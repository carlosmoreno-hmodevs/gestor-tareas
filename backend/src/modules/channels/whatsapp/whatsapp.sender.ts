import { whatsappConfig } from '../../../config/whatsapp.config';

export interface WhatsappOutboundTextParams {
  toWaId: string;
  text: string;
  replyToMessageId?: string;
}

/** Envío saliente WhatsApp — mock/log en dev; Graph API en fase posterior */
export class WhatsappSender {
  async sendText(params: WhatsappOutboundTextParams): Promise<{ sent: boolean; mode: 'mock' | 'graph' }> {
    const { toWaId, text } = params;
    if (!text.trim()) {
      return { sent: false, mode: 'mock' };
    }

    if (!whatsappConfig.sendEnabled || !whatsappConfig.accessToken || !whatsappConfig.phoneNumberId) {
      console.info('[WhatsappSender:mock]', {
        to: toWaId,
        preview: text.slice(0, 120),
        length: text.length,
      });
      return { sent: true, mode: 'mock' };
    }

    // TODO Fase WhatsApp real: POST https://graph.facebook.com/{version}/{phone_number_id}/messages
    const url = `https://graph.facebook.com/${whatsappConfig.graphApiVersion}/${whatsappConfig.phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${whatsappConfig.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toWaId,
        type: 'text',
        text: { body: text },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('[WhatsappSender] Graph API error', response.status, body.slice(0, 300));
      return { sent: false, mode: 'graph' };
    }

    return { sent: true, mode: 'graph' };
  }
}

export const whatsappSender = new WhatsappSender();
