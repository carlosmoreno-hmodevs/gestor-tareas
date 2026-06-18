import { prisma } from '../../shared/database/prisma';
import {
  simulatorTranscriptionProvider,
  type SimulatorTranscriptionInput,
} from './simulator.provider';

export interface TranscriptionRunResult {
  status: 'completed' | 'failed';
  transcriptText?: string;
  errorMessage?: string;
  transcriptionId: string;
}

export class TranscriptionService {
  async getByMessageId(messageId: string) {
    return prisma.transcription.findUnique({ where: { messageId } });
  }

  async runSimulatorTranscription(
    messageId: string,
    input: SimulatorTranscriptionInput
  ): Promise<TranscriptionRunResult> {
    const pending = await prisma.transcription.upsert({
      where: { messageId },
      update: {
        provider: 'simulator',
        status: 'pending',
        transcriptText: null,
        errorMessage: null,
        completedAt: null,
      },
      create: {
        messageId,
        provider: 'simulator',
        status: 'pending',
      },
    });

    const result = simulatorTranscriptionProvider.transcribe(input);

    if (result.status === 'failed') {
      const updated = await prisma.transcription.update({
        where: { id: pending.id },
        data: {
          status: 'failed',
          errorMessage: result.errorMessage ?? 'Transcripción fallida',
          completedAt: new Date(),
        },
      });
      return {
        status: 'failed',
        errorMessage: updated.errorMessage ?? undefined,
        transcriptionId: updated.id,
      };
    }

    const updated = await prisma.transcription.update({
      where: { id: pending.id },
      data: {
        status: 'completed',
        transcriptText: result.transcriptText,
        completedAt: new Date(),
      },
    });

    return {
      status: 'completed',
      transcriptText: updated.transcriptText ?? undefined,
      transcriptionId: updated.id,
    };
  }
}

export const transcriptionService = new TranscriptionService();
