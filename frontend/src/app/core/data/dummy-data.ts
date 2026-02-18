import type { Task } from '../../shared/models';
import type { User } from '../../shared/models';
import type { AlertRule } from '../../shared/models';
import type { Document } from '../../shared/models';
import type { Category, StatusConfig, PriorityConfig, Team } from '../../shared/models';

const now = new Date();
const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 86400000);
const addHours = (d: Date, h: number) => new Date(d.getTime() + h * 3600000);
const addMinutes = (d: Date, m: number) => new Date(d.getTime() + m * 60000);

function createTask(
  folio: string,
  title: string,
  assignee: string,
  assigneeId: string,
  status: Task['status'],
  priority: Task['priority'],
  dueDate: Date,
  overrides: Partial<Task> = {}
): Task {
  const isOverdue = dueDate < now;
  const hoursToDue = (dueDate.getTime() - now.getTime()) / 3600000;
  let riskIndicator: Task['riskIndicator'] = 'ok';
  if (isOverdue) riskIndicator = 'vencida';
  else if (hoursToDue <= 72) riskIndicator = 'por-vencer';

  return {
    id: `task-${folio}`,
    tenantId: (overrides as { tenantId?: string }).tenantId ?? 'tenant-1',
    folio,
    title,
    description: `Descripción de la tarea: ${title}`,
    assignee,
    assigneeId,
    status,
    priority,
    dueDate,
    riskIndicator,
    tags: [],
    attachmentsCount: 0,
    commentsCount: 0,
    createdAt: addDays(now, -7),
    createdBy: 'user-1',
    createdByName: 'María García',
    history: [] as Task['history'],
    ...overrides
  };
}

export const USERS: User[] = [
  { id: 'user-1', name: 'María García', email: 'maria@empresa.com', role: 'Admin', team: 'Operaciones' },
  { id: 'user-2', name: 'Carlos López', email: 'carlos@empresa.com', role: 'Supervisor', team: 'Logística' },
  { id: 'user-3', name: 'Ana Martínez', email: 'ana@empresa.com', role: 'Operador', team: 'Calidad' },
  { id: 'user-4', name: 'Pedro Sánchez', email: 'pedro@empresa.com', role: 'Operador', team: 'Producción' },
  { id: 'user-5', name: 'Laura Rodríguez', email: 'laura@empresa.com', role: 'Supervisor', team: 'Operaciones' }
];

// Demo task with full history and attachments for task-detail UI
function createDemoTask001(): Task {
  const base = createTask('TASK-001', 'Revisar documentación de calidad', 'María García', 'user-1', 'En Progreso', 'Alta', addHours(now, 12), {
    commentsCount: 2,
    attachmentsCount: 2,
    categoryId: 'cat-1',
    categoryName: 'Calidad',
    projectId: 'proj-1',
    tags: ['ISO 9001', 'Auditoría'],
    description: 'Revisar y actualizar la documentación de calidad para la próxima auditoría interna. Incluir procedimientos actualizados y evidencias del último trimestre.',
    attachments: [
      { id: 'att-1', name: 'Procedimiento_Calidad_v2.pdf', size: 245000, type: 'application/pdf', uploadedAt: addHours(now, -48), uploadedBy: 'María García', uploadedById: 'user-1' },
      { id: 'att-2', name: 'Evidencias_Q1.xlsx', size: 56000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', uploadedAt: addHours(now, -24), uploadedBy: 'Carlos López', uploadedById: 'user-2' }
    ],
    history: [
      { id: 'h-1', type: 'CREATED', timestamp: addDays(now, -7), userId: 'user-1', userName: 'María García', details: { newValue: '{}' } },
      { id: 'h-2', type: 'STATUS_CHANGED', timestamp: addDays(now, -5), userId: 'user-1', userName: 'María García', details: { fromStatus: 'Pendiente', toStatus: 'En Progreso' } },
      { id: 'h-3', type: 'ATTACHMENT_ADDED', timestamp: addHours(now, -48), userId: 'user-1', userName: 'María García', details: { fileNames: ['Procedimiento_Calidad_v2.pdf'] } },
      { id: 'h-4', type: 'COMMENT_ADDED', timestamp: addHours(now, -36), userId: 'user-2', userName: 'Carlos López', details: { comment: 'He revisado el procedimiento, falta la sección 4.2. Sugerencia: incluir el checklist de verificación.' } },
      { id: 'h-5', type: 'ATTACHMENT_ADDED', timestamp: addHours(now, -24), userId: 'user-2', userName: 'Carlos López', details: { fileNames: ['Evidencias_Q1.xlsx'] } },
      { id: 'h-6', type: 'COMMENT_ADDED', timestamp: addHours(now, -2), userId: 'user-1', userName: 'María García', details: { comment: 'Listo, añadí la sección 4.2. Revisar por favor.' } }
    ]
  } as Task);
  return base;
}

function tasksForTenant1(): Task[] {
  return [
  createDemoTask001(),
  createTask('TASK-002', 'Actualizar inventario de almacén', 'Carlos López', 'user-2', 'Pendiente', 'Media', addDays(now, 1)),
  createTask('TASK-003', 'Auditoría interna ISO 9001', 'Ana Martínez', 'user-3', 'Completada', 'Alta', addDays(now, -2)),
  createTask('TASK-004', 'Reunión de planificación semanal', 'Pedro Sánchez', 'user-4', 'En Espera', 'Baja', addDays(now, 3)),
  createTask('TASK-005', 'Corregir no conformidad NC-2024-001', 'María García', 'user-1', 'Vencida', 'Alta', addDays(now, -1), { commentsCount: 5 }),
  createTask('TASK-006', 'Capacitación nuevo personal', 'Laura Rodríguez', 'user-5', 'Pendiente', 'Media', addDays(now, 5)),
  createTask('TASK-007', 'Revisar proveedores críticos', 'Carlos López', 'user-2', 'En Progreso', 'Alta', addHours(now, 36)),
  createTask('TASK-008', 'Elaborar informe mensual', 'Ana Martínez', 'user-3', 'Liberada', 'Media', addDays(now, -3)),
  createTask('TASK-009', 'Mantenimiento preventivo equipo A', 'Pedro Sánchez', 'user-4', 'Pendiente', 'Baja', addDays(now, 7)),
  createTask('TASK-010', 'Investigación root cause defecto', 'María García', 'user-1', 'En Progreso', 'Alta', addDays(now, 2)),
  createTask('TASK-011', 'Cerrar orden de compra OC-4421', 'Carlos López', 'user-2', 'Pendiente', 'Media', addHours(now, 24)),
  createTask('TASK-012', 'Inspección final lote #890', 'Ana Martínez', 'user-3', 'Completada', 'Media', addDays(now, -1)),
  createTask('TASK-013', 'Configurar nuevo software ERP', 'Pedro Sánchez', 'user-4', 'En Espera', 'Baja', addDays(now, 14)),
  createTask('TASK-014', 'Responder queja de cliente #567', 'Laura Rodríguez', 'user-5', 'Vencida', 'Alta', addDays(now, -2)),
  createTask('TASK-015', 'Actualizar procedimientos de trabajo', 'María García', 'user-1', 'Pendiente', 'Media', addDays(now, 4)),
  createTask('TASK-016', 'Supervisar entrega de mercancía', 'Carlos López', 'user-2', 'En Progreso', 'Baja', addHours(now, 6)),
  createTask('TASK-017', 'Calibración instrumentos', 'Ana Martínez', 'user-3', 'Pendiente', 'Alta', addDays(now, 1)),
  createTask('TASK-018', 'Revisión de seguridad área B', 'Pedro Sánchez', 'user-4', 'Completada', 'Media', addDays(now, -5)),
  createTask('TASK-019', 'Formación equipo en Lean', 'Laura Rodríguez', 'user-5', 'Pendiente', 'Media', addDays(now, 10)),
  createTask('TASK-020', 'Cierre de incidencia INC-089', 'María García', 'user-1', 'Vencida', 'Alta', addDays(now, -4)),
  createTask('TASK-021', 'Preparar presentación gerencial', 'Carlos López', 'user-2', 'En Progreso', 'Media', addDays(now, 2)),
  createTask('TASK-022', 'Validar muestras lote nuevo', 'Ana Martínez', 'user-3', 'Pendiente', 'Alta', addHours(now, 48)),
  createTask('TASK-023', 'Sin asignar - Revisar backlog', 'Sin asignar', '', 'Pendiente', 'Baja', addDays(now, 6)),
  createTask('TASK-024', 'Optimizar rutas de distribución', 'Carlos López', 'user-2', 'Cancelada', 'Media', addDays(now, -1)),
  createTask('TASK-025', 'Implementar 5S en almacén', 'Laura Rodríguez', 'user-5', 'En Progreso', 'Media', addDays(now, 3)),
  createTask('TASK-026', 'Verificar trazabilidad producto X', 'Ana Martínez', 'user-3', 'Pendiente', 'Alta', addHours(now, 18)),
  createTask('TASK-027', 'Coordinar visita auditor externo', 'María García', 'user-1', 'En Espera', 'Media', addDays(now, 8)),
  createTask('TASK-028', 'Revisar KPIs del trimestre', 'Pedro Sánchez', 'user-4', 'Completada', 'Baja', addDays(now, -7)),
  createTask('TASK-029', 'Sin asignar - Urgente', 'Sin asignar', '', 'Pendiente', 'Alta', addHours(now, 4)),
  createTask('TASK-030', 'Actualizar certificaciones equipo', 'Laura Rodríguez', 'user-5', 'Liberada', 'Media', addDays(now, -2)),
  createTask('TASK-031', 'Revisión rechazada - Documentación incompleta', 'Pedro Sánchez', 'user-4', 'Rechazada', 'Alta', addDays(now, 2), { rejectionComment: 'Faltan evidencias de la última auditoría.' }),
  createTask('TASK-032', 'Revisión de reportes (solo lectura)', 'Eva Torres', 'user-6', 'Pendiente', 'Baja', addDays(now, 5)),
  createTask('TASK-033', 'Auditoría general del sistema', 'Super Admin', 'user-owner', 'En Progreso', 'Alta', addDays(now, 3))
  ];
}

function tasksForTenant2(): Task[] {
  return [
    createTask('TASK-101', 'Configurar tienda nueva', 'María García', 'user-1', 'En Progreso', 'Alta', addDays(now, 5), { tenantId: 'tenant-2', projectId: 'proj-3', orgUnitId: 'ou-7' }),
    createTask('TASK-102', 'Contratación personal local', 'Pedro Sánchez', 'user-4', 'Pendiente', 'Media', addDays(now, 10), { tenantId: 'tenant-2', projectId: 'proj-3', orgUnitId: 'ou-6' }),
    createTask('TASK-103', 'Revisión de inventario inicial', 'Laura Rodríguez', 'user-5', 'Completada', 'Baja', addDays(now, -1), { tenantId: 'tenant-2', projectId: 'proj-3' })
  ];
}

/** Tareas iniciales por tenant */
export function getInitialTasks(tenantId: string): Task[] {
  if (tenantId === 'tenant-1') return tasksForTenant1();
  if (tenantId === 'tenant-2') return tasksForTenant2();
  return [];
}

/** @deprecated Use getInitialTasks(tenantId) */
export const TASKS: Task[] = tasksForTenant1();

export const ALERT_RULES: AlertRule[] = [
  {
    id: 'rule-1',
    name: 'Recordatorio 24h antes',
    thresholdHours: 24,
    frequency: 'diaria',
    escalationTargets: ['supervisor'],
    allowedActionsForOverdue: ['editar', 'reprogramar']
  },
  {
    id: 'rule-2',
    name: 'Por vencer 72h',
    thresholdHours: 72,
    frequency: 'cada12h',
    escalationTargets: ['supervisor', 'área'],
    allowedActionsForOverdue: ['editar', 'reprogramar', 'bloquear']
  }
];

export const DOCUMENTS: Document[] = [
  { id: 'doc-1', name: 'Informe_Q1.pdf', size: 245000, taskId: 'task-TASK-008', uploadedAt: addDays(now, -1), uploadedBy: 'Ana Martínez' },
  { id: 'doc-2', name: 'NC-2024-001.pdf', size: 120000, taskId: 'task-TASK-005', uploadedAt: addDays(now, -2), uploadedBy: 'María García' },
  { id: 'doc-3', name: 'Evidencia_auditoria.docx', size: 56000, taskId: 'task-TASK-003', uploadedAt: addDays(now, -3), uploadedBy: 'Ana Martínez' }
];

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Calidad', order: 1, color: '#1976d2' },
  { id: 'cat-2', name: 'Logística', order: 2, color: '#388e3c' },
  { id: 'cat-3', name: 'Producción', order: 3, color: '#f57c00' }
];

export const STATUSES: StatusConfig[] = [
  { id: 'st-1', name: 'Pendiente', value: 'Pendiente', order: 1 },
  { id: 'st-2', name: 'En Progreso', value: 'En Progreso', order: 2 },
  { id: 'st-3', name: 'En Espera', value: 'En Espera', order: 3 },
  { id: 'st-4', name: 'Completada', value: 'Completada', order: 4 },
  { id: 'st-5', name: 'Liberada', value: 'Liberada', order: 5 },
  { id: 'st-6', name: 'Rechazada', value: 'Rechazada', order: 6 },
  { id: 'st-7', name: 'Vencida', value: 'Vencida', order: 7 },
  { id: 'st-8', name: 'Cancelada', value: 'Cancelada', order: 8 }
];

export const PRIORITIES: PriorityConfig[] = [
  { id: 'pr-1', name: 'Alta', value: 'Alta', order: 1 },
  { id: 'pr-2', name: 'Media', value: 'Media', order: 2 },
  { id: 'pr-3', name: 'Baja', value: 'Baja', order: 3 }
];

export const TEAMS: Team[] = [
  { id: 'team-1', name: 'Operaciones', area: 'General', order: 1 },
  { id: 'team-2', name: 'Logística', area: 'Cadena de suministro', order: 2 },
  { id: 'team-3', name: 'Calidad', area: 'Aseguramiento', order: 3 },
  { id: 'team-4', name: 'Producción', area: 'Manufactura', order: 4 }
];
