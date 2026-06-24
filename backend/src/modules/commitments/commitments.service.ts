import { Prisma } from '@prisma/client';
import { prisma } from '../../shared/database/prisma';
import { assertTransition } from './commitment-state.machine';
import { enrichCommitmentEvents, mapEventForApi } from './commitment-event.presenter';
import { contactsService } from '../contacts/contacts.service';
import {
  buildCommitmentListWhere,
  emptySummary,
  includeByAssigneeBreakdown,
  mapStatusCounts,
  type CommitmentListFilters,
  type CommitmentListResult,
  type CommitmentSummary,
} from './commitments-list.query';
import type { AuthActor } from '../auth/commitment.permissions';
import { notificationsService } from '../notifications/notifications.service';

const LIST_INCLUDE = {
  assignees: { include: { contact: true } },
  requester: true,
  originMessage: true,
  conversationThread: true,
} as const;

const TERMINAL = ['closed', 'cancelled'];

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
  async list(workspaceId: string, scopeWhere?: Record<string, unknown>) {
    return prisma.commitment.findMany({
      where: { workspaceId, ...(scopeWhere ?? {}) },
      include: LIST_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async listFiltered(
    workspaceId: string,
    scopeWhere: Record<string, unknown>,
    filters: CommitmentListFilters,
    actor: AuthActor
  ): Promise<CommitmentListResult<Awaited<ReturnType<CommitmentsService['list']>>[number]>> {
    const where = buildCommitmentListWhere(workspaceId, scopeWhere, filters, actor);
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const usePagination = filters.page !== undefined || filters.pageSize !== undefined;

    if (!usePagination) {
      const items = await prisma.commitment.findMany({
        where,
        include: LIST_INCLUDE,
        orderBy: { createdAt: 'desc' },
      });
      return { items, total: items.length, page: 1, pageSize: items.length };
    }

    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      prisma.commitment.findMany({
        where,
        include: LIST_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.commitment.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  async getSummary(
    workspaceId: string,
    scopeWhere: Record<string, unknown>,
    actor: AuthActor
  ): Promise<CommitmentSummary> {
    const baseWhere = buildCommitmentListWhere(workspaceId, scopeWhere, {}, actor);
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const [total, statusGroups, overdue, dueWithin48h, unassigned] = await Promise.all([
      prisma.commitment.count({ where: baseWhere }),
      prisma.commitment.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: { _all: true },
      }),
      prisma.commitment.count({
        where: {
          AND: [
            baseWhere,
            { dueAt: { lt: now } },
            { status: { notIn: TERMINAL } },
          ],
        },
      }),
      prisma.commitment.count({
        where: {
          AND: [
            baseWhere,
            { dueAt: { gte: now, lte: in48h } },
            { status: { notIn: TERMINAL } },
          ],
        },
      }),
      prisma.commitment.count({
        where: {
          AND: [baseWhere, { assignees: { none: {} } }],
        },
      }),
    ]);

    const byStatus = mapStatusCounts(
      statusGroups.map((g) => ({ status: g.status, _count: g._count._all }))
    );
    const active = total - byStatus.closed - byStatus.cancelled;

    let byAssignee: CommitmentSummary['byAssignee'] = [];
    if (includeByAssigneeBreakdown(actor.role)) {
      const rows = await prisma.commitmentAssignee.groupBy({
        by: ['contactId'],
        where: {
          role: 'primary',
          commitment: baseWhere,
        },
        _count: { _all: true },
      });
      const contactIds = rows.map((r) => r.contactId);
      const contacts = contactIds.length
        ? await prisma.contact.findMany({
            where: { id: { in: contactIds } },
            select: { id: true, displayName: true },
          })
        : [];
      const nameById = new Map(contacts.map((c) => [c.id, c.displayName]));
      byAssignee = rows
        .map((r) => ({
          contactId: r.contactId,
          displayName: nameById.get(r.contactId) ?? 'Sin nombre',
          count: r._count._all,
        }))
        .sort((a, b) => b.count - a.count);
    }

    return {
      total,
      active,
      byStatus,
      overdue,
      dueWithin48h,
      unassigned,
      byPriority: {},
      byAssignee,
    };
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

    if (input.assigneeContactIds?.length) {
      await contactsService.assertActiveAssignees(input.workspaceId, input.assigneeContactIds);
    }

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
    }).then(async (created) => {
      if (input.assigneeContactIds?.length) {
        void notificationsService.notifyContactLinkedUsers(
          input.workspaceId,
          input.assigneeContactIds,
          {
            type: 'commitment_assigned',
            title: 'Nuevo compromiso asignado',
            message: `Se te asignó: ${created.title}`,
            relatedCommitmentId: created.id,
          }
        );
      }
      return created;
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
    return prisma.$transaction(run).then(async (updated) => {
      if (!updated) return updated;
      await this.dispatchStatusNotifications(workspaceId, updated, toStatus, actor?.userId);
      return updated;
    });
  }

  private async dispatchStatusNotifications(
    workspaceId: string,
    commitment: {
      id: string;
      title: string;
      assignees: Array<{ contactId: string }>;
    },
    toStatus: string,
    actorUserId?: string
  ) {
    const assigneeContactIds = commitment.assignees.map((a) => a.contactId);

    if (toStatus === 'correction_requested') {
      void notificationsService.notifyContactLinkedUsers(workspaceId, assigneeContactIds, {
        type: 'correction_requested',
        title: 'Corrección solicitada',
        message: `Se solicitó corrección en: ${commitment.title}`,
        relatedCommitmentId: commitment.id,
      });
      return;
    }

    if (toStatus === 'closed') {
      void notificationsService.notifyContactLinkedUsers(workspaceId, assigneeContactIds, {
        type: 'commitment_closed',
        title: 'Compromiso cerrado',
        message: `Se cerró el compromiso: ${commitment.title}`,
        relatedCommitmentId: commitment.id,
      });
    }

    if (toStatus === 'evidence_submitted') {
      void notificationsService.notifyCoordinators(
        workspaceId,
        {
          type: 'evidence_uploaded',
          title: 'Evidencia enviada',
          message: `Nueva evidencia en: ${commitment.title}`,
          relatedCommitmentId: commitment.id,
        },
        actorUserId
      );
    }
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
