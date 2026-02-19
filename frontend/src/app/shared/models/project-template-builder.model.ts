import type { TaskChecklistItem } from './task-checklist.model';

/** Ítem editable en el Project Template Builder. */
export interface ProjectTemplateBuilderItem {
  key: string;
  taskTemplateId?: string;
  included: boolean;
  title: string;
  categoryId: string;
  priority: string;
  assigneeId: string;
  dueDate?: Date;
  description?: string;
  /** Items de checklist (se convierten en TaskChecklistItem al crear). */
  checklistItems: string[];
}
