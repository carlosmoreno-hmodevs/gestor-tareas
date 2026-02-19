# Modos de sistema por tenant

El gestor soporta dos modos de operación por tenant: **Normal** (genérico) y **Ferretero** (perfil ferretería). El modo no añade módulos ERP/POS/inventarios; solo cambia lenguaje, catálogos, plantillas y KPIs derivados del core.

## Normal vs Ferretero

| Aspecto | Normal | Ferretero |
|--------|--------|-----------|
| **Experiencia** | Genérica: tareas, proyectos, catálogos y tablero estándar. | Vocabulario y presets orientados a operación ferretera. |
| **Catálogos** | Editables en Admin (categorías, prioridades, equipos). | Precargados y **bloqueados** en Admin para mantener estándar. |
| **Plantillas** | No hay selector de plantillas. | Selector "Template (opcional)" en Nueva tarea que prellena título, categoría, checklist y evidencia. |
| **Tablero** | KPIs: Pendientes, Por vencer, Vencidas, Completadas. | Mismos datos + etiquetas ferreteras (Fuera de plazo, Bloqueadas) y card extra "Bloqueadas" (En espera). |
| **Etiquetas UI** | Responsable, Evidencia, Prioridad, En espera, Liberada, Vencida. | Encargado, Foto/Comprobante, Urgencia, Bloqueada, Validada por supervisor, Fuera de plazo. |

## Qué se bloquea en modo Ferretero

- **Bloqueado (solo lectura en Admin):**
  - Agregar / Editar / Eliminar en **Categorías**, **Prioridades** y **Equipos**.
  - Tooltip: "Bloqueado en modo ferretero para mantener estándar".

- **Sigue configurable:**
  - Usuarios, roles, membresías por sucursal/equipo.
  - Umbrales de alertas (24/48/72 h), reglas de notificación.
  - Escalamiento y horarios (según implementación).

## Persistencia y quién puede cambiar el modo

- **Persistencia:** Por tenant en `localStorage` bajo la clave `gestor-tareas:snapshot:settings.{tenantId}`.
- **Valor por defecto:** Si no existe configuración para un tenant, el modo es **Normal** (nunca se asume Ferretero).
- **Quién puede cambiar el modo:** Solo usuarios con rol **OWNER** o **TENANT_ADMIN** (globalRole), desde **Admin > Sistema**.

## Plantillas de tarea (modo Ferretero)

Disponibles en **Nueva tarea** cuando el tenant está en modo Ferretero:

1. **Recepción de mercancía** – Checklist: factura, conteo, daños, faltantes, acomodo. Evidencia: foto mercancía/factura.
2. **Pedido a proveedor** – Checklist: cotizar, autorizar, ordenar, confirmar, recibir. Evidencia: orden/confirmación.
3. **Inventario cíclico por pasillo** – Checklist: conteo, diferencias, ajuste, reporte.
4. **Etiquetado y corrección de precios** – Checklist: revisar lista, imprimir, colocar, verificar. Evidencia: foto antes/después.
5. **Surtido / preparación de pedido** – Checklist: recolectar, validar, empaquetar.
6. **Garantía / devolución** – Checklist: diagnóstico, evidencia, contacto, resolución, cierre.
7. **Cambio de exhibición / promo** – Checklist: retirar, colocar, señalización, precios, verificación.
8. **Mantenimiento preventivo** – Checklist: revisión, limpieza, ajustes, seguridad.

Al elegir una plantilla se prellenan: título (plantilla), categoría/área, descripción narrativa (descripción + evidencia + nota de control) y **checklist nativo** (ver abajo).

### Checklist nativo

En modo Ferretero, las tareas pueden tener un **checklist tildable** separado de la descripción:

- **Modelo:** `TaskChecklistItem` (id, text, isDone, doneAt, doneByUserId); `Task.checklist?: TaskChecklistItem[]`.
- **TaskTemplate:** `descriptionText` (texto narrativo), `checklistItems: string[]`, `evidenceHint`, `controlNotes`. El checklist NO se mete en descripción.
- **Nueva tarea:** Al elegir template, descripción recibe solo descriptionText + evidencia + nota. El checklist se crea como `TaskChecklistItem[]` nativos. Toggle "Incluir checklist" (default ON si el template lo tiene).
- **Detalle de tarea:** Sección "Checklist" con checkboxes tildables; progreso "X/Y completados"; persistencia vía `TaskService.updateTask`.
- **Compatibilidad:** Tareas antiguas con bullets en descripción siguen funcionando; no se migran.

## Plantillas de proyecto (modo Ferretero)

En modo Ferretero existe también **Plantillas de proyecto** (Project Templates), que prellenan el proyecto y permiten generar un esqueleto de tareas basado en los Task Templates existentes.

### Dónde se usan

- **Crear proyecto:** Card "Plantilla (opcional)" con selector de ProjectTemplate. Al elegir una, se prellenan nombre, descripción y opcionalmente imagen. Checkbox "Generar tareas sugeridas al guardar" (por defecto activado). Vista previa de tareas que se crearían.
- **Detalle de proyecto:** Si el proyecto tiene `templateId`, se muestra la card "Plantilla aplicada" con el nombre. Sección "Esqueleto de tareas" con lista de tareas generadas desde la plantilla, conteos (total, completadas, vencidas, bloqueadas) y enlace a cada tarea. Si aún no se generaron tareas, botón "Generar tareas del template".

### Cómo generan tareas

1. Al guardar un proyecto con plantilla y tareas seleccionadas en el Builder, se crean con `createTasksFromBuilder`.
2. Cada tarea lleva `projectId`, `templateId` (TaskTemplate), `generatedFromProjectTemplateId`, `checklist` nativo.
3. **Auto-linking:** Las tareas creadas desde el Builder se enlazan automáticamente con `BLOCKS` secuencial (tarea[i] bloquea tarea[i+1]), respetando el orden final del Builder.
4. El owner del proyecto se asigna como responsable por defecto; las tareas heredan `orgUnitId`.
5. En Detalle de proyecto, cada tarea muestra "bloquea a X" / "bloqueada por Y" según sus TaskLinks.
6. Si no se usó el Builder (fallback), el botón "Generar tareas del template" crea tareas desde `generateTasksFromProjectTemplate` con links secuenciales.

### Plantillas iniciales (6)

1. **Recepción de proveedor (operación completa)** – Recepción de mercancía, Etiquetado y precios, Exhibición, Inventario cíclico.
2. **Reabasto / Pedido a proveedor** – Pedido a proveedor, Recepción de mercancía, Inventario cíclico.
3. **Inventario y orden (5S semanal)** – Inventario cíclico, Mantenimiento preventivo, Exhibición, Etiquetado y precios.
4. **Garantías y devoluciones** – Garantía/devolución, Surtido/preparación, Mantenimiento.
5. **Cambio de promoción / exhibición** – Cambio de exhibición/promo, Etiquetado y precios.
6. **Mantenimiento y seguridad mensual** – Mantenimiento preventivo, Inventario cíclico.

Las plantillas de proyecto **no son editables** por ahora (igual que Task Templates). En modo Normal, la UI de Crear proyecto y Detalle de proyecto permanece igual; no se muestra selector ni cards de plantilla.

## KPIs implementados (Tablero)

- **Fuente de datos:** Mismo core (tareas del tenant, estados, fechas).
- **En modo Normal:** Pendientes, Por vencer, Vencidas, Completadas; gráficos por estado, prioridad, responsable.
- **En modo Ferretero:** Mismas métricas con etiquetas ferreteras; además se muestra el card **Bloqueadas** (tareas en estado *En espera*), con sublabel "Proveedor / autorización / factura".
- **Fórmula Fuera de plazo:** `estado efectivo === 'Vencida'` o `riskIndicator === 'vencida'` (fecha límite &lt; hoy).
- **Tiempo de ciclo (futuro):** Campo opcional `liberatedAt` en Task; se puede usar para "Creación → Liberación/Validación".

## Campos opcionales en Task (modo Ferretero)

Sin romper tareas existentes; por defecto `undefined`:

- `blockedReason?: string` – Motivo de bloqueo (En espera).
- `correctedReason?: string` – Motivo de corrección (no liberada).
- `liberatedAt?: string` – Fecha en que pasó a Liberada/Validada (para tiempo de ciclo).

## Cambio de modo

- **Normal → Ferretero:** Se aplican presets (categorías ferreteras se agregan al snapshot del tenant si no existían); UI, etiquetas y tablero pasan a vista ferretera.
- **Ferretero → Normal:** No se borran datos; solo se vuelve a etiquetas y tablero normales y se rehabilita la edición de catálogos en Admin.
- No debe crashear si el tenant ya tiene datos previos.
