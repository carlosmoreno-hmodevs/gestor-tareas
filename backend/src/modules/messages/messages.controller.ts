import { Router } from 'express';
import { prisma } from '../../shared/database/prisma';
import { getWorkspace } from '../auth/auth.middleware';
import { transcriptionService } from '../transcription/transcription.service';

export const messagesRouter = Router();

messagesRouter.get('/:id', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);

    const message = await prisma.message.findFirst({
      where: { id: req.params.id, workspaceId: workspace.id },
      include: {
        transcription: true,
        events: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!message) {
      res.status(404).json({ error: 'Mensaje no encontrado' });
      return;
    }

    res.json({ data: message });
  } catch (err) {
    next(err);
  }
});

messagesRouter.get('/:id/transcription', async (req, res, next) => {
  try {
    const workspace = getWorkspace(req);

    const message = await prisma.message.findFirst({
      where: { id: req.params.id, workspaceId: workspace.id },
      select: { id: true },
    });

    if (!message) {
      res.status(404).json({ error: 'Mensaje no encontrado' });
      return;
    }

    const transcription = await transcriptionService.getByMessageId(message.id);
    if (!transcription) {
      res.status(404).json({ error: 'Transcripción no encontrada' });
      return;
    }

    res.json({ data: transcription });
  } catch (err) {
    next(err);
  }
});
