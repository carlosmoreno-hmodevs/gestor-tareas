import { aiExtractionProvider } from './providers/ai-provider.factory';
import { isAiExtractionUsable } from './providers/openai-ai.provider';
import type { Contact } from '@prisma/client';
import { aiConfig } from '../../config/ai.config';
import { parseCommitmentFromText } from '../conversations/text-intent.parser';
import { aiExtractionRepository } from './ai-extraction.repository';
import {
  mapExtractionJsonToIntent,
  mapParsedToMapped,
  mappedToExtractionJson,
} from './commitment-intent.mapper';
import type { ResolvedCommitmentIntent } from './ai.types';

export class AiService {
  async resolveCommitmentIntent(params: {
    inputText: string;
    contacts: Contact[];
    messageId: string;
    transcriptionId?: string;
  }): Promise<ResolvedCommitmentIntent> {
    const { inputText, contacts, messageId, transcriptionId } = params;

    if (aiConfig.enabled) {
      const attempt = await aiExtractionProvider.extractCommitmentIntent(inputText);

      if (isAiExtractionUsable(attempt)) {
        const mapped = mapExtractionJsonToIntent(attempt.extraction, contacts, inputText);
        const aiExtractionId = await aiExtractionRepository.createProposed({
          messageId,
          transcriptionId,
          inputText,
          detectedIntent: attempt.extraction.intent,
          extractedJson: attempt.extraction,
          model: `${aiConfig.provider}:${attempt.model}`,
          confidence: attempt.confidence,
          status: 'proposed',
        });

        return {
          parsed: mapped,
          source: 'ai',
          aiExtractionId,
          model: attempt.model,
          confidence: attempt.confidence,
        };
      }

      console.warn(
        '[AiService] Fallback determinístico:',
        attempt.errorMessage ?? `confianza=${attempt.confidence}, intent=${attempt.extraction.intent}`
      );
    }

    const parsed = parseCommitmentFromText(inputText, contacts);
    const mapped = mapParsedToMapped(parsed, contacts);
    const extractionJson = mappedToExtractionJson(mapped);

    const aiExtractionId = await aiExtractionRepository.createProposed({
      messageId,
      transcriptionId,
      inputText,
      detectedIntent: 'create_commitment',
      extractedJson: extractionJson,
      model: aiConfig.enabled ? 'deterministic-fallback' : 'deterministic-parser',
      confidence: aiConfig.enabled ? undefined : 1,
      status: aiConfig.enabled ? 'fallback' : 'proposed',
    });

    return {
      parsed: mapped,
      source: 'deterministic',
      aiExtractionId,
      model: aiConfig.enabled ? 'deterministic-fallback' : 'deterministic-parser',
    };
  }
}

export const aiService = new AiService();
