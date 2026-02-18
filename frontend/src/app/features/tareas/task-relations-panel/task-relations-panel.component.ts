import { Component, inject, input, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import type { Task, TaskLink, TaskLinkType, TaskTreeNode } from '../../../shared/models';
import { TaskService } from '../../../core/services/task.service';
import { TaskWorkflowService } from '../../../core/services/task-workflow.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { AddSubtaskDialogComponent } from '../add-subtask-dialog/add-subtask-dialog.component';
import { AddLinkDialogComponent } from '../add-link-dialog/add-link-dialog.component';
import { LinkSubtaskDialogComponent } from '../link-subtask-dialog/link-subtask-dialog.component';

@Component({
  selector: 'app-task-relations-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    AvatarComponent
  ],
  templateUrl: './task-relations-panel.component.html',
  styleUrl: './task-relations-panel.component.scss'
})
export class TaskRelationsPanelComponent {
  private readonly taskService = inject(TaskService);
  private readonly workflow = inject(TaskWorkflowService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  taskId = input.required<string>();
  isOnline = input<boolean>(true);

  task = computed(() => this.taskService.getById(this.taskId()));
  parentTask = computed(() => this.task() ? this.taskService.getParentTask(this.taskId()) : undefined);
  subtasks = computed(() => this.task() ? this.taskService.getSubtasks(this.taskId()) : []);
  links = computed(() => this.task() ? this.taskService.getLinksForTask(this.taskId()) : { blockedBy: [], blocking: [], related: [], duplicates: [] });
  isBlocked = computed(() => this.task() ? this.taskService.isBlocked(this.taskId()) : false);
  linkableTasks = computed(() => this.task() ? this.taskService.getLinkableTasks(this.taskId()) : []);

  openLinkExistingSubtask(): void {
    const t = this.task();
    if (!t || !this.isOnline()) return;
    const linkable = this.linkableTasks().filter((x) => !this.subtasks().some((s) => s.id === x.id));
    if (linkable.length === 0) {
      this.snackBar.open('No hay tareas disponibles para vincular como subtarea', 'Cerrar', { duration: 2000 });
      return;
    }
    const ref = this.dialog.open(LinkSubtaskDialogComponent, {
      data: { parentTask: t, linkableTasks: linkable },
      width: '90vw',
      maxWidth: '440px'
    });
    ref.afterClosed().subscribe((targetId) => {
      if (targetId) {
        try {
          this.taskService.setParentTask(targetId, t.id);
          this.snackBar.open('Tarea vinculada como subtarea', 'Cerrar', { duration: 2000 });
        } catch (e) {
          this.snackBar.open((e as Error).message, 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  openAddSubtask(): void {
    const t = this.task();
    if (!t || !this.isOnline()) return;
    const ref = this.dialog.open(AddSubtaskDialogComponent, {
      data: { parentTask: t },
      width: '90vw',
      maxWidth: '480px'
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        try {
          this.taskService.addSubtask(t.id, result);
          this.snackBar.open('Subtask añadida', 'Cerrar', { duration: 2000 });
        } catch (e) {
          this.snackBar.open((e as Error).message, 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  openAddLink(): void {
    const t = this.task();
    if (!t || !this.isOnline()) return;
    const linkable = this.linkableTasks();
    if (linkable.length === 0) {
      this.snackBar.open('No hay tareas disponibles para enlazar', 'Cerrar', { duration: 2000 });
      return;
    }
    const ref = this.dialog.open(AddLinkDialogComponent, {
      data: { currentTask: t, linkableTasks: linkable },
      width: '90vw',
      maxWidth: '480px'
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        try {
          if (result.type === 'BLOCKS') {
            const from = result.blockedBy ? result.targetTaskId : t.id;
            const to = result.blockedBy ? t.id : result.targetTaskId;
            this.taskService.createTaskLink(from, to, 'BLOCKS');
          } else {
            this.taskService.createTaskLink(t.id, result.targetTaskId, result.type);
          }
          this.snackBar.open('Enlace añadido', 'Cerrar', { duration: 2000 });
        } catch (e) {
          this.snackBar.open((e as Error).message, 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  removeLink(link: TaskLink): void {
    if (!confirm('¿Eliminar este enlace?')) return;
    try {
      this.taskService.removeTaskLink(link.id);
      this.snackBar.open('Enlace eliminado', 'Cerrar', { duration: 2000 });
    } catch (e) {
      this.snackBar.open((e as Error).message, 'Cerrar', { duration: 3000 });
    }
  }

  removeParent(): void {
    const t = this.task();
    if (!t?.parentTaskId || !confirm('¿Desvincular de la tarea padre?')) return;
    try {
      this.taskService.setParentTask(t.id, null);
      this.snackBar.open('Desvinculada de la tarea padre', 'Cerrar', { duration: 2000 });
    } catch (e) {
      this.snackBar.open((e as Error).message, 'Cerrar', { duration: 3000 });
    }
  }

  navigateToTask(id: string): void {
    this.router.navigate(['/tareas', id]);
  }

  getTaskForLink(link: TaskLink, currentId: string): Task | undefined {
    const otherId = link.fromTaskId === currentId ? link.toTaskId : link.fromTaskId;
    return this.taskService.getById(otherId);
  }

  getEffectiveStatus(task: Task): string {
    return this.workflow.getEffectiveStatus(task);
  }

  getTypeLabel(type: TaskLinkType): string {
    const labels: Record<TaskLinkType, string> = {
      BLOCKS: 'Bloquea',
      RELATES: 'Relacionada',
      DUPLICATES: 'Duplica'
    };
    return labels[type] ?? type;
  }
}
