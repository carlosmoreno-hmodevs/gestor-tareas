/** Plantilla de tarea para modo ferretero (prellenado de formulario). */
export interface TaskTemplate {
  id: string;
  name: string;
  /** Título sugerido (puede contener placeholder como {Proveedor}). */
  titleTemplate: string;
  /** ID de categoría sugerida (área). */
  categoryId?: string;
  /** Texto narrativo / instrucción (NO incluye checklist). */
  descriptionText?: string;
  /** Items de checklist (se crean como TaskChecklistItem nativos). */
  checklistItems: string[];
  /** Pista de evidencia esperada (ej. "Foto mercancía/factura"). */
  evidenceHint?: string;
  /** Nota de control (ej. "Puede quedar Bloqueada por aclaración; liberación por supervisor"). */
  controlNotes?: string;
}
