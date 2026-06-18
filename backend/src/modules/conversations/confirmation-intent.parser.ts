export type ConfirmationIntent = 'confirm' | 'cancel' | 'unknown';

const CONFIRM_RE = /^(s[ií]|confirmo|correcto|ok|adelante)[\s!.?,]*$/i;
const CANCEL_RE = /^(no|cancelar|cancela)[\s!.?,]*$/i;

/** Detecta intención de confirmación o cancelación en respuesta corta del usuario */
export function parseConfirmationIntent(text: string): ConfirmationIntent {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return 'unknown';
  if (CONFIRM_RE.test(normalized)) return 'confirm';
  if (CANCEL_RE.test(normalized)) return 'cancel';
  return 'unknown';
}
