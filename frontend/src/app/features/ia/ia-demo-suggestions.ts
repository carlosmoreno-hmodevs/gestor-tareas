/** Frases demo del asistente: filtrado por texto; la acción real se resuelve por `id` en `IaComponent`. */
export type IaDemoKind = 'consulta' | 'accion';

export interface IaDemoSuggestion {
  id: string;
  /** Texto que se coloca en el campo al elegir la sugerencia */
  preview: string;
  /** Palabras extra para que coincida al escribir (sinónimos, nombres, etc.) */
  matchHints: string;
  kind: IaDemoKind;
  icon: string;
}

export const IA_DEMO_SUGGESTIONS: IaDemoSuggestion[] = [
  {
    id: 'tasks-assignee-maria',
    preview: '¿Qué tareas tiene asignadas Maria?',
    matchHints: 'maria responsable asignadas lista tareas persona',
    kind: 'consulta',
    icon: 'person_search'
  },
  {
    id: 'tasks-assignee-carlos',
    preview: 'Muéstrame el resumen de carga de Carlos (pendientes y en progreso)',
    matchHints: 'carlos supervisor trabajo carga',
    kind: 'consulta',
    icon: 'summarize'
  },
  {
    id: 'overdue-list',
    preview: 'Lista las tareas vencidas con título y responsable',
    matchHints: 'vencidas atrasadas overdue morosas',
    kind: 'consulta',
    icon: 'warning'
  },
  {
    id: 'projects-active',
    preview: '¿Cuántos proyectos activos o en curso hay ahora?',
    matchHints: 'proyectos iniciativas contar estado activo',
    kind: 'consulta',
    icon: 'folder_open'
  },
  {
    id: 'board-snapshot',
    preview: 'Dame un snapshot del tablero: pendientes, en progreso y en espera',
    matchHints: 'tablero estados resumen kpis',
    kind: 'consulta',
    icon: 'dashboard'
  },
  {
    id: 'workload-top',
    preview: '¿Quién tiene más tareas abiertas? Top 5 responsables',
    matchHints: 'ranking carga equipo prioridad',
    kind: 'consulta',
    icon: 'leaderboard'
  },
  {
    id: 'create-task-urgent-inventory',
    preview: 'Crea una tarea urgente de revisión de inventario para Felipe',
    matchHints: 'crear alta prioridad inventarios felipe',
    kind: 'accion',
    icon: 'add_task'
  },
  {
    id: 'create-task-acme',
    preview: 'Registrar tarea de seguimiento con cliente ACME, prioridad media',
    matchHints: 'nueva tarea cliente comercial seguimiento',
    kind: 'accion',
    icon: 'task_alt'
  },
  {
    id: 'create-project-pilot',
    preview: 'Crear proyecto piloto Optimización de surtido con Karen como líder',
    matchHints: 'proyecto iniciativa piloto karen logística',
    kind: 'accion',
    icon: 'rocket_launch'
  },
  {
    id: 'create-task-alignment',
    preview: 'Agendar bloque: reunión de alineación con operaciones (prioridad alta)',
    matchHints: 'reunión coordinación operaciones agenda',
    kind: 'accion',
    icon: 'event'
  }
];
