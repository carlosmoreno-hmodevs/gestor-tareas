import { Injectable, inject, computed } from '@angular/core';
import { TenantSettingsService } from './tenant-settings.service';

/** Claves de etiquetas de UI (solo presentación). Los valores internos (status, etc.) no cambian. */
export type UiCopyKey =
  | 'assignee'           // Responsable -> Encargado
  | 'evidence'           // Evidencia -> Foto / Comprobante
  | 'priority'           // Prioridad -> Urgencia
  | 'sectionResponsibles'  // "Responsables y fecha límite" etc.
  | 'assigneeRequired'     // "Responsable obligatorio"
  | 'attachments';        // Adjuntos -> Foto / Comprobante en ferretero

const BASE_LABELS: Record<UiCopyKey, string> = {
  assignee: 'Responsable',
  evidence: 'Evidencia',
  priority: 'Prioridad',
  sectionResponsibles: 'Responsables y fecha límite',
  assigneeRequired: 'Responsable obligatorio',
  attachments: 'Adjuntos'
};

const FERRETERO_OVERRIDES: Record<UiCopyKey, string> = {
  assignee: 'Encargado',
  evidence: 'Foto / Comprobante',
  priority: 'Urgencia',
  sectionResponsibles: 'Encargados y fecha límite',
  assigneeRequired: 'Encargado obligatorio',
  attachments: 'Foto / Comprobante'
};

/** Mapeo de valor interno de estado a etiqueta visible. Solo para estados que cambian en ferretero. */
const STATUS_DISPLAY_NORMAL: Record<string, string> = {
  'En Espera': 'En Espera',
  'Liberada': 'Liberada',
  'Vencida': 'Vencida'
};

const STATUS_DISPLAY_FERRETERO: Record<string, string> = {
  'En Espera': 'Bloqueada',
  'Liberada': 'Validada por supervisor',
  'Vencida': 'Fuera de plazo'
};

@Injectable({ providedIn: 'root' })
export class UiCopyService {
  private readonly tenantSettings = inject(TenantSettingsService);

  /** Etiqueta para una clave de UI. En modo normal devuelve la base; en ferretero el override. */
  label(key: UiCopyKey): string {
    return this.tenantSettings.isFerretero() ? (FERRETERO_OVERRIDES[key] ?? BASE_LABELS[key]) : BASE_LABELS[key];
  }

  /** Etiqueta visible de un estado (valor interno). No cambia el valor interno. */
  statusLabel(internalStatusValue: string): string {
    const normalized = internalStatusValue?.trim() || '';
    if (this.tenantSettings.isFerretero() && STATUS_DISPLAY_FERRETERO[normalized] !== undefined) {
      return STATUS_DISPLAY_FERRETERO[normalized];
    }
    return STATUS_DISPLAY_NORMAL[normalized] ?? normalized;
  }

  /** Para uso en templates: getter reactivo de la etiqueta (assignee). */
  readonly assigneeLabel = computed(() => this.label('assignee'));
  readonly evidenceLabel = computed(() => this.label('evidence'));
  readonly priorityLabel = computed(() => this.label('priority'));
  readonly sectionResponsiblesLabel = computed(() => this.label('sectionResponsibles'));
}
