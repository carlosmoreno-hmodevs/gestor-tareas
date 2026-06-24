import { Router } from 'express';
import { z } from 'zod';
import { getWorkspace } from '../auth/auth.middleware';
import { loadAuthActor } from '../auth/commitment.permissions';
import {
  canListContacts,
  FORBIDDEN_MESSAGE,
  listScopeWhere,
  requireManageContacts,
} from './contacts.permissions';
import { contactsService, ContactsError } from './contacts.service';

export const contactsRouter = Router();

const contactStatusSchema = z.enum(['active', 'inactive']);

function handleContactsError(
  err: unknown,
  res: import('express').Response,
  next: import('express').NextFunction
) {
  if (err instanceof ContactsError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  next(err);
}

contactsRouter.get('/me', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    const contact = await contactsService.getMe(workspace.id, actor.contactId);
    if (!contact) {
      res.status(404).json({ error: 'No tienes un responsable operativo vinculado.' });
      return;
    }
    res.json({ data: contact });
  } catch (err) {
    next(err);
  }
});

contactsRouter.get('/', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    if (!canListContacts(actor.role)) {
      res.status(403).json({ error: FORBIDDEN_MESSAGE });
      return;
    }

    const statusParam = typeof req.query.status === 'string' ? req.query.status : undefined;
    const activeOnly = req.query.for_assignment === 'true' || req.query.active_only === 'true';
    const status = statusParam ? contactStatusSchema.parse(statusParam) : undefined;

    const items = await contactsService.list(workspace.id, listScopeWhere(actor), {
      status,
      activeOnly,
    });
    res.json({ data: items });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Parámetro de filtro inválido.' });
      return;
    }
    next(err);
  }
});

contactsRouter.get('/:id', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    if (!canListContacts(actor.role)) {
      res.status(403).json({ error: FORBIDDEN_MESSAGE });
      return;
    }

    const item = await contactsService.getById(workspace.id, req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Responsable no encontrado.' });
      return;
    }

    if (actor.role === 'assignee' && actor.contactId !== item.id) {
      res.status(404).json({ error: 'Responsable no encontrado.' });
      return;
    }

    res.json({ data: item });
  } catch (err) {
    next(err);
  }
});

const createSchema = z.object({
  display_name: z.string().min(2).max(255),
  phone_number: z.string().max(50).optional(),
  email: z.string().email().optional(),
  position: z.string().max(100).optional(),
  team: z.string().max(100).optional(),
  user_id: z.string().uuid().optional(),
});

contactsRouter.post('/', requireManageContacts, async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const workspace = getWorkspace(req);
    const created = await contactsService.create(workspace.id, {
      displayName: body.display_name,
      phoneNumber: body.phone_number,
      email: body.email,
      position: body.position,
      team: body.team,
      userId: body.user_id,
    });
    res.status(201).json({ data: created });
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(err);
      return;
    }
    handleContactsError(err, res, next);
  }
});

const patchSchema = z.object({
  display_name: z.string().min(2).max(255).optional(),
  phone_number: z.string().max(50).nullable().optional(),
  email: z.string().email().nullable().optional(),
  position: z.string().max(100).nullable().optional(),
  team: z.string().max(100).nullable().optional(),
});

contactsRouter.patch('/:id', requireManageContacts, async (req, res, next) => {
  try {
    const body = patchSchema.parse(req.body);
    const workspace = getWorkspace(req);
    const updated = await contactsService.update(workspace.id, req.params.id, {
      displayName: body.display_name,
      phoneNumber: body.phone_number,
      email: body.email,
      position: body.position,
      team: body.team,
    });
    res.json({ data: updated });
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(err);
      return;
    }
    handleContactsError(err, res, next);
  }
});

const patchStatusSchema = z.object({
  status: contactStatusSchema,
});

contactsRouter.patch('/:id/status', requireManageContacts, async (req, res, next) => {
  try {
    const body = patchStatusSchema.parse(req.body);
    const workspace = getWorkspace(req);
    const updated = await contactsService.updateStatus(workspace.id, req.params.id, body.status);
    res.json({ data: updated });
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(err);
      return;
    }
    handleContactsError(err, res, next);
  }
});
