import { aiConfig } from '../../../config/ai.config';
import type { AiExtractionAttempt, CommitmentExtractionJson } from '../ai.types';
import type { AiExtractionProvider } from './ai-provider.interface';

const SYSTEM_PROMPT = `Eres un asistente que extrae campos estructurados de instrucciones operativas en español (México).
Responde SOLO con un objeto JSON válido, sin markdown.

Campos requeridos:
- intent: "create_commitment" si el usuario pide asignar una tarea o compromiso; otro valor si no aplica
- assigneeName: nombre del responsable (solo el nombre, ej. "Panchito")
- activity: verbo + acción SIN ubicación, fecha ni evidencia (ej. "Contar los sacos de cemento")
- location: lugar limpio (ej. "Sucursal Centro") — NO incluyas "y mande foto" ni evidencia
- dueDateText: expresión de fecha tal como la dijo el usuario (ej. "mañana", "hoy")
- evidenceRequired: tipo de evidencia corto (ej. "foto") o null
- priority: "low" | "medium" | "high"
- confidence: número entre 0 y 1 indicando certeza de la extracción

Reglas:
- Separa ubicación de evidencia. "sucursal Centro y mande foto" → location="Sucursal Centro", evidenceRequired="foto"
- No repitas la ubicación dentro de activity
- activity debe ser concisa y accionable`;

export function estimateConfidence(json: CommitmentExtractionJson): number {
  let score = 0.5;
  if (json.intent === 'create_commitment') score += 0.15;
  if (json.activity?.trim()) score += 0.15;
  if (json.assigneeName?.trim()) score += 0.1;
  if (json.location?.trim() && !json.location.toLowerCase().includes('mande')) score += 0.1;
  return Math.min(score, 0.95);
}

export function isAiExtractionUsable(attempt: AiExtractionAttempt): boolean {
  if (!attempt.success) return false;
  if (attempt.extraction.intent !== 'create_commitment') return false;
  if (!attempt.extraction.activity?.trim()) return false;
  if (attempt.confidence < aiConfig.minConfidence) return false;
  const loc = attempt.extraction.location?.toLowerCase() ?? '';
  if (loc.includes('mande foto') || loc.includes('manda foto')) return false;
  return true;
}

export class OpenAiExtractionProvider implements AiExtractionProvider {
  readonly kind = 'openai' as const;

  async extractCommitmentIntent(inputText: string): Promise<AiExtractionAttempt> {
    const apiKey = aiConfig.openaiApiKey;
    if (!apiKey) {
      return {
        success: false,
        extraction: { intent: 'unknown' },
        confidence: 0,
        model: aiConfig.model,
        errorMessage: 'OPENAI_API_KEY no configurada',
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: aiConfig.model,
          temperature: 0.1,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: inputText },
          ],
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        return {
          success: false,
          extraction: { intent: 'unknown' },
          confidence: 0,
          model: aiConfig.model,
          errorMessage: `OpenAI HTTP ${response.status}: ${errBody.slice(0, 200)}`,
        };
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        return {
          success: false,
          extraction: { intent: 'unknown' },
          confidence: 0,
          model: aiConfig.model,
          errorMessage: 'Respuesta vacía de OpenAI',
        };
      }

      const parsed = JSON.parse(content) as CommitmentExtractionJson;
      const confidence =
        typeof parsed.confidence === 'number' && parsed.confidence >= 0 && parsed.confidence <= 1
          ? parsed.confidence
          : estimateConfidence(parsed);

      return {
        success: true,
        extraction: parsed,
        confidence,
        model: aiConfig.model,
      };
    } catch (err) {
      return {
        success: false,
        extraction: { intent: 'unknown' },
        confidence: 0,
        model: aiConfig.model,
        errorMessage: err instanceof Error ? err.message : 'Error desconocido en OpenAI',
      };
    }
  }
}

export const openAiExtractionProvider = new OpenAiExtractionProvider();
