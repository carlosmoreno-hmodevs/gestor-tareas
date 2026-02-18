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
  };
}

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
