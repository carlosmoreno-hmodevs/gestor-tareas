import { Prisma } from '@prisma/client';
import { prisma } from '../../shared/database/prisma';
import type { InboundMessageDTO } from '../channels/inbound-message.dto';
import { idempotencyService } from './idempotency.service';
import { commitmentsService } from '../commitments/commitments.service';
import { parseConfirmationIntent } from './confirmation-intent.parser';
import { buildConfirmationPrompt, buildAssigneeNotFoundMessage } from './confirmation-summary.builder';
import {
  parseSessionContext,
  SESSION_STATE,
  type PendingCommitmentProposal,
} from './session-context.types';
import { jobQueue } from '../jobs/queue';
import { aiService } from '../ai/ai.service';
import { aiExtractionRepository } from '../ai/ai-extraction.repository';

export interface InboundProcessingResult {
  duplicate: boolean;
  inboundMessageId: string;
  outboundText: string;
  outboundMessageId: string;
  awaitingConfirmation?: boolean;
  proposalCancelled?: boolean;
  commitment?: Awaited<ReturnType<typeof commitmentsService.create>>;
  messageType?: string;
  transcriptionStatus?: 'completed' | 'failed' | 'pending';
  transcriptText?: string;
}

export class ConversationEngineService {
  async processInbound(dto: InboundMessageDTO): Promise<InboundProcessingResult> {
    const workspace = await prisma.workspace.findUnique({
      where: { slug: dto.workspaceSlug },
    });
    if (!workspace) {
      throw new Error(`Workspace no encontrado: ${dto.workspaceSlug}`);
    }

    const existing = await idempotencyService.findExistingMessage(
      dto.channel,
      dto.provider,
      dto.externalMessageId
    );
    if (existing) {
      return this.handleDuplicate(existing);
    }

    const channelContact = await prisma.channelContact.findUnique({
      where: {
        channel_provider_externalId: {
          channel: dto.channel,
          provider: dto.provider,
          externalId: dto.channelContactExternalId,
        },
      },
      include: { contact: true },
    });
    if (!channelContact) {
      throw new Error(`Contacto de canal no encontrado: ${dto.channelContactExternalId}`);
    }

    let thread = await prisma.conversationThread.findFirst({
      where: {
        workspaceId: workspace.id,
        channelContactId: channelContact.id,
        channel: dto.channel,
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    if (!thread) {
      thread = await prisma.conversationThread.create({
        data: {
          workspaceId: workspace.id,
          channel: dto.channel,
          channelContactId: channelContact.id,
          sessionState: SESSION_STATE.idle,
        },
      });
    }

    const inbound = await this.persistInbound(
      thread.id,
      workspace.id,
      channelContact.contactId,
      dto
    );

    if (dto.messageType === 'audio') {
      await prisma.messageEvent.create({
        data: {
          messageId: inbound.id,
          eventType: 'audio_queued',
          payloadJson: { provider: dto.provider },
        },
      });

      return jobQueue.runProcessInboundAudio({
        inboundMessageId: inbound.id,
        dto,
        threadId: thread.id,
        workspaceId: workspace.id,
        channelContactId: channelContact.contactId,
      });
    }

    if (dto.messageType !== 'text' || !dto.textBody?.trim()) {
      const reply = 'Por ahora solo procesamos mensajes de texto y audio simulado.';
      const outbound = await this.createOutbound(thread.id, workspace.id, dto, reply);
      return {
        duplicate: false,
        inboundMessageId: inbound.id,
        outboundText: reply,
        outboundMessageId: outbound.id,
      };
    }

    return this.processInboundContent({
      dto,
      workspaceId: workspace.id,
      thread,
      inbound,
      textBody: dto.textBody!,
      channelContactId: channelContact.contactId,
    });
  }

  /** Procesa contenido textual ya disponible (texto directo o post-transcripción). */
  async processInboundContent(params: {
    dto: InboundMessageDTO;
    workspaceId: string;
    thread: { id: string };
    inbound: { id: string };
    textBody: string;
    channelContactId: string;
  }): Promise<InboundProcessingResult> {
    const { dto, workspaceId, inbound, textBody, channelContactId } = params;
    const thread = await prisma.conversationThread.findUniqueOrThrow({
      where: { id: params.thread.id },
    });

    const contentDto: InboundMessageDTO = { ...dto, messageType: 'text', textBody };

    const pending = parseSessionContext(thread.sessionContextJson);
    if (thread.sessionState === SESSION_STATE.awaitingConfirmation && pending) {
      return this.handleAwaitingConfirmation({
        dto: contentDto,
        workspaceId,
        thread,
        inbound,
        pending,
        channelContactId,
      });
    }

    return this.handleNewCommitmentIntent({
      dto: contentDto,
      workspaceId,
      thread,
      inbound,
      requesterContactId: channelContactId,
    });
  }

  private async handleDuplicate(
    existing: NonNullable<Awaited<ReturnType<typeof idempotencyService.findExistingMessage>>>
  ): Promise<InboundProcessingResult> {
    const outbound = await prisma.message.findFirst({
      where: {
        threadId: existing.threadId,
        direction: 'outbound',
        createdAt: { gte: existing.createdAt },
      },
      orderBy: { createdAt: 'asc' },
    });
    const thread = await prisma.conversationThread.findUnique({
      where: { id: existing.threadId },
    });
    const transcription = await prisma.transcription.findUnique({
      where: { messageId: existing.id },
    });
    return {
      duplicate: true,
      inboundMessageId: existing.id,
      outboundText: outbound?.textBody ?? 'Mensaje ya procesado.',
      outboundMessageId: outbound?.id ?? existing.id,
      awaitingConfirmation: thread?.sessionState === SESSION_STATE.awaitingConfirmation,
      messageType: existing.messageType,
      transcriptionStatus: transcription?.status as InboundProcessingResult['transcriptionStatus'],
      transcriptText: transcription?.transcriptText ?? existing.textBody ?? undefined,
      commitment: existing.originOfCommitment
        ? await prisma.commitment.findUniqueOrThrow({
            where: { id: existing.originOfCommitment.id },
            include: {
              assignees: { include: { contact: true } },
              requester: true,
              originMessage: true,
            },
          })
        : undefined,
    };
  }

  private async handleNewCommitmentIntent(params: {
    dto: InboundMessageDTO;
    workspaceId: string;
    thread: { id: string };
    inbound: { id: string };
    requesterContactId: string;
  }): Promise<InboundProcessingResult> {
    const { dto, workspaceId, thread, inbound, requesterContactId } = params;
    const contacts = await prisma.contact.findMany({ where: { workspaceId } });
    const transcription = await prisma.transcription.findUnique({
      where: { messageId: inbound.id },
    });

    const resolved = await aiService.resolveCommitmentIntent({
      inputText: dto.textBody!,
      contacts,
      messageId: inbound.id,
      transcriptionId: transcription?.id,
    });

    const parsed = resolved.parsed;

    if (parsed.assigneeNotFound && parsed.mentionedAssigneeName) {
      const reply = buildAssigneeNotFoundMessage(parsed.mentionedAssigneeName);

      await prisma.message.update({
        where: { id: inbound.id },
        data: { status: 'processed', processedAt: new Date() },
      });

      await prisma.messageEvent.create({
        data: {
          messageId: inbound.id,
          eventType: 'assignee_not_found',
          payloadJson: { mentionedAssigneeName: parsed.mentionedAssigneeName },
        },
      });

      const outbound = await this.createOutbound(thread.id, workspaceId, dto, reply);

      return {
        duplicate: false,
        inboundMessageId: inbound.id,
        outboundText: reply,
        outboundMessageId: outbound.id,
        awaitingConfirmation: false,
      };
    }

    const proposal: PendingCommitmentProposal = {
      version: 1,
      originMessageId: inbound.id,
      requesterContactId,
      proposal: {
        title: parsed.title,
        description: parsed.description,
        location: parsed.location,
        dueAt: parsed.dueAt?.toISOString(),
        dueDateText: parsed.dueDateText,
        expectedEvidence: parsed.expectedEvidence,
        evidenceLabel: parsed.evidenceLabel,
        assigneeContactId: parsed.assigneeContactId,
        assigneeName: parsed.assigneeName,
        rawText: dto.textBody!,
        extractionSource: resolved.source,
        aiExtractionId: resolved.aiExtractionId,
      },
      createdAt: new Date().toISOString(),
    };

    const reply = buildConfirmationPrompt(parsed, contacts);

    await prisma.message.update({
      where: { id: inbound.id },
      data: { status: 'processed', processedAt: new Date() },
    });

    await prisma.messageEvent.create({
      data: {
        messageId: inbound.id,
        eventType: 'parsed',
        payloadJson: {
          awaitingConfirmation: true,
          proposalTitle: parsed.title,
          extractionSource: resolved.source,
          aiExtractionId: resolved.aiExtractionId,
          model: resolved.model,
        },
      },
    });

    await prisma.conversationThread.update({
      where: { id: thread.id },
      data: {
        sessionState: SESSION_STATE.awaitingConfirmation,
        sessionContextJson: proposal as unknown as Prisma.InputJsonValue,
        lastMessageAt: new Date(),
      },
    });

    const outbound = await this.createOutbound(thread.id, workspaceId, dto, reply);
    await prisma.messageEvent.create({
      data: {
        messageId: outbound.id,
        eventType: 'confirmation_requested',
        payloadJson: { inboundMessageId: inbound.id },
      },
    });

    return {
      duplicate: false,
      inboundMessageId: inbound.id,
      outboundText: reply,
      outboundMessageId: outbound.id,
      awaitingConfirmation: true,
    };
  }

  private async handleAwaitingConfirmation(params: {
    dto: InboundMessageDTO;
    workspaceId: string;
    thread: { id: string };
    inbound: { id: string };
    pending: PendingCommitmentProposal;
    channelContactId: string;
  }): Promise<InboundProcessingResult> {
    const { dto, workspaceId, thread, inbound, pending, channelContactId } = params;
    const intent = parseConfirmationIntent(dto.textBody!);

    if (intent === 'unknown') {
      const reply =
        'No entendí tu respuesta. Responde *sí* para confirmar el compromiso o *no* para cancelarlo.';
      await this.markInboundProcessed(inbound.id, 'confirmation_unclear');
      const outbound = await this.createOutbound(thread.id, workspaceId, dto, reply);
      return {
        duplicate: false,
        inboundMessageId: inbound.id,
        outboundText: reply,
        outboundMessageId: outbound.id,
        awaitingConfirmation: true,
      };
    }

    if (intent === 'cancel') {
      const reply = 'Entendido. Cancelé la propuesta de compromiso. Puedes enviar una nueva instrucción cuando quieras.';
      await this.markInboundProcessed(inbound.id, 'proposal_cancelled', {
        originMessageId: pending.originMessageId,
      });

      if (pending.proposal.aiExtractionId) {
        await aiExtractionRepository.markStatus(pending.proposal.aiExtractionId, 'rejected');
      }

      await prisma.conversationThread.update({
        where: { id: thread.id },
        data: {
          sessionState: SESSION_STATE.idle,
          sessionContextJson: Prisma.JsonNull,
          lastMessageAt: new Date(),
        },
      });

      const outbound = await this.createOutbound(thread.id, workspaceId, dto, reply);
      return {
        duplicate: false,
        inboundMessageId: inbound.id,
        outboundText: reply,
        outboundMessageId: outbound.id,
        proposalCancelled: true,
        awaitingConfirmation: false,
      };
    }

    const p = pending.proposal;
    const commitment = await commitmentsService.create({
      workspaceId,
      title: p.title,
      description: p.description,
      location: p.location,
      dueAt: p.dueAt ? new Date(p.dueAt) : undefined,
      expectedEvidence: p.expectedEvidence,
      status: 'assigned',
      requesterContactId: pending.requesterContactId,
      conversationThreadId: thread.id,
      originMessageId: pending.originMessageId,
      assigneeContactIds: p.assigneeContactId ? [p.assigneeContactId] : [],
      actorContactId: channelContactId,
      messageId: inbound.id,
      payload: {
        source: p.extractionSource === 'ai' ? 'simulator_ai' : 'simulator_text',
        rawText: p.rawText,
        confirmedByMessageId: inbound.id,
        aiExtractionId: p.aiExtractionId,
      },
    });

    if (p.aiExtractionId) {
      await aiExtractionRepository.markStatus(p.aiExtractionId, 'confirmed');
    }

    await prisma.message.update({
      where: { id: inbound.id },
      data: {
        commitmentId: commitment.id,
        status: 'processed',
        processedAt: new Date(),
      },
    });

    await prisma.messageEvent.create({
      data: {
        messageId: inbound.id,
        eventType: 'confirmed',
        payloadJson: { commitmentId: commitment.id, originMessageId: pending.originMessageId },
      },
    });

    await prisma.message.update({
      where: { id: pending.originMessageId },
      data: { commitmentId: commitment.id },
    });

    await prisma.conversationThread.update({
      where: { id: thread.id },
      data: {
        commitmentId: commitment.id,
        sessionState: SESSION_STATE.commitmentCreated,
        sessionContextJson: Prisma.JsonNull,
        lastMessageAt: new Date(),
      },
    });

    const assigneeName = p.assigneeName ?? commitment.assignees[0]?.contact.displayName ?? 'el responsable';
    const dueLabel = p.dueAt
      ? new Date(p.dueAt).toLocaleDateString('es-MX', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        })
      : 'sin fecha definida';

    const reply = [
      `Compromiso ${commitment.folio} creado.`,
      `Responsable: ${assigneeName}.`,
      `Actividad: ${commitment.title}.`,
      p.location ? `Ubicación: ${p.location}.` : null,
      `Fecha compromiso: ${dueLabel}.`,
      p.expectedEvidence ? `Evidencia esperada: ${p.expectedEvidence}.` : null,
      'Puedes revisarlo en el tablero web.',
    ]
      .filter(Boolean)
      .join('\n');

    const outbound = await this.createOutbound(thread.id, workspaceId, dto, reply);
    await prisma.messageEvent.create({
      data: {
        messageId: outbound.id,
        eventType: 'commitment_created_notice',
        payloadJson: { commitmentId: commitment.id },
      },
    });

    return {
      duplicate: false,
      inboundMessageId: inbound.id,
      outboundText: reply,
      outboundMessageId: outbound.id,
      awaitingConfirmation: false,
      commitment,
    };
  }

  private async persistInbound(
    threadId: string,
    workspaceId: string,
    senderContactId: string,
    dto: InboundMessageDTO
  ) {
    const raw = dto.rawPayload ?? {};
    const mediaId = typeof raw['media_id'] === 'string' ? raw['media_id'] : undefined;
    const mimeType = typeof raw['mime_type'] === 'string' ? raw['mime_type'] : undefined;

    const inbound = await prisma.message.create({
      data: {
        threadId,
        workspaceId,
        direction: 'inbound',
        channel: dto.channel,
        provider: dto.provider,
        externalMessageId: dto.externalMessageId,
        externalEventId: dto.externalEventId,
        senderContactId,
        messageType: dto.messageType,
        textBody: dto.textBody,
        mediaId,
        mimeType,
        status: dto.messageType === 'text' ? 'ready' : 'pending_transcription',
        rawPayloadJson: (dto.rawPayload ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });

    await prisma.messageEvent.create({
      data: {
        messageId: inbound.id,
        eventType: 'received',
        payloadJson: { channel: dto.channel },
      },
    });

    return inbound;
  }

  private async markInboundProcessed(
    messageId: string,
    eventType: string,
    payload?: Record<string, unknown>
  ) {
    await prisma.message.update({
      where: { id: messageId },
      data: { status: 'processed', processedAt: new Date() },
    });
    await prisma.messageEvent.create({
      data: {
        messageId,
        eventType,
        payloadJson: (payload ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  }

  private async createOutbound(
    threadId: string,
    workspaceId: string,
    dto: InboundMessageDTO,
    text: string
  ) {
    return prisma.message.create({
      data: {
        threadId,
        workspaceId,
        direction: 'outbound',
        channel: dto.channel,
        provider: dto.provider,
        messageType: 'text',
        textBody: text,
        status: 'processed',
        processedAt: new Date(),
      },
    });
  }
}

export const conversationEngineService = new ConversationEngineService();
