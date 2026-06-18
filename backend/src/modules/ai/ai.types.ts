import type { MappedCommitmentIntent } from './commitment-intent.mapper';

export interface CommitmentExtractionJson {
  intent: string;
  assigneeName?: string;
  activity?: string;
  location?: string;
  dueDateText?: string;
  evidenceRequired?: string;
  priority?: string;
  confidence?: number;
}

export interface AiExtractionAttempt {
  success: boolean;
  extraction: CommitmentExtractionJson;
  confidence: number;
  model: string;
  errorMessage?: string;
}

export type ExtractionSource = 'ai' | 'deterministic';

export interface ResolvedCommitmentIntent {
  parsed: MappedCommitmentIntent;
  source: ExtractionSource;
  aiExtractionId?: string;
  model?: string;
  confidence?: number;
}
