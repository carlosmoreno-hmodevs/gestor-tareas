# Pruebas Manuales MVP 1 — Endpoints del Motor Inicial

## Versión
v0.1

## Estatus
Pruebas manuales iniciales para revisión de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento registra las pruebas manuales de endpoints MVP 1 para validar el comportamiento funcional del motor inicial de compromisos de Gamora Bot.

Las pruebas se realizaron sobre el repositorio técnico ya construido y validado, sin modificar código, sin conectar APIs externas y sin avanzar a MVP 2.

## 2. Contexto técnico

- Repositorio técnico: `C:\Users\Home\Documents\Gamora_Bot_MVP`
- Base local: `gamora_bot_dev`
- Motor de base de datos: PostgreSQL local
- Backend local: `http://127.0.0.1:3001`
- OpenAI: no conectado
- WhatsApp Business API: no conectado
- Credenciales: no documentadas
- Archivo `.env`: no mostrado y no documentado

## 3. Alcance de las pruebas

Las pruebas manuales cubren:

- healthcheck;
- workspaces;
- users;
- workspace-users;
- commitments;
- commitment detail;
- commitment actions;
- transición válida;
- transición inválida;
- timeline;
- audit;
- guardrails.

## 4. Pruebas ejecutadas

| Caso | Endpoint / acción | Resultado | Observación |
|---|---|---|---|
| A. Healthcheck | `GET /health` | Exitoso | Respondió `status: ok` y `db: ok`. |
| B. Workspaces | `GET /api/workspaces` | Exitoso | Aparece `Ferreteria Luisito`. No se creó workspace adicional para evitar crecimiento innecesario de datos demo. |
| C. Users | `GET /api/users` | Exitoso | Aparecen `Luisito`, `Panchito` y `Rosita`. También existen usuarios generados por pruebas automatizadas previas. |
| D. Workspace users | `GET /api/workspaces/:workspaceId/users` | Exitoso | El workspace `Ferreteria Luisito` tiene 3 usuarios asociados. |
| E. Commitments | `GET /api/commitments` | Exitoso | Aparecen los 3 compromisos demo del seed y un compromiso generado por pruebas automatizadas previas. |
| F. Commitment detail | `GET /api/commitments/:id` | Exitoso | El compromiso consultado devolvió responsable, workspace, estado y datos principales. |
| G. Acción válida | `POST /api/commitments/:id/actions` con `accept` | Exitoso | El compromiso pasó de `PENDING_ACCEPTANCE` a `ACCEPTED_IN_PROGRESS`. |
| H. Transición inválida | `POST /api/commitments/:id/actions` con `close` | Bloqueado correctamente | El backend respondió error 400: `Transicion no permitida: ACCEPTED_IN_PROGRESS -> close`. |
| I. Timeline | `GET /api/commitments/:id/timeline` | Exitoso | Se encontró una transición asociada a la acción válida ejecutada. |
| J. Audit | `GET /api/audit?workspaceId=...` | Exitoso | Se encontraron eventos funcionales de auditoría para el workspace. |
| K. Guardrails | `GET /api/guardrails?workspaceId=...` | Exitoso | El endpoint respondió correctamente. No hay eventos guardrail activos, lo cual es esperado en esta etapa. |

## 5. Datos usados

Workspace demo usado:

- `Ferreteria Luisito`

Usuarios demo usados:

- `Luisito`
- `Panchito`
- `Rosita`

Compromiso demo usado para pruebas de acción:

- `Contar sacos de cemento`

Datos existentes adicionales:

- Se observaron usuarios y un compromiso generados por pruebas automatizadas previas del MVP 1. Esto no bloquea la validación, pero confirma que la base local conserva datos de pruebas.

No se incluyeron datos sensibles, contraseñas ni contenido del archivo `.env`.

## 6. Validación de transición válida

- Compromiso usado: `Contar sacos de cemento`
- Estado inicial: `PENDING_ACCEPTANCE`
- Acción ejecutada: `accept`
- Estado final: `ACCEPTED_IN_PROGRESS`
- StateTransition: registrada y visible en timeline.
- AuditLog: disponible en auditoría del workspace.

La transición se ejecutó mediante acción controlada, no mediante cambio libre de estado.

## 7. Validación de transición inválida

- Acción intentada: `close`
- Estado del compromiso al intentar la acción: `ACCEPTED_IN_PROGRESS`
- Motivo de invalidez: el cierre no está permitido desde `ACCEPTED_IN_PROGRESS`; debe pasar por el flujo definido antes de cierre.
- Respuesta del backend: error 400 con mensaje `Transicion no permitida: ACCEPTED_IN_PROGRESS -> close`.
- Confirmación: el backend bloqueó la transición inválida y no permitió cerrar indebidamente el compromiso.

## 8. Validación de bitácora y timeline

Endpoint usado:

- `GET /api/commitments/:id/timeline`

Resultado:

- El timeline devolvió la transición generada por la acción `accept`.

Endpoint de auditoría usado:

- `GET /api/audit?workspaceId=...`

Resultado:

- La auditoría respondió con eventos funcionales del workspace.

Conclusión:

- La acción manual puede rastrearse mediante transición de estado y bitácora funcional.

## 9. Validación de guardrails

Endpoint usado:

- `GET /api/guardrails?workspaceId=...`

Resultado:

- El endpoint respondió correctamente.
- No existen eventos guardrail activos para el workspace durante estas pruebas.

Esto es esperado en esta etapa porque no se forzaron límites, bloqueos, pausas manuales ni comportamientos anómalos.

## 10. Errores o hallazgos

No se encontraron errores bloqueantes.

Hallazgos menores:

- La base local contiene datos generados por pruebas automatizadas previas, además del seed demo.
- El timeline del compromiso demo mostró la transición registrada después de la acción manual; los compromisos semilla no necesariamente incluyen transición inicial de creación en el timeline.

Ajustes sugeridos antes o durante MVP 2:

- Definir si las pruebas automatizadas deben limpiar datos de prueba o aislarse en fixtures propios.
- Evaluar si el seed debe registrar una transición inicial para compromisos creados por datos demo.
- Mantener los endpoints sin exposición productiva hasta agregar autenticación y permisos formales.

## 11. Confirmaciones de seguridad

- No se documentó contraseña.
- No se mostró `.env`.
- No se versionó `.env`.
- No se conectó OpenAI.
- No se conectó WhatsApp.
- No se instalaron Docker ni pnpm.
- No se ejecutaron migraciones nuevas.
- No se reseteó base de datos.
- No se borraron datos.
- No se modificó código.
- No se avanzó a MVP 2.

## 12. Dictamen

Las pruebas manuales validan el comportamiento básico del motor inicial de compromisos del MVP 1.

El backend responde correctamente, la base PostgreSQL local está operativa, los datos demo son consultables, las acciones válidas cambian estado mediante reglas controladas, las transiciones inválidas se bloquean y la bitácora/timeline permite rastrear operaciones funcionales.

No se identifican bloqueantes técnicos para preparar el prompt de MVP 2 — Interfaz web inicial de control.

## 13. Siguiente paso recomendado

1. Luis Felipe revisa estas pruebas manuales.
2. Si no hay observaciones bloqueantes, ChatGPT prepara el prompt MVP 2 — Interfaz web inicial de control.
3. Mantener OpenAI y WhatsApp apagados.
4. No pasar a WhatsApp hasta que la web pueda operar el motor básico con mayor claridad visual y control.

## 14. Cierre

Estas pruebas manuales reducen riesgo antes de construir la interfaz web, porque confirman que el motor persistente de compromisos ya responde con datos reales de PostgreSQL, respeta transiciones controladas y mantiene trazabilidad funcional básica.
