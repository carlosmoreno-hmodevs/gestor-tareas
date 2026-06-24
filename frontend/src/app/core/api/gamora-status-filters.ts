import type { TaskStatus } from '../../shared/models';

/** Estados Gamora → estados UI legacy */
export const GAMORA_TO_UI_STATUS: Record<string, TaskStatus> = {
  draft: 'Pendiente',
  assigned: 'Pendiente',
  accepted: 'En Progreso',
  evidence_submitted: 'En Progreso',
  in_review: 'En Progreso',
  correction_requested: 'En Espera',
  corrected: 'En Progreso',
  pending_close: 'En Progreso',
  closed: 'Completada',
  cancelled: 'Cancelada',
  rejected: 'Rechazada',
};

/** Filtros UI → estados Gamora (API) */
export const UI_STATUS_TO_GAMORA: Record<string, string[]> = {
  Pendiente: ['assigned', 'draft'],
  'En Progreso': ['accepted', 'evidence_submitted', 'in_review', 'corrected', 'pending_close'],
  'En Espera': ['correction_requested'],
  Completada: ['closed'],
  Liberada: ['closed'],
  Cancelada: ['cancelled'],
  Rechazada: ['rejected'],
  completadas: ['closed'],
  Vencida: [], // usar overdue=true
};

export function gamoraStatusesForUiFilter(uiStatus: string): string[] | 'overdue' | null {
  if (uiStatus === 'Vencida') return 'overdue';
  return UI_STATUS_TO_GAMORA[uiStatus] ?? null;
}

export const GAMORA_STATUS_LABELS: Record<string, string> = {
  assigned: 'Pendiente',
  accepted: 'En progreso',
  evidence_submitted: 'Evidencia enviada',
  in_review: 'En revisión',
  correction_requested: 'Corrección solicitada',
  corrected: 'Corregida',
  closed: 'Cerrada',
  cancelled: 'Cancelada',
  draft: 'Borrador',
  rejected: 'Rechazada',
  pending_close: 'Pendiente de cierre',
};

/** Columnas Kanban Gamora (orden operativo) */
export const GAMORA_KANBAN_COLUMNS: { status: string; label: string }[] = [
  { status: 'assigned', label: 'Pendiente' },
  { status: 'accepted', label: 'En progreso' },
  { status: 'evidence_submitted', label: 'Evidencia enviada' },
  { status: 'in_review', label: 'En revisión' },
  { status: 'correction_requested', label: 'Corrección solicitada' },
  { status: 'corrected', label: 'Corregida' },
  { status: 'closed', label: 'Cerrada' },
  { status: 'cancelled', label: 'Cancelada' },
];

export function gamoraStatusLabel(status: string | undefined): string {
  if (!status) return '—';
  return GAMORA_STATUS_LABELS[status] ?? status;
}
