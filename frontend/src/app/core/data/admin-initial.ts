import type {
  AdminUser,
  Role,
  Permission,
  AdminCategory,
  AdminPriority,
  AdminStatus,
  AdminProjectStatus,
  AdminTeam,
  AdminTagSuggestion,
  AdminProjectType,
  DueDateRules,
  NotificationRule
} from '../../shared/models/admin.model';

const now = new Date();

// --- Permissions (keys) ---
export const PERMISSIONS: Permission[] = [
  { key: 'tasks.view', label: 'Ver tareas', group: 'tasks' },
  { key: 'tasks.create', label: 'Crear tareas', group: 'tasks' },
  { key: 'tasks.update', label: 'Editar tareas', group: 'tasks' },
  { key: 'tasks.transition.approve', label: 'Aprobar/Liberar tareas', group: 'tasks' },
  { key: 'tasks.transition.reject', label: 'Rechazar tareas', group: 'tasks' },
  { key: 'projects.view', label: 'Ver proyectos', group: 'projects' },
  { key: 'projects.create', label: 'Crear proyectos', group: 'projects' },
  { key: 'projects.update', label: 'Editar proyectos', group: 'projects' },
  { key: 'admin.manageUsers', label: 'Gestionar usuarios', group: 'admin' },
  { key: 'admin.manageRoles', label: 'Gestionar roles', group: 'admin' },
  { key: 'admin.manageCatalogs', label: 'Gestionar catálogos', group: 'admin' },
  { key: 'admin.manageRules', label: 'Gestionar reglas', group: 'admin' },
  { key: 'admin.view', label: 'Ver administración', group: 'admin' },
  { key: 'alerts.view', label: 'Ver alertas', group: 'alerts' },
  { key: 'alerts.manage', label: 'Gestionar alertas', group: 'alerts' },
  { key: 'docs.view', label: 'Ver documentos', group: 'docs' },
  { key: 'docs.manage', label: 'Gestionar documentos', group: 'docs' },
  { key: 'ia.use', label: 'Usar asistente IA', group: 'ia' }
];

export const ALL_PERMISSION_KEYS = PERMISSIONS.map((p) => p.key);

// --- Roles (base) ---
export const INITIAL_ROLES: Role[] = [
  {
    id: 'role-owner',
    name: 'Owner / Superadmin',
    description: 'Acceso total al sistema',
    isSystem: true,
    permissions: [...ALL_PERMISSION_KEYS]
  },
  {
    id: 'role-admin',
    name: 'Admin',
    description: 'Gestión parcial: usuarios, catálogos, reglas',
    isSystem: true,
    permissions: ALL_PERMISSION_KEYS.filter((k) => !k.startsWith('admin.manageRoles'))
  },
  {
    id: 'role-supervisor',
    name: 'Supervisor',
    description: 'Aprobar, liberar, rechazar tareas',
    isSystem: true,
    permissions: [
      'tasks.view',
      'tasks.create',
      'tasks.update',
      'tasks.transition.approve',
      'tasks.transition.reject',
      'projects.view',
      'projects.create',
      'projects.update',
      'alerts.view',
      'docs.view',
      'ia.use'
    ]
  },
  {
    id: 'role-member',
    name: 'Member',
    description: 'Operación normal',
    isSystem: true,
    permissions: ['tasks.view', 'tasks.create', 'tasks.update', 'projects.view', 'alerts.view', 'docs.view', 'ia.use']
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    description: 'Solo lectura',
    isSystem: true,
    permissions: ['tasks.view', 'projects.view', 'alerts.view', 'docs.view']
  }
];

// --- Users (admin-managed) ---
// Al menos un usuario por rol: Owner, Admin, Supervisor, Member, Viewer
export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-owner',
    name: 'Super Admin',
    email: 'owner@empresa.com',
    roleId: 'role-owner',
    teamId: 'team-1',
    isActive: true,
    createdAt: new Date(now.getTime() - 400 * 86400000)
  },
  {
    id: 'user-1',
    name: 'María García',
    email: 'maria@empresa.com',
    roleId: 'role-admin',
    teamId: 'team-1',
    isActive: true,
    createdAt: new Date(now.getTime() - 365 * 86400000)
  },
  {
    id: 'user-2',
    name: 'Carlos López',
    email: 'carlos@empresa.com',
    roleId: 'role-supervisor',
    teamId: 'team-2',
    isActive: true,
    createdAt: new Date(now.getTime() - 300 * 86400000)
  },
  {
    id: 'user-3',
    name: 'Ana Martínez',
    email: 'ana@empresa.com',
    roleId: 'role-member',
    teamId: 'team-3',
    isActive: true,
    createdAt: new Date(now.getTime() - 200 * 86400000)
  },
  {
    id: 'user-4',
    name: 'Pedro Sánchez',
    email: 'pedro@empresa.com',
    roleId: 'role-member',
    teamId: 'team-4',
    isActive: true,
    createdAt: new Date(now.getTime() - 150 * 86400000)
  },
  {
    id: 'user-5',
    name: 'Laura Rodríguez',
    email: 'laura@empresa.com',
    roleId: 'role-supervisor',
    teamId: 'team-1',
    isActive: true,
    createdAt: new Date(now.getTime() - 100 * 86400000)
  },
  {
    id: 'user-6',
    name: 'Eva Torres',
    email: 'eva@empresa.com',
    roleId: 'role-viewer',
    teamId: 'team-3',
    isActive: true,
    createdAt: new Date(now.getTime() - 80 * 86400000)
  }
];

// --- Catalogs ---
export const INITIAL_CATEGORIES: AdminCategory[] = [
  { id: 'cat-1', name: 'Calidad', order: 1, color: '#1976d2', active: true },
  { id: 'cat-2', name: 'Logística', order: 2, color: '#388e3c', active: true },
  { id: 'cat-3', name: 'Producción', order: 3, color: '#f57c00', active: true }
];

export const INITIAL_PRIORITIES: AdminPriority[] = [
  { id: 'pr-1', name: 'Alta', value: 'Alta', order: 1, color: '#d32f2f', level: 3, slaHours: 24, active: true },
  { id: 'pr-2', name: 'Media', value: 'Media', order: 2, color: '#ed6c02', level: 2, slaHours: 72, active: true },
  { id: 'pr-3', name: 'Baja', value: 'Baja', order: 3, color: '#2e7d32', level: 1, slaHours: 168, active: true }
];

export const INITIAL_TASK_STATUSES: AdminStatus[] = [
  { id: 'st-1', name: 'Pendiente', value: 'Pendiente', order: 1, active: true },
  { id: 'st-2', name: 'En Progreso', value: 'En Progreso', order: 2, active: true },
  { id: 'st-3', name: 'En Espera', value: 'En Espera', order: 3, active: true },
  { id: 'st-4', name: 'Completada', value: 'Completada', order: 4, active: true },
  { id: 'st-5', name: 'Liberada', value: 'Liberada', order: 5, active: true },
  { id: 'st-6', name: 'Rechazada', value: 'Rechazada', order: 6, active: true },
  { id: 'st-7', name: 'Vencida', value: 'Vencida', order: 7, active: true },
  { id: 'st-8', name: 'Cancelada', value: 'Cancelada', order: 8, active: true }
];

export const INITIAL_PROJECT_STATUSES: AdminProjectStatus[] = [
  { id: 'pst-1', name: 'Activo', value: 'Activo', order: 1, active: true },
  { id: 'pst-2', name: 'Pausado', value: 'Pausado', order: 2, active: true },
  { id: 'pst-3', name: 'Completado', value: 'Completado', order: 3, active: true }
];

export const INITIAL_TEAMS: AdminTeam[] = [
  { id: 'team-1', name: 'Operaciones', area: 'General', order: 1, active: true },
  { id: 'team-2', name: 'Logística', area: 'Cadena de suministro', order: 2, active: true },
  { id: 'team-3', name: 'Calidad', area: 'Aseguramiento', order: 3, active: true },
  { id: 'team-4', name: 'Producción', area: 'Manufactura', order: 4, active: true }
];

export const INITIAL_TAG_SUGGESTIONS: AdminTagSuggestion[] = [
  { id: 'tag-1', name: 'ISO 9001', active: true },
  { id: 'tag-2', name: 'Auditoría', active: true },
  { id: 'tag-3', name: 'Urgente', active: true }
];

export const INITIAL_PROJECT_TYPES: AdminProjectType[] = [
  { id: 'pt-1', name: 'Mejora continua', active: true },
  { id: 'pt-2', name: 'Proyecto estratégico', active: true }
];

// --- Rules ---
export const INITIAL_DUE_DATE_RULES: DueDateRules = {
  daysUntilDueSoon: 3,
  dueSoonUnit: 'days',
  enabled: true
};

export const INITIAL_NOTIFICATION_RULES: NotificationRule[] = [
  { id: 'nr-1', key: 'task_due_soon', label: 'Tarea por vencer', enabled: true, channels: ['in-app', 'email'] },
  { id: 'nr-2', key: 'task_overdue', label: 'Tarea vencida', enabled: true, channels: ['in-app', 'email'] },
  { id: 'nr-3', key: 'task_completed', label: 'Tarea completada', enabled: true, channels: ['in-app'] },
  { id: 'nr-4', key: 'task_assigned', label: 'Nueva asignación', enabled: true, channels: ['in-app', 'email'] },
  { id: 'nr-5', key: 'task_rejected', label: 'Rechazo de tarea', enabled: true, channels: ['in-app', 'email'] },
  { id: 'nr-6', key: 'task_released', label: 'Liberación de tarea', enabled: true, channels: ['in-app'] }
];
