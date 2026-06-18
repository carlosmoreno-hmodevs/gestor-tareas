import type { AiExtractionAttempt } from '../ai.types';

export type AiProviderKind = 'openai' | 'mock' | 'groq' | 'ollama';

export interface AiExtractionProvider {
  readonly kind: AiProviderKind;
  extractCommitmentIntent(inputText: string): Promise<AiExtractionAttempt>;
}
