# Dashboard Ferretero – KPIs y fórmulas

Este documento describe los KPIs del **Tablero en modo Ferretero**, sus fórmulas y el alcance de los datos (tenant + org scope). Solo se usa datos del frontend (dummy + TaskService/ProjectService + snapshots); no hay backend.

## Alcance de datos

- **Tenant**: solo tareas del tenant actual (`TenantContextService`).
- **Org**: si hay unidad organizativa seleccionada (contexto ≠ "Todos"), se incluyen esa unidad y sus descendientes (`OrgService.getScopeOrgUnitIds`). El filtrado lo aplica ya `TaskService.tasks()`.
- **Modo**: el dashboard ferretero solo se muestra cuando `TenantSettingsService.isFerretero()` es verdadero. En modo Normal el tablero no cambia.

### Filtro por período

El selector “Período” (Últimos 7 / 30 / 90 días) aplica un **filtro por fecha límite**:

- Solo se consideran tareas cuya **dueDate** (fecha límite) está en el rango **[now − periodDays, now + periodDays]**.
- Ejemplo: “Últimos 7 días” → ventana de 7 días hacia atrás y 7 días hacia delante desde hoy.
- El tablero sincroniza el valor con `FerreteroKpiService.setPeriodDays()`. Todos los KPIs y gráficos usan este subconjunto de tareas.

## Conjuntos de estado usados

- **ACTIVE_STATES**: Pendiente, En Progreso, En Espera, Rechazada (tareas que cuentan como “activas” para backlog).
- **DONE_STATES**: Liberada, Completada (consideradas terminadas para preventivos y vencimiento).
- **OVERDUE_EXEMPT**: Completada, Liberada, Cancelada, Rechazada (no se consideran vencidas por fecha).
- **Vencida**: estado efectivo cuando `dueDate < hoy` y la tarea no está en DONE_STATES ni Cancelada (o estado explícito `Vencida`).

## Fórmulas por KPI

### 1) % Fuera de plazo (Vencidas / Fuera de plazo)

- **overdueCount**: tareas tales que `effectiveStatus === 'Vencida'` O (`dueDate < hoy` Y estado ∉ DONE_STATES y ≠ Cancelada).
- **totalActive**: tareas con estado en ACTIVE_STATES o estado `Vencida`, excluyendo Cancelada.
- **overduePct** = `overdueCount / max(totalActive, 1)` (en %: × 100 para mostrar).

### 2) Tareas por vencer (24h / 48h / 72h)

- Ventanas **independientes** (no acumulativas):
  - **dueSoon24**: estado no en {Completada, Liberada, Cancelada} y `0 ≤ (dueDate − now) ≤ 24` horas.
  - **dueSoon48**: mismo criterio de estado y `24 < (dueDate − now) ≤ 48` horas.
  - **dueSoon72**: mismo criterio y `48 < (dueDate − now) ≤ 72` horas.
- Fecha límite: `dueDate` (fecha límite de la tarea).

### 3) Backlog activo por área/categoría

- **backlogTasks**: tareas con estado en ACTIVE_STATES o `Vencida`, excluyendo Cancelada.
- Se agrupa por `categoryName` (o categoría del catálogo por `categoryId`).
- **backlogByArea**: conteo por área; se toma **top 5** y se colorean con el color de la categoría en el catálogo.

### 4) Bloqueadas (En espera)

- **blockedCount**: tareas con `status === 'En Espera'`.
- **topBlockedReasons**: agrupación por `blockedReason` (fallback `"Sin motivo"`), ordenado por cantidad descendente, top 5.
- **avgBlockedTimeHours**: para tareas con `status === 'En Espera'` y `blockedAt` definido, se calcula la duración en horas como `(unblockedAt ?? now) − blockedAt`; el promedio de esas duraciones se muestra en la card. Si ninguna tarea bloqueada tiene `blockedAt`, se muestra **N/A**.

### 5) No liberadas (Rechazadas)

- **rejectedCount**: tareas con `status === 'Rechazada'`.
- **totalReviewed**: tareas en Completada + Rechazada + Liberada (las que “llegaron a revisión”).
- **rejectedPct** = `rejectedCount / max(totalReviewed, 1)` (en %: × 100).
- **topRejectedReasons**: agrupación por `correctedReason` (fallback `"Sin motivo"`), top 5.

### 6) Preventivos (Mantenimiento)

- **preventiveTasks**: tareas con `categoryId === 'fcat-mantenimiento'`.
- **preventiveDone**: preventivas con estado en DONE_STATES.
- **preventiveOverdue**: preventivas que cumplen la condición de vencidas (dueDate < hoy y no finalizadas).
- **preventiveTotal**: total de tareas preventivas. En la UI se muestra “Liberadas vs total” y “Vencidas: X”.

### 7) Cumplimiento de checklists

- **checklistItemsTotal**: suma de `checklist.length` (o ítems) de todas las tareas.
- **checklistItemsDone**: suma de ítems con `isDone === true`.
- **checklistCompletionPct** = `checklistItemsDone / max(checklistItemsTotal, 1)` (× 100 para %).
- Si no hay ningún ítem de checklist en el scope: se muestra “Sin checklists aún” y el valor puede mostrarse como “—” (card se mantiene).

### 8) Tiempo promedio bloqueada

- Para cada tarea con `status === 'En Espera'` y `blockedAt` definido: duración = `(unblockedAt ?? now) − blockedAt` en horas. **avgBlockedTimeHours** = media de esas duraciones. Si no hay ninguna con `blockedAt`, se muestra **N/A**.

## Secciones del dashboard (modo Ferretero)

1. **Hoy / Riesgo**: cards clicables (Fuera de plazo, Por vencer 24h/48h/72h, Bloqueadas, No liberadas) con tooltip “¿Qué significa?” y enlace a `/tareas` con filtros (`status`, `due`, `category`).
2. **Carga por área**: gráfico de barras horizontal “Backlog activo por categoría” (top 5).
3. **Visualizaciones**: varios gráficos (ver lista más abajo).
4. **Calidad / Preventivos / Rutinas**: cards Preventivos (clicable), Cumplimiento checklists, Tiempo promedio bloqueada; tablas “Top motivos Bloqueada” y “Top motivos Rechazada”.

## Gráficos del dashboard ferretero

| Gráfico | Descripción |
|--------|-------------|
| **Backlog activo por categoría** | Barras horizontales: top 5 áreas por conteo de tareas en backlog (ACTIVE_STATES + Vencida). |
| **Distribución por estado** | Donut: conteo por estado efectivo (Pendiente, En Progreso, En Espera, Vencida, Completada, Liberada, Rechazada, Cancelada) dentro del scope y período. |
| **Riesgo por vencimiento** | Barras horizontales: 5 buckets (Fuera de plazo, 0–24h, 24–48h, 48–72h, >72h). Misma definición que las cards (ventanas independientes). |
| **Tendencia (últimos 7 días)** | Línea: por cada día, “Liberadas/completadas” (tareas con `liberatedAt` en ese día) y “Vencidas (por día)” (tareas con dueDate en ese día y ya vencidas). |
| **Rechazadas por categoría** | Barras horizontales: top 5 categorías por conteo de tareas con estado Rechazada. Si no hay rechazadas, mensaje “Sin tareas rechazadas en el período”. |
| **Motivos de bloqueo** | Donut: top motivos (`blockedReason`) de tareas En espera. Si no hay bloqueadas, mensaje “Sin tareas bloqueadas”. |

## Servicio y componentes

- **FerreteroKpiService** (`core/services/ferretero-kpi.service.ts`): calcula todo en un único `computed` a partir de `TaskService.tasks()` (ya filtradas por tenant y org), aplicando además el filtro por período (`dueDate` en rango). Expone `kpiState()`, `riskSummaryCards()`, `periodDays` y `setPeriodDays(days)`.
- **Tablero**: si `isFerretero()` es falso, se muestra el dashboard Normal sin cambios; si es verdadero, sincroniza el período con el servicio y muestra el layout ferretero (cards clicables con tooltips, 4+ gráficos, tablas de motivos).

## Offline

El dashboard sigue usando las mismas tareas que el resto de la app; si se usa `OfflineSnapshotService`, las tareas provienen del snapshot y los KPIs se calculan sobre ese conjunto sin cambios adicionales.
