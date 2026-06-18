import { Router } from 'express';
import { prisma } from '../../shared/database/prisma';
import { resolveWorkspaceSlug } from '../channels/simulator/simulator.adapter';

export const workspacesRouter = Router();

workspacesRouter.get('/current', async (req, res, next) => {
  try {
    const slug = resolveWorkspaceSlug(req);
    const workspace = await prisma.workspace.findUnique({ where: { slug } });
    if (!workspace) {
      res.status(404).json({ error: 'Workspace no encontrado' });
      return;
    }
    res.json({ data: workspace });
  } catch (err) {
    next(err);
  }
});
