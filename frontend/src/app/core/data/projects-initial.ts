import type { Project } from '../../shared/models';
import { FERRETERO_PROJECT_TEMPLATES } from './ferretero-initial';
import type { SystemMode } from '../../shared/models/tenant-settings.model';

const now = new Date();
const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 86400000);

function createActivityEntry(
  type: Project['activity'][0]['type'],
  userId: string,
  userName: string,
  details: Record<string, unknown> = {}
) {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    timestamp: now,
    userId,
    userName,
    details
  };
}

/** Proyectos dummy modo ferretero: usan plantillas ferreteras. */
function ferreteroProjectsForTenant(tenantId: string): Project[] {
  const primaryOu = tenantId === 'tenant-1' ? 'ou-2' : 'ou-7';
  const base = {
    tenantId,
    primaryOrgUnitId: primaryOu,
    owner: 'María García',
    ownerId: 'user-1',
    members: [{ userId: 'user-1', role: 'Líder' }, { userId: 'user-2', role: 'Miembro' }],
    tags: [] as string[],
    filesMeta: [],
    activity: [
      { id: 'act-f1', type: 'CREATED' as const, timestamp: now, userId: 'user-1', userName: 'María García', details: {} }
    ],
    createdBy: 'user-1',
    createdByName: 'María García',
    createdAt: addDays(now, -14),
    lastUpdatedAt: now,
    filesCount: 0,
    activityCount: 1
  };
  const tpls = FERRETERO_PROJECT_TEMPLATES;
  return [
    {
      ...base,
      id: 'fproj-1',
      name: 'Recepción y acomodo – Tienda Centro',
      description: tpls[0].description ?? '',
      status: 'Activo',
      priority: 'Alta',
      startDate: addDays(now, -7),
      dueDate: addDays(now, 14),
      clientArea: 'Bodega',
      milestones: [],
      templateId: tpls[0].id,
      templateTasksGenerated: true,
      kpis: { completadas: 2, total: 4, vencidas: 0 }
    },
    {
      ...base,
      id: 'fproj-2',
      name: 'Reabasto – Ferretería Norte',
      description: tpls[1].description ?? '',
      status: 'Activo',
      priority: 'Media',
      startDate: addDays(now, -3),
      dueDate: addDays(now, 10),
      clientArea: 'Compras',
      milestones: [],
      templateId: tpls[1].id,
      templateTasksGenerated: true,
      kpis: { completadas: 1, total: 3, vencidas: 0 }
    },
    {
      ...base,
      id: 'fproj-3',
      name: 'Inventario y 5S – Semana 7',
      description: tpls[2].description ?? '',
      status: 'En curso',
      priority: 'Media',
      startDate: addDays(now, -2),
      dueDate: addDays(now, 5),
      clientArea: 'Bodega',
      milestones: [],
      templateId: tpls[2].id,
      templateTasksGenerated: true,
      kpis: { completadas: 0, total: 4, vencidas: 1 }
    },
    {
      ...base,
      id: 'fproj-4',
      name: 'Garantías – Cliente 4452',
      description: tpls[3].description ?? '',
      status: 'Activo',
      priority: 'Alta',
      startDate: addDays(now, -5),
      dueDate: addDays(now, 2),
      clientArea: 'Garantías',
      milestones: [],
      templateId: tpls[3].id,
      templateTasksGenerated: true,
      kpis: { completadas: 1, total: 3, vencidas: 0 }
    },
    {
      ...base,
      id: 'fproj-5',
      name: 'Cambio de promoción – Zona entrada',
      description: tpls[4].description ?? '',
      status: 'Activo',
      priority: 'Baja',
      startDate: addDays(now, -1),
      dueDate: addDays(now, 3),
      clientArea: 'Exhibición',
      milestones: [],
      templateId: tpls[4].id,
      templateTasksGenerated: true,
      kpis: { completadas: 1, total: 2, vencidas: 0 }
    },
    {
      ...base,
      id: 'fproj-6',
      name: 'Mantenimiento mensual – Febrero',
      description: tpls[5].description ?? '',
      status: 'En curso',
      priority: 'Alta',
      startDate: addDays(now, -1),
      dueDate: addDays(now, 7),
      clientArea: 'Mantenimiento',
      milestones: [],
      templateId: tpls[5].id,
      templateTasksGenerated: true,
      kpis: { completadas: 0, total: 1, vencidas: 0 }
    }
  ];
}

export function getInitialProjects(tenantId: string, mode?: SystemMode): Project[] {
  if (mode === 'ferretero') return ferreteroProjectsForTenant(tenantId);
  const byTenant: Record<string, Project[]> = {
    'tenant-1': [
      {
        id: 'proj-1',
        tenantId: 'tenant-1',
        primaryOrgUnitId: 'ou-1',
        name: 'Mejora Continua 2024',
        description: 'Proyecto de mejora de procesos',
        owner: 'María García',
        ownerId: 'user-1',
        status: 'Activo',
        members: [{ userId: 'user-1', role: 'Líder' }, { userId: 'user-3', role: 'Miembro' }],
        tags: ['ISO 9001', 'Calidad'],
        priority: 'Alta',
        startDate: addDays(now, -30),
        dueDate: addDays(now, 60),
        clientArea: 'Operaciones',
        filesMeta: [],
        milestones: [
          { id: 'm1', title: 'Fase 1: Diagnóstico', status: 'completed', dueDate: addDays(now, -14) },
          { id: 'm2', title: 'Fase 2: Implementación', status: 'in-progress', dueDate: addDays(now, 30) },
          { id: 'm3', title: 'Fase 3: Validación', status: 'pending', dueDate: addDays(now, 60) }
        ],
        activity: [
          createActivityEntry('CREATED', 'user-1', 'María García', { name: 'Mejora Continua 2024' })
        ],
        createdBy: 'user-1',
        createdByName: 'María García',
        createdAt: addDays(now, -30),
        lastUpdatedAt: now,
        kpis: { completadas: 12, total: 20, vencidas: 2 },
        filesCount: 15,
        activityCount: 42
      },
      {
        id: 'proj-2',
        tenantId: 'tenant-1',
        primaryOrgUnitId: 'ou-1',
        name: 'Digitalización Logística',
        description: 'Automatización de procesos logísticos',
        owner: 'Carlos López',
        ownerId: 'user-2',
        status: 'En curso',
        members: [{ userId: 'user-2', role: 'Líder' }, { userId: 'user-4', role: 'Miembro' }],
        tags: ['Logística', 'Digital'],
        priority: 'Media',
        startDate: addDays(now, -14),
        dueDate: addDays(now, 90),
        clientArea: 'Logística',
        filesMeta: [],
        milestones: [],
        activity: [
          createActivityEntry('CREATED', 'user-2', 'Carlos López', { name: 'Digitalización Logística' })
        ],
        createdBy: 'user-2',
        createdByName: 'Carlos López',
        createdAt: addDays(now, -14),
        lastUpdatedAt: now,
        kpis: { completadas: 5, total: 10, vencidas: 1 },
        filesCount: 8,
        activityCount: 18
      }
    ],
    'tenant-2': [
      {
        id: 'proj-3',
        tenantId: 'tenant-2',
        name: 'Expansión Región Sur',
        description: 'Apertura de nuevas tiendas',
        owner: 'María García',
        ownerId: 'user-1',
        status: 'Activo',
        members: [{ userId: 'user-1', role: 'Líder' }, { userId: 'user-4', role: 'Miembro' }],
        tags: ['Expansión', 'Retail'],
        priority: 'Alta',
        startDate: addDays(now, -7),
        dueDate: addDays(now, 120),
        clientArea: 'Comercial',
        primaryOrgUnitId: 'ou-6',
        filesMeta: [],
        milestones: [],
        activity: [
          createActivityEntry('CREATED', 'user-1', 'María García', { name: 'Expansión Región Sur' })
        ],
        createdBy: 'user-1',
        createdByName: 'María García',
        createdAt: addDays(now, -7),
        lastUpdatedAt: now,
        kpis: { completadas: 2, total: 8, vencidas: 0 },
        filesCount: 3,
        activityCount: 5
      }
    ]
  };
  return byTenant[tenantId] ?? [];
}
