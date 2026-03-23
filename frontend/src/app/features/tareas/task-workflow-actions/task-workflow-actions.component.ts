import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { Transition } from '../../../core/services/task-workflow.service';
import type { Task, TaskStatus } from '../../../shared/models';
import type { TaskRejectedReason } from '../../../shared/models/reason-catalog.model';

@Component({
  selector: 'app-task-workflow-actions',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './task-workflow-actions.component.html',
  styleUrl: './task-workflow-actions.component.scss'
})
export class TaskWorkflowActionsComponent {
  currentStatus = input.required<TaskStatus | null>();
  allowedTransitions = input<Transition[]>([]);
  isOnline = input(true);
  /** Para mostrar motivo de liberación / rechazo en Resumen. */
  task = input<Task | null>(null);

  transitionClicked = output<Transition>();

  onTransition(tr: Transition): void {
    this.transitionClicked.emit(tr);
  }

  rejectedReasonText(): string {
    const t = this.task();
    if (!t) return '';
    const r = t.rejectedReason;
    if (r != null && typeof r === 'object') {
      const o = r as TaskRejectedReason;
      return o.label ?? o.customText ?? o.detail ?? '';
    }
    return t.correctedReason ?? t.rejectionComment ?? '';
  }

  rejectedReasonDetail(): string | undefined {
    const t = this.task();
    if (!t) return undefined;
    const r = t.rejectedReason;
    if (r == null || typeof r !== 'object') return undefined;
    const o = r as TaskRejectedReason;
    const primary = (o.label ?? o.customText ?? '').trim();
    const det = o.detail?.trim();
    if (!det) return undefined;
    if (!primary) return undefined;
    if (det === primary) return undefined;
    return det;
  }

  releaseReasonText(): string {
    const t = this.task();
    if (!t) return '';
    const r = t.releaseReason;
    if (r == null || typeof r !== 'object') return '';
    const o = r as TaskRejectedReason;
    return o.label ?? o.customText ?? o.detail ?? '';
  }

  releaseReasonDetail(): string | undefined {
    const t = this.task();
    if (!t) return undefined;
    const r = t.releaseReason;
    if (r == null || typeof r !== 'object') return undefined;
    const o = r as TaskRejectedReason;
    const primary = (o.label ?? o.customText ?? '').trim();
    const det = o.detail?.trim();
    if (!det) return undefined;
    if (!primary) return undefined;
    if (det === primary) return undefined;
    return det;
  }

  /** Hay algo que mostrar como motivo (principal o solo detalle en el texto principal). */
  hasRejectedReasonBlock(): boolean {
    return !!this.rejectedReasonText().trim();
  }

  hasReleaseReasonBlock(): boolean {
    return !!this.releaseReasonText().trim();
  }
}
