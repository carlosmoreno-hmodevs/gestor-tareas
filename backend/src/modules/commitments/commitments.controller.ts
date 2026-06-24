import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { envConfig } from '../../config/env.config';
import { publicServerErrorMessage } from '../../shared/errors/public-error-message';
import { commitmentsService } from '../commitments/commitments.service';
import { getWorkspace } from '../auth/auth.middleware';
import {
  loadAuthActor,
  listScopeWhere,
  assertCanView,
  assertCanCreate,
  assertCanUpdate,
  assertCanTransition,
  handleAuthorizationError,
  AuthorizationError,
  NOT_FOUND_MESSAGE,
} from '../auth/commitment.permissions';
import { evidenceRouter } from '../evidence/evidence.controller';
import { ContactsError } from '../contacts/contacts.service';
import type { CommitmentListFilters } from './commitments-list.query';

export const commitmentsRouter = Router();

function parseListFilters(query: Record<string, unknown>): CommitmentListFilters {
  const statusRaw = typeof query.status === 'string' ? query.status : undefined;
  const status = statusRaw
    ? statusRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : undefined;

  const page = query.page !== undefined ? Number(query.page) : undefined;
  const pageSize = query.pageSize !== undefined ? Number(query.pageSize) : undefined;

  return {
    status,
    assigneeContactId:
      typeof query.assigneeContactId === 'string' ? query.assigneeContactId : undefined,
    priority: typeof query.priority === 'string' ? query.priority : undefined,
    dueFrom:
      typeof query.dueFrom === 'string' && query.dueFrom
        ? new Date(query.dueFrom)
        : undefined,
    dueTo:
      typeof query.dueTo === 'string' && query.dueTo ? new Date(query.dueTo) : undefined,
    overdue: query.overdue === 'true' ? true : undefined,
    dueWithin48h: query.dueWithin48h === 'true' ? true : undefined,
    unassigned: query.unassigned === 'true' ? true : undefined,
    search: typeof query.search === 'string' ? query.search : undefined,
    page: Number.isFinite(page) && page! > 0 ? page : undefined,
    pageSize: Number.isFinite(pageSize) && pageSize! > 0 ? Math.min(pageSize!, 100) : undefined,
  };
}

function hasListFilters(filters: CommitmentListFilters): boolean {
  return !!(
    filters.status?.length ||
    filters.assigneeContactId ||
    filters.priority ||
    filters.dueFrom ||
    filters.dueTo ||
    filters.overdue ||
    filters.dueWithin48h ||
    filters.unassigned ||
    filters.search ||
    filters.page !== undefined ||
    filters.pageSize !== undefined
  );
}

function mapCommitment(c: {
  id: string;
  workspaceId: string;
  folio: string;
  title: string;
  description: string | null;
  location: string | null;
  status: string;
  requesterContactId: string | null;
  dueAt: Date | null;
  expectedEvidence: string | null;
  conversationThreadId: string | null;
  originMessageId: string | null;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  requester?: { displayName: string } | null;
  assignees: Array<{
    contactId: string;
    status: string;
    role: string;
    contact: { displayName: string };
  }>;
}) {
  const primary = c.assignees.find((a) => a.role === 'primary') ?? c.assignees[0];
  return {
    id: c.id,
    workspaceId: c.workspaceId,
    folio: c.folio,
    title: c.title,
    description: c.description,
    location: c.location,
    status: c.status,
    requesterContactId: c.requesterContactId,
    requesterName: c.requester?.displayName ?? null,
    dueAt: c.dueAt,
    expectedEvidence: c.expectedEvidence,
    conversationThreadId: c.conversationThreadId,
    originMessageId: c.originMessageId,
    assigneeContactId: primary?.contactId ?? null,
    assigneeName: primary?.contact.displayName ?? null,
    assigneeStatus: primary?.status ?? null,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    closedAt: c.closedAt,
  };
}

commitmentsRouter.get('/summary', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    const summary = await commitmentsService.getSummary(
      workspace.id,
      listScopeWhere(actor),
      actor
    );
    res.json({ data: summary });
  } catch (err) {
    handleAuthorizationError(err, res, next);
  }
});

commitmentsRouter.get('/', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    const scope = listScopeWhere(actor);
    const filters = parseListFilters(req.query as Record<string, unknown>);

    if (hasListFilters(filters)) {
      const result = await commitmentsService.listFiltered(workspace.id, scope, filters, actor);
      res.json({
        data: {
          items: result.items.map(mapCommitment),
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
        },
      });
      return;
    }

    const items = await commitmentsService.list(workspace.id, scope);
    res.json({ data: items.map(mapCommitment) });
  } catch (err) {
    handleAuthorizationError(err, res, next);
  }
});

commitmentsRouter.use(
  '/:id/evidence',
  async (req, res, next) => {
    try {
      const workspace = getWorkspace(req);
      const actor = await loadAuthActor(req);
      res.locals.workspaceId = workspace.id;
      res.locals.authActor = actor;
      next();
    } catch (err) {
      handleAuthorizationError(err, res, next);
    }
  },
  evidenceRouter
);

commitmentsRouter.get('/:id', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    const item = await commitmentsService.getById(workspace.id, req.params.id);
    if (!item) {
      res.status(404).json({ error: NOT_FOUND_MESSAGE });
      return;
    }
    assertCanView(actor, item);
    res.json({
      data: {
        ...mapCommitment(item),
        events: await commitmentsService.presentEvents(item.events),
      },
    });
  } catch (err) {
    handleAuthorizationError(err, res, next);
  }
});

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  due_at: z.string().datetime().optional(),
  expected_evidence: z.string().optional(),
  assignee_contact_id: z.string().uuid().optional(),
  requester_contact_id: z.string().uuid().optional(),
});

commitmentsRouter.post('/', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    assertCanCreate(actor);
    const body = createSchema.parse(req.body);
    const created = await commitmentsService.create({
      workspaceId: workspace.id,
      title: body.title,
      description: body.description,
      location: body.location,
      dueAt: body.due_at ? new Date(body.due_at) : undefined,
      expectedEvidence: body.expected_evidence,
      requesterContactId: body.requester_contact_id,
      assigneeContactIds: body.assignee_contact_id ? [body.assignee_contact_id] : [],
      status: 'assigned',
    });
    res.status(201).json({ data: mapCommitment(created) });
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(err);
      return;
    }
    if (err instanceof ContactsError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    handleAuthorizationError(err, res, next);
  }
});

const patchSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  due_at: z.string().datetime().nullable().optional(),
  expected_evidence: z.string().optional(),
});

commitmentsRouter.patch('/:id', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    const existing = await commitmentsService.getById(workspace.id, req.params.id);
    if (!existing) {
      res.status(404).json({ error: NOT_FOUND_MESSAGE });
      return;
    }
    assertCanUpdate(actor, existing);
    const body = patchSchema.parse(req.body);
    const updated = await commitmentsService.update(workspace.id, req.params.id, {
      title: body.title,
      description: body.description,
      location: body.location,
      dueAt: body.due_at === null ? null : body.due_at ? new Date(body.due_at) : undefined,
      expectedEvidence: body.expected_evidence,
    });
    if (!updated) {
      res.status(404).json({ error: NOT_FOUND_MESSAGE });
      return;
    }
    res.json({ data: mapCommitment(updated) });
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(err);
      return;
    }
    handleAuthorizationError(err, res, next);
  }
});

const statusSchema = z.object({
  status: z.string().min(1),
  actor_contact_id: z.string().uuid().optional(),
  actor_user_id: z.string().uuid().optional(),
  comment: z.string().optional(),
});

commitmentsRouter.patch('/:id/status', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    const body = statusSchema.parse(req.body);
    const existing = await commitmentsService.getById(workspace.id, req.params.id);
    if (!existing) {
      res.status(404).json({ error: NOT_FOUND_MESSAGE });
      return;
    }
    assertCanTransition(actor, existing, body.status);
    try {
      const updated = await commitmentsService.updateStatus(
        workspace.id,
        req.params.id,
        body.status,
        {
          contactId: body.actor_contact_id ?? actor.contactId ?? undefined,
          userId: actor.userId,
        },
        { comment: body.comment }
      );
      if (!updated) {
        res.status(404).json({ error: NOT_FOUND_MESSAGE });
        return;
      }
      res.json({ data: mapCommitment(updated) });
    } catch (e) {
      res.status(422).json({ error: (e as Error).message });
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(err);
      return;
    }
    handleAuthorizationError(err, res, next);
  }
});

commitmentsRouter.get('/:id/events', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    const item = await commitmentsService.getById(workspace.id, req.params.id);
    if (!item) {
      res.status(404).json({ error: NOT_FOUND_MESSAGE });
      return;
    }
    assertCanView(actor, item);
    const events = await commitmentsService.getEvents(workspace.id, req.params.id);
    res.json({ data: events ?? [] });
  } catch (err) {
    handleAuthorizationError(err, res, next);
  }
});

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: 'Validación fallida',
      ...(envConfig.isLocal ? { details: err.flatten() } : {}),
    });
    return;
  }
  if (err instanceof AuthorizationError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: publicServerErrorMessage(err) });
}
