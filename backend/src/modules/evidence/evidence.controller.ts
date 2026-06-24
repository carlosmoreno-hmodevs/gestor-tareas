import { Router, type Request, type Response, type NextFunction } from 'express';
import fs from 'fs/promises';
import { prisma } from '../../shared/database/prisma';
import {
  assertCanView,
  assertCanUploadEvidence,
  handleAuthorizationError,
  type AuthActor,
  NOT_FOUND_MESSAGE,
} from '../auth/commitment.permissions';
import { evidenceService } from './evidence.service';
import { evidenceUploadMiddleware } from './evidence.upload';

export const evidenceRouter = Router({ mergeParams: true });

function mapEvidence(e: {
  id: string;
  workspaceId: string;
  commitmentId: string;
  uploadedByContactId: string | null;
  uploadedByUserId: string | null;
  source: string;
  mediaType: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  storageProvider: string;
  storagePath: string;
  createdAt: Date;
}) {
  return {
    id: e.id,
    workspaceId: e.workspaceId,
    commitmentId: e.commitmentId,
    uploadedByContactId: e.uploadedByContactId,
    uploadedByUserId: e.uploadedByUserId,
    source: e.source,
    mediaType: e.mediaType,
    originalFilename: e.originalFilename,
    mimeType: e.mimeType,
    sizeBytes: e.sizeBytes,
    storageProvider: e.storageProvider,
    createdAt: e.createdAt,
  };
}

async function loadCommitmentForEvidence(workspaceId: string, commitmentId: string) {
  return prisma.commitment.findFirst({
    where: { id: commitmentId, workspaceId },
    include: { assignees: true },
  });
}

function getActor(res: Response): AuthActor {
  return res.locals.authActor as AuthActor;
}

evidenceRouter.get('/', async (req, res, next) => {
  try {
    const workspaceId = res.locals.workspaceId as string;
    const params = req.params as { id: string };
    const commitmentId = params.id;
    const actor = getActor(res);
    const commitment = await loadCommitmentForEvidence(workspaceId, commitmentId);
    if (!commitment) {
      res.status(404).json({ error: NOT_FOUND_MESSAGE });
      return;
    }
    assertCanView(actor, commitment);
    const items = await evidenceService.list(workspaceId, commitmentId);
    res.json({ data: (items ?? []).map(mapEvidence) });
  } catch (err) {
    handleAuthorizationError(err, res, next);
  }
});

evidenceRouter.post('/', (req, res, next) => {
  evidenceUploadMiddleware(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: (err as Error).message });
      return;
    }
    next();
  });
}, async (req, res, next) => {
  try {
    const workspaceId = res.locals.workspaceId as string;
    const params = req.params as { id: string };
    const commitmentId = params.id;
    const actor = getActor(res);
    const commitment = await loadCommitmentForEvidence(workspaceId, commitmentId);
    if (!commitment) {
      res.status(404).json({ error: NOT_FOUND_MESSAGE });
      return;
    }
    assertCanUploadEvidence(actor, commitment);

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'Archivo requerido (campo "file")' });
      return;
    }

    const actorContactId =
      typeof req.body.actor_contact_id === 'string'
        ? req.body.actor_contact_id
        : actor.contactId ?? undefined;

    try {
      const evidence = await evidenceService.upload({
        workspaceId,
        commitmentId,
        buffer: file.buffer,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        actor: { contactId: actorContactId, userId: actor.userId },
      });
      if (!evidence) {
        res.status(404).json({ error: NOT_FOUND_MESSAGE });
        return;
      }
      res.status(201).json({ data: mapEvidence(evidence) });
    } catch (e) {
      res.status(422).json({ error: (e as Error).message });
    }
  } catch (err) {
    handleAuthorizationError(err, res, next);
  }
});

evidenceRouter.get('/:evidenceId/file', async (req, res, next) => {
  try {
    const workspaceId = res.locals.workspaceId as string;
    const params = req.params as { id: string; evidenceId: string };
    const commitmentId = params.id;
    const evidenceId = params.evidenceId;
    const actor = getActor(res);
    const commitment = await loadCommitmentForEvidence(workspaceId, commitmentId);
    if (!commitment) {
      res.status(404).json({ error: NOT_FOUND_MESSAGE });
      return;
    }
    assertCanView(actor, commitment);

    const evidence = await evidenceService.getById(workspaceId, commitmentId, evidenceId);
    if (!evidence) {
      res.status(404).json({ error: 'Evidencia no encontrada' });
      return;
    }
    const filePath = await evidenceService.getFilePath(workspaceId, commitmentId, evidenceId);
    if (!filePath) {
      res.status(404).json({ error: 'Archivo no encontrado' });
      return;
    }
    res.setHeader('Content-Type', evidence.mimeType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(evidence.originalFilename)}"`
    );
    const data = await fs.readFile(filePath);
    res.send(data);
  } catch (err) {
    handleAuthorizationError(err, res, next);
  }
});
