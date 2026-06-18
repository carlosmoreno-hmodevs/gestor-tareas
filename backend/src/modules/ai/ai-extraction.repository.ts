import type { Prisma } from '@prisma/client';
import { prisma } from '../../shared/database/prisma';
import type { CommitmentExtractionJson } from './ai.types';

export class AiExtractionRepository {
  async createProposed(params: {
    messageId: string;
    transcriptionId?: string;
    inputText: string;
    detectedIntent: string;
    extractedJson: CommitmentExtractionJson;
    model: string;
    confidence?: number;
    status?: string;
  }): Promise<string> {
    const row = await prisma.aiExtraction.create({
      data: {
        messageId: params.messageId,
        transcriptionId: params.transcriptionId,
        inputText: params.inputText,
        detectedIntent: params.detectedIntent,
        extractedJson: params.extractedJson as unknown as Prisma.InputJsonValue,
        requiresConfirmation: true,
        status: params.status ?? 'proposed',
        model: params.model,
        confidence: params.confidence,
      },
    });
    return row.id;
  }

  async markStatus(id: string, status: 'confirmed' | 'rejected'): Promise<void> {
    await prisma.aiExtraction.update({
      where: { id },
      data: { status },
    });
  }
}

export const aiExtractionRepository = new AiExtractionRepository();
