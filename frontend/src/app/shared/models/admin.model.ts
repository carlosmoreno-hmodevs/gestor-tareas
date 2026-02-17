/** Admin module models - RBAC, catalogs, rules */

// --- Users (Admin-managed) ---
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  teamId: string;
  isActive: boolean;
  phone?: string;
  position?: string;
  notes?: string;
  avatarUrl?: string | null;
  createdAt?: Date;
}

// --- RBAC ---
export interface Permission {
  key: string;
  label: string;
  group: 'tasks' | 'projects' | 'admin' | 'alerts' | 'docs' | 'ia';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: string[];
}

// --- Catalog items (administrable) ---
export interface AdminCategory {
  id: string;
  name: string;
  color?: string;
  order: number;
  active: boolean;
}

export interface AdminPriority {
  id: string;
  name: string;
  value: string;
  color?: string;
  level?: number;
  slaHours?: number;
  order: number;
  active: boolean;
}

export interface AdminStatus {
  id: string;
  name: string;
  value: string;
  color?: string;
  order: number;
  active: boolean;
}

export interface AdminProjectStatus {
  id: string;
  name: string;
  value: string;
  color?: string;
  order: number;
  active: boolean;
}

export interface AdminTeam {
  id: string;
  name: string;
  area: string;
  order: number;
  active: boolean;
}

export interface AdminTagSuggestion {
  id: string;
  name: string;
  active: boolean;
}

export interface AdminProjectType {
  id: string;
  name: string;
  active: boolean;
}

// --- Rules ---
export type DueSoonUnit = 'days' | 'hours';

export interface DueDateRules {
  daysUntilDueSoon: number;
  dueSoonUnit?: DueSoonUnit;
  enabled: boolean;
}

export type NotificationChannel = 'in-app' | 'email' | 'push';

export interface NotificationRule {
  id: string;
  key: string;
  label: string;
  enabled: boolean;
  channels: NotificationChannel[];
  config?: Record<string, unknown>;
}

// --- Admin snapshot (persistence) ---
export interface AdminSnapshot {
  users: AdminUser[];
  roles: Role[];
  categories: AdminCategory[];
  priorities: AdminPriority[];
  taskStatuses: AdminStatus[];
  projectStatuses: AdminProjectStatus[];
  teams: AdminTeam[];
  tagSuggestions: AdminTagSuggestion[];
  projectTypes: AdminProjectType[];
  dueDateRules: DueDateRules;
  notificationRules: NotificationRule[];
  savedAt: string;
}
