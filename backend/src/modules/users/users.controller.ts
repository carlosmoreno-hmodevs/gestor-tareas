import { Router } from 'express';
import { z } from 'zod';
import { getWorkspace, requireAdmin } from '../auth/auth.middleware';
import { usersService, UsersError } from './users.service';

export const usersRouter = Router();

const userRoleSchema = z.enum(['admin', 'coordinator', 'assignee', 'viewer']);
const userStatusSchema = z.enum(['active', 'suspended', 'inactive']);

function handleUsersError(err: unknown, res: import('express').Response, next: import('express').NextFunction) {
  if (err instanceof UsersError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  next(err);
}

usersRouter.get('/me', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const user = await usersService.getMe(workspace.id, req.auth!.userId);
    res.json({ data: user });
  } catch (err) {
    handleUsersError(err, res, next);
  }
});

const patchMeSchema = z.object({
  displayName: z.string().min(2).max(255).optional(),
});

usersRouter.patch('/me', async (req, res, next) => {
  try {
    const body = patchMeSchema.parse(req.body);
    const workspace = getWorkspace(req);
    const user = await usersService.updateMe(workspace.id, req.auth!.userId, body);
    res.json({ data: user });
  } catch (err) {
    handleUsersError(err, res, next);
  }
});

const changePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8),
});

usersRouter.post('/me/password', async (req, res, next) => {
  try {
    const body = changePasswordSchema.parse(req.body);
    const workspace = getWorkspace(req);
    await usersService.changePassword(
      workspace.id,
      req.auth!.userId,
      body.current_password,
      body.new_password
    );
    res.json({ data: { ok: true } });
  } catch (err) {
    handleUsersError(err, res, next);
  }
});

usersRouter.get('/', requireAdmin, async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const users = await usersService.list(workspace.id);
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

const createUserSchema = z.object({
  email: z.string().email(),
  display_name: z.string().min(2).max(255),
  role: userRoleSchema,
  password: z.string().min(8).optional(),
  create_contact: z.boolean().optional(),
});

usersRouter.post('/', requireAdmin, async (req, res, next) => {
  try {
    const body = createUserSchema.parse(req.body);
    const workspace = getWorkspace(req);
    const result = await usersService.create(workspace.id, {
      email: body.email,
      displayName: body.display_name,
      role: body.role,
      password: body.password,
      createContact: body.create_contact,
    });
    res.status(201).json({
      data: result.user,
      meta: { temporary_password: result.temporaryPassword },
    });
  } catch (err) {
    handleUsersError(err, res, next);
  }
});

const patchUserSchema = z.object({
  display_name: z.string().min(2).max(255).optional(),
  role: userRoleSchema.optional(),
  email: z.string().email().optional(),
});

usersRouter.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = patchUserSchema.parse(req.body);
    const workspace = getWorkspace(req);
    const user = await usersService.update(workspace.id, req.params.id, {
      displayName: body.display_name,
      role: body.role,
      email: body.email,
    });
    res.json({ data: user });
  } catch (err) {
    handleUsersError(err, res, next);
  }
});

const patchStatusSchema = z.object({
  status: userStatusSchema,
});

usersRouter.patch('/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const body = patchStatusSchema.parse(req.body);
    const workspace = getWorkspace(req);
    const user = await usersService.updateStatus(
      workspace.id,
      req.params.id,
      body.status,
      req.auth!.userId
    );
    res.json({ data: user });
  } catch (err) {
    handleUsersError(err, res, next);
  }
});

usersRouter.get('/:id', requireAdmin, async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const user = await usersService.getById(workspace.id, req.params.id);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado.' });
      return;
    }
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});
