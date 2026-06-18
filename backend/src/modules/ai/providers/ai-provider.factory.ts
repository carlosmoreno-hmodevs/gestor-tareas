import { aiConfig } from '../../../config/ai.config';
import type { AiExtractionProvider } from './ai-provider.interface';
import { mockAiExtractionProvider } from './mock-ai.provider';
import { openAiExtractionProvider } from './openai-ai.provider';

export function createAiExtractionProvider(): AiExtractionProvider {
  switch (aiConfig.provider) {
    case 'mock':
      return mockAiExtractionProvider;
    case 'groq':
    case 'ollama':
      console.warn(
        `[AI] Provider "${aiConfig.provider}" no implementado aún — usando mock (fallback determinístico)`
      );
      return mockAiExtractionProvider;
    case 'openai':
    default:
      return openAiExtractionProvider;
  }
}

export const aiExtractionProvider = createAiExtractionProvider();
