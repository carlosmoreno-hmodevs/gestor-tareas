/** Tipos simplificados del webhook WhatsApp Cloud API (Meta) */
export interface WhatsappWebhookPayload {
  object?: string;
  entry?: WhatsappWebhookEntry[];
}

export interface WhatsappWebhookEntry {
  id?: string;
  changes?: WhatsappWebhookChange[];
}

export interface WhatsappWebhookChange {
  field?: string;
  value?: WhatsappWebhookValue;
}

export interface WhatsappWebhookValue {
  messaging_product?: string;
  metadata?: {
    display_phone_number?: string;
    phone_number_id?: string;
  };
  contacts?: Array<{
    profile?: { name?: string };
    wa_id?: string;
  }>;
  messages?: WhatsappInboundMessage[];
  statuses?: unknown[];
}

export interface WhatsappInboundMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body?: string };
  audio?: { id?: string; mime_type?: string };
  image?: { id?: string; mime_type?: string };
  document?: { id?: string; mime_type?: string; filename?: string };
}
