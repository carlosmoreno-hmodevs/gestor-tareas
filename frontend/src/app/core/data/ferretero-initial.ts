import type { AdminCategory, AdminPriority, AdminStatus } from '../../shared/models/admin.model';
import type { TaskTemplate } from '../../shared/models/task-template.model';
import type { ProjectTemplate } from '../../shared/models/project-template.model';
import type { ReasonCatalogItem } from '../../shared/models/reason-catalog.model';

/** Áreas/categorías operativas por defecto en modo ferretero. */
export const FERRETERO_CATEGORIES: AdminCategory[] = [
  { id: 'fcat-mostrador', name: 'Mostrador / Ventas', order: 1, color: '#1976d2', active: true },
  { id: 'fcat-bodega', name: 'Bodega / Almacén', order: 2, color: '#388e3c', active: true },
  { id: 'fcat-compras', name: 'Compras / Proveedores', order: 3, color: '#f57c00', active: true },
  { id: 'fcat-entregas', name: 'Entregas / Reparto', order: 4, color: '#7b1fa2', active: true },
  { id: 'fcat-garantias', name: 'Garantías / Devoluciones', order: 5, color: '#c2185b', active: true },
  { id: 'fcat-exhibicion', name: 'Exhibición / Promociones', order: 6, color: '#0097a7', active: true },
  { id: 'fcat-mantenimiento', name: 'Mantenimiento / Seguridad', order: 7, color: '#5d4037', active: true },
  { id: 'fcat-admin', name: 'Administración', order: 8, color: '#455a64', active: true }
];

/** Tipos de tarea ferreteros (clasificación). Se muestran como categorías o tipo. */
export const FERRETERO_TASK_TYPES = [
  'Reabasto / Pedido a proveedor',
  'Recepción de mercancía',
  'Inventario cíclico / conteo',
  'Etiquetado y precios',
  'Surtido / preparación',
  'Garantía / devolución',
  'Orden y limpieza (5S)',
  'Mantenimiento preventivo'
];

/** Motivos estándar para Bloqueada (En espera). */
export const FERRETERO_MOTIVOS_BLOQUEADA = [
  'Falta confirmación de proveedor',
  'Faltante en entrega',
  'Error o aclaración de factura',
  'Requiere autorización interna',
  'Pendiente de cliente (garantías)'
];

/** Motivos para corrección (no liberada). */
export const FERRETERO_MOTIVOS_CORRECCION = [
  'Falta evidencia (foto/comprobante)',
  'Conteo inconsistente',
  'Precio/etiqueta incorrecta',
  'Checklist incompleto',
  'Evidencia insuficiente/ilegible'
];

/** Motivos de cancelación. */
export const FERRETERO_MOTIVOS_CANCELACION = [
  'Duplicada',
  'No procede',
  'Cambio de prioridad operativa',
  'Resuelta por otro canal'
];

/** IDs de categorías ferreteras (para appliesTo). */
const fcat = {
  bodega: 'fcat-bodega',
  compras: 'fcat-compras',
  entregas: 'fcat-entregas',
  garantias: 'fcat-garantias',
  mostrador: 'fcat-mostrador',
  exhibicion: 'fcat-exhibicion',
  mantenimiento: 'fcat-mantenimiento',
  admin: 'fcat-admin'
};

/** Catálogo de motivos de bloqueo (ferretero). Presets para seed por tenant. */
export const FERRETERO_REASON_CATALOG_BLOCKED: ReasonCatalogItem[] = [
  { id: 'rcb-1', code: 'SUPPLIER_CONFIRMATION', label: 'Falta confirmación de proveedor', kind: 'blocked', systemMode: 'ferretero', appliesTo: { categoryIds: [fcat.compras] }, order: 1 },
  { id: 'rcb-2', code: 'INVOICE_CLARIFICATION', label: 'Error o aclaración de factura', kind: 'blocked', systemMode: 'ferretero', appliesTo: { categoryIds: [fcat.compras, fcat.bodega] }, order: 2 },
  { id: 'rcb-3', code: 'MISSING_IN_DELIVERY', label: 'Faltante en entrega', kind: 'blocked', systemMode: 'ferretero', appliesTo: { categoryIds: [fcat.entregas, fcat.bodega] }, order: 3 },
  { id: 'rcb-4', code: 'MANAGER_APPROVAL', label: 'Autorización de gerencia', kind: 'blocked', systemMode: 'ferretero', order: 4 },
  { id: 'rcb-5', code: 'CUSTOMER_PENDING_WARRANTY', label: 'Pendiente de cliente (garantías)', kind: 'blocked', systemMode: 'ferretero', appliesTo: { categoryIds: [fcat.garantias] }, order: 5 },
  { id: 'rcb-6', code: 'NO_STOCK_REPLENISH', label: 'Sin stock / reposición pendiente', kind: 'blocked', systemMode: 'ferretero', appliesTo: { categoryIds: [fcat.bodega, fcat.mostrador] }, order: 6 },
  { id: 'rcb-7', code: 'WAITING_ROUTE', label: 'Esperando transporte / ruta', kind: 'blocked', systemMode: 'ferretero', appliesTo: { categoryIds: [fcat.entregas] }, order: 7 },
  { id: 'rcb-8', code: 'WAITING_SUPERVISOR', label: 'Esperando validación supervisor', kind: 'blocked', systemMode: 'ferretero', order: 8 },
  { id: 'rcb-9', code: 'OTHER_BLOCKED', label: 'Otro (personalizado)', kind: 'blocked', systemMode: 'ferretero', isOther: true, order: 99 }
];

/** Catálogo de motivos de rechazo (ferretero). Presets para seed por tenant. */
export const FERRETERO_REASON_CATALOG_REJECTED: ReasonCatalogItem[] = [
  { id: 'rcr-1', code: 'MISSING_EVIDENCE', label: 'Falta evidencia (foto/comprobante)', kind: 'rejected', systemMode: 'ferretero', order: 1 },
  { id: 'rcr-2', code: 'CHECKLIST_INCOMPLETE', label: 'Checklist incompleto', kind: 'rejected', systemMode: 'ferretero', order: 2 },
  { id: 'rcr-3', code: 'COUNT_INCONSISTENT', label: 'Conteo inconsistente', kind: 'rejected', systemMode: 'ferretero', appliesTo: { categoryIds: [fcat.bodega] }, order: 3 },
  { id: 'rcr-4', code: 'UNJUSTIFIED_DIFFERENCE', label: 'Diferencias no justificadas en conteo', kind: 'rejected', systemMode: 'ferretero', appliesTo: { categoryIds: [fcat.bodega] }, order: 4 },
  { id: 'rcr-5', code: 'INCOMPLETE_DATA', label: 'Datos incompletos (proveedor/SKU)', kind: 'rejected', systemMode: 'ferretero', order: 5 },
  { id: 'rcr-6', code: 'WRONG_ATTACHMENTS', label: 'Adjuntos incorrectos', kind: 'rejected', systemMode: 'ferretero', order: 6 },
  { id: 'rcr-7', code: 'NOT_STANDARD', label: 'No cumple estándar / procedimiento', kind: 'rejected', systemMode: 'ferretero', order: 7 },
  { id: 'rcr-8', code: 'PRICE_LABEL_WRONG', label: 'Precio/etiqueta incorrecta', kind: 'rejected', systemMode: 'ferretero', appliesTo: { categoryIds: [fcat.mostrador] }, order: 8 },
  { id: 'rcr-9', code: 'OTHER_REJECTED', label: 'Otro (personalizado)', kind: 'rejected', systemMode: 'ferretero', isOther: true, order: 99 }
];

/** Prioridades y estados no se reemplazan; se usan los del tenant. Solo referencias para UI. */
export const FERRETERO_PRIORITIES_DEFAULT: AdminPriority[] = [
  { id: 'fpr-1', name: 'Alta', value: 'Alta', order: 1, color: '#d32f2f', level: 3, slaHours: 24, active: true },
  { id: 'fpr-2', name: 'Media', value: 'Media', order: 2, color: '#ed6c02', level: 2, slaHours: 72, active: true },
  { id: 'fpr-3', name: 'Baja', value: 'Baja', order: 3, color: '#2e7d32', level: 1, slaHours: 168, active: true }
];

/** Plantillas de tarea para modo ferretero (Create Task). */
export const FERRETERO_TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'tpl-recepcion',
    name: 'Recepción de mercancía',
    titleTemplate: 'Recepción de mercancía – {Proveedor}',
    categoryId: 'fcat-bodega',
    descriptionText: 'Seguimiento de recepción de mercancía de proveedor.',
    checklistItems: ['Factura recibida', 'Conteo realizado', 'Daños revisados', 'Faltantes anotados', 'Acomodo en ubicación'],
    evidenceHint: 'Foto mercancía/factura',
    controlNotes: 'Puede quedar Bloqueada por aclaración; liberación por supervisor.'
  },
  {
    id: 'tpl-pedido-proveedor',
    name: 'Pedido a proveedor',
    titleTemplate: 'Pedido a proveedor – seguimiento',
    categoryId: 'fcat-compras',
    descriptionText: 'Gestión de pedido a proveedor.',
    checklistItems: ['Cotizar', 'Autorizar', 'Ordenar', 'Confirmar fecha', 'Recibir'],
    evidenceHint: 'Orden/confirmación',
    controlNotes: 'Bloqueo por proveedor; escalamiento si demora.'
  },
  {
    id: 'tpl-inventario-ciclico',
    name: 'Inventario cíclico por pasillo',
    titleTemplate: 'Inventario cíclico – pasillo {Pasillo}',
    categoryId: 'fcat-bodega',
    descriptionText: 'Inventario cíclico por pasillo o zona.',
    checklistItems: ['Conteo', 'Diferencias', 'Ajuste', 'Reporte'],
    evidenceHint: 'Formato/fotos',
    controlNotes: 'Requiere validación (Liberada/Validada).'
  },
  {
    id: 'tpl-etiquetado-precios',
    name: 'Etiquetado y corrección de precios',
    titleTemplate: 'Etiquetado y precios – {Área}',
    categoryId: 'fcat-mostrador',
    descriptionText: 'Etiquetado y corrección de precios por área.',
    checklistItems: ['Revisar lista', 'Imprimir', 'Colocar', 'Verificar'],
    evidenceHint: 'Foto antes/después',
    controlNotes: 'No liberada si falta evidencia.'
  },
  {
    id: 'tpl-surtido',
    name: 'Surtido / preparación de pedido',
    titleTemplate: 'Surtido – pedido {Pedido}',
    categoryId: 'fcat-bodega',
    descriptionText: 'Surtido y preparación de pedido.',
    checklistItems: ['Recolectar', 'Validar', 'Empaquetar'],
    evidenceHint: 'Foto paquete/ticket',
    controlNotes: 'Medir tiempos y retrabajo.'
  },
  {
    id: 'tpl-garantia',
    name: 'Garantía / devolución',
    titleTemplate: 'Garantía / devolución – {Cliente}',
    categoryId: 'fcat-garantias',
    descriptionText: 'Gestión de garantía o devolución de cliente.',
    checklistItems: ['Diagnóstico', 'Evidencia', 'Contacto', 'Resolución', 'Cierre'],
    evidenceHint: 'Fotos producto/nota',
    controlNotes: 'Seguimiento y liberación final.'
  },
  {
    id: 'tpl-exhibicion',
    name: 'Cambio de exhibición / promo',
    titleTemplate: 'Exhibición / promo – {Zona}',
    categoryId: 'fcat-exhibicion',
    descriptionText: 'Cambio de exhibición o promoción.',
    checklistItems: ['Retirar', 'Colocar', 'Señalización', 'Precios', 'Verificación'],
    evidenceHint: 'Foto antes/después'
  },
  {
    id: 'tpl-mantenimiento',
    name: 'Mantenimiento preventivo',
    titleTemplate: 'Mantenimiento preventivo – {Equipo}',
    categoryId: 'fcat-mantenimiento',
    descriptionText: 'Mantenimiento preventivo de equipo o área.',
    checklistItems: ['Revisión', 'Limpieza', 'Ajustes', 'Seguridad'],
    evidenceHint: 'Foto/bitácora'
  }
];

/** Plantillas de proyecto para modo ferretero (Create Project). */
export const FERRETERO_PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'ppl-recepcion-completa',
    name: 'Recepción de proveedor (operación completa)',
    description: 'Flujo completo: recepción, etiquetado, acomodo e inventario de diferencias.',
    nameTemplate: 'Recepción y acomodo – {Sucursal}',
    taskTemplateIds: ['tpl-recepcion', 'tpl-etiquetado-precios', 'tpl-exhibicion', 'tpl-inventario-ciclico']
  },
  {
    id: 'ppl-reabasto-proveedor',
    name: 'Reabasto / Pedido a proveedor',
    description: 'Pedido, recepción e inventario cíclico.',
    nameTemplate: 'Reabasto – {Proveedor}',
    taskTemplateIds: ['tpl-pedido-proveedor', 'tpl-recepcion', 'tpl-inventario-ciclico']
  },
  {
    id: 'ppl-inventario-5s',
    name: 'Inventario y orden (5S semanal)',
    description: 'Inventario cíclico, mantenimiento, exhibición y etiquetado.',
    nameTemplate: 'Inventario y 5S – {Semana}',
    taskTemplateIds: ['tpl-inventario-ciclico', 'tpl-mantenimiento', 'tpl-exhibicion', 'tpl-etiquetado-precios']
  },
  {
    id: 'ppl-garantias-devoluciones',
    name: 'Garantías y devoluciones',
    description: 'Gestión de garantías, devoluciones, surtido si aplica.',
    nameTemplate: 'Garantías – {Cliente}',
    taskTemplateIds: ['tpl-garantia', 'tpl-surtido', 'tpl-mantenimiento']
  },
  {
    id: 'ppl-cambio-promo',
    name: 'Cambio de promoción / exhibición',
    description: 'Cambio de exhibición, señalización y precios.',
    nameTemplate: 'Cambio de promoción – {Zona}',
    taskTemplateIds: ['tpl-exhibicion', 'tpl-etiquetado-precios']
  },
  {
    id: 'ppl-mantenimiento-mensual',
    name: 'Mantenimiento y seguridad mensual',
    description: 'Revisión, limpieza y seguridad mensual.',
    nameTemplate: 'Mantenimiento mensual – {Mes}',
    taskTemplateIds: ['tpl-mantenimiento']
  }
];

export const FERRETERO_STATUSES_DEFAULT: AdminStatus[] = [
  { id: 'fst-1', name: 'Pendiente', value: 'Pendiente', order: 1, active: true },
  { id: 'fst-2', name: 'En Progreso', value: 'En Progreso', order: 2, active: true },
  { id: 'fst-3', name: 'Bloqueada', value: 'En Espera', order: 3, active: true },
  { id: 'fst-4', name: 'Completada', value: 'Completada', order: 4, active: true },
  { id: 'fst-5', name: 'Validada por supervisor', value: 'Liberada', order: 5, active: true },
  { id: 'fst-6', name: 'Rechazada', value: 'Rechazada', order: 6, active: true },
  { id: 'fst-7', name: 'Fuera de plazo', value: 'Vencida', order: 7, active: true },
  { id: 'fst-8', name: 'Cancelada', value: 'Cancelada', order: 8, active: true }
];
