import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UiCopyService } from '../../../core/services/ui-copy.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import type { Task, TaskStatus } from '../../../shared/models';
import type { TaskBlockedReason, TaskRejectedReason } from '../../../shared/models/reason-catalog.model';

@Component({
  selector: 'app-task-detail-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule,
    AvatarComponent,
    DateFormatPipe
  ],
  templateUrl: './task-detail-header.component.html',
  styleUrl: './task-detail-header.component.scss'
})
export class TaskDetailHeaderComponent {
  readonly uiCopy = inject(UiCopyService);

  task = input.required<Task | null>();
  effectiveStatus = input.required<TaskStatus | null>();
  assigneeName = input<string>('Sin asignar');
  hasOverdueBadge = input(false);

  menuAction = output<string>();

  statusDisplayLabel(): string {
    const s = this.effectiveStatus();
    return s ? this.uiCopy.statusLabel(s) : '';
  }

  onMenuAction(action: string): void {
    this.menuAction.emit(action);
  }

  /** Texto del motivo de bloqueo (catálogo, custom o legacy string). */
  blockedReasonText(t: Task): string {
    const r = t.blockedReason;
    if (r == null) return '';
    if (typeof r === 'string') return r;
    return (r as TaskBlockedReason).label ?? (r as TaskBlockedReason).customText ?? '';
  }

  /** Detalle del motivo de bloqueo (solo formato catálogo). */
  blockedReasonDetail(t: Task): string | undefined {
    const r = t.blockedReason;
    if (r == null || typeof r === 'string') return undefined;
    return (r as TaskBlockedReason).detail;
  }

  /** Texto del motivo de rechazo (catálogo, custom o legacy correctedReason/rejectionComment). */
  rejectedReasonText(t: Task): string {
    const r = t.rejectedReason;
    if (r != null && typeof r === 'object')
      return (r as TaskRejectedReason).label ?? (r as TaskRejectedReason).customText ?? '';
    return t.correctedReason ?? t.rejectionComment ?? '';
  }

  /** Detalle del motivo de rechazo (solo formato catálogo). */
  rejectedReasonDetail(t: Task): string | undefined {
    const r = t.rejectedReason;
    if (r == null || typeof r !== 'object') return undefined;
    return (r as TaskRejectedReason).detail;
  }
}
