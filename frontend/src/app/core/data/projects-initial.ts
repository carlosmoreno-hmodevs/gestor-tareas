import type { Project } from '../../shared/models';

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

export function getInitialProjects(): Project[] {
  return [
    {
      id: 'proj-1',
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
  ];
}
