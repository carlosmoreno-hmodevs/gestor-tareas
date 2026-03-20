import { Injectable, signal } from '@angular/core';

/**
 * El shell usa esto para quitar max-width en /tareas cuando la vista es Tablero (ancho completo).
 */
@Injectable({ providedIn: 'root' })
export class TaskPageLayoutService {
  readonly tasksFullBleed = signal(false);

  setTasksFullBleed(value: boolean): void {
    this.tasksFullBleed.set(value);
  }
}
