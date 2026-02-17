export type ProjectStatus = 'Activo' | 'En curso' | 'En pausa' | 'Cerrado';
export type ProjectPriority = 'Alta' | 'Media' | 'Baja';

export interface ProjectMember {
  userId: string;
  role: string;
}

export interface ProjectImageMeta {
  name: string;
  size: number;
  type: string;
  previewUrl: string; // base64 or objectURL for MVP
}

export interface ProjectFileMeta {
  id: string;
  name: string;
  size: number;
  type?: string;
  uploadedAt: Date;
  uploadedBy?: string;
  uploadedById?: string;
}

export type ProjectActivityType =
  | 'CREATED'
  | 'TASK_ADDED'
  | 'TASK_COMPLETED'
  | 'TASK_OVERDUE'
  | 'FILE_ADDED'
  | 'STATUS_CHANGED'
  | 'MILESTONE_ADDED'
  | 'MEMBER_ADDED';

export interface ProjectActivityEntry {
  id: string;
  type: ProjectActivityType;
  timestamp: Date;
  userId: string;
  userName?: string;
  details: Record<string, unknown>;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: Date;
}

export interface ProjectKpis {
  tasksInProgress: number;
  tasksOverdue: number;
  completedTasks: number;
  totalTasks: number;
  progressPercent: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  ownerId: string;
  status?: ProjectStatus;
  image?: ProjectImageMeta;
  startDate?: Date;
  dueDate?: Date;
  clientArea?: string;
  members: ProjectMember[];
  tags: string[];
  priority?: ProjectPriority;
  budget?: number;
  observations?: string;
  filesMeta: ProjectFileMeta[];
  milestones: ProjectMilestone[];
  activity: ProjectActivityEntry[];
  createdBy: string;
  createdByName?: string;
  createdAt: Date;
  lastUpdatedAt?: Date;
  /** Legacy/computed - prefer computeKPIs() for live values */
  kpis?: { completadas: number; total: number; vencidas: number };
  filesCount?: number;
  activityCount?: number;
}
