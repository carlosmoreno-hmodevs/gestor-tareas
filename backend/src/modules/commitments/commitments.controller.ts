import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { envConfig } from '../../config/env.config';
import { publicServerErrorMessage } from '../../shared/errors/public-error-message';
import { commitmentsService } from '../commitments/commitments.service';
import { resolveWorkspaceSlug } from '../channels/simulator/simulator.adapter';
import { prisma } from '../../shared/database/prisma';
import { evidenceRouter } from '../evidence/evidence.controller';

export const commitmentsRouter = Router();

async function getWorkspace(req: Request) {
  const slug = resolveWorkspaceSlug(req);
  const workspace = await prisma.workspace.findUnique({ where: { slug } });
  if (!workspace) throw new Error(`Workspace no encontrado: ${slug}`);
  return workspace;
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

commitmentsRouter.get('/', async (req, res, next) => {
  try {
    const workspace = await getWorkspace(req);
    const items = await commitmentsService.list(workspace.id);
    res.json({ data: items.map(mapCommitment) });
  } catch (err) {
    next(err);
  }
});

commitmentsRouter.use('/:id/evidence', async (req, res, next) => {
  try {
    const workspace = await getWorkspace(req);
    res.locals.workspaceId = workspace.id;
    next();
  } catch (err) {
    next(err);
  }
}, evidenceRouter);

commitmentsRouter.get('/:id', async (req, res, next) => {
  try {
    const workspace = await getWorkspace(req);
    const item = await commitmentsService.getById(workspace.id, req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Compromiso no encontrado' });
      return;
    }
    res.json({
      data: {
        ...mapCommitment(item),
        events: await commitmentsService.presentEvents(item.events),
      },
    });
  } catch (err) {
    next(err);
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
    const workspace = await getWorkspace(req);
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
    next(err);
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
    const workspace = await getWorkspace(req);
    const body = patchSchema.parse(req.body);
    const updated = await commitmentsService.update(workspace.id, req.params.id, {
      title: body.title,
      description: body.description,
      location: body.location,
      dueAt: body.due_at === null ? null : body.due_at ? new Date(body.due_at) : undefined,
      expectedEvidence: body.expected_evidence,
    });
    if (!updated) {
      res.status(404).json({ error: 'Compromiso no encontrado' });
      return;
    }
    res.json({ data: mapCommitment(updated) });
  } catch (err) {
    next(err);
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
    const workspace = await getWorkspace(req);
    const body = statusSchema.parse(req.body);
    try {
      const updated = await commitmentsService.updateStatus(
        workspace.id,
        req.params.id,
        body.status,
        { contactId: body.actor_contact_id, userId: body.actor_user_id },
        { comment: body.comment }
      );
      if (!updated) {
        res.status(404).json({ error: 'Compromiso no encontrado' });
        return;
      }
      res.json({ data: mapCommitment(updated) });
    } catch (e) {
      res.status(422).json({ error: (e as Error).message });
    }
  } catch (err) {
    next(err);
  }
});

commitmentsRouter.get('/:id/events', async (req, res, next) => {
  try {
    const workspace = await getWorkspace(req);
    const events = await commitmentsService.getEvents(workspace.id, req.params.id);
    if (!events) {
      res.status(404).json({ error: 'Compromiso no encontrado' });
      return;
    }
    res.json({ data: events });
  } catch (err) {
    next(err);
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
  res.status(500).json({ error: publicServerErrorMessage(err) });
}
