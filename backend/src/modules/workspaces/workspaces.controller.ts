import { Router } from 'express';
import { z } from 'zod';
import { getWorkspace, requireAdmin } from '../auth/auth.middleware';
import { workspacesService } from './workspaces.service';

export const workspacesRouter = Router();

workspacesRouter.get('/current', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);
    res.json({ data: workspacesService.getCurrent(workspace) });
  } catch (err) {
    next(err);
  }
});

const patchCurrentSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  settings: z
    .object({
      timezone: z.string().min(1).max(100).optional(),
      logoUrl: z.string().url().nullable().optional(),
      audio_enabled: z.boolean().optional(),
      audio_max_duration_seconds: z.number().int().positive().optional(),
      audio_max_size_bytes: z.number().int().positive().optional(),
      evidenceRequiredDefault: z.boolean().optional(),
      defaultDueDays: z.number().int().min(0).max(365).optional(),
      allowAssigneeEvidenceAfterReview: z.boolean().optional(),
    })
    .optional(),
});

workspacesRouter.patch('/current', requireAdmin, async (req, res, next) => {
  try {
    const body = patchCurrentSchema.parse(req.body);
    const workspace = getWorkspace(req);
    const updated = await workspacesService.updateCurrent(workspace.id, body);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});
