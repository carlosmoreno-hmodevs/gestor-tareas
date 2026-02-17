import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../core/services/task.service';
import { DataService } from '../../../core/services/data.service';
import { TaskWorkflowService } from '../../../core/services/task-workflow.service';
import { CurrentUserService } from '../../../core/services/current-user.service';
import { ConnectivityService } from '../../../core/services/connectivity.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TaskDetailHeaderComponent } from '../task-detail-header/task-detail-header.component';
import { TaskDetailFormComponent } from '../task-detail-form/task-detail-form.component';
import { TaskEvidencePanelComponent } from '../task-evidence-panel/task-evidence-panel.component';
import { TaskTimelineComponent } from '../task-timeline/task-timeline.component';
import { TaskWorkflowActionsComponent } from '../task-workflow-actions/task-workflow-actions.component';
import { RejectDialogComponent } from '../reject-dialog/reject-dialog.component';
import { RescheduleDialogComponent } from '../reschedule-dialog/reschedule-dialog.component';
import type { Task, TaskStatus } from '../../../shared/models';
import type { Transition } from '../../../core/services/task-workflow.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    PageHeaderComponent,
    TaskDetailHeaderComponent,
    TaskDetailFormComponent,
    TaskEvidencePanelComponent,
    TaskTimelineComponent,
    TaskWorkflowActionsComponent
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent {
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);
  private readonly dataService = inject(DataService);
  private readonly workflow = inject(TaskWorkflowService);
  private readonly currentUser = inject(CurrentUserService);
  readonly connectivity = inject(ConnectivityService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  taskId = input.required<string>({ alias: 'id' });
  task = computed(() => this.taskService.getById(this.taskId()));

  allowedTransitions = computed(() => {
    const t = this.task();
    if (!t) return [];
    return this.workflow.getAllowedTransitions(t, this.currentUser.role);
  });

  effectiveStatus = computed(() => {
    const t = this.task();
    return t ? this.workflow.getEffectiveStatus(t) : null;
  });

  taskAttachments = computed(() => {
    const t = this.task();
    return t?.attachments ?? [];
  });

  onSaveChanges(updates: Partial<Task>): void {
    const t = this.task();
    if (!t) return;
    this.taskService.updateTask(t.id, updates);
    this.snackBar.open('Cambios guardados', 'Cerrar', { duration: 2000 });
  }

  onCancelEdit(): void {
    this.snackBar.open('Cambios descartados', 'Cerrar', { duration: 1500 });
  }

  onFilesSelected(files: File[]): void {
    const t = this.task();
    if (!t || !files.length) return;
    const meta = files.map((f) => ({ name: f.name, size: f.size, type: f.type }));
    this.taskService.addAttachmentMetadata(t.id, meta);
    this.snackBar.open(
      `Archivo(s) adjuntado(s): ${files.length}`,
      'Cerrar',
      { duration: 2000 }
    );
  }

  onDownloadRequested(_event: { attachment: { name: string } }): void {
    this.snackBar.open(`Descarga simulada: ${_event.attachment.name}`, 'Cerrar', {
      duration: 2000
    });
  }

  onRemoveRequested(event: { attachment: { id: string } }): void {
    const t = this.task();
    if (!t) return;
    this.taskService.removeAttachment(t.id, event.attachment.id);
    this.snackBar.open('Archivo eliminado', 'Cerrar', { duration: 2000 });
  }

  onCommentSubmitted(text: string): void {
    const t = this.task();
    if (!t) return;
    this.taskService.addComment(t.id, text);
    this.snackBar.open('Comentario enviado', 'Cerrar', { duration: 2000 });
  }

  onTimelineItemMenu(_event: { entry: unknown; action: string }): void {
    this.snackBar.open(`Acción "${_event.action}" (placeholder)`, 'Cerrar', {
      duration: 1500
    });
  }

  onMenuAction(action: string): void {
    this.snackBar.open(`Acción "${action}" (placeholder)`, 'Cerrar', { duration: 1500 });
  }

  executeTransition(transition: Transition): void {
    const t = this.task();
    if (!t || !this.connectivity.isOnline()) return;

    if (transition.to === 'Rechazada') {
      const ref = this.dialog.open(RejectDialogComponent, {
        data: {
          taskTitle: t.title,
          dialogTitle: 'Rechazar tarea',
          label: 'Motivo / Comentario (opcional)',
          confirmLabel: 'Rechazar',
          optionalComment: true
        },
        width: '90vw',
        maxWidth: '440px'
      });
      ref.afterClosed().subscribe((result) => {
        if (result !== null) {
          try {
            this.taskService.applyTransition(t.id, 'Rechazada', {
              comment: result?.comment ?? ''
            });
            this.snackBar.open('Tarea rechazada', 'Cerrar', { duration: 2000 });
          } catch (e) {
            this.snackBar.open((e as Error).message || 'Error', 'Cerrar', { duration: 3000 });
          }
        }
      });
      return;
    }

    if (transition.to === 'Pendiente' && this.effectiveStatus() === 'Vencida') {
      const ref = this.dialog.open(RescheduleDialogComponent, {
        data: { taskTitle: t.title, currentDueDate: t.dueDate },
        width: '90vw',
        maxWidth: '440px'
      });
      ref.afterClosed().subscribe((result) => {
        if (result?.newDueDate && result?.comment) {
          try {
            this.taskService.applyTransition(t.id, 'Pendiente', {
              comment: result.comment,
              newDueDate: result.newDueDate
            });
            this.snackBar.open('Tarea reagendada', 'Cerrar', { duration: 2000 });
          } catch (e) {
            this.snackBar.open((e as Error).message || 'Error', 'Cerrar', { duration: 3000 });
          }
        }
      });
      return;
    }

    if (transition.to === 'Pendiente' && t.status === 'Rechazada') {
      const ref = this.dialog.open(RejectDialogComponent, {
        data: {
          taskTitle: t.title,
          dialogTitle: 'Volver a iniciar tarea',
          label: 'Observaciones adicionales (opcional)',
          confirmLabel: 'Volver a iniciar',
          optionalComment: true
        },
        width: '90vw',
        maxWidth: '440px'
      });
      ref.afterClosed().subscribe((result) => {
        if (result !== null) {
          try {
            this.taskService.applyTransition(t.id, 'Pendiente', {
              comment: result?.comment ?? ''
            });
            this.snackBar.open('Tarea reabierta', 'Cerrar', { duration: 2000 });
          } catch (e) {
            this.snackBar.open((e as Error).message || 'Error', 'Cerrar', { duration: 3000 });
          }
        }
      });
      return;
    }

    const isRejectTransition = (transition as { to: string }).to === 'Rechazada';
    const isRescheduleTransition =
      this.effectiveStatus() === 'Vencida' && (transition as { to: string }).to === 'Pendiente';
    if (
      transition.requiresComment &&
      !isRejectTransition &&
      !isRescheduleTransition
    ) {
      const ref = this.dialog.open(RejectDialogComponent, {
        data: {
          taskTitle: t.title,
          dialogTitle: transition.to === 'Cancelada' ? 'Cancelar tarea' : undefined,
          label:
            transition.to === 'Cancelada' ? 'Motivo (opcional)' : 'Comentario (requerido)',
          confirmLabel: transition.to === 'Cancelada' ? 'Cancelar' : undefined
        },
        width: '90vw',
        maxWidth: '440px'
      });
      ref.afterClosed().subscribe((result) => {
        const comment = result?.comment ?? '';
        try {
          this.taskService.applyTransition(t.id, transition.to, { comment });
          this.snackBar.open(`Estado: ${transition.label}`, 'Cerrar', { duration: 2000 });
        } catch (e) {
          this.snackBar.open((e as Error).message || 'Error', 'Cerrar', { duration: 3000 });
        }
      });
      return;
    }

    try {
      this.taskService.applyTransition(t.id, transition.to, {});
      this.snackBar.open(`Estado: ${transition.label}`, 'Cerrar', { duration: 2000 });
    } catch (e) {
      this.snackBar.open((e as Error).message || 'Error', 'Cerrar', { duration: 3000 });
    }
  }

  goBack(): void {
    this.router.navigate(['/tareas']);
  }
}
