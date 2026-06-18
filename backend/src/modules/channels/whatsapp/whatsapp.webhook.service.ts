import type { InboundMessageDTO } from '../inbound-message.dto';
import { conversationEngineService } from '../../conversations/conversation-engine.service';
import { whatsappAdapter } from './whatsapp.adapter';
import type { WhatsappWebhookPayload } from './whatsapp.types';
import { whatsappSender } from './whatsapp.sender';

export class WhatsappWebhookService {
  async handlePayload(payload: WhatsappWebhookPayload): Promise<void> {
    const messages = whatsappAdapter.normalizeWebhookPayload(payload);
    if (!messages.length) return;

    for (const dto of messages) {
      try {
        await this.dispatchInbound(dto);
      } catch (err) {
        console.error('[WhatsappWebhook] Error procesando mensaje', dto.externalMessageId, err);
      }
    }
  }

  private async dispatchInbound(dto: InboundMessageDTO): Promise<void> {
    const result = await conversationEngineService.processInbound(dto);

    if (result.outboundText?.trim()) {
      await whatsappSender.sendText({
        toWaId: dto.channelContactExternalId,
        text: result.outboundText,
      });
    }
  }
}

export const whatsappWebhookService = new WhatsappWebhookService();
