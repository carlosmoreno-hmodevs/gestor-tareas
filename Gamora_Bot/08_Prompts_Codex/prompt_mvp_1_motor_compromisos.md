# Prompt MVP 1 — Motor Inicial de Compromisos con PostgreSQL Real

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del prompt

Este prompt instruye a Codex para construir MVP 1 sobre el repositorio técnico existente de Gamora Bot.

MVP 1 debe implementar el motor inicial de compromisos operativos usando PostgreSQL real local como persistencia.

MVP 1 no debe conectar WhatsApp real ni OpenAI real. Tampoco debe implementar todavía Mina Mercedes ni Sunworks.

El objetivo es pasar de una base técnica vacía a un primer motor funcional capaz de:

- crear workspaces;
- crear usuarios demo;
- asociar usuarios a workspaces;
- crear compromisos;
- asignar responsables;
- manejar estados básicos;
- validar transiciones;
- registrar bitácora;
- usar PostgreSQL real;
- ejecutar migraciones Prisma;
- correr seed demo controlado;
- exponer endpoints backend iniciales;
- mantener guardrails mínimos.

## 2. Contexto que debe conocer Codex

Gamora Bot es un motor de compromisos operativos sobre WhatsApp Business.

Principios vigentes:

- WhatsApp será canal operativo, no fuente de verdad.
- Gamora Core es el sistema.
- Web/PWA será la capa formal de control.
- IA interpreta, backend gobierna, humano valida.
- AI & API Guardrails son obligatorios.
- No se leen chats personales.
- No se envían mensajes a usuarios no enrolados.
- Todo compromiso debe pertenecer a un workspace.
- Todo cambio crítico debe quedar en bitácora.
- Todo estado debe cambiar mediante reglas controladas.
- MVP 1 debe usar PostgreSQL real local.
- MVP 1 no debe usar SQLite.
- MVP 1 no debe usar almacenamiento mock para el motor principal.
- MVP 1 no debe conectar OpenAI ni WhatsApp reales.

Estado técnico local:

- Repositorio técnico: `C:\Users\Home\Documents\Gamora_Bot_MVP`
- Base local PostgreSQL: `gamora_bot_dev`
- Usuario local temporal: `postgres`
- Puerto esperado: `5432`
- PostgreSQL 17 instalado.
- No documentar contraseña.
- No subir `.env` real.
- En staging/producción se usará usuario específico con permisos limitados.

## 3. Precondiciones obligatorias antes de ejecutar MVP 1

El prompt de ejecución de MVP 1 deberá validar:

- Existe el repositorio `C:\Users\Home\Documents\Gamora_Bot_MVP`.
- Existe `package.json` raíz.
- `npm.cmd` funciona.
- PostgreSQL 17 está instalado.
- Base `gamora_bot_dev` existe.
- Usuario local temporal `postgres` puede conectarse.
- `.gitignore` incluye `.env`.
- `.env.example` existe.
- No hay credenciales reales versionadas.
- No hay conexión OpenAI real.
- No hay conexión WhatsApp real.

Si falta alguna precondición crítica:

- No avanzar.
- Reportar claramente el problema.
- No inventar éxito.

## 4. Manejo seguro de `.env` local

MVP 1 necesitará `DATABASE_URL` para ejecutar Prisma contra PostgreSQL local.

Reglas:

- `.env` local puede crearse únicamente dentro del repositorio técnico si está incluido en `.gitignore`.
- `.env` no debe subirse a Git.
- `.env` no debe copiarse a Obsidian.
- La contraseña local no debe documentarse.
- La contraseña local no debe imprimirse.
- La contraseña local no debe aparecer en README, logs, pruebas ni resúmenes.
- Codex no debe pedir que Luis Felipe pegue la contraseña en el chat.
- Si se necesita contraseña, Luis Felipe debe capturarla localmente en la terminal o editar `.env` manualmente.

Estrategia recomendada:

1. Verificar que `.env` está en `.gitignore`.
2. Si `.env` no existe, crear una guía local o plantilla segura para que Luis Felipe capture `DATABASE_URL` manualmente.
3. `DATABASE_URL` esperada en formato conceptual:

   `postgresql://postgres:CONTRASENA_LOCAL_PRIVADA@localhost:5432/gamora_bot_dev?schema=public`

4. No registrar la contraseña real.
5. Si `DATABASE_URL` no queda configurada, detener MVP 1 antes de ejecutar migraciones.

## 5. Alcance exacto de MVP 1

MVP 1 debe implementar:

- modelos Prisma iniciales reales;
- migración inicial contra PostgreSQL local;
- seed demo controlado;
- motor inicial de workspaces;
- motor inicial de usuarios;
- relación usuarios-workspaces;
- motor inicial de compromisos;
- estados básicos de compromiso;
- validación de transiciones de estado;
- bitácora funcional básica;
- state transitions;
- guardrails mínimos;
- endpoints REST iniciales;
- actualización de healthcheck para validar conexión DB;
- pruebas automatizadas o validaciones mínimas;
- documentación técnica en README o docs internos del repo.

MVP 1 no debe implementar:

- WhatsApp real;
- OpenAI real;
- envío real de mensajes;
- recepción real de webhooks productivos;
- carga real de archivos/evidencias;
- almacenamiento de media real;
- autenticación final;
- interfaz web completa;
- permisos enterprise complejos;
- Mina Mercedes;
- Sunworks;
- proyectos/hitos avanzados;
- notificaciones reales;
- multi-tenant enterprise avanzado;
- staging;
- producción.

## 6. Modelos Prisma iniciales requeridos

Definir o ajustar Prisma schema con modelos iniciales.

Modelos indispensables MVP 1:

### Workspace

- `id`
- `name`
- `status`
- `timezone` opcional
- `country` opcional
- `createdAt`
- `updatedAt`

### User

- `id`
- `fullName`
- `phoneNumber` opcional
- `email` opcional
- `status`
- `whatsappStatus`
- `createdAt`
- `updatedAt`

### WorkspaceUser

- `id`
- `workspaceId`
- `userId`
- `role`
- `status`
- `createdAt`
- `updatedAt`

### Commitment

- `id`
- `workspaceId`
- `title`
- `description`
- `responsibleUserId`
- `createdByUserId`
- `validatorUserId` opcional
- `unitOrFront` opcional
- `dueAt`
- `expectedEvidence` opcional
- `priority`
- `status`
- `sourceChannel`
- `createdAt`
- `updatedAt`
- `closedAt` opcional
- `canceledAt` opcional

### StateTransition

- `id`
- `workspaceId`
- `objectType`
- `objectId`
- `fromState` opcional
- `toState`
- `changedByUserId` opcional
- `reason` opcional
- `metadataJson` opcional
- `createdAt`

### AuditLog

- `id`
- `workspaceId`
- `actorUserId` opcional
- `action`
- `objectType`
- `objectId`
- `description`
- `metadataJson` opcional
- `createdAt`

### GuardrailEvent

- `id`
- `workspaceId`
- `guardrailType`
- `scopeType`
- `scopeId` opcional
- `status`
- `threshold` opcional
- `currentValue` opcional
- `actionTaken`
- `createdAt`
- `resolvedAt` opcional

### ApiUsageLog

Opcional si ya estaba preparado en MVP 0:

- `id`
- `workspaceId` opcional
- `provider`
- `apiType`
- `unitsUsed`
- `costEstimated` opcional
- `relatedObjectType` opcional
- `relatedObjectId` opcional
- `status`
- `createdAt`

Reglas:

- Usar relaciones Prisma reales.
- Usar `createdAt`/`updatedAt`.
- Usar enums cuando tenga sentido.
- No crear modelos innecesarios fuera del MVP 1.
- No crear todavía `evidences` si no se implementará flujo de evidencia real.
- Si se decide incluir `Evidence` como placeholder, debe quedar sin lógica completa y claramente fuera del flujo principal de MVP 1.

## 7. Enums sugeridos

Incluir enums o equivalentes para:

### WorkspaceStatus

- `ACTIVE`
- `INACTIVE`
- `SUSPENDED`

### UserStatus

- `INVITED`
- `ACTIVE`
- `SUSPENDED`
- `DELETED`

### WhatsappStatus

- `NOT_CONNECTED`
- `ACTIVE`
- `OPTED_OUT`
- `DISABLED`

### WorkspaceRole

- `ADMIN`
- `COORDINATOR`
- `RESPONSIBLE`
- `SUPERVISOR_VALIDATOR`
- `OBSERVER`

### WorkspaceUserStatus

- `ACTIVE`
- `SUSPENDED`
- `REMOVED`

### CommitmentStatus

- `DRAFT`
- `PENDING_ACCEPTANCE`
- `ACCEPTED_IN_PROGRESS`
- `IN_REVIEW`
- `CORRECTION_REQUESTED`
- `REJECTED`
- `APPROVED`
- `CLOSED`
- `CANCELED`
- `SUSPENDED_BY_GUARDRAIL`
- `OVERDUE`

### CommitmentPriority

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

### SourceChannel

- `WEB`
- `WHATSAPP_MOCK`
- `SYSTEM`
- `SEED`

### GuardrailStatus

- `ACTIVE`
- `BLOCKED`
- `RESOLVED`
- `WARNING`

## 8. Reglas de transición de compromisos

Implementar una capa de reglas para cambios de estado.

Transiciones mínimas permitidas:

```text
DRAFT -> PENDING_ACCEPTANCE
PENDING_ACCEPTANCE -> ACCEPTED_IN_PROGRESS
ACCEPTED_IN_PROGRESS -> IN_REVIEW
IN_REVIEW -> APPROVED
IN_REVIEW -> CORRECTION_REQUESTED
IN_REVIEW -> REJECTED
CORRECTION_REQUESTED -> ACCEPTED_IN_PROGRESS
APPROVED -> CLOSED
PENDING_ACCEPTANCE -> CANCELED
ACCEPTED_IN_PROGRESS -> CANCELED
Cualquier estado operativo -> SUSPENDED_BY_GUARDRAIL cuando aplique
```

Reglas:

- No permitir transiciones arbitrarias.
- Toda transición válida debe registrar `StateTransition`.
- Toda transición crítica debe registrar `AuditLog`.
- Si una transición no está permitida, responder error claro.
- Cierre requiere estado `APPROVED` o regla explícita.
- Rechazo/corrección debe incluir motivo.
- `CANCELED` debe registrar motivo.
- No borrar compromisos en MVP 1; usar cancelación lógica.

## 9. Motor inicial de compromisos

Implementar servicio backend para:

- crear compromiso;
- listar compromisos;
- consultar compromiso por id;
- cambiar estado mediante acción controlada;
- asignar responsable;
- registrar quién creó;
- registrar validador si aplica;
- registrar bitácora;
- aplicar validaciones básicas;
- impedir responsable inexistente;
- impedir workspace inexistente;
- impedir cambios fuera del workspace;
- impedir transición inválida.

Reglas mínimas para crear compromiso:

- `workspaceId` obligatorio;
- `title` obligatorio;
- `description` obligatoria;
- `responsibleUserId` obligatorio;
- `createdByUserId` obligatorio;
- `dueAt` obligatorio;
- `responsibleUserId` debe existir;
- `createdByUserId` debe existir;
- ambos deben pertenecer al workspace;
- status inicial recomendado: `PENDING_ACCEPTANCE`;
- `sourceChannel`: `WEB` o `SEED` en MVP 1.

## 10. Endpoints REST iniciales

Implementar endpoints backend bajo `/api`.

### Health

- `GET /health`
- Debe incluir `status ok` y, si es posible, `db status`.

### Workspaces

- `POST /api/workspaces`
- `GET /api/workspaces`
- `GET /api/workspaces/:id`

### Users

- `POST /api/users`
- `GET /api/users`
- `GET /api/users/:id`

### Workspace users

- `POST /api/workspaces/:workspaceId/users`
- `GET /api/workspaces/:workspaceId/users`

### Commitments

- `POST /api/commitments`
- `GET /api/commitments`
- `GET /api/commitments/:id`
- `POST /api/commitments/:id/actions`
- `GET /api/commitments/:id/timeline`

### Audit

- `GET /api/audit?workspaceId=...`

### Guardrails

- `GET /api/guardrails?workspaceId=...`
- `POST /api/guardrails/manual-pause` o endpoint equivalente placeholder si aplica.

Reglas:

- MVP 1 no tendrá autenticación final.
- Temporalmente, acciones críticas podrán recibir `actorUserId` en body o query.
- Documentar claramente que esto es temporal para desarrollo local.
- No exponer endpoints como producción.
- Validar `workspaceId` siempre que aplique.

## 11. Acciones de compromiso

Endpoint sugerido:

`POST /api/commitments/:id/actions`

Body conceptual:

- `action`
- `actorUserId`
- `reason` opcional
- `metadata` opcional

Acciones mínimas:

- `accept`
- `submit_for_review`
- `approve`
- `request_correction`
- `reject`
- `close`
- `cancel`
- `suspend_by_guardrail`

Cada acción debe:

- validar `actorUserId`;
- validar compromiso;
- validar transición;
- actualizar estado;
- registrar `StateTransition`;
- registrar `AuditLog`;
- responder estado actualizado.

## 12. Seed demo controlado

Crear seed demo para desarrollo local.

Datos sugeridos:

### Workspace

- Ferretería Luisito

### Usuarios

- Luisito, rol `COORDINATOR` o `ADMIN`
- Panchito, rol `RESPONSIBLE`
- Rosita, rol `RESPONSIBLE` u `OBSERVER`/`SUPERVISOR_VALIDATOR` según convenga

### Compromisos demo

1. Contar sacos de cemento en sucursal Sur.
2. Corte de caja de mediodía.
3. Revisar inventario de almacén.

Reglas:

- Usar datos ficticios.
- No usar teléfonos reales.
- No usar correos reales, o usar dominios `example.com`.
- No insertar datos personales reales.
- No implementar todavía WhatsApp real.
- No implementar evidencia real.
- Seed debe poder ejecutarse de forma repetible o idempotente si es razonable.

## 13. Guardrails mínimos MVP 1

Implementar o reforzar Guardrails Service placeholder con lógica mínima local.

Debe contemplar:

- `manualPause` boolean o equivalente;
- bloqueo de acciones si workspace está suspendido o guardrail activo;
- registro de `GuardrailEvent` cuando aplique;
- no permitir acciones masivas no controladas;
- no permitir llamadas externas;
- no permitir transición suspendida sin registrar evento;
- dejar preparado logging futuro de consumo.

Reglas:

- MVP 1 no llama APIs de pago, pero ya debe tener puntos de control.
- Ningún flujo futuro debe saltarse Guardrails Service.
- Si guardrail bloquea una acción, debe responder error claro y registrarse si aplica.

## 14. Bitácora y auditoría

Cada operación funcional relevante debe registrar `AuditLog`.

Eventos mínimos:

- workspace creado;
- user creado;
- user agregado a workspace;
- commitment creado;
- commitment action ejecutada;
- transición válida;
- transición rechazada, si se decide registrar;
- guardrail activado;
- commitment cerrado;
- commitment cancelado.

`StateTransition` debe registrar:

- `objectType`;
- `objectId`;
- `fromState`;
- `toState`;
- `changedByUserId`;
- `reason`;
- `createdAt`.

## 15. Web/PWA en MVP 1

MVP 1 puede actualizar mínimamente el frontend, pero no debe construir interfaz completa.

Permitido:

- mostrar estado de MVP 1;
- mostrar healthcheck backend;
- mostrar texto indicando que el motor inicial de compromisos está activo;
- opcional: vista simple de prueba para listar compromisos demo si no aumenta demasiado el alcance.

No permitido:

- dashboard completo;
- login real;
- gestión completa de usuarios;
- pantallas complejas;
- flujo Mina Mercedes;
- flujo Sunworks;
- revisión de evidencias.

Prioridad:

Backend + PostgreSQL + motor inicial.

## 16. Migraciones Prisma

MVP 1 deberá ejecutar migración inicial contra PostgreSQL local.

Reglas:

- Usar Prisma migrations.
- No usar SQLite.
- No borrar base existente sin autorización.
- No resetear base sin autorización explícita.
- No ejecutar `db push` si se decide usar migraciones formales, salvo justificación.
- No ejecutar migraciones si `DATABASE_URL` no está configurado.
- Documentar comandos usados.

Comandos esperados, ajustables según package scripts:

- `npm.cmd run prisma:generate`
- `npm.cmd run prisma:migrate`
- `npm.cmd run prisma:seed`
- `npm.cmd run build`
- `npm.cmd run test`
- `npm.cmd run lint`

Si un script no existe, Codex puede crearlo de forma razonable.

## 17. Pruebas mínimas MVP 1

Agregar pruebas o validaciones para:

- crear workspace;
- crear usuario;
- asociar usuario a workspace;
- crear compromiso;
- transición válida;
- transición inválida bloqueada;
- audit log creado;
- state transition creada;
- guardrail básico bloquea cuando aplica;
- healthcheck responde;
- DB responde.

No usar OpenAI.

No usar WhatsApp.

No usar APIs externas.

## 18. README y documentación dentro del repo técnico

Actualizar README o docs internas del repositorio técnico con:

- qué incluye MVP 1;
- cómo configurar `.env` local sin exponer contraseña;
- cómo ejecutar migraciones;
- cómo ejecutar seed;
- cómo levantar backend;
- cómo probar `/health`;
- cómo probar endpoints básicos;
- qué sigue fuera de alcance;
- advertencia de que usuario `postgres` solo aplica para desarrollo local;
- advertencia de no subir `.env`.

No modificar documentación estratégica de Obsidian durante ejecución MVP 1 salvo autorización adicional.

## 19. Validaciones finales esperadas

Al ejecutar MVP 1, Codex deberá validar:

- `npm.cmd install`, si aplica.
- `npm.cmd run build`.
- `npm.cmd run test`.
- `npm.cmd run lint`.
- `npm.cmd run prisma:generate`.
- migración ejecutada correctamente.
- seed ejecutado correctamente.
- backend levanta.
- `GET /health` responde.
- DB status responde, si se implementa.
- endpoints básicos funcionan al menos con pruebas o comandos documentados.
- no hay llamadas OpenAI.
- no hay llamadas WhatsApp.
- `.env` no se versiona.
- no se documenta contraseña.

## 20. Criterios de aceptación MVP 1

MVP 1 se considerará aceptado si:

- Prisma schema inicial existe y está alineado con el modelo MVP.
- Migración inicial corre contra PostgreSQL local.
- Base `gamora_bot_dev` contiene tablas iniciales.
- Seed demo puede ejecutarse.
- Backend puede crear y consultar workspaces.
- Backend puede crear y consultar usuarios.
- Backend puede asociar usuarios a workspace.
- Backend puede crear compromisos.
- Backend puede ejecutar acciones de compromiso.
- Transiciones inválidas se bloquean.
- `StateTransition` se registra.
- `AuditLog` se registra.
- Guardrails básicos existen y se consultan o aplican.
- Healthcheck responde.
- Pruebas mínimas pasan.
- No se conectó OpenAI.
- No se conectó WhatsApp.
- No se usaron credenciales reales de producción.
- No se implementó Mina Mercedes.
- No se implementó Sunworks.

## 21. Restricciones estrictas para Codex al ejecutar MVP 1

Codex debe respetar estas restricciones:

- No conectar OpenAI real.
- No conectar WhatsApp real.
- No usar WhatsApp Web.
- No usar credenciales reales de producción.
- No documentar contraseñas.
- No subir `.env`.
- No instalar Docker.
- No instalar pnpm.
- No cambiar a SQLite.
- No usar almacenamiento mock como motor principal.
- No borrar la base `gamora_bot_dev` sin autorización.
- No resetear migraciones sin autorización.
- No implementar funcionalidades fuera de MVP 1.
- No implementar Mina Mercedes.
- No implementar Sunworks.
- No hacer refactor masivo innecesario.
- No modificar Obsidian durante ejecución MVP 1 salvo permiso.

## 22. Resultado esperado de Codex al ejecutar MVP 1

Codex deberá entregar:

1. Resumen de archivos modificados en el repositorio técnico.
2. Migraciones creadas.
3. Modelos Prisma creados.
4. Seed creado/ejecutado.
5. Endpoints creados.
6. Pruebas ejecutadas.
7. Validaciones realizadas.
8. Errores o pendientes.
9. Confirmación de que no se documentó contraseña.
10. Confirmación de que `.env` no fue versionado.
11. Confirmación de que no se conectó OpenAI.
12. Confirmación de que no se conectó WhatsApp.
13. Confirmación de que no se instaló Docker ni pnpm.
14. Confirmación de que no se implementó Mina Mercedes ni Sunworks.
15. Recomendación del siguiente paso técnico.

## 23. Cierre del prompt

MVP 1 es el primer paso funcional real del producto: convierte la base técnica de MVP 0 en un motor inicial persistente de compromisos, con PostgreSQL real, reglas de estado, bitácora y guardrails mínimos, sin conectar todavía canales externos.

Este prompt debe ejecutarse únicamente cuando Luis Felipe autorice avanzar a MVP 1.
