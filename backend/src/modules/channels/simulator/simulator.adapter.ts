import type { Request } from 'express';
import { z } from 'zod';
import type { InboundMessageDTO } from '../inbound-message.dto';

const inboundSchema = z
  .object({
    workspace_slug: z.string().optional(),
    channel_contact_external_id: z.string().min(1),
    message_type: z.enum(['text', 'audio', 'image', 'document', 'system']).default('text'),
    text_body: z.string().optional(),
    simulated_transcript: z.string().optional(),
    simulate_transcription_failure: z.boolean().optional(),
    external_message_id: z.string().min(1),
    external_event_id: z.string().optional(),
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
        message: 'simulated_transcript es obligatorio para audio simulado (salvo simulate_transcription_failure)',
        path: ['simulated_transcript'],
      });
    }
  });

export class SimulatorAdapter {
  normalize(body: unknown, workspaceSlug: string): InboundMessageDTO {
    const data = inboundSchema.parse(body);
    return {
      workspaceSlug: data.workspace_slug ?? workspaceSlug,
      channel: 'simulator',
      provider: 'internal',
      channelContactExternalId: data.channel_contact_external_id,
      externalMessageId: data.external_message_id,
      externalEventId: data.external_event_id,
      messageType: data.message_type,
      textBody: data.text_body,
      rawPayload: body as Record<string, unknown>,
    };
  }
}

export const simulatorAdapter = new SimulatorAdapter();

/**
 * @deprecated Solo para webhooks públicos sin JWT (WhatsApp mock).
 * Rutas protegidas deben usar workspace del token vía requireWorkspace.
 */
export function resolveWorkspaceSlug(req: Request): string {
  const header = req.header('x-workspace-slug');
  if (header) return header;
  return 'ferreteria-luisito';
}
