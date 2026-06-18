import type { MessageType } from '@prisma/client';
import type { InboundMessageDTO } from '../inbound-message.dto';
import { whatsappConfig } from '../../../config/whatsapp.config';
import type { WhatsappInboundMessage, WhatsappWebhookPayload } from './whatsapp.types';

export class WhatsappAdapter {
  /**
   * Normaliza payload Meta → lista de InboundMessageDTO (0..n por webhook).
   * El external_id del contacto es el wa_id (teléfono del remitente).
   */
  normalizeWebhookPayload(payload: WhatsappWebhookPayload): InboundMessageDTO[] {
    if (payload.object !== 'whatsapp_business_account') return [];

    const results: InboundMessageDTO[] = [];
    const workspaceSlug = whatsappConfig.defaultWorkspaceSlug;

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== 'messages') continue;
        const value = change.value;
        if (!value?.messages?.length) continue;

        const phoneNumberId = value.metadata?.phone_number_id;

        for (const msg of value.messages) {
          const dto = this.messageToDto(msg, workspaceSlug, phoneNumberId, payload);
          if (dto) results.push(dto);
        }
      }
    }

    return results;
  }

  private messageToDto(
    msg: WhatsappInboundMessage,
    workspaceSlug: string,
    phoneNumberId: string | undefined,
    rawPayload: WhatsappWebhookPayload
  ): InboundMessageDTO | null {
    const channelContactExternalId = msg.from;
    if (!channelContactExternalId) return null;

    const base = {
      workspaceSlug,
      channel: 'whatsapp' as const,
      provider: 'meta',
      channelContactExternalId,
      externalMessageId: msg.id,
      externalEventId: phoneNumberId,
      rawPayload: {
        meta_message: msg,
        phone_number_id: phoneNumberId,
        webhook: rawPayload,
      } as Record<string, unknown>,
    };

    if (msg.type === 'text' && msg.text?.body?.trim()) {
      return {
        ...base,
        messageType: 'text' as MessageType,
        textBody: msg.text.body.trim(),
      };
    }

    if (msg.type === 'audio' && msg.audio?.id) {
      return {
        ...base,
        messageType: 'audio' as MessageType,
        rawPayload: {
          ...base.rawPayload,
          media_id: msg.audio.id,
          mime_type: msg.audio.mime_type,
        },
      };
    }

    if (msg.type === 'image' && msg.image?.id) {
      return {
        ...base,
        messageType: 'image' as MessageType,
        rawPayload: {
          ...base.rawPayload,
          media_id: msg.image.id,
          mime_type: msg.image.mime_type,
        },
      };
    }

    if (msg.type === 'document' && msg.document?.id) {
      return {
        ...base,
        messageType: 'document' as MessageType,
        rawPayload: {
          ...base.rawPayload,
          media_id: msg.document.id,
          mime_type: msg.document.mime_type,
          filename: msg.document.filename,
        },
      };
    }

    return null;
  }
}

export const whatsappAdapter = new WhatsappAdapter();
