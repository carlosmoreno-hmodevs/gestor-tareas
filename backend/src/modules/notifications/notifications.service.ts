import { prisma } from '../../shared/database/prisma';

export type NotificationType =
  | 'commitment_assigned'
  | 'evidence_uploaded'
  | 'correction_requested'
  | 'commitment_closed';

interface CreateNotificationInput {
  workspaceId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedCommitmentId?: string;
}

export class NotificationsService {
  async list(workspaceId: string, userId: string, limit = 30) {
    return prisma.notification.findMany({
      where: { workspaceId, userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async unreadCount(workspaceId: string, userId: string) {
    return prisma.notification.count({
      where: { workspaceId, userId, readAt: null },
    });
  }

  async markRead(workspaceId: string, userId: string, id: string) {
    const existing = await prisma.notification.findFirst({
      where: { id, workspaceId, userId },
    });
    if (!existing) return null;
    return prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  async markAllRead(workspaceId: string, userId: string) {
    await prisma.notification.updateMany({
      where: { workspaceId, userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async create(input: CreateNotificationInput) {
    return prisma.notification.create({ data: input });
  }

  async notifyContactLinkedUsers(
    workspaceId: string,
    contactIds: string[],
    payload: Omit<CreateNotificationInput, 'workspaceId' | 'userId'>
  ) {
    if (!contactIds.length) return;
    const contacts = await prisma.contact.findMany({
      where: { id: { in: contactIds }, workspaceId, userId: { not: null } },
      select: { userId: true },
    });
    const userIds = [...new Set(contacts.map((c) => c.userId!).filter(Boolean))];
    await Promise.all(
      userIds.map((userId) => this.create({ workspaceId, userId, ...payload }))
    );
  }

  async notifyCoordinators(
    workspaceId: string,
    payload: Omit<CreateNotificationInput, 'workspaceId' | 'userId'>,
    excludeUserId?: string
  ) {
    const users = await prisma.user.findMany({
      where: {
        workspaceId,
        role: { in: ['admin', 'coordinator'] },
        status: 'active',
        ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
      },
      select: { id: true },
    });
    await Promise.all(
      users.map((u) => this.create({ workspaceId, userId: u.id, ...payload }))
    );
  }
}

export const notificationsService = new NotificationsService();

function mapNotification(n: {
  id: string;
  type: string;
  title: string;
  message: string;
  relatedCommitmentId: string | null;
  readAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    relatedCommitmentId: n.relatedCommitmentId,
    readAt: n.readAt?.toISOString() ?? null,
    createdAt: n.createdAt.toISOString(),
  };
}

export function mapNotificationForApi(
  n: Awaited<ReturnType<NotificationsService['list']>>[number]
) {
  return mapNotification(n);
}
