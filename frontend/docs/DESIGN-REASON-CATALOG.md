# Diseño: Catálogo de motivos (Bloqueo / Rechazo)

## Objetivo

Sustituir el texto libre por defecto en **motivos de bloqueo** y **motivos de rechazo/corrección** por un catálogo seleccionable, con opción "Otro (personalizado)" y detalle opcional. Los motivos son contextuales por tenant, modo (normal/ferretero), categoría y opcionalmente plantilla/proyecto.

## 1. Modelo de datos

### 1.1 Catálogo (`ReasonCatalogItem`)

- **id**: string (uuid o slug)
- **code**: string (ej. `SUPPLIER_CONFIRMATION`, `INVOICE_CLARIFICATION`)
- **label**: string (texto mostrado en UI)
- **kind**: `'blocked' | 'rejected'`
- **systemMode**: `'normal' | 'ferretero' | 'all'`
- **appliesTo** (opcional):
  - **categoryIds**: string[] — si no se define, aplica a todas las categorías
  - **taskTemplateIds**, **projectTemplateIds**, **projectIds**, **orgUnitTypeKeys**: string[]
- **isOther**: boolean — marca el ítem "Otro (personalizado)", que habilita texto libre obligatorio
- **order**: number — orden en el dropdown (Otro al final)

Definido en `frontend/src/app/shared/models/reason-catalog.model.ts`.

### 1.2 Motivo guardado en Task (compatibilidad legacy)

- **blockedReason**: `string | TaskBlockedReason`
  - Objeto: `{ code?, label?, customText?, detail?, source?: 'catalog' | 'custom' | 'legacy' }`
- **rejectedReason**: `TaskRejectedReason` (misma estructura)
- **correctedReason**: string (legacy) — se mantiene para lectura; si existe `rejectedReason`, la UI prioriza este.

Compatibilidad:

- Si el valor antiguo es `string`, en runtime se interpreta como legacy y se muestra tal cual.
- No se migran datos en caliente; solo se interpretan y muestran correctamente.

## 2. Persistencia y administración (por tenant)

- **Clave localStorage**: `gestor-tareas:snapshot:reasons.{tenantId}`
- **AdminService**:
  - `getReasonCatalog(tenantId)`: devuelve ítems del catálogo para el tenant.
  - `upsertReasonCatalogItems(tenantId, items)`: guarda/actualiza ítems.
  - `ensureFerreteroReasonPresets(tenantId)`: si el catálogo está vacío y el tenant es ferretero, persiste los presets de bloqueo y rechazo.

En modo ferretero, los presets se cargan automáticamente la primera vez que se pide el catálogo (seed por tenant).

## 3. Seeds (ferretero)

Definidos en `ferretero-initial.ts`:

- **Bloqueo** (`FERRETERO_REASON_CATALOG_BLOCKED`): SUPPLIER_CONFIRMATION, INVOICE_CLARIFICATION, MISSING_IN_DELIVERY, MANAGER_APPROVAL, CUSTOMER_PENDING_WARRANTY, NO_STOCK_REPLENISH, WAITING_ROUTE, WAITING_SUPERVISOR, OTHER_BLOCKED (isOther).
- **Rechazo** (`FERRETERO_REASON_CATALOG_REJECTED`): MISSING_EVIDENCE, CHECKLIST_INCOMPLETE, COUNT_INCONSISTENT, UNJUSTIFIED_DIFFERENCE, INCOMPLETE_DATA, WRONG_ATTACHMENTS, NOT_STANDARD, PRICE_LABEL_WRONG, OTHER_REJECTED (isOther).

Varios ítems tienen `appliesTo.categoryIds` para restringir por categoría (Compras, Bodega, Entregas, Garantías, Mostrador, etc.).

## 4. UI: Modal Bloquear / Rechazar

- **Componente**: `ReasonDialogComponent` (`features/tareas/reason-dialog/`).
- **Flujo**:
  1. El usuario elige transición "Pausar" (→ En Espera) o "Rechazar" (→ Rechazada).
  2. Se abre el modal con:
     - **Motivo** (requerido): `mat-select` con ítems del catálogo filtrados por contexto.
     - **Detalle** (opcional): texto corto (ej. SKU, proveedor).
     - Si el motivo seleccionado tiene **isOther**, se muestra un campo **Motivo personalizado** (requerido).
  3. Al confirmar se devuelve `blockedReason` o `rejectedReason` con `code`, `label`, `customText` (si es Otro), `detail` y `source`.

**Filtrado contextual** al cargar el modal:

- `systemMode` = modo actual (normal/ferretero) o ítems con `systemMode === 'all'`.
- `kind` = bloqueo o rechazo.
- Si `appliesTo` está definido: se filtra por `categoryId`, `taskTemplateId`, `projectId`, `generatedFromProjectTemplateId` cuando corresponda.
- Orden: más específicos primero, genéricos después, "Otro (personalizado)" al final (por `order`).

Si no hay ítems en el catálogo (modo normal sin configuración), se muestra un único ítem "Otro (personalizado)" para no bloquear la acción.

## 5. Visualización en detalle de tarea

En el header de la tarea (`task-detail-header`):

- **Bloqueo**: se muestra "Motivo de bloqueo: {label o customText o string legacy}". Si existe `detail`, se muestra "Detalle: {detail}".
- **Rechazo**: se muestra "Motivo de rechazo / corrección: {label o customText o correctedReason/rejectionComment legacy}". Si existe `detail`, se muestra "Detalle: {detail}".

Helpers: `blockedReasonText`, `blockedReasonDetail`, `rejectedReasonText`, `rejectedReasonDetail`.

## 6. Dashboard / KPIs (agrupación)

En `FerreteroKpiService`:

- **Agrupación por motivo**:
  - Si la tarea tiene motivo en formato objeto con **code**: se agrupa por `code` y se muestra el **label** (o "Otro" si el code es `OTHER_*`).
  - Si es legacy (string o sin code): se agrupa por texto **normalizado** (trim, minúsculas, sin tildes, espacios colapsados) o en "Sin catalogar".
- Top 5 motivos de bloqueo y Top 5 motivos de rechazo se calculan con esta lógica, manteniendo tenant y período (días) como hasta ahora.

## 7. Restricciones y compatibilidad

- No se rompe el modo normal: si no hay catálogo, se ofrece "Otro (personalizado)".
- Tareas antiguas con motivo en texto libre siguen mostrándose correctamente (legacy).
- La aplicación sigue funcionando sin backend (dummy/localStorage).
- Guards, multitenant y scope se mantienen sin cambios.

## 8. Archivos principales

| Área            | Archivo |
|-----------------|--------|
| Modelo          | `shared/models/reason-catalog.model.ts`, `shared/models/task.model.ts` |
| Seeds           | `core/data/ferretero-initial.ts` |
| Servicios       | `core/services/admin.service.ts`, `core/services/task-workflow.service.ts`, `core/services/task.service.ts`, `core/services/ferretero-kpi.service.ts` |
| UI modal        | `features/tareas/reason-dialog/reason-dialog.component.ts` |
| Integración     | `features/tareas/task-detail/task-detail.component.ts` |
| Header tarea    | `features/tareas/task-detail-header/task-detail-header.component.*` |
| Dummy           | `core/data/dummy-data.ts` |
