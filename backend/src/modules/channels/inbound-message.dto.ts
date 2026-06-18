import type { ChannelType, MessageType } from '@prisma/client';

export interface InboundMessageDTO {
  workspaceSlug: string;
  channel: ChannelType;
  provider: string;
  channelContactExternalId: string;
  externalMessageId: string;
  externalEventId?: string;
  messageType: MessageType;
  textBody?: string;
  rawPayload?: Record<string, unknown>;
}

export interface OutboundMessageDTO {
  textBody: string;
  messageType?: MessageType;
}
