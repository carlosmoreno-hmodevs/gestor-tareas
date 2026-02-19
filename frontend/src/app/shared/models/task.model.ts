export type TaskStatus =
  | 'Pendiente'
  | 'En Progreso'
  | 'En Espera'
  | 'Completada'
  | 'Liberada'
  | 'Rechazada'
  | 'Vencida'
  | 'Cancelada';

export type Priority = 'Alta' | 'Media' | 'Baja';

export type TaskHistoryType =
  | 'CREATED'
  | 'STATUS_CHANGED'
  | 'EDITED'
  | 'REASSIGNED'
  | 'COMMENT_ADDED'
  | 'DUE_DATE_CHANGED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'RESCHEDULED'
  | 'ATTACHMENT_ADDED'
  | 'PARENT_CHANGED'
  | 'LINK_ADDED'
  | 'LINK_REMOVED';

export interface TaskHistoryEntry {
  id: string;
  type: TaskHistoryType;
  timestamp: Date;
  userId: string;
  userName?: string;
  details: {
    field?: string;
    oldValue?: string;
    newValue?: string;
    comment?: string;
    fromStatus?: TaskStatus;
    toStatus?: TaskStatus;
    newDueDate?: Date;
    fileName?: string;
    fileNames?: string[];
    /** Creada por automatización */
    createdByAutomation?: boolean;
    automationId?: string;
    automationName?: string;
  };
}

import type { TaskChecklistItem } from './task-checklist.model';
import type { TaskBlockedReason, TaskRejectedReason } from './reason-catalog.model';

export type { TaskChecklistItem };
export type { TaskBlockedReason, TaskRejectedReason };

export interface TaskAttachment {
  id: string;
  name: string;
  size: number;
  type?: string; // mime type for icon (e.g. application/pdf)
  uploadedAt: Date;
  uploadedBy?: string;
  uploadedById?: string;
}

export interface Task {
  id: string;
  tenantId: string;
  folio: string;
  title: string;
  description: string;
  assignee: string;
  assigneeId: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date;
  riskIndicator: 'ok' | 'por-vencer' | 'vencida';
  tags: string[];
  attachmentsCount: number;
  commentsCount: number;
  createdAt: Date;
  createdBy: string;
  createdByName?: string;
  projectId?: string;
  orgUnitId?: string;
  parentTaskId?: string;
  sortOrder?: number;
  categoryId?: string;
  categoryName?: string;
  subAssigneeIds?: string[];
  subAssignees?: string[];
  observations?: string;
  attachments?: TaskAttachment[];
  rejectionComment?: string;
  history: TaskHistoryEntry[];
  /** Checklist tildable (guía/seguimiento). No se incluye en descripción. */
  checklist?: TaskChecklistItem[];
  /** Motivo de bloqueo (En espera). Objeto catalog/custom o legacy string. */
  blockedReason?: string | TaskBlockedReason;
  /** Modo ferretero: fecha en que pasó a En espera (ISO). Para KPI tiempo promedio bloqueada. */
  blockedAt?: string;
  /** Modo ferretero: fecha en que se desbloqueó (ISO). Si falta, se usa “ahora” para tareas aún bloqueadas. */
  unblockedAt?: string;
  /** [Legacy] Motivo de corrección/rechazo como texto libre. Se usa si no existe rejectedReason. */
  correctedReason?: string;
  /** Motivo de rechazo (no liberada). Catalog/custom; si falta, se usa correctedReason. */
  rejectedReason?: TaskRejectedReason;
  /** Fecha en que pasó a Liberada/Validada (para tiempo de ciclo). */
  liberatedAt?: string;
  /** Modo ferretero: ID del TaskTemplate usado para generar esta tarea. */
  templateId?: string;
  /** ID del ProjectTemplate que generó esta tarea (para filtrar esqueleto). */
  generatedFromProjectTemplateId?: string;
}

/** Task link type for dependencies (graph) */
export type TaskLinkType = 'BLOCKS' | 'RELATES' | 'DUPLICATES';

export interface TaskLink {
  id: string;
  tenantId: string;
  fromTaskId: string;
  toTaskId: string;
  type: TaskLinkType;
  createdAt: string;
  createdByUserId: string;
}

/** Links grouped by type for UI */
export interface TaskLinksForTask {
  blockedBy: TaskLink[];
  blocking: TaskLink[];
  related: TaskLink[];
  duplicates: TaskLink[];
}

/** For task tree / subtasks display */
export interface TaskTreeNode {
  task: Task;
  children: TaskTreeNode[];
  depth: number;
}
