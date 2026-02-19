/** Alcance de aplicación de un ítem del catálogo de motivos. */
export interface ReasonCatalogAppliesTo {
  categoryIds?: string[];
  taskTemplateIds?: string[];
  projectTemplateIds?: string[];
  projectIds?: string[];
  orgUnitTypeKeys?: string[];
}

/** Ítem del catálogo de motivos (bloqueo / rechazo). */
export interface ReasonCatalogItem {
  id: string;
  code: string;
  label: string;
  kind: 'blocked' | 'rejected';
  systemMode: 'normal' | 'ferretero' | 'all';
  appliesTo?: ReasonCatalogAppliesTo;
  /** Marca el ítem "Otro (personalizado)" que habilita texto libre. */
  isOther?: boolean;
  order?: number;
}

/** Motivo guardado en Task (bloqueo). Compatible con legacy (string). */
export interface TaskBlockedReason {
  code?: string;
  label?: string;
  customText?: string;
  detail?: string;
  source?: 'catalog' | 'custom' | 'legacy';
}

/** Motivo guardado en Task (rechazo). Compatible con legacy (correctedReason string). */
export interface TaskRejectedReason {
  code?: string;
  label?: string;
  customText?: string;
  detail?: string;
  source?: 'catalog' | 'custom' | 'legacy';
}
