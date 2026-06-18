import { Prisma } from '@prisma/client';
import { prisma } from '../../shared/database/prisma';
import { commitmentsService } from '../commitments/commitments.service';
import { statusesAllowingEvidenceUpload } from '../commitments/commitment-state.machine';
import {
  inferMediaType,
  isAllowedMime,
  resolveStoragePath,
  saveUploadFile,
} from '../../shared/storage/local-storage';

export interface UploadEvidenceInput {
  workspaceId: string;
  commitmentId: string;
  buffer: Buffer;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  actor?: { contactId?: string; userId?: string };
}

export class EvidenceService {
  async list(workspaceId: string, commitmentId: string) {
    const commitment = await prisma.commitment.findFirst({
      where: { id: commitmentId, workspaceId },
      select: { id: true },
    });
    if (!commitment) return null;

    return prisma.evidenceFile.findMany({
      where: { commitmentId, workspaceId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getById(workspaceId: string, commitmentId: string, evidenceId: string) {
    return prisma.evidenceFile.findFirst({
      where: { id: evidenceId, commitmentId, workspaceId },
    });
  }

  async upload(input: UploadEvidenceInput) {
    if (!isAllowedMime(input.mimeType)) {
      throw new Error(`Tipo de archivo no permitido: ${input.mimeType}`);
    }

    const commitment = await prisma.commitment.findFirst({
      where: { id: input.commitmentId, workspaceId: input.workspaceId },
    });
    if (!commitment) return null;

    if (!statusesAllowingEvidenceUpload(commitment.status)) {
      throw new Error(
        `No se puede subir evidencia en estado "${commitment.status}". Estados válidos: accepted, correction_requested`
      );
    }

    const { storagePath } = await saveUploadFile(
      input.workspaceId,
      input.commitmentId,
      input.originalFilename,
      input.buffer
    );

    return prisma.$transaction(async (tx) => {
      const evidence = await tx.evidenceFile.create({
        data: {
          workspaceId: input.workspaceId,
          commitmentId: input.commitmentId,
          uploadedByContactId: input.actor?.contactId,
          uploadedByUserId: input.actor?.userId,
          source: 'web',
          mediaType: inferMediaType(input.mimeType),
          originalFilename: input.originalFilename,
          mimeType: input.mimeType,
          sizeBytes: input.sizeBytes,
          storageProvider: 'local',
          storagePath,
        },
      });

      await tx.commitmentEvent.create({
        data: {
          commitmentId: input.commitmentId,
          eventType: 'evidence_uploaded',
          actorContactId: input.actor?.contactId,
          actorUserId: input.actor?.userId,
          payloadJson: {
            evidenceFileId: evidence.id,
            originalFilename: evidence.originalFilename,
            mediaType: evidence.mediaType,
          } as Prisma.InputJsonValue,
        },
      });

      if (commitment.status === 'accepted') {
        await commitmentsService.updateStatus(
          input.workspaceId,
          input.commitmentId,
          'evidence_submitted',
          input.actor,
          { comment: `Evidencia subida: ${input.originalFilename}` },
          tx
        );
      }

      return evidence;
    });
  }

  async getFilePath(workspaceId: string, commitmentId: string, evidenceId: string) {
    const evidence = await this.getById(workspaceId, commitmentId, evidenceId);
    if (!evidence) return null;
    return resolveStoragePath(evidence.storagePath);
  }
}

export const evidenceService = new EvidenceService();
