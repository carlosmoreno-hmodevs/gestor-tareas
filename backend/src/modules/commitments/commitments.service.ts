import { Prisma } from '@prisma/client';
import { prisma } from '../../shared/database/prisma';
import { assertTransition } from './commitment-state.machine';
import { enrichCommitmentEvents, mapEventForApi } from './commitment-event.presenter';

export interface CreateCommitmentInput {
  workspaceId: string;
  title: string;
  description?: string;
  location?: string;
  status?: string;
  requesterContactId?: string;
  dueAt?: Date;
  expectedEvidence?: string;
  conversationThreadId?: string;
  originMessageId?: string;
  assigneeContactIds?: string[];
  actorContactId?: string;
  messageId?: string;
  payload?: Record<string, unknown>;
}

export class CommitmentsService {
  async list(workspaceId: string) {
    return prisma.commitment.findMany({
      where: { workspaceId },
      include: {
        assignees: { include: { contact: true } },
        requester: true,
        originMessage: true,
        conversationThread: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(workspaceId: string, id: string) {
    return prisma.commitment.findFirst({
      where: { id, workspaceId },
      include: {
        assignees: { include: { contact: true } },
        requester: true,
        originMessage: true,
        conversationThread: true,
        events: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  async getEvents(workspaceId: string, commitmentId: string) {
    const commitment = await prisma.commitment.findFirst({
      where: { id: commitmentId, workspaceId },
      select: { id: true },
    });
    if (!commitment) return null;
    const events = await prisma.commitmentEvent.findMany({
      where: { commitmentId },
      orderBy: { createdAt: 'asc' },
    });
    return this.presentEvents(events);
  }

  async presentEvents(
    events: Array<{
      id: string;
      commitmentId: string;
      eventType: string;
      fromStatus: string | null;
      toStatus: string | null;
      actorContactId: string | null;
      actorUserId: string | null;
      messageId: string | null;
      payloadJson: unknown;
      createdAt: Date;
    }>
  ) {
    const enriched = await enrichCommitmentEvents(
      events,
      (ids) =>
        prisma.contact.findMany({
          where: { id: { in: ids } },
          select: { id: true, displayName: true },
        }),
      (ids) =>
        prisma.user.findMany({
          where: { id: { in: ids } },
          select: { id: true, displayName: true },
        })
    );
    return enriched.map(mapEventForApi);
  }

  async create(input: CreateCommitmentInput) {
    const folio = await this.nextFolio(input.workspaceId);
    const status = input.status ?? 'assigned';

    return prisma.$transaction(async (tx) => {
      const commitment = await tx.commitment.create({
        data: {
          workspaceId: input.workspaceId,
          folio,
          title: input.title,
          description: input.description,
          location: input.location,
          status,
          requesterContactId: input.requesterContactId,
          dueAt: input.dueAt,
          expectedEvidence: input.expectedEvidence,
          conversationThreadId: input.conversationThreadId,
          originMessageId: input.originMessageId,
        },
      });

      if (input.assigneeContactIds?.length) {
        await tx.commitmentAssignee.createMany({
          data: input.assigneeContactIds.map((contactId, index) => ({
            commitmentId: commitment.id,
            contactId,
            role: index === 0 ? 'primary' : 'secondary',
            status: 'pending',
          })),
        });
      }

      await tx.commitmentEvent.create({
        data: {
          commitmentId: commitment.id,
          eventType: 'created',
          toStatus: status,
          actorContactId: input.actorContactId,
          messageId: input.messageId,
          payloadJson: (input.payload ?? undefined) as Prisma.InputJsonValue | undefined,
        },
      });

      return tx.commitment.findUniqueOrThrow({
        where: { id: commitment.id },
        include: {
          assignees: { include: { contact: true } },
          requester: true,
          originMessage: true,
        },
      });
    });
  }

  async update(
    workspaceId: string,
    id: string,
    data: {
      title?: string;
      description?: string;
      location?: string;
      dueAt?: Date | null;
      expectedEvidence?: string;
    }
  ) {
    const existing = await prisma.commitment.findFirst({ where: { id, workspaceId } });
    if (!existing) return null;

    return prisma.$transaction(async (tx) => {
      const updated = await tx.commitment.update({
        where: { id },
        data,
        include: {
          assignees: { include: { contact: true } },
          requester: true,
        },
      });

      await tx.commitmentEvent.create({
        data: {
          commitmentId: id,
          eventType: 'updated',
          payloadJson: data,
        },
      });

      return updated;
    });
  }

  async updateStatus(
    workspaceId: string,
    id: string,
    toStatus: string,
    actor?: { contactId?: string; userId?: string },
    options?: { comment?: string },
    existingTx?: Prisma.TransactionClient
  ) {
    const run = async (tx: Prisma.TransactionClient) => {
      const existing = await tx.commitment.findFirst({ where: { id, workspaceId } });
      if (!existing) return null;

      assertTransition(existing.status, toStatus);

      const updated = await tx.commitment.update({
        where: { id },
        data: {
          status: toStatus,
          closedAt: toStatus === 'closed' ? new Date() : existing.closedAt,
        },
        include: {
          assignees: { include: { contact: true } },
          requester: true,
        },
      });

      if (toStatus === 'accepted') {
        await tx.commitmentAssignee.updateMany({
          where: { commitmentId: id, status: 'pending' },
          data: { status: 'accepted', acceptedAt: new Date() },
        });
      }

      const payload: Record<string, unknown> = {};
      if (options?.comment) payload.comment = options.comment;

      await tx.commitmentEvent.create({
        data: {
          commitmentId: id,
          eventType: 'status_changed',
          fromStatus: existing.status,
          toStatus,
          actorContactId: actor?.contactId,
          actorUserId: actor?.userId,
          payloadJson: Object.keys(payload).length
            ? (payload as Prisma.InputJsonValue)
            : undefined,
        },
      });

      return tx.commitment.findUniqueOrThrow({
        where: { id },
        include: {
          assignees: { include: { contact: true } },
          requester: true,
        },
      });
    };

    if (existingTx) return run(existingTx);
    return prisma.$transaction(run);
  }

  private async nextFolio(workspaceId: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `CMP-${year}-`;
    const last = await prisma.commitment.findFirst({
      where: { workspaceId, folio: { startsWith: prefix } },
      orderBy: { folio: 'desc' },
      select: { folio: true },
    });
    const lastNum = last ? parseInt(last.folio.replace(prefix, ''), 10) : 0;
    return `${prefix}${String(lastNum + 1).padStart(4, '0')}`;
  }
}

export const commitmentsService = new CommitmentsService();
