import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { GAMORA_KANBAN_COLUMNS, gamoraStatusLabel } from '../../../core/api/gamora-status-filters';
import type { Task } from '../../models';

@Component({
  selector: 'app-gamora-kanban-board',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './gamora-kanban-board.component.html',
  styleUrl: './gamora-kanban-board.component.scss',
})
export class GamoraKanbanBoardComponent {
  tasks = input.required<Task[]>();

  readonly columns = GAMORA_KANBAN_COLUMNS;

  tasksByColumn = computed(() => {
    const map = new Map<string, Task[]>();
    for (const col of this.columns) {
      map.set(col.status, []);
    }
    for (const task of this.tasks()) {
      const status = task.gamoraStatus ?? task.observations ?? 'assigned';
      const list = map.get(status);
      if (list) {
        list.push(task);
      } else {
        const fallback = map.get('assigned') ?? [];
        fallback.push(task);
        map.set('assigned', fallback);
      }
    }
    return map;
  });

  statusLabel(status: string): string {
    return gamoraStatusLabel(status);
  }

  dueLabel(task: Task): string {
    if (!task.hasDueDate) return 'Sin fecha';
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(
      new Date(task.dueDate)
    );
  }
}
