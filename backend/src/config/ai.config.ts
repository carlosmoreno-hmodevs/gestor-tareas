import type { AiProviderKind } from '../modules/ai/providers/ai-provider.interface';

export const aiConfig = {
  enabled: process.env.AI_ENABLED === 'true',
  provider: (process.env.AI_PROVIDER ?? 'openai') as AiProviderKind,
  openaiApiKey: process.env.OPENAI_API_KEY ?? '',
  model: process.env.AI_MODEL ?? 'gpt-4o-mini',
  minConfidence: Number.parseFloat(process.env.AI_MIN_CONFIDENCE ?? '0.6'),
};
