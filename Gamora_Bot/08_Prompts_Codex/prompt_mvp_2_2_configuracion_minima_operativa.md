# Prompt MVP 2.2 — Configuración Mínima Operativa

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del prompt

Este prompt instruirá a Codex para ejecutar MVP 2.2 sobre el repositorio técnico existente.

MVP 2.2 debe permitir configurar el entorno operativo mínimo de una PyME antes de crear compromisos.

El objetivo es que el usuario pueda definir:

- su negocio o espacio operativo;
- sus tiendas, sucursales o frentes;
- sus personas/responsables;
- roles operativos básicos;
- relación de personas con el espacio operativo.

MVP 2.2 no debe crear todavía el flujo guiado de compromisos completo. Eso será MVP 2.3.

## 2. Contexto que debe conocer Codex

Gamora Bot ya cuenta con:

- MVP 0 — base técnica;
- MVP 1 — motor inicial de compromisos con PostgreSQL real;
- MVP 2 — interfaz web inicial;
- MVP 2.1 — UX por intención del usuario.

La experiencia actual ya tiene “Mi día operativo”, pero todavía falta permitir que el usuario configure su operación mínima antes de crear compromisos reales.

Principio rector:

“Más poder con menos fricción.”

## 3. Precondiciones obligatorias

Antes de ejecutar MVP 2.2, Codex deberá validar:

- existe el repo C:\Users\Home\Documents\Gamora_Bot_MVP;
- apps/web existe;
- apps/api existe;
- npm.cmd funciona;
- backend local responde GET /health con status ok y db ok;
- frontend local compila;
- .env está ignorado por Git;
- OpenAI sigue apagado;
- WhatsApp sigue apagado.

Si falta una precondición crítica:

- detenerse;
- reportar claramente;
- no inventar éxito.

## 4. Alcance exacto de MVP 2.2

MVP 2.2 debe implementar configuración mínima operativa.

Debe incluir:

- sección o flujo “Configuración básica” mejorado;
- crear/editar espacio operativo;
- crear/editar tiendas, sucursales o frentes;
- crear/editar personas/responsables;
- asignar rol operativo básico;
- asociar personas al espacio operativo;
- mostrar estado de configuración mínima;
- mostrar checklist de preparación:
  - negocio creado;
  - al menos una tienda/frente creada;
  - al menos una persona responsable creada;
  - listo para crear primer compromiso;
- preparar el contexto para MVP 2.3.

MVP 2.2 no debe implementar:

- WhatsApp real;
- OpenAI real;
- QR/landing simulados;
- journey simulado completo;
- creación guiada completa de compromisos;
- evidencias reales;
- storage real;
- autenticación final;
- roles enterprise complejos;
- identidad visual final;
- Mina Mercedes;
- Sunworks;
- MVP 3.

## 5. Experiencia objetivo

El usuario debe sentir:

“Ya dejé listo mi negocio para empezar a trabajar con compromisos.”

No debe sentir:

“Estoy configurando un sistema empresarial pesado.”

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

Regla:
Estos datos pueden existir como seed/demo o pueden crearse desde la UI si el backend lo permite.

No usar datos personales reales.
No usar teléfonos reales.
No conectar WhatsApp.

## 7. Backend esperado

Revisar el backend actual antes de modificar.

Ya existen modelos como Workspace, User y WorkspaceUser.

Para tiendas/frentes, Codex deberá evaluar si ya existe un campo suficiente o si hace falta crear un modelo mínimo nuevo.

Si hace falta un modelo nuevo, proponer e implementar con alcance mínimo:

OperationalFront o equivalente:

- id;
- workspaceId;
- name;
- type;
- status;
- createdAt;
- updatedAt.

Ejemplos de type:

- STORE;
- BRANCH;
- FRONT;
- WAREHOUSE;
- OTHER.

Reglas:

- Si se crea modelo nuevo, crear migración Prisma formal.
- No usar SQLite.
- No resetear base sin autorización.
- No borrar datos.
- No crear estructura enterprise compleja.
- No crear catálogos excesivos.

Para personas/responsables:
Usar User y WorkspaceUser actuales si son suficientes.

Si falta campo para rol operativo visible, evaluar campo mínimo opcional en WorkspaceUser, por ejemplo:

- positionLabel;
- operationalRoleLabel;

o equivalente.

Si requiere migración, justificarla y mantener alcance mínimo.

## 8. Endpoints requeridos

Aprovechar endpoints existentes:

- GET /api/workspaces
- POST /api/workspaces
- GET /api/workspaces/:id
- POST /api/users
- GET /api/users
- POST /api/workspaces/:workspaceId/users
- GET /api/workspaces/:workspaceId/users

Si se crea OperationalFront, agregar endpoints mínimos:

- POST /api/workspaces/:workspaceId/fronts
- GET /api/workspaces/:workspaceId/fronts
- GET /api/workspaces/:workspaceId/fronts/:frontId
- PATCH /api/workspaces/:workspaceId/fronts/:frontId

Opcional:

- PATCH /api/workspaces/:id
- PATCH /api/users/:id

solo si es sencillo y necesario para edición básica.

No crear endpoints complejos de permisos, auth o enterprise.

## 9. Interfaz web requerida

Agregar o mejorar sección:

Configuración básica.

Debe permitir:

### Paso 1 — Mi negocio

- ver espacio operativo actual;
- crear o editar nombre del negocio;
- usar lenguaje “Mi negocio” o “Espacio operativo”, no “Workspace” como término principal.

### Paso 2 — Tiendas o frentes

- listar tiendas/frentes;
- agregar tienda/frente;
- editar nombre básico;
- tipo simple: tienda, sucursal, frente, almacén, otro;
- estado activo/inactivo si aplica.

### Paso 3 — Personas

- listar personas/responsables;
- agregar persona;
- asociarla al espacio operativo;
- asignar rol operativo simple;
- mostrar estado de participación/enrolamiento como interno/simulado si aplica.

### Paso 4 — Listo para operar

- checklist visual:
  - negocio definido;
  - al menos una tienda/frente;
  - al menos una persona responsable;
  - listo para crear compromiso en MVP 2.3.

## 10. Reglas UX

Mantener:

- interfaz neutral;
- lenguaje humano;
- baja fricción;
- pocos campos;
- no saturar;
- no mostrar configuraciones avanzadas;
- no usar identidad visual final;
- no usar estilos heredados;
- no convertirlo en panel enterprise.

Microcopy sugerido:

- “Primero dejemos listo tu negocio.”
- “Agrega las tiendas, sucursales o frentes donde trabajas.”
- “Agrega a las personas que podrán recibir o cerrar compromisos.”
- “Con esto ya podrás crear tu primer compromiso.”

## 11. Relación con Mi día operativo

La home “Mi día operativo” debe poder mostrar el estado de preparación si todavía falta configurar algo.

Ejemplos:

- “Completa tu configuración mínima para empezar.”
- “Agrega al menos una tienda o frente.”
- “Agrega al menos una persona responsable.”
- “Tu operación mínima está lista.”

No saturar la home con formularios completos.

Solo mostrar llamadas a la acción hacia Configuración básica.

## 12. Seed/demo

Si el seed actual ya tiene Ferretería Luisito, Panchito y Rosita, no duplicar.

Si se agregan tiendas/frentes demo:

- Sucursal Norte.
- Sucursal Sur.

Seed debe ser idempotente si se modifica.

No borrar datos existentes.

## 13. Validaciones técnicas esperadas

Al ejecutar MVP 2.2, Codex deberá validar:

- npm.cmd run build;
- npm.cmd run test;
- npm.cmd run lint;
- npm.cmd run prisma:generate si hubo cambios Prisma;
- npm.cmd run prisma:migrate si hubo migración;
- npm.cmd run prisma:seed si se ajustó seed;
- GET /health;
- endpoints de configuración responden;
- UI carga;
- se puede ver/crear/editar negocio básico;
- se puede ver/crear tienda/frente;
- se puede ver/crear persona/responsable;
- checklist de configuración mínima funciona;
- .env no se muestra ni versiona;
- OpenAI sigue apagado;
- WhatsApp sigue apagado.

## 14. Criterios de aceptación MVP 2.2

MVP 2.2 será aceptado si:

- existe una sección Configuración básica;
- el usuario puede entender y definir su negocio;
- el usuario puede definir tiendas/frentes;
- el usuario puede definir personas/responsables;
- la interfaz indica si la operación mínima está lista;
- se mantiene baja fricción;
- no se siente como configuración enterprise;
- no se pierde la home Mi día operativo;
- no se rompe MVP 1, MVP 2 ni MVP 2.1;
- no se conecta WhatsApp;
- no se conecta OpenAI;
- no se implementa identidad visual final;
- build/test/lint pasan.

## 15. Restricciones estrictas

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

## 16. Resultado esperado de Codex al ejecutar MVP 2.2

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

## 17. Cierre

MVP 2.2 debe dejar listo el contexto operativo mínimo para que MVP 2.3 pueda crear compromisos de forma natural.

La lógica es:

Primero configuro mi operación.
Después creo compromisos dentro de esa operación.
