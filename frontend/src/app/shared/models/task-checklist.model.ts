/** Ítem de checklist de tarea (tildable). */
export interface TaskChecklistItem {
  id: string;
  text: string;
  isDone: boolean;
  doneAt?: string;
  doneByUserId?: string;
}
