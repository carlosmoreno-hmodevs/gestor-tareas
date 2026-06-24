import type { Prisma } from '@prisma/client';
import type { AuthActor } from '../auth/commitment.permissions';
import { seesAllWorkspaceCommitments } from '../auth/commitment.permissions';

const TERMINAL_STATUSES = ['closed', 'cancelled'] as const;
const ACTIVE_STATUSES_EXCLUDE = [...TERMINAL_STATUSES];

export interface CommitmentListFilters {
  status?: string[];
  assigneeContactId?: string;
  priority?: string;
  dueFrom?: Date;
  dueTo?: Date;
  overdue?: boolean;
  dueWithin48h?: boolean;
  unassigned?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CommitmentListResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CommitmentSummary {
  total: number;
  active: number;
  byStatus: {
    assigned: number;
    accepted: number;
    evidence_submitted: number;
    in_review: number;
    correction_requested: number;
    corrected: number;
    closed: number;
    cancelled: number;
    other: number;
  };
  overdue: number;
  dueWithin48h: number;
  unassigned: number;
  byPriority: Record<string, number>;
  byAssignee: Array<{
    contactId: string;
    displayName: string;
    count: number;
  }>;
}

const STATUS_KEYS = [
  'assigned',
  'accepted',
  'evidence_submitted',
  'in_review',
  'correction_requested',
  'corrected',
  'closed',
  'cancelled',
] as const;

export function resolveAssigneeContactFilter(
  actor: AuthActor,
  requested?: string
): string | undefined {
  if (actor.role === 'assignee') {
    return actor.contactId ?? undefined;
  }
  return requested;
}

export function buildCommitmentListWhere(
  workspaceId: string,
  scopeWhere: Record<string, unknown>,
  filters: CommitmentListFilters,
  actor: AuthActor
): Prisma.CommitmentWhereInput {
  const and: Prisma.CommitmentWhereInput[] = [{ workspaceId }, scopeWhere as Prisma.CommitmentWhereInput];

  if (filters.status?.length) {
    and.push({ status: { in: filters.status } });
  }

  const assigneeId = resolveAssigneeContactFilter(actor, filters.assigneeContactId);
  if (assigneeId) {
    and.push({ assignees: { some: { contactId: assigneeId } } });
  }

  if (filters.unassigned) {
    and.push({ assignees: { none: {} } });
  }

  if (filters.overdue) {
    and.push({
      dueAt: { lt: new Date() },
      status: { notIn: [...ACTIVE_STATUSES_EXCLUDE] },
    });
  }

  if (filters.dueWithin48h) {
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    and.push({
      dueAt: { gte: now, lte: in48h },
      status: { notIn: [...ACTIVE_STATUSES_EXCLUDE] },
    });
  }

  if (filters.dueFrom || filters.dueTo) {
    const dueAt: Prisma.DateTimeNullableFilter = {};
    if (filters.dueFrom) dueAt.gte = filters.dueFrom;
    if (filters.dueTo) dueAt.lte = filters.dueTo;
    and.push({ dueAt });
  }

  if (filters.search?.trim()) {
    const q = filters.search.trim();
    and.push({
      OR: [
        { title: { contains: q } },
        { folio: { contains: q } },
        { description: { contains: q } },
        { location: { contains: q } },
        { assignees: { some: { contact: { displayName: { contains: q } } } } },
      ],
    });
  }

  // priority no existe en schema — si se envía, no devolver filas
  if (filters.priority) {
    and.push({ id: { in: [] } });
  }

  return { AND: and };
}

export function emptySummary(): CommitmentSummary {
  return {
    total: 0,
    active: 0,
    byStatus: {
      assigned: 0,
      accepted: 0,
      evidence_submitted: 0,
      in_review: 0,
      correction_requested: 0,
      corrected: 0,
      closed: 0,
      cancelled: 0,
      other: 0,
    },
    overdue: 0,
    dueWithin48h: 0,
    unassigned: 0,
    byPriority: {},
    byAssignee: [],
  };
}

export function mapStatusCounts(
  groups: Array<{ status: string; _count: number }>
): CommitmentSummary['byStatus'] {
  const result = emptySummary().byStatus;
  let other = 0;
  for (const g of groups) {
    if ((STATUS_KEYS as readonly string[]).includes(g.status)) {
      result[g.status as keyof typeof result] = g._count;
    } else {
      other += g._count;
    }
  }
  result.other = other;
  return result;
}

export function includeByAssigneeBreakdown(role: AuthActor['role']): boolean {
  return seesAllWorkspaceCommitments(role);
}
