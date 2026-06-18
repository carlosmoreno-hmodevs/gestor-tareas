# Prompt MVP 2.4 — Evidencias Simuladas/Controladas desde Web

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del prompt

Este prompt instruirá a Codex para ejecutar MVP 2.4 sobre el repositorio técnico existente.

MVP 2.4 debe permitir simular o registrar de forma controlada evidencias desde la web/PWA para un compromiso ya creado.

El objetivo es avanzar del flujo:

“Ya creé un compromiso.”

a:

“Ya puedo registrar una evidencia o avance, revisarlo y tomar una decisión.”

MVP 2.4 no debe implementar evidencias reales por WhatsApp, storage real, carga pesada de archivos, OpenAI real ni WhatsApp real.

## 2. Contexto que debe conocer Codex

Gamora Bot ya cuenta con:

- MVP 0 — base técnica;
- MVP 1 — motor inicial de compromisos con PostgreSQL real;
- MVP 2 — interfaz web inicial;
- MVP 2.1 — UX por intención del usuario;
- MVP 2.2 — configuración mínima operativa;
- MVP 2.3 — creación guiada de compromisos desde web.

MVP 2.3 permite crear compromisos con responsable, frente, fecha, evidencia esperada y prioridad.

MVP 2.4 debe permitir registrar evidencia o avance simulado/controlado sobre esos compromisos.

Principio rector:

“Más poder con menos fricción.”

## 3. Precondiciones obligatorias

Antes de ejecutar MVP 2.4, Codex deberá validar:

- existe el repo C:\Users\Home\Documents\Gamora_Bot_MVP;
- apps/web existe;
- apps/api existe;
- npm.cmd funciona;
- backend local responde GET /health con status ok y db ok;
- frontend local compila;
- base PostgreSQL local está sincronizada;
- MVP 2.3 está aplicado;
- existen compromisos creados;
- existen workspaces, personas/responsables y tiendas/frentes;
- .env está ignorado por Git;
- OpenAI sigue apagado;
- WhatsApp sigue apagado.

Si falta una precondición crítica:

- detenerse;
- reportar claramente;
- no inventar éxito.

## 4. Alcance exacto de MVP 2.4

MVP 2.4 debe implementar evidencias simuladas/controladas desde web.

Debe incluir:

- registrar evidencia o avance sobre un compromiso;
- campo de descripción de evidencia;
- tipo de evidencia esperado o simulado;
- fecha/hora de registro;
- usuario que registra la evidencia, usando usuario demo/controlado;
- cambio de estado hacia IN_REVIEW o estado equivalente;
- aparición en Pendientes por revisar;
- notificación visual en Mi día operativo;
- vista de revisión de evidencia;
- acciones del validador:
  - aprobar;
  - pedir corrección;
  - rechazar;
- motivo obligatorio para corrección/rechazo;
- actualización de timeline;
- actualización de audit;
- mensajes claros de éxito/error;
- evidencia simulada, no archivo real pesado.

MVP 2.4 no debe implementar:

- WhatsApp real;
- OpenAI real;
- evidencias reales por WhatsApp;
- storage real;
- carga real de archivos pesados;
- media real;
- QR/landing simulados;
- journey simulado completo;
- autenticación final;
- roles enterprise complejos;
- identidad visual final;
- Mina Mercedes;
- Sunworks;
- MVP 3.

## 5. Experiencia objetivo

El usuario debe sentir:

“Ya puedo ver que un responsable reportó avance o evidencia y puedo revisarlo.”

No debe sentir:

“Estoy administrando archivos complejos o un gestor documental.”

## 6. Caso base Ferretería Luisito

Usar como referencia funcional:

Espacio operativo:
- Ferretería Luisito.

Frente:
- Sucursal Sur.

Responsable:
- Panchito.

Compromiso:
- Contar sacos de cemento recibidos hoy en Sucursal Sur.

Evidencia simulada:
- “Panchito reporta que contó 42 sacos de cemento.”
- Tipo: conteo / comentario.
- Evidencia esperada: foto o conteo.
- Estado posterior: IN_REVIEW o equivalente.

Validador:
- Luisito.

Acciones de revisión:
- aprobar;
- pedir corrección;
- rechazar.

## 7. Backend esperado

Revisar el backend actual antes de modificar.

Ya existen:

- Commitment.
- StateTransition.
- AuditLog.
- acciones de compromiso.
- timeline.
- audit.

Codex debe evaluar si ya existe modelo de evidencia.

Si no existe, crear un modelo mínimo nuevo, por ejemplo:

Evidence o CommitmentEvidence:
- id;
- workspaceId;
- commitmentId;
- submittedByUserId;
- evidenceType;
- description;
- simulatedFileName opcional;
- status;
- createdAt;
- updatedAt;
- reviewedByUserId opcional;
- reviewedAt opcional;
- reviewNote opcional.

Tipos sugeridos:
- COMMENT;
- PHOTO_SIMULATED;
- COUNT;
- FILE_SIMULATED;
- OTHER.

Estados sugeridos:
- SUBMITTED;
- APPROVED;
- CORRECTION_REQUESTED;
- REJECTED.

Reglas:

- Si se crea modelo nuevo, crear migración Prisma formal.
- No usar SQLite.
- No resetear base.
- No borrar datos.
- No implementar storage real.
- No guardar archivos reales.
- No crear estructura documental compleja.
- No crear permisos enterprise complejos.

## 8. Endpoints requeridos

Agregar endpoints mínimos si no existen:

- POST /api/commitments/:id/evidence
- GET /api/commitments/:id/evidence
- POST /api/commitments/:id/evidence/:evidenceId/review

Opcional, solo si facilita UI:
- GET /api/evidence?workspaceId=...
- GET /api/evidence/pending-review?workspaceId=...

Reglas:

- No crear endpoints complejos.
- No subir archivos reales.
- No aceptar binary upload.
- Solo JSON controlado para evidencia simulada.
- Validar commitmentId.
- Validar workspaceId.
- Validar usuario demo/controlado si aplica.
- Registrar AuditLog.
- Registrar StateTransition si cambia estado del compromiso.

## 9. Estados de compromiso

Cuando se registra evidencia:

- si el compromiso está ACCEPTED_IN_PROGRESS o estado equivalente, pasar a IN_REVIEW.
- si está PENDING_ACCEPTANCE, no permitir evidencia hasta aceptación, salvo decisión explícita ya soportada.
- si está CLOSED o CANCELED, no permitir evidencia.
- si está CORRECTION_REQUESTED, permitir nueva evidencia/corrección y volver a IN_REVIEW.

Reglas:

- Usar motor de estados existente siempre que sea posible.
- No cambiar estados directamente sin reglas.
- No romper acciones existentes.

## 10. Interfaz web requerida

Agregar o mejorar:

### Detalle de compromiso

Debe incluir sección:

Evidencia / avance reportado.

Debe permitir:

- ver evidencia esperada;
- registrar evidencia simulada;
- ver evidencias registradas;
- ver estado de revisión;
- ver quién reportó;
- ver fecha/hora;
- ver resultado de revisión.

### Pendientes por revisar

Debe mostrar compromisos o evidencias en revisión.

Debe permitir al validador:

- abrir evidencia;
- aprobar;
- pedir corrección;
- rechazar.

### Mi día operativo

Debe mostrar:

- evidencias pendientes por revisar;
- compromisos con evidencia recibida;
- acciones necesarias para Luisito.

## 11. Flujo de evidencia simulada

Flujo mínimo:

1. Compromiso está aceptado/en proceso.
2. Usuario registra evidencia simulada desde web.
3. Sistema guarda evidencia.
4. Sistema mueve compromiso a IN_REVIEW.
5. Mi día operativo muestra pendiente por revisar.
6. Luisito abre detalle.
7. Luisito aprueba, pide corrección o rechaza.
8. Sistema actualiza evidencia, compromiso, timeline y audit.

## 12. Reglas UX

Mantener:

- interfaz neutral;
- lenguaje humano;
- baja fricción;
- pocos campos;
- no saturar;
- no mostrar gestor documental complejo;
- no usar identidad visual final;
- no usar estilos heredados;
- no convertirlo en panel enterprise.

Microcopy sugerido:

- “Registrar avance o evidencia.”
- “Describe qué se hizo o qué se encontró.”
- “No subiremos archivos reales todavía; esta evidencia es simulada/controlada.”
- “Luisito tiene evidencia pendiente por revisar.”
- “Pedir corrección.”
- “Aprobar evidencia.”
- “Rechazar evidencia.”

## 13. Validaciones funcionales

Frontend debe validar:

- evidencia no vacía;
- compromiso seleccionado;
- responsable o usuario demo existente;
- no registrar evidencia en compromiso cerrado/cancelado;
- motivo obligatorio al pedir corrección o rechazar;
- mostrar errores claros.

Backend debe validar:

- compromiso existe;
- estado permite evidencia;
- usuario existe si aplica;
- evidencia pertenece al workspace;
- revisión válida;
- estado de evidencia válido.

## 14. Bitácora y trazabilidad

Al registrar evidencia:

- registrar AuditLog.
- registrar timeline o StateTransition si cambia estado.
- mostrar historial entendible.

Al revisar evidencia:

- registrar quién revisó.
- registrar resultado.
- registrar nota/motivo si aplica.
- registrar AuditLog.
- actualizar timeline.

No mostrar JSON crudo.

## 15. Seed/demo

No duplicar Ferretería Luisito, Panchito, Rosita, Sucursal Norte o Sucursal Sur.

El flujo debe funcionar con compromisos existentes o creados por MVP 2.3.

Si se requiere agregar evidencia demo mínima:

- hacerlo de forma idempotente;
- no borrar datos existentes;
- no usar datos reales;
- no subir archivos reales.

## 16. Validaciones técnicas esperadas

Al ejecutar MVP 2.4, Codex deberá validar:

- npm.cmd run build;
- npm.cmd run test;
- npm.cmd run lint;
- npm.cmd run prisma:generate si hubo cambios Prisma;
- npm.cmd run prisma:migrate si hubo migración;
- npm.cmd run prisma:seed si se ajustó seed;
- GET /health;
- endpoints necesarios responden;
- UI carga;
- Crear compromiso sigue funcionando;
- Configuración básica sigue funcionando;
- Mi día operativo sigue funcionando;
- se puede registrar evidencia simulada;
- evidencia aparece en detalle;
- compromiso pasa a IN_REVIEW o equivalente;
- evidencia aparece en Pendientes por revisar;
- se puede aprobar evidencia;
- se puede pedir corrección con motivo;
- se puede rechazar con motivo;
- timeline/audit responden;
- .env no se muestra ni versiona;
- OpenAI sigue apagado;
- WhatsApp sigue apagado.

## 17. Criterios de aceptación MVP 2.4

MVP 2.4 será aceptado si:

- existe flujo de evidencia simulada/controlada;
- se puede registrar evidencia sobre un compromiso;
- no se suben archivos reales;
- no se usa storage real;
- el compromiso pasa a revisión cuando corresponde;
- Mi día operativo muestra evidencia pendiente;
- Pendientes por revisar muestra elementos accionables;
- el validador puede aprobar, pedir corrección o rechazar;
- corrección/rechazo piden motivo;
- audit/timeline registran eventos;
- no se rompe MVP 1, MVP 2, MVP 2.1, MVP 2.2 ni MVP 2.3;
- no se conecta WhatsApp;
- no se conecta OpenAI;
- no se implementa identidad visual final;
- build/test/lint pasan.

## 18. Restricciones estrictas

Incluir:

- No conectar OpenAI real.
- No conectar WhatsApp real.
- No usar WhatsApp Web.
- No mostrar .env.
- No versionar .env.
- No documentar contraseñas.
- No instalar Docker.
- No instalar pnpm.
- No resetear base.
- No borrar datos.
- No cambiar a SQLite.
- No crear identidad visual final.
- No usar estilos heredados.
- No implementar Mina Mercedes.
- No implementar Sunworks.
- No implementar autenticación final.
- No hacer refactor masivo.
- No modificar documentación estratégica de Obsidian durante ejecución.
- No avanzar a MVP 3.
- No implementar storage real.
- No subir archivos reales.

## 19. Resultado esperado de Codex al ejecutar MVP 2.4

Codex deberá entregar:

1. Resumen de archivos modificados en el repositorio técnico.
2. Cambios backend realizados, si aplica.
3. Migraciones creadas, si aplica.
4. Cambios frontend realizados.
5. Cambios UX realizados.
6. Validaciones realizadas.
7. Errores o pendientes.
8. Confirmación de que no conectó OpenAI.
9. Confirmación de que no conectó WhatsApp.
10. Confirmación de que .env no fue mostrado ni versionado.
11. Confirmación de que no instaló Docker ni pnpm.
12. Confirmación de que no implementó identidad visual final.
13. Confirmación de que no implementó Mina Mercedes ni Sunworks.
14. Confirmación de que no implementó storage real ni carga de archivos reales.
15. Recomendación del siguiente paso técnico.

## 20. Cierre

MVP 2.4 debe permitir que el usuario pase de:

“Ya creé un compromiso trazable.”

a:

“Ya puedo registrar avance/evidencia y revisarlo.”
