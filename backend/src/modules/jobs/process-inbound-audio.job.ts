import { prisma } from '../../shared/database/prisma';
import type { InboundMessageDTO } from '../channels/inbound-message.dto';
import type { InboundProcessingResult } from '../conversations/conversation-engine.service';
import { conversationEngineService } from '../conversations/conversation-engine.service';
import { transcriptionService } from '../transcription/transcription.service';

const TRANSCRIPTION_FAILURE_REPLY =
  'No pude transcribir el audio. Intenta enviarlo de nuevo o escribe la instrucción.';

export interface ProcessInboundAudioJobInput {
  inboundMessageId: string;
  dto: InboundMessageDTO;
  threadId: string;
  workspaceId: string;
  channelContactId: string;
}

/** Job síncrono Fase 3 — reemplazable por cola async sin cambiar Conversation Engine. */
export class ProcessInboundAudioJob {
  async run(input: ProcessInboundAudioJobInput): Promise<InboundProcessingResult> {
    const { inboundMessageId, dto, threadId, workspaceId, channelContactId } = input;
    const raw = dto.rawPayload ?? {};

    // WhatsApp real: persistir audio y encolar — sin descarga ni STT aún (Fase 4)
    if (dto.channel === 'whatsapp' && dto.provider === 'meta' && !raw['simulated_transcript']) {
      await prisma.messageEvent.create({
        data: {
          messageId: inboundMessageId,
          eventType: 'audio_queued',
          payloadJson: {
            media_id: typeof raw['media_id'] === 'string' ? raw['media_id'] : null,
            phase: 'awaiting_media_download_and_stt',
            note: 'TODO: descargar media desde Graph API y transcribir',
          },
        },
      });

      return {
        duplicate: false,
        inboundMessageId,
        outboundText: '',
        outboundMessageId: inboundMessageId,
        messageType: 'audio',
        transcriptionStatus: 'pending',
      };
    }

    const transcription = await transcriptionService.runSimulatorTranscription(inboundMessageId, {
      simulatedTranscript:
        typeof raw['simulated_transcript'] === 'string' ? raw['simulated_transcript'] : undefined,
      simulateTranscriptionFailure: raw['simulate_transcription_failure'] === true,
    });

    if (transcription.status === 'failed') {
      await prisma.message.update({
        where: { id: inboundMessageId },
        data: {
          status: 'transcription_failed',
          processedAt: new Date(),
        },
      });

      await prisma.messageEvent.create({
        data: {
          messageId: inboundMessageId,
          eventType: 'transcription_failed',
          payloadJson: { error: transcription.errorMessage },
        },
      });

      const outbound = await prisma.message.create({
        data: {
          threadId,
          workspaceId,
          direction: 'outbound',
          channel: dto.channel,
          provider: dto.provider,
          messageType: 'text',
          textBody: TRANSCRIPTION_FAILURE_REPLY,
          status: 'processed',
          processedAt: new Date(),
        },
      });

      await prisma.conversationThread.update({
        where: { id: threadId },
        data: { lastMessageAt: new Date() },
      });

      return {
        duplicate: false,
        inboundMessageId,
        outboundText: TRANSCRIPTION_FAILURE_REPLY,
        outboundMessageId: outbound.id,
        transcriptionStatus: 'failed',
        messageType: 'audio',
      };
    }

    const transcriptText = transcription.transcriptText!;

    await prisma.message.update({
      where: { id: inboundMessageId },
      data: {
        textBody: transcriptText,
        status: 'ready',
      },
    });

    await prisma.messageEvent.create({
      data: {
        messageId: inboundMessageId,
        eventType: 'transcription_completed',
        payloadJson: {
          transcriptionId: transcription.transcriptionId,
          transcriptLength: transcriptText.length,
        },
      },
    });

    const thread = await prisma.conversationThread.findUniqueOrThrow({
      where: { id: threadId },
    });

    const textDto: InboundMessageDTO = {
      ...dto,
      messageType: 'text',
      textBody: transcriptText,
    };

    const result = await conversationEngineService.processInboundContent({
      dto: textDto,
      workspaceId,
      thread,
      inbound: { id: inboundMessageId },
      textBody: transcriptText,
      channelContactId,
    });

    return {
      ...result,
      transcriptionStatus: 'completed',
      transcriptText,
      messageType: 'audio',
    };
  }
}

export const processInboundAudioJob = new ProcessInboundAudioJob();
