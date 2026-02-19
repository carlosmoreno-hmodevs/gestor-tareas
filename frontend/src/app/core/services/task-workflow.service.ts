import { Injectable } from '@angular/core';
import type { Task, TaskStatus, TaskHistoryEntry } from '../../shared/models';
import type { TaskBlockedReason, TaskRejectedReason } from '../../shared/models/reason-catalog.model';

export interface TransitionPayload {
  comment?: string;
  newDueDate?: Date;
  blockedReason?: TaskBlockedReason;
  rejectedReason?: TaskRejectedReason;
}

export interface Transition {
  from: TaskStatus;
  to: TaskStatus;
  label: string;
  requiresComment: boolean;
  requiresNewDueDate: boolean;
  roleRequired?: string;
}

const TRANSITIONS: Transition[] = [
  { from: 'Pendiente', to: 'En Progreso', label: 'Iniciar', requiresComment: false, requiresNewDueDate: false },
  { from: 'En Progreso', to: 'En Espera', label: 'Pausar', requiresComment: false, requiresNewDueDate: false },
  { from: 'En Espera', to: 'En Progreso', label: 'Reanudar', requiresComment: false, requiresNewDueDate: false },
  { from: 'En Progreso', to: 'Completada', label: 'Completar', requiresComment: false, requiresNewDueDate: false },
  { from: 'En Espera', to: 'Completada', label: 'Completar', requiresComment: false, requiresNewDueDate: false },
  { from: 'Completada', to: 'Liberada', label: 'Liberar', requiresComment: false, requiresNewDueDate: false },
  { from: 'Completada', to: 'Rechazada', label: 'Rechazar', requiresComment: false, requiresNewDueDate: false },
  { from: 'Rechazada', to: 'Pendiente', label: 'Volver a iniciar', requiresComment: false, requiresNewDueDate: false },
  { from: 'Pendiente', to: 'Cancelada', label: 'Cancelar', requiresComment: false, requiresNewDueDate: false },
  { from: 'En Progreso', to: 'Cancelada', label: 'Cancelar', requiresComment: false, requiresNewDueDate: false },
  { from: 'En Espera', to: 'Cancelada', label: 'Cancelar', requiresComment: false, requiresNewDueDate: false },
  { from: 'Vencida', to: 'Pendiente', label: 'Reagendar', requiresComment: true, requiresNewDueDate: true }
];

const FINAL_STATUSES: TaskStatus[] = ['Completada', 'Liberada', 'Cancelada'];
const ACTIVE_STATUSES: TaskStatus[] = ['Pendiente', 'En Progreso', 'En Espera'];
const OVERDUE_EXEMPT: TaskStatus[] = ['Completada', 'Liberada', 'Cancelada', 'Rechazada'];

@Injectable({ providedIn: 'root' })
export class TaskWorkflowService {
  private readonly DUE_SOON_HOURS = 72;
  private readonly ROLES_ALLOWED_REJECT = ['Admin', 'Supervisor'];

  getAllTransitions(): Transition[] {
    return [...TRANSITIONS];
  }

  getAllowedTransitions(task: Task, currentUserRole?: string): Transition[] {
    const effectiveStatus = this.getEffectiveStatus(task);
    return TRANSITIONS.filter((t) => {
      if (t.from !== effectiveStatus) return false;
      if (t.roleRequired && !this.hasRole(currentUserRole, t.roleRequired)) return false;
      return true;
    });
  }

  canTransition(task: Task, toStatus: TaskStatus, currentUserRole?: string): boolean {
    const transitions = this.getAllowedTransitions(task, currentUserRole);
    return transitions.some((t) => t.to === toStatus);
  }

  getTransition(task: Task, toStatus: TaskStatus): Transition | null {
    const effectiveStatus = this.getEffectiveStatus(task);
    return TRANSITIONS.find((t) => t.from === effectiveStatus && t.to === toStatus) ?? null;
  }

  getEffectiveStatus(task: Task): TaskStatus {
    if (this.isOverdue(task) && !OVERDUE_EXEMPT.includes(task.status)) {
      return 'Vencida';
    }
    return task.status;
  }

  isOverdue(task: Task): boolean {
    const now = new Date();
    return task.dueDate < now && !OVERDUE_EXEMPT.includes(task.status);
  }

  computeRiskIndicator(task: Task): 'ok' | 'por-vencer' | 'vencida' {
    if (OVERDUE_EXEMPT.includes(task.status) || task.status === 'Rechazada') return 'ok';
    const now = new Date();
    if (task.dueDate < now) return 'vencida';
    const hoursToDue = (task.dueDate.getTime() - now.getTime()) / 3600000;
    return hoursToDue <= this.DUE_SOON_HOURS ? 'por-vencer' : 'ok';
  }

  private hasRole(userRole: string | undefined, required: string): boolean {
    if (!userRole) return false;
    return this.ROLES_ALLOWED_REJECT.some((r) => r.toLowerCase() === userRole.toLowerCase());
  }

  /** Applies a transition and returns a new Task. Caller must persist. */
  applyTransition(
    task: Task,
    toStatus: TaskStatus,
    payload: TransitionPayload,
    userId: string,
    userName: string
  ): Task {
    const transition = this.getTransition(task, toStatus);
    if (!transition) throw new Error(`Transition not allowed: ${task.status} → ${toStatus}`);

    if (transition.requiresComment && !payload.comment?.trim()) {
      throw new Error('Comment is required for this transition');
    }
    if (transition.requiresNewDueDate) {
      if (!payload.newDueDate) throw new Error('New due date is required for reschedule');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const d = new Date(payload.newDueDate);
      d.setHours(0, 0, 0, 0);
      if (d < today) throw new Error('New due date must be today or later');
    }

    const updated = { ...task };
    const prevStatus = this.getEffectiveStatus(task);

    updated.status = toStatus;
    if (transition.requiresNewDueDate && payload.newDueDate) {
      updated.dueDate = new Date(payload.newDueDate);
    }
    if (toStatus === 'En Espera' && payload.blockedReason) {
      updated.blockedReason = payload.blockedReason;
      updated.blockedAt = new Date().toISOString();
    }
    if (toStatus === 'Rechazada') {
      if (payload.rejectedReason) {
        updated.rejectedReason = payload.rejectedReason;
        updated.correctedReason = payload.rejectedReason.label || payload.rejectedReason.customText || undefined;
      }
      if (payload.comment) updated.rejectionComment = payload.comment;
    }
    updated.riskIndicator = this.computeRiskIndicator({ ...updated, status: toStatus });

    const history = [...(task.history || [])];
    if (toStatus === 'Rechazada') {
      const comment = payload.rejectedReason?.detail || payload.rejectedReason?.customText || payload.rejectedReason?.label || payload.comment;
      if (comment) {
        history.push(this.createHistoryEntry('REJECTED', userId, userName, { comment, fromStatus: prevStatus, toStatus }));
      } else {
        history.push(this.createHistoryEntry('REJECTED', userId, userName, { fromStatus: prevStatus, toStatus }));
      }
    } else if (prevStatus === 'Vencida' && toStatus === 'Pendiente') {
      history.push(
        this.createHistoryEntry('RESCHEDULED', userId, userName, {
          comment: payload.comment,
          newDueDate: payload.newDueDate,
          fromStatus: prevStatus,
          toStatus
        })
      );
    } else if (toStatus === 'Cancelada') {
      history.push(
        this.createHistoryEntry('CANCELLED', userId, userName, { comment: payload.comment, fromStatus: prevStatus, toStatus })
      );
    } else if (toStatus === 'Pendiente' && prevStatus === 'Rechazada') {
      history.push(
        this.createHistoryEntry('STATUS_CHANGED', userId, userName, {
          comment: payload.comment,
          fromStatus: prevStatus,
          toStatus
        })
      );
    } else {
      history.push(
        this.createHistoryEntry('STATUS_CHANGED', userId, userName, { fromStatus: prevStatus, toStatus })
      );
    }
    updated.history = history;
    return updated;
  }

  createHistoryEntry(
    type: TaskHistoryEntry['type'],
    userId: string,
    userName: string,
    details: TaskHistoryEntry['details']
  ): TaskHistoryEntry {
    return {
      id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      timestamp: new Date(),
      userId,
      userName,
      details
    };
  }
}
