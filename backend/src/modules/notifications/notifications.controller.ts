import { Router } from 'express';
import { getWorkspace } from '../auth/auth.middleware';
import { loadAuthActor } from '../auth/commitment.permissions';
import { mapNotificationForApi, notificationsService } from './notifications.service';

export const notificationsRouter = Router();

notificationsRouter.get('/', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    const limit = Math.min(parseInt(String(req.query.limit ?? '30'), 10) || 30, 100);
    const items = await notificationsService.list(workspace.id, actor.userId, limit);
    res.json({ data: items.map(mapNotificationForApi) });
  } catch (err) {
    next(err);
  }
});

notificationsRouter.get('/unread-count', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    const count = await notificationsService.unreadCount(workspace.id, actor.userId);
    res.json({ data: { count } });
  } catch (err) {
    next(err);
  }
});

notificationsRouter.patch('/read-all', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    await notificationsService.markAllRead(workspace.id, actor.userId);
    res.json({ data: { ok: true } });
  } catch (err) {
    next(err);
  }
});

notificationsRouter.patch('/:id/read', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    const actor = await loadAuthActor(req);
    const updated = await notificationsService.markRead(workspace.id, actor.userId, req.params.id);
    if (!updated) {
      res.status(404).json({ error: 'Notificación no encontrada' });
      return;
    }
    res.json({ data: mapNotificationForApi(updated) });
  } catch (err) {
    next(err);
  }
});
