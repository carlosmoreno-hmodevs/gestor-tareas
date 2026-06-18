# Validación MVP 1 — Motor Inicial de Compromisos

## Versión
v0.1

## Estatus
Validación inicial para revisión de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento registra la ejecución y validación de MVP 1 — Motor Inicial de Compromisos con PostgreSQL Real.

MVP 1 convierte la base técnica de MVP 0 en un primer motor funcional persistente. Ya no es solo estructura de repositorio: ahora Gamora Bot cuenta con modelos de datos reales, migración Prisma, seed demo, endpoints iniciales, reglas de transición, bitácora y validación contra PostgreSQL local.

MVP 1 todavía no conecta WhatsApp real, OpenAI real, interfaz completa, Mina Mercedes ni Sunworks.

## 2. Ruta del repositorio técnico

Repositorio técnico:

`C:\Users\Home\Documents\Gamora_Bot_MVP`

El repositorio técnico está separado del vault de Obsidian. Esto mantiene la documentación estratégica separada del código, dependencias, builds, migraciones y archivos locales de desarrollo.

## 3. Alcance ejecutado

MVP 1 ejecutó:

- modelos Prisma iniciales;
- enums;
- migración inicial;
- seed demo controlado;
- endpoints REST iniciales;
- motor de workspaces;
- motor de usuarios;
- asociación users-workspaces;
- motor de compromisos;
- acciones de compromiso;
- reglas de transición;
- `StateTransition`;
- `AuditLog`;
- `GuardrailEvent`;
- `ApiUsageLog`;
- healthcheck con validación DB;
- pruebas mínimas;
- actualización mínima del frontend.

## 4. Archivos y áreas modificadas en el repositorio técnico

Áreas modificadas durante la ejecución:

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma/migrations/20260607034253_init_mvp_1/migration.sql`
- `apps/api/src/config/prisma.ts`
- `apps/api/src/services/*`
- `apps/api/src/modules/*/*.routes.ts`
- `apps/api/src/tests/mvp1-engine.test.ts`
- `apps/api/src/server.ts`
- `apps/web/src/app/App.tsx`
- `apps/web/src/components/StatusPanel.tsx`
- `package.json`
- `package-lock.json`
- `README.md`

Este listado es informativo y corresponde al reporte de ejecución de MVP 1.

## 5. Modelos implementados

Modelos implementados:

- `Workspace`: representa empresa, cliente o espacio operativo.
- `User`: representa personas que podrán participar en el sistema.
- `WorkspaceUser`: relaciona usuarios con workspaces y roles.
- `Commitment`: representa el compromiso operativo como objeto central.
- `StateTransition`: registra cambios de estado de objetos funcionales.
- `AuditLog`: registra bitácora funcional de acciones relevantes.
- `GuardrailEvent`: registra eventos o bloqueos asociados a guardrails.
- `ApiUsageLog`: deja preparada la medición de uso de APIs.

Estos modelos permiten que el motor inicial opere con persistencia real y no con almacenamiento simulado.

## 6. Motor de compromisos implementado

El motor inicial permite:

- crear compromisos;
- listar compromisos;
- consultar compromisos;
- asignar responsables;
- ejecutar acciones controladas;
- validar transiciones;
- bloquear transiciones inválidas;
- registrar bitácora;
- registrar `StateTransition`;
- registrar `AuditLog`.

El cambio de estado ya no es libre: pasa por una capa de reglas que define qué transiciones son válidas.

## 7. Acciones de compromiso implementadas

Acciones implementadas:

- `accept`
- `submit_for_review`
- `approve`
- `request_correction`
- `reject`
- `close`
- `cancel`
- `suspend_by_guardrail`

Estas acciones operan sobre reglas de transición, no sobre cambios libres de estado.

## 8. Seed demo

Seed demo ejecutado:

Workspace:

- Ferretería Luisito

Usuarios:

- Luisito
- Panchito
- Rosita

Compromisos:

1. Contar sacos de cemento en sucursal Sur.
2. Corte de caja de mediodía.
3. Revisar inventario de almacén.

Aclaraciones:

- datos ficticios;
- sin teléfonos reales;
- sin WhatsApp real;
- sin OpenAI real;
- seed idempotente/controlado.

## 9. Endpoints implementados

### Health

- `GET /health`

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

MVP 1 aún no tiene autenticación final y no debe exponerse como producción.

## 10. Validaciones realizadas

| Validación | Resultado | Observación |
|---|---|---|
| `npm.cmd install` | Correcto | Dependencias instaladas/actualizadas. |
| `npm.cmd run prisma:generate` | Correcto | Prisma Client generado. |
| `npm.cmd run prisma:migrate` | Correcto | Migración inicial aplicada contra PostgreSQL local. |
| `npm.cmd run prisma:seed` | Correcto | Seed demo ejecutado. |
| `npm.cmd run build` | Correcto | Backend, frontend y shared compilaron. |
| `npm.cmd run lint` | Correcto | TypeScript pasó sin errores. |
| `npm.cmd run test` | Correcto | 3 suites y 5 tests pasaron. |
| `GET /health` | Correcto | Respondió `status: ok` y `db: ok`. |
| `GET /api/workspaces` | Correcto | Respondió con datos. |
| `GET /api/users` | Correcto | Respondió con datos. |
| `GET /api/commitments` | Correcto | Respondió con datos. |
| `npx.cmd prisma migrate status` | Correcto | Base sincronizada con migraciones. |

## 11. Healthcheck y base de datos

`GET /health` respondió:

- `status: ok`
- `db: ok`

Base local:

- `gamora_bot_dev`

Motor de base:

- PostgreSQL local

Estado Prisma:

- migración inicial aplicada;
- base sincronizada según `prisma migrate status`.

No se documentó contraseña.

## 12. Confirmaciones de seguridad

Durante MVP 1:

- No se documentó contraseña.
- `.env` existe localmente pero está ignorado por Git.
- `.env` no fue versionado.
- No se conectó OpenAI.
- No se conectó WhatsApp.
- No se hicieron llamadas reales a APIs de pago.
- No se instaló Docker.
- No se instaló pnpm.
- No se implementó Mina Mercedes.
- No se implementó Sunworks.
- No se modificó documentación estratégica durante ejecución.
- No se avanzó a MVP 2.

## 13. Pendientes y notas técnicas

Notas y pendientes:

- `npx` directo está bloqueado por PowerShell; `npx.cmd` funciona.
- Prisma avisa que `package.json#prisma` será deprecado en Prisma 7; no bloquea MVP 1.
- El repo sigue sin remoto GitHub/GitLab.
- Falta validar manualmente endpoints con casos reales de ejemplo.
- Falta decidir cuándo documentar cierre formal de MVP 1.
- Falta preparar MVP 2 de interfaz web.
- Falta mantener OpenAI/WhatsApp apagados hasta que los guardrails estén más maduros.

## 14. Alcance no implementado

MVP 1 no implementó:

- WhatsApp real;
- OpenAI real;
- envío real de mensajes;
- webhooks productivos;
- evidencias reales;
- storage real;
- autenticación final;
- dashboard completo;
- Mina Mercedes;
- Sunworks;
- staging;
- producción.

## 15. Dictamen técnico

MVP 1 queda validado como primer motor funcional persistente de Gamora Bot.

El repositorio ya cuenta con persistencia real sobre PostgreSQL, modelos base, migración, seed, endpoints iniciales, reglas de transición, bitácora y guardrails mínimos.

Antes de avanzar a MVP 2, se recomienda validar manualmente algunos endpoints con casos de ejemplo y documentar cualquier ajuste menor.

## 16. Siguiente paso recomendado

Recomendación:

1. Luis Felipe valida MVP 1.
2. Se prueban manualmente endpoints representativos.
3. Se documentan resultados de prueba manual si aplica.
4. ChatGPT prepara prompt MVP 2 — Interfaz web inicial de control.
5. No conectar WhatsApp/OpenAI todavía.

## 17. Cierre

MVP 1 cumple el propósito de convertir Gamora Bot en un motor funcional persistente básico, sin consumir APIs externas ni exponer credenciales.

La base técnica ya puede sostener la siguiente capa de producto: una interfaz web inicial que permita operar y revisar estos datos sin depender de comandos o pruebas técnicas.
