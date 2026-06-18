# Prompt MVP 2.3 — Creación Guiada de Compromisos desde Web

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del prompt

Este prompt instruirá a Codex para ejecutar MVP 2.3 sobre el repositorio técnico existente.

MVP 2.3 debe permitir crear compromisos desde la web/PWA usando el contexto operativo configurado en MVP 2.2.

El objetivo es que el usuario pueda convertir un pendiente operativo en compromiso trazable, sin depender todavía de WhatsApp real ni OpenAI real.

MVP 2.3 debe permitir crear compromisos usando:

- espacio operativo / negocio;
- tienda, sucursal o frente;
- persona responsable;
- fecha compromiso;
- descripción clara;
- evidencia esperada opcional;
- prioridad opcional;
- confirmación antes de crear.

## 2. Contexto que debe conocer Codex

Gamora Bot ya cuenta con:

- MVP 0 — base técnica;
- MVP 1 — motor inicial de compromisos con PostgreSQL real;
- MVP 2 — interfaz web inicial;
- MVP 2.1 — UX por intención del usuario;
- MVP 2.2 — configuración mínima operativa.

MVP 2.2 dejó listo el contexto operativo mínimo:

- negocio / espacio operativo;
- tiendas, sucursales o frentes;
- personas responsables;
- roles operativos básicos;
- checklist de preparación.

MVP 2.3 debe usar ese contexto para crear compromisos de forma natural.

Principio rector:

“Más poder con menos fricción.”

## 3. Precondiciones obligatorias

Antes de ejecutar MVP 2.3, Codex deberá validar:

- existe el repo C:\Users\Home\Documents\Gamora_Bot_MVP;
- apps/web existe;
- apps/api existe;
- npm.cmd funciona;
- backend local responde GET /health con status ok y db ok;
- frontend local compila;
- base PostgreSQL local está sincronizada;
- MVP 2.2 está aplicado;
- existen workspaces;
- existen personas/responsables;
- existen tiendas/frentes;
- .env está ignorado por Git;
- OpenAI sigue apagado;
- WhatsApp sigue apagado.

Si falta una precondición crítica:

- detenerse;
- reportar claramente;
- no inventar éxito.

## 4. Alcance exacto de MVP 2.3

MVP 2.3 debe implementar creación guiada de compromisos desde web.

Debe incluir:

- botón o flujo “Crear compromiso”;
- formulario guiado, no pesado;
- selección de espacio operativo si aplica;
- selección de tienda/frente;
- selección de responsable;
- descripción del compromiso;
- fecha compromiso;
- evidencia esperada opcional;
- prioridad opcional;
- vista de confirmación antes de crear;
- creación real usando backend;
- registro en bitácora/audit si ya existe;
- aparición inmediata en Mi día operativo;
- aparición en Compromisos;
- clasificación por atención requerida;
- estado inicial correcto;
- mensajes de éxito/error claros.

MVP 2.3 no debe implementar:

- WhatsApp real;
- OpenAI real;
- interpretación de lenguaje natural con IA;
- evidencias reales;
- storage real;
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

“Ya convertí un pendiente operativo en un compromiso trazable.”

No debe sentir:

“Estoy llenando un formulario empresarial pesado.”

## 6. Caso base Ferretería Luisito

Usar como referencia funcional:

Espacio operativo:

- Ferretería Luisito.

Tiendas/frentes:

- Sucursal Norte.
- Sucursal Sur.

Personas:

- Luisito — dueño/coordinador.
- Panchito — encargado de bodega.
- Rosita — cajera.

Primer compromiso sugerido:

- Panchito debe contar los sacos de cemento recibidos hoy en Sucursal Sur y reportar el conteo.

Campos esperados:

- responsable: Panchito;
- frente: Sucursal Sur;
- descripción: contar sacos de cemento recibidos hoy;
- fecha compromiso: hoy o fecha seleccionable;
- evidencia esperada: foto o conteo;
- prioridad: media.

No usar datos personales reales.
No usar teléfonos reales.
No conectar WhatsApp.

## 7. Backend esperado

Revisar el backend actual antes de modificar.

Ya existen modelos:

- Workspace.
- User.
- WorkspaceUser.
- OperationalFront.
- Commitment.
- StateTransition.
- AuditLog.

MVP 2.3 debe usar el motor de compromisos existente.

Si el modelo Commitment ya tiene campos suficientes:

- usarlo sin migración.

Si falta asociación directa con OperationalFront:

- evaluar si usar `unitOrFront` existente si ya existe;
- o agregar campo `operationalFrontId` solo si es indispensable.

Reglas:

- Evitar migración si no es necesaria.
- Si se requiere migración, justificarla y mantener alcance mínimo.
- No resetear base.
- No borrar datos.
- No cambiar reglas centrales de estados salvo bug evidente.
- No crear estructura enterprise compleja.

## 8. Endpoints requeridos

Aprovechar endpoints existentes:

- GET /api/workspaces
- GET /api/workspaces/:workspaceId/fronts
- GET /api/workspaces/:workspaceId/users
- POST /api/commitments
- GET /api/commitments
- GET /api/commitments/:id
- GET /api/commitments/:id/timeline
- GET /api/audit?workspaceId=...

Si POST /api/commitments ya permite crear con los campos requeridos:

- usar endpoint existente.

Si falta algún campo menor:

- ajustar backend con alcance mínimo.

No crear endpoints complejos de permisos, auth o enterprise.

## 9. Interfaz web requerida

Agregar flujo:

Crear compromiso.

Puede ubicarse en:

- Mi día operativo;
- Compromisos;
- o como acción principal visible cuando la configuración mínima está lista.

Debe permitir:

### Paso 1 — ¿Qué pendiente quieres convertir en compromiso?

Campo:

- descripción del compromiso.

Microcopy:

“Escribe el pendiente como lo dirías normalmente.”

### Paso 2 — ¿Quién será responsable?

Selector:

- personas responsables existentes.

Debe usar datos de Configuración básica.

### Paso 3 — ¿Dónde aplica?

Selector:

- tienda, sucursal o frente existente.

Debe usar OperationalFront.

### Paso 4 — ¿Para cuándo?

Campo:

- fecha compromiso.

Opcional:

- hoy;
- mañana;
- seleccionar fecha.

### Paso 5 — ¿Qué evidencia esperas?

Campo opcional:

- foto;
- conteo;
- comentario;
- archivo;
- ninguna por ahora.

No implementar carga real de evidencia todavía.

### Paso 6 — Confirmar compromiso

Mostrar resumen:

- qué;
- quién;
- dónde;
- cuándo;
- evidencia esperada;
- prioridad;
- estado inicial.

Botón:

Crear compromiso.

## 10. Estado inicial del compromiso

Definir estado inicial recomendado:

PENDING_ACCEPTANCE

O el equivalente actual del backend.

Razón:
El compromiso existe, pero el responsable todavía debe aceptarlo en flujo futuro o mediante acción simulada/controlada.

Si el backend usa otro estado inicial ya definido, respetarlo y documentarlo.

## 11. Relación con Mi día operativo

Después de crear el compromiso:

- debe aparecer en Mi día operativo;
- debe clasificarse como pendiente por aceptar o acción requerida;
- debe aparecer en Compromisos;
- debe permitir abrir detalle;
- debe permitir ejecutar acciones según estado, si aplica.

## 12. Relación con Configuración básica

Si falta configuración mínima:

- no mostrar flujo de creación completo;
- mostrar mensaje:
  “Primero completa tu configuración mínima.”
- enviar a Configuración básica.

Checklist mínimo requerido:

- negocio definido;
- al menos una tienda/frente;
- al menos una persona responsable.

## 13. Reglas UX

Mantener:

- interfaz neutral;
- lenguaje humano;
- baja fricción;
- pocos campos;
- confirmación clara;
- no saturar;
- no mostrar configuraciones avanzadas;
- no usar identidad visual final;
- no usar estilos heredados;
- no convertirlo en panel enterprise.

Microcopy sugerido:

- “Convierte un pendiente en compromiso.”
- “Elige quién será responsable.”
- “Indica dónde aplica.”
- “Define para cuándo debe quedar.”
- “¿Qué evidencia te gustaría recibir?”
- “Revisa antes de crear.”

## 14. Validaciones funcionales

El frontend debe validar:

- descripción obligatoria;
- responsable obligatorio;
- tienda/frente obligatoria si existen frentes;
- fecha compromiso obligatoria;
- no crear si falta configuración mínima;
- no crear si el responsable no pertenece al espacio operativo;
- mostrar errores claros.

El backend debe validar lo que corresponda del lado servidor.

## 15. Bitácora y trazabilidad

Al crear compromiso:

- debe registrarse en AuditLog si ya está implementado;
- debe registrarse StateTransition si el motor lo hace;
- debe permitir consultar timeline;
- no inventar bitácora si backend no la produce;
- no mostrar JSON crudo.

## 16. Seed/demo

No duplicar Ferretería Luisito, Panchito, Rosita, Sucursal Norte o Sucursal Sur.

El flujo debe funcionar con datos existentes.

Si se requiere agregar datos demo mínimos:

- hacerlo de forma idempotente;
- no borrar datos existentes;
- no usar datos reales.

## 17. Validaciones técnicas esperadas

Al ejecutar MVP 2.3, Codex deberá validar:

- npm.cmd run build;
- npm.cmd run test;
- npm.cmd run lint;
- npm.cmd run prisma:generate si hubo cambios Prisma;
- npm.cmd run prisma:migrate si hubo migración;
- npm.cmd run prisma:seed si se ajustó seed;
- GET /health;
- endpoints necesarios responden;
- UI carga;
- Configuración básica sigue funcionando;
- Mi día operativo sigue funcionando;
- se puede crear compromiso desde web;
- compromiso aparece en Mi día operativo;
- compromiso aparece en Compromisos;
- detalle carga;
- timeline/audit responden si aplica;
- .env no se muestra ni versiona;
- OpenAI sigue apagado;
- WhatsApp sigue apagado.

## 18. Criterios de aceptación MVP 2.3

MVP 2.3 será aceptado si:

- existe un flujo “Crear compromiso”;
- el usuario puede crear un compromiso usando contexto existente;
- el flujo pide pocos datos;
- el responsable se selecciona desde personas configuradas;
- el frente se selecciona desde tiendas/frentes configurados;
- el compromiso se guarda en PostgreSQL;
- el compromiso aparece en Mi día operativo;
- el compromiso aparece en Compromisos;
- el detalle del compromiso abre correctamente;
- se registra trazabilidad básica si el backend ya la soporta;
- se mantiene baja fricción;
- no se siente como formulario enterprise;
- no se rompe MVP 1, MVP 2, MVP 2.1 ni MVP 2.2;
- no se conecta WhatsApp;
- no se conecta OpenAI;
- no se implementa identidad visual final;
- build/test/lint pasan.

## 19. Restricciones estrictas

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

## 20. Resultado esperado de Codex al ejecutar MVP 2.3

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
14. Recomendación del siguiente paso técnico.

## 21. Cierre

MVP 2.3 debe permitir que el usuario pase de:

“Ya configuré mi operación.”

a:

“Ya convertí un pendiente operativo en un compromiso trazable.”
