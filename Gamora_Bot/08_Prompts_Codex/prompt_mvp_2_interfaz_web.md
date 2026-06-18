# Prompt MVP 2 — Interfaz Web Inicial de Control

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del prompt

Este prompt instruye a Codex para construir MVP 2 sobre el repositorio técnico existente de Gamora Bot.

MVP 2 debe convertir el motor backend de MVP 1 en una primera experiencia web/PWA operativa, visual y controlable.

El objetivo no es construir una interfaz final enterprise, sino una interfaz inicial que permita a Luis Felipe revisar y operar el motor de compromisos sin depender de Postman, comandos o pruebas manuales.

MVP 2 debe permitir:

- ver estado del sistema;
- ver workspaces;
- ver usuarios;
- ver compromisos;
- ver detalle de compromiso;
- ejecutar acciones de compromiso desde UI;
- ver timeline;
- ver audit logs básicos;
- ver guardrails;
- mostrar errores de transición de forma clara;
- mantener OpenAI y WhatsApp apagados.

## 2. Contexto que debe conocer Codex

Gamora Bot es un motor de compromisos operativos sobre WhatsApp Business.

Principios vigentes:

- WhatsApp será canal operativo, no fuente de verdad.
- Gamora Core es el sistema.
- Web/PWA es la capa formal de control.
- IA interpreta, backend gobierna, humano valida.
- AI & API Guardrails son obligatorios.
- No se leen chats personales.
- No se envían mensajes a usuarios no enrolados.
- Todo compromiso pertenece a un workspace.
- Todo cambio crítico queda en bitácora.
- Todo estado cambia mediante reglas controladas.

Estado técnico actual:

- MVP 0 creó el repositorio base.
- MVP 1 implementó motor de compromisos persistente sobre PostgreSQL real.
- Backend local funciona en `http://127.0.0.1:3001`.
- `GET /health` responde `status: ok` y `db: ok`.
- Endpoints REST iniciales ya existen.
- Seed demo contiene `Ferreteria Luisito`, `Luisito`, `Panchito`, `Rosita` y 3 compromisos demo.
- OpenAI no está conectado.
- WhatsApp no está conectado.
- No hay autenticación final todavía.
- No hay dashboard completo todavía.

## 3. Precondiciones obligatorias antes de ejecutar MVP 2

El prompt de ejecución de MVP 2 deberá validar:

- Existe el repositorio `C:\Users\Home\Documents\Gamora_Bot_MVP`.
- Existe `apps/web`.
- Existe `apps/api`.
- `package.json` raíz existe.
- `npm.cmd` funciona.
- Backend MVP 1 puede levantarse.
- `GET /health` responde.
- Base `gamora_bot_dev` funciona.
- Seed demo existe o endpoints responden con datos.
- `.env` está ignorado por Git.
- No hay credenciales versionadas.
- No hay OpenAI real activo.
- No hay WhatsApp real activo.

Si falta alguna precondición crítica:

- No avanzar.
- Reportar claramente el problema.
- No inventar éxito.

## 4. Alcance exacto de MVP 2

MVP 2 debe implementar:

- interfaz web inicial de control;
- consumo de endpoints backend MVP 1;
- layout base;
- navegación simple;
- panel de estado del sistema;
- vista de workspaces;
- vista de usuarios;
- vista de compromisos;
- vista de detalle de compromiso;
- panel de acciones de compromiso;
- timeline básico;
- audit básico;
- guardrails básicos;
- manejo visual de errores;
- estados de carga;
- estados vacíos;
- documentación de uso local;
- pruebas mínimas o validaciones de frontend.

MVP 2 no debe implementar:

- autenticación final;
- roles enterprise reales;
- permisos complejos;
- WhatsApp real;
- OpenAI real;
- webhooks productivos;
- notificaciones reales;
- evidencias reales;
- storage real;
- Mina Mercedes;
- Sunworks;
- proyectos/hitos avanzados;
- dashboard ejecutivo completo;
- diseño final comercial;
- staging;
- producción.

## 5. Principio UX del MVP 2

La interfaz debe ser sencilla, clara y funcional.

No se busca diseño final, pero sí debe sentirse como una primera consola real de control.

Principios:

- claridad antes que sofisticación;
- datos reales del backend antes que mock visual;
- acciones visibles pero controladas;
- errores entendibles;
- estados de compromiso con colores o etiquetas;
- trazabilidad visible;
- no ocultar fallos;
- no prometer WhatsApp/OpenAI si siguen apagados.

## Regla de diseño MVP 2: interfaz neutral sin identidad definitiva

MVP 2 deberá construir una interfaz funcional, plana, neutral y preparada para recibir diseño posterior.

Reglas visuales:

- No usar estilos heredados de VerifyQA, Orkesta, NILO ni otros proyectos.
- No crear identidad visual definitiva.
- No definir paleta de marca definitiva.
- No crear logotipo.
- No usar ilustraciones de marca.
- No usar avatares.
- No usar iconografía sofisticada salvo iconos básicos si ya existen.
- No usar gradientes complejos.
- No usar fondos decorativos.
- No usar sombras pesadas.
- No usar efectos visuales innecesarios.
- No instalar librerías UI pesadas solo para apariencia.
- No invertir tiempo en diseño comercial final.
- Sí usar layout claro.
- Sí usar tipografía del sistema.
- Sí usar colores neutros.
- Sí usar separación visual básica.
- Sí usar tablas, tarjetas simples o paneles limpios.
- Sí usar estados visuales básicos para compromisos.
- Sí usar mensajes de error claros.
- Sí preparar estructura de componentes para que después pueda aplicarse un sistema de diseño propio.

La finalidad de MVP 2 es validar operación visual del motor de compromisos, no construir todavía la identidad final de Gamora Bot.

El diseño final deberá desarrollarse después, con una fase dedicada a:

- manual de identidad;
- diseño de producto;
- sistema de componentes;
- paleta;
- tipografía;
- logo;
- lenguaje visual;
- experiencia PWA;
- criterios de accesibilidad;
- navegación final.

## 6. Vistas mínimas requeridas

Implementar o ajustar vistas dentro de `apps/web`.

Vistas sugeridas:

1. Home / Estado MVP
   - mostrar nombre Gamora Bot MVP;
   - mostrar estado del backend;
   - mostrar estado DB si está disponible;
   - mostrar versión conceptual MVP 2;
   - advertencia de que WhatsApp/OpenAI están apagados.

2. Workspaces
   - listar workspaces;
   - mostrar nombre, estado y fecha de creación;
   - permitir seleccionar workspace activo.

3. Usuarios
   - listar usuarios;
   - mostrar nombre, email, estatus y WhatsApp status;
   - mostrar asociación al workspace si la API lo permite.

4. Compromisos
   - listar compromisos;
   - filtrar o agrupar por estado si es simple;
   - mostrar título, responsable, estado, prioridad y fecha compromiso;
   - permitir abrir detalle.

5. Detalle de compromiso
   - mostrar datos principales;
   - mostrar responsable;
   - mostrar creador;
   - mostrar estado actual;
   - mostrar prioridad;
   - mostrar fecha compromiso;
   - mostrar unidad/frente si existe;
   - mostrar acciones disponibles.

6. Acciones del compromiso
   - permitir ejecutar acciones MVP 1:
     - `accept`;
     - `submit_for_review`;
     - `approve`;
     - `request_correction`;
     - `reject`;
     - `close`;
     - `cancel`;
     - `suspend_by_guardrail`.
   - solicitar `reason` cuando aplique:
     - `request_correction`;
     - `reject`;
     - `cancel`;
     - `suspend_by_guardrail`.
   - mostrar resultado;
   - refrescar compromiso y timeline tras acción.

7. Timeline
   - mostrar `StateTransition` del compromiso;
   - mostrar `fromState`;
   - mostrar `toState`;
   - mostrar `reason`;
   - mostrar fecha;
   - mostrar actor si está disponible.

8. Audit
   - mostrar eventos básicos por workspace;
   - no exponer información técnica sensible.

9. Guardrails
   - mostrar eventos guardrail del workspace;
   - si no hay eventos, mostrar estado vacío claro;
   - no activar bloqueos destructivos desde MVP 2 salvo que ya exista endpoint seguro.

## 7. Consumo de API

Crear o ajustar cliente API frontend para consumir backend local.

Base URL:

- usar variable de entorno frontend si ya existe;
- fallback local razonable: `http://127.0.0.1:3001`.

Reglas:

- no hardcodear secretos;
- no usar OpenAI;
- no usar WhatsApp;
- no usar APIs externas;
- manejar errores HTTP;
- mostrar mensajes claros al usuario;
- no ocultar errores de transición;
- no exponer `.env`.

Endpoints a consumir:

- `GET /health`
- `GET /api/workspaces`
- `GET /api/users`
- `GET /api/workspaces/:workspaceId/users`
- `GET /api/commitments`
- `GET /api/commitments/:id`
- `POST /api/commitments/:id/actions`
- `GET /api/commitments/:id/timeline`
- `GET /api/audit?workspaceId=...`
- `GET /api/guardrails?workspaceId=...`

Si algún endpoint no responde exactamente como se espera:

- no inventar datos;
- adaptar la UI al contrato real;
- documentar diferencia;
- no refactorizar backend masivamente salvo que sea indispensable y seguro.

## 8. Manejo de acciones

La UI debe permitir ejecutar acciones de compromiso de forma controlada.

Reglas:

- no ejecutar acción sin confirmación visual mínima;
- mostrar estado inicial y estado final;
- mostrar mensaje de error si la transición es inválida;
- no forzar cambios manuales;
- no cambiar estado directamente desde frontend;
- siempre usar `POST /api/commitments/:id/actions`;
- refrescar datos después de la acción;
- mostrar timeline actualizado si aplica.

Acciones:

- `accept`
- `submit_for_review`
- `approve`
- `request_correction`
- `reject`
- `close`
- `cancel`
- `suspend_by_guardrail`

Si el backend bloquea una transición:

- mostrar mensaje del backend;
- no tratarlo como error del sistema;
- explicar que la transición no está permitida por reglas del motor.

## 9. Manejo de estados

La UI debe mostrar estados de compromiso de forma entendible.

Estados mínimos:

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

Mostrar:

- etiqueta visual;
- texto legible;
- color o estilo básico si ya existe sistema visual;
- sin depender de librerías pesadas innecesarias.

## 10. Manejo de datos demo y residuales

Considerar que la base local puede contener:

- datos del seed demo;
- datos generados por pruebas automatizadas;
- datos generados por pruebas manuales.

Reglas:

- no borrar datos automáticamente;
- no resetear base;
- no ejecutar migraciones nuevas salvo que MVP 2 lo requiera y esté justificado;
- no limpiar base sin autorización;
- si hay datos residuales, mostrarlos como datos existentes;
- documentar si afecta visualmente.

## 11. Guardrails visuales

Mostrar en la UI:

- estado de guardrails por workspace;
- eventos guardrail si existen;
- mensaje claro si no hay eventos;
- advertencia de que OpenAI y WhatsApp están desactivados en MVP 2;
- no incluir botones que simulen envío real a WhatsApp;
- no incluir botones que llamen OpenAI.

Regla:

La interfaz no debe dar la impresión de que ya envía WhatsApp o usa IA real.

## 12. Frontend permitido

Codex puede:

- mejorar layout base;
- crear componentes simples;
- crear cliente API;
- crear vistas funcionales;
- crear estados de carga/error;
- crear estilos básicos;
- actualizar README con instrucciones;
- agregar pruebas frontend si el stack ya lo permite.

Codex no debe:

- rediseñar todo el proyecto;
- instalar librerías pesadas sin necesidad;
- implementar autenticación final;
- implementar diseño comercial final;
- implementar dashboards complejos;
- implementar rutas avanzadas si no son necesarias;
- crear dependencia con APIs externas.

## 13. Backend permitido durante MVP 2

MVP 2 es principalmente frontend.

Codex solo puede tocar backend si:

- existe un bug menor que impide a la UI consumir un endpoint ya definido;
- falta CORS para desarrollo local;
- falta un campo básico en respuesta ya disponible en base;
- falta manejo de error claro.

Reglas:

- no refactor masivo;
- no cambiar modelo Prisma salvo necesidad crítica;
- no crear nueva migración salvo que sea absolutamente indispensable y se justifique;
- no romper endpoints existentes;
- no modificar reglas de transición salvo bug evidente;
- no resetear base.

Si se requiere backend change:

- documentar archivo modificado;
- explicar razón;
- mantener alcance mínimo.

## 14. Pruebas y validaciones MVP 2

Validar:

- frontend compila;
- backend sigue compilando;
- `npm.cmd run build` pasa;
- `npm.cmd run test` pasa;
- `npm.cmd run lint` pasa;
- `GET /health` responde;
- vista web carga;
- workspaces se listan;
- users se listan;
- commitments se listan;
- detail carga;
- acción válida puede ejecutarse desde UI;
- transición inválida muestra error claro;
- timeline se actualiza;
- audit se consulta;
- guardrails se consultan;
- no hay llamadas OpenAI;
- no hay llamadas WhatsApp;
- `.env` no se versiona.

## 15. README y documentación técnica del repo

Actualizar README o docs internas del repo técnico con:

- qué incluye MVP 2;
- cómo levantar backend;
- cómo levantar frontend;
- cómo validar health;
- cómo usar interfaz inicial;
- qué endpoints consume;
- limitaciones;
- OpenAI apagado;
- WhatsApp apagado;
- no producción;
- no autenticación final;
- no subir `.env`.

No modificar documentación estratégica de Obsidian durante ejecución MVP 2 salvo autorización adicional.

## 16. Criterios de aceptación MVP 2

MVP 2 se considerará aceptado si:

- la web carga correctamente;
- muestra estado del backend/DB;
- lista workspaces;
- lista usuarios;
- lista compromisos;
- permite abrir detalle de compromiso;
- permite ejecutar al menos una acción válida;
- muestra error claro en una transición inválida;
- muestra timeline;
- muestra audit básico;
- muestra guardrails o estado vacío;
- conserva OpenAI apagado;
- conserva WhatsApp apagado;
- no versiona `.env`;
- no documenta contraseñas;
- no instala Docker/pnpm;
- no implementa Mina Mercedes/Sunworks;
- la interfaz es funcional y clara;
- la interfaz no usa identidad visual definitiva;
- la interfaz no hereda estilos de proyectos anteriores;
- la interfaz queda preparada para recibir diseño de marca posteriormente;
- pruebas/build/lint pasan.

## 17. Restricciones estrictas para Codex al ejecutar MVP 2

Incluir en el prompt final:

- No conectar OpenAI real.
- No conectar WhatsApp real.
- No usar WhatsApp Web.
- No usar credenciales reales de producción.
- No documentar contraseñas.
- No mostrar `.env`.
- No subir `.env`.
- No instalar Docker.
- No instalar pnpm.
- No cambiar a SQLite.
- No borrar datos existentes.
- No resetear base de datos.
- No crear migraciones salvo necesidad crítica y justificada.
- No implementar Mina Mercedes.
- No implementar Sunworks.
- No implementar dashboard enterprise completo.
- No implementar autenticación final.
- No hacer refactor masivo innecesario.
- No modificar Obsidian durante ejecución MVP 2 salvo permiso.

## 18. Resultado esperado de Codex al ejecutar MVP 2

Codex deberá entregar:

1. Resumen de archivos modificados en el repositorio técnico.
2. Componentes web creados/modificados.
3. Cliente API creado/modificado.
4. Backend modificado, si aplica.
5. Validaciones realizadas.
6. Errores o pendientes.
7. Confirmación de que no se documentó contraseña.
8. Confirmación de que `.env` no fue mostrado ni versionado.
9. Confirmación de que no se conectó OpenAI.
10. Confirmación de que no se conectó WhatsApp.
11. Confirmación de que no se instaló Docker ni pnpm.
12. Confirmación de que no se implementó Mina Mercedes ni Sunworks.
13. Recomendación del siguiente paso técnico.

## 19. Cierre del prompt

MVP 2 debe hacer visible y operable el motor inicial de compromisos, sin añadir todavía canales externos.

MVP 2 debe ser el puente entre el backend funcional de MVP 1 y la futura operación real por WhatsApp, permitiendo primero control visual, validación humana y trazabilidad desde web.

Al terminar la redacción del documento:

- Entrega resumen de cambios.
- Confirma que solo modificaste `08_Prompts_Codex/prompt_mvp_2_interfaz_web.md`.
- No ejecutes MVP 2.
- No modifiques el repositorio técnico.
- No avances a prompts posteriores.
