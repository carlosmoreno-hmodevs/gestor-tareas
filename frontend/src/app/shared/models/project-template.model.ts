/** Plantilla de proyecto para modo ferretero (prellenado + tareas sugeridas). */
export interface ProjectTemplate {
  id: string;
  name: string;
  description?: string;
  /** Nombre del proyecto sugerido (puede contener {Sucursal}, etc.). */
  nameTemplate: string;
  defaultImageUrl?: string;
  suggestedCategoryIds?: string[];
  /** IDs de FERRETERO_TASK_TEMPLATES. */
  taskTemplateIds: string[];
  /** Overrides por task template (opcional). */
  taskOverrides?: Record<string, { title?: string; categoryId?: string; priority?: string }>;
  suggestedMilestones?: string[];
}
