import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TaskService } from '../../../core/services/task.service';
import { TaskWorkflowService } from '../../../core/services/task-workflow.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { DataService } from '../../../core/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AvatarComponent } from '../avatar/avatar.component';
import type { Task, TaskStatus } from '../../../shared/models';

const KANBAN_COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'Pendiente', label: 'Pendiente' },
  { status: 'En Progreso', label: 'En Progreso' },
  { status: 'En Espera', label: 'En Espera' },
  { status: 'Vencida', label: 'Vencida' },
  { status: 'Completada', label: 'Completada' },
  { status: 'Liberada', label: 'Liberada' },
  { status: 'Rechazada', label: 'Rechazada' },
  { status: 'Cancelada', label: 'Cancelada' }
];

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, RouterLink, DragDropModule, MatIconModule, AvatarComponent],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss'
})
export class KanbanBoardComponent {
  readonly taskService = inject(TaskService);
  private readonly workflow = inject(TaskWorkflowService);
  private readonly connectivity = inject(ConnectivityService);
  private readonly dataService = inject(DataService);
  private readonly snackBar = inject(MatSnackBar);

  tasks = input.required<Task[]>();
  draggable = input(true);

  columns = KANBAN_COLUMNS;
  columnIds = KANBAN_COLUMNS.map((c) => 'drop-' + c.status.replace(/\s+/g, '-'));
  users = this.dataService.usersForCurrentOrg;

  tasksByStatus = computed(() => {
    const tasks = this.tasks();
    const map = new Map<TaskStatus, Task[]>();
    for (const col of this.columns) {
      map.set(col.status, []);
    }
    for (const task of tasks) {
      const status = this.workflow.getEffectiveStatus(task);
      const list = map.get(status) ?? [];
      list.push(task);
      map.set(status, list);
    }
    return map;
  });

  getStatusFromContainerId(id: string): TaskStatus | null {
    const slug = id?.replace(/^drop-/, '');
    return this.columns.find((c) => c.status.replace(/\s+/g, '-') === slug)?.status ?? null;
  }

  canDrop = (): boolean => this.draggable() && this.connectivity.isOnline();

  getEffectiveStatus(task: Task): TaskStatus {
    return this.workflow.getEffectiveStatus(task);
  }

  getUserById(id: string) {
    return this.users().find((u) => u.id === id);
  }

  getUserByName(name: string) {
    return this.users().find((u) => u.name === name);
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    const task = event.item.data as Task;
    const toStatus = this.getStatusFromContainerId(event.container.id);
    if (!toStatus || !this.columns.some((c) => c.status === toStatus)) return;
    const fromStatus = this.workflow.getEffectiveStatus(task);

    if (fromStatus === toStatus) return;
    if (!this.canDrop()) return;

    const transition = this.workflow.getTransition(task, toStatus);
    if (!transition) {
      this.snackBar.open(
        `No se puede cambiar de "${fromStatus}" a "${toStatus}". Usa el detalle de la tarea.`,
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }
    if (transition.requiresComment || transition.requiresNewDueDate) {
      this.snackBar.open(
        `Esta transición requiere comentario. Abre la tarea para completarla.`,
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    try {
      this.taskService.applyTransition(task.id, toStatus, {});
      this.snackBar.open(`Estado: ${transition.label}`, 'Cerrar', { duration: 2000 });
    } catch (e) {
      this.snackBar.open((e as Error).message || 'Error al cambiar estado', 'Cerrar', {
        duration: 3000
      });
    }
  }
}
