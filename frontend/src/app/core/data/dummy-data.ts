import type { Task, TaskChecklistItem } from '../../shared/models';
import type { User } from '../../shared/models';
import type { AlertRule } from '../../shared/models';
import type { Document } from '../../shared/models';
import type { Category, StatusConfig, PriorityConfig, Team } from '../../shared/models';
import type { TaskBlockedReason, TaskRejectedReason } from '../../shared/models/reason-catalog.model';
import { FERRETERO_CATEGORIES, FERRETERO_TASK_TEMPLATES } from './ferretero-initial';
import type { SystemMode } from '../../shared/models/tenant-settings.model';

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

/** IDs de proyectos dummy ferreteros (ver projects-initial) */
const FERRETERO_PROJECT_IDS = ['fproj-1', 'fproj-2', 'fproj-3', 'fproj-4', 'fproj-5', 'fproj-6'] as const;

function checklistFromTemplate(templateId: string, prefix: string, doneCount?: number): TaskChecklistItem[] {
  const tpl = FERRETERO_TASK_TEMPLATES.find((t) => t.id === templateId);
  if (!tpl?.checklistItems?.length) return [];
  const total = tpl.checklistItems.length;
  const n = doneCount ?? 0;
  return tpl.checklistItems.map((text, i) => ({
    id: `chk-${prefix}-${i}`,
    text,
    isDone: i < n
  }));
}

function categoryName(categoryId: string): string {
  return FERRETERO_CATEGORIES.find((c) => c.id === categoryId)?.name ?? categoryId;
}

/** Tareas dummy modo ferretero: usan categorías, plantillas y proyectos ferreteros. */
function tasksFerreteroForTenant(tenantId: string): Task[] {
  const ou = tenantId === 'tenant-1' ? 'ou-2' : 'ou-7';
  const baseOverrides = { tenantId, orgUnitId: ou };
  const t = (folio: string, title: string, assignee: string, assigneeId: string, status: Task['status'], priority: Task['priority'], due: Date, extra: Partial<Task> = {}) =>
    createTask(folio, title, assignee, assigneeId, status, priority, due, { ...baseOverrides, ...extra });

  return [
    t('F-001', 'Recepción de mercancía – Ferretería Norte', 'Carlos López', 'user-2', 'Completada', 'Alta', addDays(now, -2), {
      projectId: FERRETERO_PROJECT_IDS[0],
      categoryId: 'fcat-bodega',
      categoryName: categoryName('fcat-bodega'),
      templateId: 'tpl-recepcion',
      generatedFromProjectTemplateId: 'ppl-recepcion-completa',
      checklist: checklistFromTemplate('tpl-recepcion', 'F-001', 4),
      liberatedAt: addDays(now, -1).toISOString()
    }),
    t('F-002', 'Etiquetado y precios – Mostrador', 'Ana Martínez', 'user-3', 'En Progreso', 'Media', addDays(now, 1), {
      projectId: FERRETERO_PROJECT_IDS[0],
      categoryId: 'fcat-mostrador',
      categoryName: categoryName('fcat-mostrador'),
      templateId: 'tpl-etiquetado-precios',
      generatedFromProjectTemplateId: 'ppl-recepcion-completa',
      checklist: checklistFromTemplate('tpl-etiquetado-precios', 'F-002', 2)
    }),
    t('F-003', 'Exhibición / promo – Zona A', 'Laura Rodríguez', 'user-5', 'Pendiente', 'Baja', addDays(now, 3), {
      projectId: FERRETERO_PROJECT_IDS[0],
      categoryId: 'fcat-exhibicion',
      categoryName: categoryName('fcat-exhibicion'),
      templateId: 'tpl-exhibicion',
      generatedFromProjectTemplateId: 'ppl-recepcion-completa',
      checklist: checklistFromTemplate('tpl-exhibicion', 'F-003')
    }),
    t('F-004', 'Inventario cíclico – pasillo 3', 'Carlos López', 'user-2', 'Liberada', 'Alta', addDays(now, -1), {
      projectId: FERRETERO_PROJECT_IDS[0],
      categoryId: 'fcat-bodega',
      categoryName: categoryName('fcat-bodega'),
      templateId: 'tpl-inventario-ciclico',
      generatedFromProjectTemplateId: 'ppl-recepcion-completa',
      checklist: checklistFromTemplate('tpl-inventario-ciclico', 'F-004'),
      liberatedAt: now.toISOString()
    }),
    t('F-005', 'Pedido a proveedor – seguimiento', 'María García', 'user-1', 'En Espera', 'Alta', addDays(now, 2), {
      projectId: FERRETERO_PROJECT_IDS[1],
      categoryId: 'fcat-compras',
      categoryName: categoryName('fcat-compras'),
      templateId: 'tpl-pedido-proveedor',
      generatedFromProjectTemplateId: 'ppl-reabasto-proveedor',
      checklist: checklistFromTemplate('tpl-pedido-proveedor', 'F-005'),
      blockedReason: { code: 'SUPPLIER_CONFIRMATION', label: 'Falta confirmación de proveedor', source: 'catalog' } as TaskBlockedReason,
      blockedAt: addHours(now, -24).toISOString()
    }),
    t('F-005b', 'Orden de compra pendiente de autorización', 'Pedro Sánchez', 'user-4', 'En Espera', 'Alta', addDays(now, 3), {
      projectId: FERRETERO_PROJECT_IDS[1],
      categoryId: 'fcat-compras',
      categoryName: categoryName('fcat-compras'),
      templateId: 'tpl-pedido-proveedor',
      generatedFromProjectTemplateId: 'ppl-reabasto-proveedor',
      checklist: checklistFromTemplate('tpl-pedido-proveedor', 'F-005b'),
      blockedReason: { code: 'MANAGER_APPROVAL', label: 'Autorización de gerencia', source: 'catalog' } as TaskBlockedReason,
      blockedAt: addHours(now, -48).toISOString()
    }),
    t('F-005c', 'Recepción retrasada – factura en trámite', 'Ana Martínez', 'user-3', 'En Espera', 'Media', addDays(now, 1), {
      projectId: FERRETERO_PROJECT_IDS[1],
      categoryId: 'fcat-bodega',
      categoryName: categoryName('fcat-bodega'),
      templateId: 'tpl-recepcion',
      generatedFromProjectTemplateId: 'ppl-reabasto-proveedor',
      checklist: checklistFromTemplate('tpl-recepcion', 'F-005c'),
      blockedReason: 'Factura en trámite',
      blockedAt: addHours(now, -72).toISOString()
    }),
    t('F-006', 'Recepción de mercancía – Proveedor XYZ', 'Pedro Sánchez', 'user-4', 'Pendiente', 'Media', addDays(now, 4), {
      projectId: FERRETERO_PROJECT_IDS[1],
      categoryId: 'fcat-bodega',
      categoryName: categoryName('fcat-bodega'),
      templateId: 'tpl-recepcion',
      generatedFromProjectTemplateId: 'ppl-reabasto-proveedor',
      checklist: checklistFromTemplate('tpl-recepcion', 'F-006')
    }),
    t('F-007', 'Inventario cíclico – pasillo 1', 'Ana Martínez', 'user-3', 'Rechazada', 'Baja', addDays(now, -3), {
      projectId: FERRETERO_PROJECT_IDS[1],
      categoryId: 'fcat-bodega',
      categoryName: categoryName('fcat-bodega'),
      templateId: 'tpl-inventario-ciclico',
      generatedFromProjectTemplateId: 'ppl-reabasto-proveedor',
      checklist: checklistFromTemplate('tpl-inventario-ciclico', 'F-007', 2),
      rejectedReason: { code: 'UNJUSTIFIED_DIFFERENCE', label: 'Diferencias no justificadas en conteo', source: 'catalog' } as TaskRejectedReason
    }),
    t('F-007b', 'Recepción – lote L-2201', 'Laura Rodríguez', 'user-5', 'Rechazada', 'Media', addDays(now, -2), {
      projectId: FERRETERO_PROJECT_IDS[1],
      categoryId: 'fcat-bodega',
      categoryName: categoryName('fcat-bodega'),
      templateId: 'tpl-recepcion',
      generatedFromProjectTemplateId: 'ppl-reabasto-proveedor',
      checklist: checklistFromTemplate('tpl-recepcion', 'F-007b', 3),
      correctedReason: 'Faltantes no registrados en sistema'
    }),
    t('F-007c', 'Etiquetado – Pasillo 2', 'Carlos López', 'user-2', 'Rechazada', 'Baja', addDays(now, -1), {
      projectId: FERRETERO_PROJECT_IDS[4],
      categoryId: 'fcat-mostrador',
      categoryName: categoryName('fcat-mostrador'),
      templateId: 'tpl-etiquetado-precios',
      generatedFromProjectTemplateId: 'ppl-cambio-promo',
      checklist: checklistFromTemplate('tpl-etiquetado-precios', 'F-007c'),
      correctedReason: 'Precio desactualizado'
    }),
    t('F-008', 'Inventario y 5S – Semana 7', 'Laura Rodríguez', 'user-5', 'En Progreso', 'Media', addDays(now, 5), {
      projectId: FERRETERO_PROJECT_IDS[2],
      categoryId: 'fcat-bodega',
      categoryName: categoryName('fcat-bodega'),
      templateId: 'tpl-inventario-ciclico',
      generatedFromProjectTemplateId: 'ppl-inventario-5s',
      checklist: checklistFromTemplate('tpl-inventario-ciclico', 'F-008', 1)
    }),
    t('F-009', 'Mantenimiento preventivo – Montacargas', 'Carlos López', 'user-2', 'Pendiente', 'Alta', addDays(now, 2), {
      projectId: FERRETERO_PROJECT_IDS[2],
      categoryId: 'fcat-mantenimiento',
      categoryName: categoryName('fcat-mantenimiento'),
      templateId: 'tpl-mantenimiento',
      generatedFromProjectTemplateId: 'ppl-inventario-5s',
      checklist: checklistFromTemplate('tpl-mantenimiento', 'F-009')
    }),
    t('F-010', 'Exhibición / promo – Promo febrero', 'María García', 'user-1', 'Vencida', 'Media', addDays(now, -2), {
      projectId: FERRETERO_PROJECT_IDS[2],
      categoryId: 'fcat-exhibicion',
      categoryName: categoryName('fcat-exhibicion'),
      templateId: 'tpl-exhibicion',
      generatedFromProjectTemplateId: 'ppl-inventario-5s',
      checklist: checklistFromTemplate('tpl-exhibicion', 'F-010')
    }),
    t('F-011', 'Garantía / devolución – Cliente 4452', 'Pedro Sánchez', 'user-4', 'Completada', 'Alta', addDays(now, -1), {
      projectId: FERRETERO_PROJECT_IDS[3],
      categoryId: 'fcat-garantias',
      categoryName: categoryName('fcat-garantias'),
      templateId: 'tpl-garantia',
      generatedFromProjectTemplateId: 'ppl-garantias-devoluciones',
      checklist: checklistFromTemplate('tpl-garantia', 'F-011')
    }),
    t('F-012', 'Surtido – pedido P-8821', 'Ana Martínez', 'user-3', 'En Progreso', 'Media', addHours(now, 24), {
      projectId: FERRETERO_PROJECT_IDS[3],
      categoryId: 'fcat-bodega',
      categoryName: categoryName('fcat-bodega'),
      templateId: 'tpl-surtido',
      generatedFromProjectTemplateId: 'ppl-garantias-devoluciones',
      checklist: checklistFromTemplate('tpl-surtido', 'F-012')
    }),
    t('F-013', 'Cambio de promoción – Zona entrada', 'Laura Rodríguez', 'user-5', 'Liberada', 'Baja', addDays(now, 1), {
      projectId: FERRETERO_PROJECT_IDS[4],
      categoryId: 'fcat-exhibicion',
      categoryName: categoryName('fcat-exhibicion'),
      templateId: 'tpl-exhibicion',
      generatedFromProjectTemplateId: 'ppl-cambio-promo',
      checklist: checklistFromTemplate('tpl-exhibicion', 'F-013'),
      liberatedAt: addDays(now, -1).toISOString()
    }),
    t('F-014', 'Etiquetado y precios – Pasillo herramientas', 'Carlos López', 'user-2', 'Pendiente', 'Media', addDays(now, 4), {
      projectId: FERRETERO_PROJECT_IDS[4],
      categoryId: 'fcat-mostrador',
      categoryName: categoryName('fcat-mostrador'),
      templateId: 'tpl-etiquetado-precios',
      generatedFromProjectTemplateId: 'ppl-cambio-promo',
      checklist: checklistFromTemplate('tpl-etiquetado-precios', 'F-014')
    }),
    t('F-015', 'Mantenimiento mensual – Febrero', 'María García', 'user-1', 'En Progreso', 'Alta', addDays(now, 7), {
      projectId: FERRETERO_PROJECT_IDS[5],
      categoryId: 'fcat-mantenimiento',
      categoryName: categoryName('fcat-mantenimiento'),
      templateId: 'tpl-mantenimiento',
      generatedFromProjectTemplateId: 'ppl-mantenimiento-mensual',
      checklist: checklistFromTemplate('tpl-mantenimiento', 'F-015')
    }),
    // ——— Bloque extendido: más bloqueadas, rechazadas, preventivos, por vencer, vencidas ———
    t('F-016', 'Pedido proveedor ABC – pendiente', 'Carlos López', 'user-2', 'En Espera', 'Alta', addHours(now, 18), {
      projectId: FERRETERO_PROJECT_IDS[1], categoryId: 'fcat-compras', categoryName: categoryName('fcat-compras'),
      blockedReason: { code: 'MISSING_IN_DELIVERY', label: 'Faltante en entrega', source: 'catalog' } as TaskBlockedReason,
      blockedAt: addHours(now, -36).toISOString(),
      createdAt: addDays(now, -5), checklist: checklistFromTemplate('tpl-pedido-proveedor', 'F-016', 1)
    }),
    t('F-017', 'Recepción lote 1002 – aclaración', 'Ana Martínez', 'user-3', 'En Espera', 'Media', addHours(now, 30), {
      projectId: FERRETERO_PROJECT_IDS[1], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      blockedReason: { code: 'INVOICE_CLARIFICATION', label: 'Error o aclaración de factura', source: 'catalog' } as TaskBlockedReason,
      blockedAt: addHours(now, -24).toISOString(),
      createdAt: addDays(now, -4), checklist: checklistFromTemplate('tpl-recepcion', 'F-017', 2)
    }),
    t('F-018', 'Orden especial – gerencia', 'Pedro Sánchez', 'user-4', 'En Espera', 'Alta', addDays(now, 2), {
      projectId: FERRETERO_PROJECT_IDS[1], categoryId: 'fcat-compras', categoryName: categoryName('fcat-compras'),
      blockedReason: 'Requiere autorización interna',
      blockedAt: addHours(now, -96).toISOString(),
      createdAt: addDays(now, -6)
    }),
    t('F-019', 'Garantía cliente 7788', 'Laura Rodríguez', 'user-5', 'En Espera', 'Media', addDays(now, 1), {
      projectId: FERRETERO_PROJECT_IDS[3], categoryId: 'fcat-garantias', categoryName: categoryName('fcat-garantias'),
      blockedReason: { code: 'CUSTOMER_PENDING_WARRANTY', label: 'Pendiente de cliente (garantías)', source: 'catalog' } as TaskBlockedReason,
      blockedAt: addHours(now, -12).toISOString(),
      checklist: checklistFromTemplate('tpl-garantia', 'F-019')
    }),
    t('F-020', 'Inventario pasillo 2 – rechazado', 'Carlos López', 'user-2', 'Rechazada', 'Baja', addDays(now, -5), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      rejectedReason: { code: 'MISSING_EVIDENCE', label: 'Falta evidencia (foto/comprobante)', source: 'catalog' } as TaskRejectedReason,
      createdAt: addDays(now, -10),
      checklist: checklistFromTemplate('tpl-inventario-ciclico', 'F-020', 1)
    }),
    t('F-021', 'Recepción L-3300 – corrección', 'Ana Martínez', 'user-3', 'Rechazada', 'Media', addDays(now, -2), {
      projectId: FERRETERO_PROJECT_IDS[1], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      rejectedReason: { code: 'COUNT_INCONSISTENT', label: 'Conteo inconsistente', source: 'catalog' } as TaskRejectedReason,
      checklist: checklistFromTemplate('tpl-recepcion', 'F-021', 3)
    }),
    t('F-022', 'Etiquetado pasillo 5', 'María García', 'user-1', 'Rechazada', 'Baja', addDays(now, -1), {
      projectId: FERRETERO_PROJECT_IDS[4], categoryId: 'fcat-mostrador', categoryName: categoryName('fcat-mostrador'),
      rejectedReason: { code: 'PRICE_LABEL_WRONG', label: 'Precio/etiqueta incorrecta', source: 'catalog' } as TaskRejectedReason,
      checklist: checklistFromTemplate('tpl-etiquetado-precios', 'F-022', 2)
    }),
    t('F-023', 'Exhibición zona B – no liberada', 'Pedro Sánchez', 'user-4', 'Rechazada', 'Media', addDays(now, 2), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-exhibicion', categoryName: categoryName('fcat-exhibicion'),
      rejectedReason: { code: 'CHECKLIST_INCOMPLETE', label: 'Checklist incompleto', source: 'catalog' } as TaskRejectedReason,
      checklist: checklistFromTemplate('tpl-exhibicion', 'F-023', 2)
    }),
    t('F-024', 'Surtido P-9012 – rechazado', 'Laura Rodríguez', 'user-5', 'Rechazada', 'Alta', addDays(now, -3), {
      projectId: FERRETERO_PROJECT_IDS[3], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      correctedReason: 'Evidencia insuficiente/ilegible', checklist: checklistFromTemplate('tpl-surtido', 'F-024', 1)
    }),
    t('F-025', 'Mantenimiento preventivo – Escalera', 'Carlos López', 'user-2', 'Liberada', 'Alta', addDays(now, -4), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-mantenimiento', categoryName: categoryName('fcat-mantenimiento'),
      liberatedAt: addDays(now, -2).toISOString(), createdAt: addDays(now, -15),
      checklist: checklistFromTemplate('tpl-mantenimiento', 'F-025', 4)
    }),
    t('F-026', 'Mantenimiento – Extintores', 'Ana Martínez', 'user-3', 'Vencida', 'Alta', addDays(now, -10), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-mantenimiento', categoryName: categoryName('fcat-mantenimiento'),
      createdAt: addDays(now, -20), checklist: checklistFromTemplate('tpl-mantenimiento', 'F-026')
    }),
    t('F-027', 'Mantenimiento – Iluminación', 'María García', 'user-1', 'Completada', 'Media', addDays(now, -1), {
      projectId: FERRETERO_PROJECT_IDS[5], categoryId: 'fcat-mantenimiento', categoryName: categoryName('fcat-mantenimiento'),
      liberatedAt: addDays(now, -1).toISOString(), createdAt: addDays(now, -8)
    }),
    t('F-028', 'Mantenimiento – Montacargas B', 'Pedro Sánchez', 'user-4', 'Pendiente', 'Alta', addHours(now, 12), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-mantenimiento', categoryName: categoryName('fcat-mantenimiento'),
      createdAt: addDays(now, -3), checklist: checklistFromTemplate('tpl-mantenimiento', 'F-028', 1)
    }),
    t('F-029', 'Mantenimiento – Aire acondicionado', 'Laura Rodríguez', 'user-5', 'En Progreso', 'Baja', addDays(now, 4), {
      projectId: FERRETERO_PROJECT_IDS[5], categoryId: 'fcat-mantenimiento', categoryName: categoryName('fcat-mantenimiento'),
      checklist: checklistFromTemplate('tpl-mantenimiento', 'F-029', 2)
    }),
    t('F-030', 'Por vencer 24h – Bodega', 'Carlos López', 'user-2', 'En Progreso', 'Alta', addHours(now, 8), {
      projectId: FERRETERO_PROJECT_IDS[0], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      checklist: checklistFromTemplate('tpl-inventario-ciclico', 'F-030', 3), createdAt: addDays(now, -2)
    }),
    t('F-031', 'Por vencer 24h – Mostrador', 'Ana Martínez', 'user-3', 'Pendiente', 'Media', addHours(now, 20), {
      projectId: FERRETERO_PROJECT_IDS[0], categoryId: 'fcat-mostrador', categoryName: categoryName('fcat-mostrador'),
      checklist: checklistFromTemplate('tpl-etiquetado-precios', 'F-031', 1), createdAt: addDays(now, -5)
    }),
    t('F-032', 'Por vencer 48h – Exhibición', 'María García', 'user-1', 'Pendiente', 'Baja', addHours(now, 40), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-exhibicion', categoryName: categoryName('fcat-exhibicion'),
      checklist: checklistFromTemplate('tpl-exhibicion', 'F-032'), createdAt: addDays(now, -1)
    }),
    t('F-033', 'Por vencer 48h – Compras', 'Pedro Sánchez', 'user-4', 'En Progreso', 'Alta', addHours(now, 50), {
      projectId: FERRETERO_PROJECT_IDS[1], categoryId: 'fcat-compras', categoryName: categoryName('fcat-compras'),
      createdAt: addDays(now, -7)
    }),
    t('F-034', 'Por vencer 72h – Garantías', 'Laura Rodríguez', 'user-5', 'Pendiente', 'Media', addHours(now, 65), {
      projectId: FERRETERO_PROJECT_IDS[3], categoryId: 'fcat-garantias', categoryName: categoryName('fcat-garantias'),
      checklist: checklistFromTemplate('tpl-garantia', 'F-034', 2), createdAt: addDays(now, -4)
    }),
    t('F-035', 'Vencida – Recepción', 'Carlos López', 'user-2', 'Vencida', 'Alta', addDays(now, -1), {
      projectId: FERRETERO_PROJECT_IDS[1], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      checklist: checklistFromTemplate('tpl-recepcion', 'F-035', 2), createdAt: addDays(now, -12)
    }),
    t('F-036', 'Vencida – Exhibición', 'Ana Martínez', 'user-3', 'Vencida', 'Media', addDays(now, -3), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-exhibicion', categoryName: categoryName('fcat-exhibicion'),
      createdAt: addDays(now, -10)
    }),
    t('F-037', 'Liberada hoy – Bodega', 'María García', 'user-1', 'Liberada', 'Alta', addDays(now, 0), {
      projectId: FERRETERO_PROJECT_IDS[0], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      liberatedAt: addHours(now, -2).toISOString(), createdAt: addDays(now, -5),
      checklist: checklistFromTemplate('tpl-inventario-ciclico', 'F-037', 4)
    }),
    t('F-038', 'Liberada ayer – Mostrador', 'Pedro Sánchez', 'user-4', 'Liberada', 'Media', addDays(now, -1), {
      projectId: FERRETERO_PROJECT_IDS[4], categoryId: 'fcat-mostrador', categoryName: categoryName('fcat-mostrador'),
      liberatedAt: addDays(now, -1).toISOString(), createdAt: addDays(now, -8),
      checklist: checklistFromTemplate('tpl-etiquetado-precios', 'F-038', 5)
    }),
    t('F-039', 'Backlog Bodega 1', 'Laura Rodríguez', 'user-5', 'Pendiente', 'Baja', addDays(now, 5), {
      projectId: FERRETERO_PROJECT_IDS[0], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      checklist: checklistFromTemplate('tpl-recepcion', 'F-039', 1), createdAt: addDays(now, -20)
    }),
    t('F-040', 'Backlog Bodega 2', 'Carlos López', 'user-2', 'En Progreso', 'Media', addDays(now, 6), {
      projectId: FERRETERO_PROJECT_IDS[1], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      checklist: checklistFromTemplate('tpl-inventario-ciclico', 'F-040', 2), createdAt: addDays(now, -15)
    }),
    t('F-041', 'Backlog Mostrador 1', 'Ana Martínez', 'user-3', 'Pendiente', 'Alta', addDays(now, 4), {
      projectId: FERRETERO_PROJECT_IDS[4], categoryId: 'fcat-mostrador', categoryName: categoryName('fcat-mostrador'),
      createdAt: addDays(now, -6)
    }),
    t('F-042', 'Backlog Exhibición 1', 'María García', 'user-1', 'Pendiente', 'Baja', addDays(now, 7), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-exhibicion', categoryName: categoryName('fcat-exhibicion'),
      checklist: checklistFromTemplate('tpl-exhibicion', 'F-042', 3), createdAt: addDays(now, -9)
    }),
    t('F-043', 'Backlog Compras 1', 'Pedro Sánchez', 'user-4', 'En Progreso', 'Media', addDays(now, 3), {
      projectId: FERRETERO_PROJECT_IDS[1], categoryId: 'fcat-compras', categoryName: categoryName('fcat-compras'),
      createdAt: addDays(now, -14)
    }),
    t('F-044', 'Garantía 1122 – rechazada', 'Laura Rodríguez', 'user-5', 'Rechazada', 'Alta', addDays(now, -2), {
      projectId: FERRETERO_PROJECT_IDS[3], categoryId: 'fcat-garantias', categoryName: categoryName('fcat-garantias'),
      correctedReason: 'Falta evidencia (foto/comprobante)', checklist: checklistFromTemplate('tpl-garantia', 'F-044')
    }),
    t('F-045', 'Mantenimiento – Herramientas', 'Carlos López', 'user-2', 'Liberada', 'Baja', addDays(now, -5), {
      projectId: FERRETERO_PROJECT_IDS[5], categoryId: 'fcat-mantenimiento', categoryName: categoryName('fcat-mantenimiento'),
      liberatedAt: addDays(now, -4).toISOString(), createdAt: addDays(now, -25),
      checklist: checklistFromTemplate('tpl-mantenimiento', 'F-045', 5)
    }),
    t('F-046', 'Mantenimiento – Puertas', 'Ana Martínez', 'user-3', 'Pendiente', 'Media', addDays(now, 10), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-mantenimiento', categoryName: categoryName('fcat-mantenimiento'),
      checklist: checklistFromTemplate('tpl-mantenimiento', 'F-046'), createdAt: addDays(now, -3)
    }),
    t('F-047', 'En espera – Faltante entrega', 'María García', 'user-1', 'En Espera', 'Alta', addHours(now, 24), {
      projectId: FERRETERO_PROJECT_IDS[1], categoryId: 'fcat-compras', categoryName: categoryName('fcat-compras'),
      blockedReason: { code: 'MISSING_IN_DELIVERY', label: 'Faltante en entrega', source: 'catalog' } as TaskBlockedReason,
      blockedAt: addHours(now, -18).toISOString(),
      createdAt: addDays(now, -2)
    }),
    t('F-048', 'En espera – Error factura', 'Pedro Sánchez', 'user-4', 'En Espera', 'Media', addDays(now, 2), {
      projectId: FERRETERO_PROJECT_IDS[1], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      blockedReason: { code: 'INVOICE_CLARIFICATION', label: 'Error o aclaración de factura', source: 'catalog' } as TaskBlockedReason,
      blockedAt: addHours(now, -6).toISOString()
    }),
    t('F-049', 'Rechazada – Conteo', 'Laura Rodríguez', 'user-5', 'Rechazada', 'Baja', addDays(now, -4), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      rejectedReason: { code: 'COUNT_INCONSISTENT', label: 'Conteo inconsistente', source: 'catalog' } as TaskRejectedReason,
      checklist: checklistFromTemplate('tpl-inventario-ciclico', 'F-049', 2)
    }),
    t('F-050', 'Rechazada – Checklist', 'Carlos López', 'user-2', 'Rechazada', 'Media', addDays(now, 1), {
      projectId: FERRETERO_PROJECT_IDS[4], categoryId: 'fcat-mostrador', categoryName: categoryName('fcat-mostrador'),
      rejectedReason: { code: 'CHECKLIST_INCOMPLETE', label: 'Checklist incompleto', source: 'catalog' } as TaskRejectedReason,
      checklist: checklistFromTemplate('tpl-etiquetado-precios', 'F-050', 2)
    }),
    t('F-051', 'Completada – Recepción', 'Ana Martínez', 'user-3', 'Completada', 'Alta', addDays(now, -6), {
      projectId: FERRETERO_PROJECT_IDS[0], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      liberatedAt: addDays(now, -5).toISOString(), createdAt: addDays(now, -12),
      checklist: checklistFromTemplate('tpl-recepcion', 'F-051', 5)
    }),
    t('F-052', 'Liberada – Exhibición', 'María García', 'user-1', 'Liberada', 'Baja', addDays(now, -3), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-exhibicion', categoryName: categoryName('fcat-exhibicion'),
      liberatedAt: addDays(now, -2).toISOString(), createdAt: addDays(now, -18),
      checklist: checklistFromTemplate('tpl-exhibicion', 'F-052', 4)
    }),
    t('F-053', 'Pendiente >72h', 'Pedro Sánchez', 'user-4', 'Pendiente', 'Media', addDays(now, 8), {
      projectId: FERRETERO_PROJECT_IDS[3], categoryId: 'fcat-bodega', categoryName: categoryName('fcat-bodega'),
      createdAt: addDays(now, -7)
    }),
    t('F-054', 'Pendiente >72h 2', 'Laura Rodríguez', 'user-5', 'Pendiente', 'Baja', addDays(now, 12), {
      projectId: FERRETERO_PROJECT_IDS[4], categoryId: 'fcat-exhibicion', categoryName: categoryName('fcat-exhibicion'),
      checklist: checklistFromTemplate('tpl-exhibicion', 'F-054'), createdAt: addDays(now, -11)
    }),
    t('F-055', 'Mantenimiento Vencida 2', 'Carlos López', 'user-2', 'Vencida', 'Alta', addDays(now, -7), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-mantenimiento', categoryName: categoryName('fcat-mantenimiento'),
      createdAt: addDays(now, -22), checklist: checklistFromTemplate('tpl-mantenimiento', 'F-055')
    }),
    t('F-056', 'Por vencer 24h – Compras', 'Ana Martínez', 'user-3', 'Pendiente', 'Alta', addHours(now, 14), {
      projectId: FERRETERO_PROJECT_IDS[1], categoryId: 'fcat-compras', categoryName: categoryName('fcat-compras'),
      createdAt: addDays(now, -1)
    }),
    t('F-057', 'Garantía liberada', 'María García', 'user-1', 'Liberada', 'Media', addDays(now, -2), {
      projectId: FERRETERO_PROJECT_IDS[3], categoryId: 'fcat-garantias', categoryName: categoryName('fcat-garantias'),
      liberatedAt: addDays(now, -1).toISOString(), createdAt: addDays(now, -14),
      checklist: checklistFromTemplate('tpl-garantia', 'F-057', 5)
    }),
    t('F-058', 'Entregas pendiente', 'Pedro Sánchez', 'user-4', 'Pendiente', 'Baja', addDays(now, 4), {
      projectId: FERRETERO_PROJECT_IDS[2], categoryId: 'fcat-entregas', categoryName: categoryName('fcat-entregas'),
      createdAt: addDays(now, -8)
    }),
    t('F-059', 'Admin – reporte', 'Laura Rodríguez', 'user-5', 'Completada', 'Media', addDays(now, -1), {
      projectId: FERRETERO_PROJECT_IDS[5], categoryId: 'fcat-admin', categoryName: categoryName('fcat-admin'),
      liberatedAt: now.toISOString(), createdAt: addDays(now, -30)
    }),
    t('F-060', 'En espera – Cliente garantía', 'Carlos López', 'user-2', 'En Espera', 'Media', addDays(now, 3), {
      projectId: FERRETERO_PROJECT_IDS[3], categoryId: 'fcat-garantias', categoryName: categoryName('fcat-garantias'),
      blockedReason: { code: 'CUSTOMER_PENDING_WARRANTY', label: 'Pendiente de cliente (garantías)', source: 'catalog', detail: 'Cliente 7788' } as TaskBlockedReason,
      blockedAt: addHours(now, -60).toISOString()
    })
  ].map((task) => ({ ...task, id: `task-${task.folio}` }));
}

/** Tareas iniciales por tenant y modo: normal (solo datos genéricos) o ferretero (solo datos ferreteros). */
export function getInitialTasks(tenantId: string, mode?: SystemMode): Task[] {
  if (mode === 'ferretero') return tasksFerreteroForTenant(tenantId);
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
