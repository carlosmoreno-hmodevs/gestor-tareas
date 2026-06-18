import { Router } from 'express';
import { z } from 'zod';
import { simulatorAdapter, resolveWorkspaceSlug } from '../channels/simulator/simulator.adapter';
import { conversationEngineService } from './conversation-engine.service';
import { prisma } from '../../shared/database/prisma';

export const conversationsRouter = Router();

const inboundBodySchema = z
  .object({
    channel_contact_external_id: z.string().min(1),
    message_type: z.enum(['text', 'audio', 'image', 'document', 'system']).default('text'),
    text_body: z.string().optional(),
    simulated_transcript: z.string().optional(),
    simulate_transcription_failure: z.boolean().optional(),
    external_message_id: z.string().min(1),
    external_event_id: z.string().optional(),
    workspace_slug: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.message_type === 'text' && !data.text_body?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'text_body es obligatorio para mensajes de texto',
        path: ['text_body'],
      });
    }
    if (
      data.message_type === 'audio' &&
      !data.simulate_transcription_failure &&
      !data.simulated_transcript?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'simulated_transcript es obligatorio para audio simulado',
        path: ['simulated_transcript'],
      });
    }
  });

conversationsRouter.post('/inbound', async (req, res, next) => {
  try {
    inboundBodySchema.parse(req.body);
    const workspaceSlug = resolveWorkspaceSlug(req);
    const dto = simulatorAdapter.normalize(req.body, workspaceSlug);
    const result = await conversationEngineService.processInbound(dto);

    res.status(result.duplicate ? 200 : 201).json({
      duplicate: result.duplicate,
      inbound_message_id: result.inboundMessageId,
      outbound_message_id: result.outboundMessageId,
      reply: result.outboundText,
      awaiting_confirmation: result.awaitingConfirmation ?? false,
      proposal_cancelled: result.proposalCancelled ?? false,
      message_type: result.messageType ?? dto.messageType,
      transcription_status: result.transcriptionStatus ?? null,
      transcript_text: result.transcriptText ?? null,
      commitment: result.commitment
        ? {
            id: result.commitment.id,
            folio: result.commitment.folio,
            title: result.commitment.title,
            status: result.commitment.status,
          }
        : null,
    });
  } catch (err) {
    next(err);
  }
});

conversationsRouter.get('/', async (req, res, next) => {
  try {
    const slug = resolveWorkspaceSlug(req);
    const workspace = await prisma.workspace.findUnique({ where: { slug } });
    if (!workspace) {
      res.status(404).json({ error: 'Workspace no encontrado' });
      return;
    }
    const threads = await prisma.conversationThread.findMany({
      where: { workspaceId: workspace.id },
      include: {
        channelContact: { include: { contact: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
    res.json({ data: threads });
  } catch (err) {
    next(err);
  }
});

conversationsRouter.get('/:id', async (req, res, next) => {
  try {
    const slug = resolveWorkspaceSlug(req);
    const workspace = await prisma.workspace.findUnique({ where: { slug } });
    if (!workspace) {
      res.status(404).json({ error: 'Workspace no encontrado' });
      return;
    }
    const thread = await prisma.conversationThread.findFirst({
      where: { id: req.params.id, workspaceId: workspace.id },
      include: {
        channelContact: { include: { contact: true } },
        messages: { orderBy: { createdAt: 'asc' } },
        commitments: true,
      },
    });
    if (!thread) {
      res.status(404).json({ error: 'Conversación no encontrada' });
      return;
    }
    res.json({ data: thread });
  } catch (err) {
    next(err);
  }
});
