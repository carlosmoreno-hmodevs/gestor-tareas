import { prisma } from '../../shared/database/prisma';
import type { ChannelType } from '@prisma/client';

export class IdempotencyService {
  async findExistingMessage(
    channel: ChannelType,
    provider: string,
    externalMessageId: string
  ) {
    return prisma.message.findUnique({
      where: {
        channel_provider_externalMessageId: {
          channel,
          provider,
          externalMessageId,
        },
      },
      include: {
        originOfCommitment: {
          include: {
            assignees: { include: { contact: true } },
            requester: true,
          },
        },
        thread: true,
      },
    });
  }
}

export const idempotencyService = new IdempotencyService();
