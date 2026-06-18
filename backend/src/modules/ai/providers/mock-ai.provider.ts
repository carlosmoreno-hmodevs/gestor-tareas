import type { AiExtractionAttempt } from '../ai.types';
import type { AiExtractionProvider } from './ai-provider.interface';

/** Provider determinístico para pruebas sin llamadas externas */
export class MockAiExtractionProvider implements AiExtractionProvider {
  readonly kind = 'mock' as const;

  async extractCommitmentIntent(inputText: string): Promise<AiExtractionAttempt> {
    return {
      success: false,
      extraction: { intent: 'unknown' },
      confidence: 0,
      model: 'mock',
      errorMessage: `AI_PROVIDER=mock no extrae — usar parser determinístico. Input: ${inputText.slice(0, 40)}…`,
    };
  }
}

export const mockAiExtractionProvider = new MockAiExtractionProvider();
