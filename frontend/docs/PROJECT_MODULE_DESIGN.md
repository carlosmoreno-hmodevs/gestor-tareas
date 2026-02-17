# Proyecto: Módulo de Proyectos - Diseño

## 1. Estructura de componentes (Project Detail)

```
ProjectDetailComponent (container)
├── ProjectDetailHeaderComponent
│   - Imagen (avatar/cover), título, chips (cliente/status/due), owner
│   - Botón "+ Add Task", menú acciones (⋯)
├── ProjectDetailKpisComponent
│   - Cards: In Progress | Overdue | Completed | Progress %
├── mat-tab-group
│   ├── OverviewTabComponent
│   │   ├── Card "Description" (o empty state)
│   │   ├── Card "Team Members" (avatars)
│   │   ├── Card "Milestones" (lista dummy)
│   │   ├── Card "Key Dates"
│   │   ├── Card "Recent Activity" (5 items)
│   │   └── Card "AI Suggestions" (mock)
│   ├── TasksTabComponent
│   │   - Tabla/lista tareas, filtros, Add Task
│   ├── FilesTabComponent
│   │   - Lista archivos, upload mock
│   └── ActivityTabComponent
│       - Timeline de actividad
```

## 2. Modelo Project y KPIs

### Modelo extendido

```ts
ProjectStatus = 'Activo' | 'En curso' | 'En pausa' | 'Cerrado'
ProjectPriority = 'Alta' | 'Media' | 'Baja'

ProjectImageMeta { name, size, type, previewUrl }
ProjectFileMeta { id, name, size, type?, uploadedAt, uploadedBy, uploadedById? }
ProjectActivityType = 'CREATED' | 'TASK_ADDED' | 'TASK_COMPLETED' | ...
ProjectActivityEntry { id, type, timestamp, userId, userName, details }
Milestone { id, title, status, dueDate }
```

### Cálculo de KPIs (ProjectService.computeKPIs)

- **tasksInProgress**: tareas con status ∈ {Pendiente, En Progreso, En Espera} y NO vencidas
- **tasksOverdue**: tareas vencidas (effectiveStatus === 'Vencida')
- **completedTasks**: status ∈ {Completada, Liberada}
- **totalTasks**: total de tareas del proyecto
- **progressPercent**: (completedTasks / totalTasks) * 100, 0 si totalTasks === 0

KPIs se calculan en tiempo real desde TaskService al mostrar el proyecto.
