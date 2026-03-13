# Gestor de Tareas - Estado del Sistema Implementado

Documento de referencia del estado actual del sistema, con enfoque funcional y técnico.

## 1) Resumen ejecutivo

El sistema es una SPA en Angular orientada a gestion operativa de tareas y proyectos, con soporte multi-tenant, contexto organizacional, modo especializado ferretero, automatizaciones y funcionamiento offline basico mediante snapshots locales.

Actualmente incluye:

- modulo de tareas completo (lista, kanban, detalle, workflow, relaciones, checklist),
- modulo de proyectos (lista, creacion, detalle con KPIs y metricas),
- modulo de administracion (usuarios, roles, catalogos, organizacion, automatizaciones, sistema),
- tablero operativo/ferretero con KPIs y graficas,
- layout responsive con navegacion desktop/mobile.

---

## 2) Arquitectura general

### Stack principal

- **Framework:** Angular (standalone components)
- **UI:** Angular Material
- **Graficas:** `ng2-charts` + Chart.js
- **PWA:** Service Worker habilitado en produccion
- **Estado reactivo:** Signals (`signal`, `computed`, `effect`)
- **Persistencia local:** `localStorage` (contexto, snapshots, settings)

### Estructura de arranque

- `src/main.ts`
- `src/app/app.config.ts`
- `src/app/app.routes.ts`

Puntos clave:

- inicializacion de tenant por defecto si no existe uno guardado,
- enrutamiento por `loadComponent` (lazy),
- layout global en `ShellComponent`,
- guardas para tenant y admin.

---

## 3) Modulos y secciones funcionales

## Tablero

Ruta: `/tablero`  
Archivo principal: `src/app/features/tablero/tablero.component.ts`

Incluye:

- KPIs operativos y ferreteros,
- filtro de periodo,
- seccion Hoy/Riesgo,
- visualizaciones por estado, riesgo y carga.

## Tareas

Rutas principales:

- `/tareas`
- `/tareas/nueva`
- `/tareas/:id`

Archivos clave:

- `src/app/features/tareas/task-list/task-list.component.ts`
- `src/app/features/tareas/task-create/task-create.component.ts`
- `src/app/features/tareas/task-detail/task-detail.component.ts`

Incluye:

- vista lista/kanban,
- filtros, orden, exportacion,
- transiciones de estado,
- checklist y adjuntos,
- relaciones entre tareas (bloqueos, duplicados, subtareas).

## Proyectos

Rutas:

- `/proyectos`
- `/proyectos/nueva`
- `/proyectos/:id`

Archivos clave:

- `src/app/features/proyectos/project-create/project-create.component.ts`
- `src/app/features/proyectos/project-detail/project-detail.component.ts`

Incluye:

- creacion de iniciativas/proyectos,
- vinculacion y generacion de tareas,
- KPIs de proyecto,
- overview enriquecido con equipo y distribucion,
- pestaña de metricas con graficas del proyecto.

### Cambios recientes en detalle de proyecto

- Tabs en espanol: **Resumen, Tareas, Archivos, Metricas**.
- Seccion **Equipo** ampliada con:
  - nombre,
  - puesto,
  - liberadas/total por persona,
  - porcentaje de efectividad y color por nivel.
- Pestaña **Metricas** reemplaza actividad duplicada e incluye:
  - progreso del proyecto,
  - dona por estado (solo tareas del proyecto),
  - barras concluidas vs vencidas.

## Administracion

Ruta base: `/admin`  
Archivo de layout: `src/app/features/admin/admin-layout/admin-layout.component.ts`

Submodulos:

- usuarios,
- roles,
- catalogos,
- organizacion,
- reglas/automatizaciones,
- sistema (modo normal/ferretero).

## Otros

- `/documentos`: repositorio visual de archivos/evidencias.
- `/ia`: modulo IA (estado mock).
- `/offline`: vista de conectividad.
- `/select-tenant`: seleccion de tenant.

---

## 4) Servicios core (logica principal)

## Contexto y alcance

- `TenantContextService`: tenant actual y membresias.
- `OrgService`: unidad organizacional seleccionada y alcance.
- `TenantSettingsService`: modo `normal` o `ferretero`.

## Dominio funcional

- `TaskService`: estado y operaciones de tareas, relaciones y snapshots.
- `TaskWorkflowService`: reglas de transicion y estado efectivo (ej. vencida).
- `ProjectService`: operaciones de proyecto, KPIs y actividad.
- `AdminService`: usuarios, roles, catalogos y presets.

## Soporte transversal

- `ConnectivityService`: estado online/offline.
- `OfflineSnapshotService`: persistencia local por tenant/modo.
- `AutomationService`: ejecucion de automatizaciones y tareas recurrentes.
- `UiCopyService`: etiquetas segun modo (normal/ferretero).
- `ThemeService`: modo claro/oscuro.

---

## 5) Modelos de datos principales

Ubicacion: `src/app/shared/models`

- `task.model.ts`
- `project.model.ts`
- `user.model.ts`
- `admin.model.ts`
- `tenant.model.ts`
- `org.model.ts`
- `tenant-settings.model.ts`
- `automation.model.ts`
- `reason-catalog.model.ts`

Destacan:

- soporte de estados completos (`Pendiente`, `En Progreso`, `En Espera`, `Completada`, `Liberada`, `Rechazada`, `Vencida`, `Cancelada`),
- estructura de historico de cambios,
- motivos tipados de bloqueo/rechazo,
- miembros de proyecto y actividad del proyecto.

---

## 6) Flujo de datos y persistencia

1. Se resuelve tenant/org/modo.
2. Se cargan datos iniciales por tenant+modo.
3. Si existe snapshot local, se hidrata desde `localStorage`.
4. La UI se alimenta por `computed` reactivos.
5. Cambios de tareas/proyectos se persisten localmente (si aplica).
6. Automatizaciones pueden inyectar tareas de forma programada.

Notas:

- no hay backend productivo conectado en esta version,
- gran parte de la persistencia es local (modo demo robusto).

---

## 7) Modo Normal vs Modo Ferretero

El modo de sistema altera:

- terminologia y labels visibles,
- KPIs y tableros presentados,
- catalogos y presets cargados,
- flujos operativos orientados a ferreteria (bloqueos/rechazos/validaciones).

Referencias:

- `src/app/core/services/tenant-settings.service.ts`
- `src/app/core/services/ferretero-kpi.service.ts`
- `src/app/core/services/ui-copy.service.ts`

---

## 8) Componentes compartidos relevantes

Ubicacion: `src/app/shared/components`

- `page-header`
- `avatar`
- `org-context-bar`
- `offline-banner`
- `task-card`
- `kanban-board`
- `status-chip`
- `priority-pill`

Estos componentes permiten coherencia visual y aceleran construccion de pantallas.

---

## 9) Estado de UX/UI y responsive

Estado actual:

- navegacion inferior en movil,
- header contextual con tenant/unidad,
- cards y tabs adaptadas a pantallas pequenas,
- mejoras recientes para evitar truncados/cortes en tarjetas KPI,
- ajustes de textos largos en selectores de organizacion.

---

## 10) Integracion y despliegue

## Build de GitHub Pages

Comando:

- `npm run build:pages`

Observacion reciente:

- el build estaba fallando por budget de estilos de componente (`anyComponentStyle`) en `project-detail.component.scss`.
- se ajusto budget en `angular.json` para permitir el crecimiento real del componente.

---

## 11) Limitaciones y deuda tecnica visible

- No hay backend/API productiva; estado local-first.
- Modulo IA esta en modo mock.
- Algunas acciones permanecen como placeholder.
- Acoplamiento cruzado entre servicios de tareas/proyectos en ciertas rutas de negocio.
- Aun hay advertencias de tamano de estilos en varios componentes (aunque el build ya puede pasar con budgets ajustados).

---

## 12) Proximos pasos recomendados

1. Definir API backend y estrategia de sincronizacion real.
2. Consolidar budgets y optimizacion de SCSS por componente.
3. Cobertura de pruebas (unitarias e integracion) en features criticas.
4. Telemetria funcional para KPIs de uso y rendimiento.
5. Endurecer manejo offline con reconciliacion de cambios.

---

## 13) Referencias de documentacion existente

En `frontend/docs` ya existen documentos complementarios:

- `AUTOMATIONS.md`
- `DASHBOARD-FERRETERO-KPIS.md`
- `DESIGN-SYSTEM-MODES.md`
- `PROJECT_MODULE_DESIGN.md`
- `DEMO.md`
- `DESIGN-REASON-CATALOG.md`

Este archivo funciona como vista consolidada "estado actual del sistema".
