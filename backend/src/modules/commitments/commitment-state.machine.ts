/** Estados del compromiso — ver checklist Fase 2 para equivalencias con UI Angular */

export const COMMITMENT_STATUSES = [
  'draft',
  'pending',
  'assigned',
  'accepted',
  'evidence_submitted',
  'in_review',
  'correction_requested',
  'corrected',
  'closed',
  'cancelled',
] as const;

export type CommitmentStatus = (typeof COMMITMENT_STATUSES)[number];

const TERMINAL = new Set(['closed', 'cancelled']);

/** Transiciones explícitas por estado (sin contar cancelación global) */
const ALLOWED: Record<string, string[]> = {
  draft: ['assigned', 'accepted'],
  pending: ['assigned', 'accepted'],
  assigned: ['accepted'],
  accepted: ['evidence_submitted'],
  evidence_submitted: ['in_review'],
  in_review: ['correction_requested', 'closed'],
  correction_requested: ['corrected'],
  corrected: ['in_review'],
};

/** Normaliza alias: pending ≡ draft para validación */
export function normalizeStatus(status: string): string {
  if (status === 'pending') return 'draft';
  return status;
}

export function canTransition(from: string, to: string): boolean {
  const fromNorm = normalizeStatus(from);
  const toNorm = normalizeStatus(to);
  if (fromNorm === toNorm) return true;
  if (toNorm === 'cancelled' && !TERMINAL.has(fromNorm)) return true;
  if (TERMINAL.has(fromNorm)) return false;
  return ALLOWED[fromNorm]?.includes(toNorm) ?? false;
}

export function assertTransition(from: string, to: string): void {
  if (!canTransition(from, to)) {
    throw new Error(`Transición no permitida: ${from} → ${to}`);
  }
}

export function statusesAllowingEvidenceUpload(status: string): boolean {
  return ['accepted', 'correction_requested'].includes(status);
}
