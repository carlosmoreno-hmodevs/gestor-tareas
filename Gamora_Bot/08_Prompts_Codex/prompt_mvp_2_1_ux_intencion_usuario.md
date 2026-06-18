# Prompt MVP 2.1 — Reordenamiento UX por Intención del Usuario

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del prompt

Este prompt instruirá a Codex para ejecutar MVP 2.1 sobre el repositorio técnico existente.

MVP 2.1 debe tomar la consola técnica neutral de MVP 2 y reorganizarla hacia una experiencia web más alineada al Customer Journey, centrada en intención del usuario y menor fricción.

El objetivo no es rediseñar visualmente Gamora Bot ni crear marca final.

El objetivo es cambiar la lógica de navegación y presentación de información para que el usuario vea primero:

- qué requiere atención;
- qué está vencido o en riesgo;
- qué requiere revisión;
- qué compromisos están activos;
- qué acciones puede tomar;
- qué pasó recientemente;
- qué necesita hacer ahora.

## 2. Contexto que debe conocer Codex

Gamora Bot es un motor de compromisos operativos trazables sobre WhatsApp Business, con web/PWA como capa formal de control.

Estado actual:

- MVP 0 creó la base técnica.
- MVP 1 creó el motor inicial de compromisos con PostgreSQL real.
- MVP 2 creó una consola web neutral para operar el motor.
- MVP 2 fue validado como consola técnica, no como UX final.
- La interfaz actual muestra backend/DB, workspaces, users, commitments, detail, actions, timeline, audit y guardrails.
- Esa información es útil técnicamente, pero puede saturar al usuario si se presenta como experiencia final.

Principio rector:

“Más poder con menos fricción.”

Regla estratégica:

La interfaz futura debe diseñarse desde el Customer Journey y las necesidades reales del usuario, no desde la cantidad de entidades técnicas disponibles.

## 3. Precondiciones obligatorias antes de ejecutar MVP 2.1

El prompt de ejecución de MVP 2.1 deberá validar:

- Existe el repositorio técnico `C:\Users\Home\Documents\Gamora_Bot_MVP`.
- MVP 2 está funcionando.
- `apps/web` existe.
- `apps/api` existe.
- `npm.cmd` funciona.
- Backend local puede levantarse.
- `GET /health` responde `status: ok` y `db: ok`.
- Endpoints de workspaces, users, commitments, timeline, audit y guardrails responden.
- `.env` está ignorado por Git.
- No hay credenciales versionadas.
- OpenAI sigue apagado.
- WhatsApp sigue apagado.

Si alguna precondición crítica falla:

- No avanzar.
- Reportar claramente el problema.
- No inventar éxito.

## 4. Alcance exacto de MVP 2.1

MVP 2.1 debe implementar una reorganización UX de la web actual.

Debe incluir:

- nueva home orientada a “Mi día operativo”;
- navegación por intención del usuario;
- resumen de lo que requiere atención;
- compromisos vencidos o en riesgo;
- compromisos pendientes por revisión;
- compromisos activos;
- actividad reciente relevante;
- acceso a detalle de compromiso;
- timeline y audit como detalle secundario;
- guardrails como sección secundaria de control;
- acciones disponibles según estado;
- estados vacíos explicativos;
- mensajes de error claros;
- interfaz neutral, plana, sin identidad visual final.

MVP 2.1 no debe implementar:

- WhatsApp real;
- OpenAI real;
- identidad visual final;
- logo final;
- paleta final de marca;
- manual de marca;
- autenticación final;
- permisos enterprise complejos;
- evidencias reales;
- storage real;
- Mina Mercedes;
- Sunworks;
- dashboard enterprise completo;
- staging;
- producción.

## 5. Principio UX obligatorio

MVP 2.1 debe aplicar:

“Más poder con menos fricción.”

Esto significa:

- mostrar primero lo que requiere atención;
- ocultar complejidad secundaria hasta que el usuario la necesite;
- evitar que todo compita visualmente;
- reducir tablas largas en la pantalla inicial;
- priorizar acciones claras;
- usar lenguaje humano;
- explicar estados;
- no hacer que el usuario navegue por estructuras técnicas.

## 6. Navegación propuesta para MVP 2.1

Reorganizar la navegación actual hacia secciones por intención:

1. Mi día operativo
2. Compromisos
3. Pendientes por revisar
4. Personas
5. Actividad
6. Control
7. Configuración básica, si ya existe o puede representarse sin complejidad

### Mi día operativo

Pantalla principal.

Debe responder: ¿qué necesita mi atención hoy?

### Compromisos

Listado funcional de compromisos, con filtros simples.

### Pendientes por revisar

Compromisos en estado de revisión, corrección o espera de validación.

### Personas

Responsables y carga básica de pendientes.

### Actividad

Historial reciente entendible, no log técnico puro.

### Control

Guardrails, audit y estado técnico secundario.

### Configuración básica

Workspace y usuarios, sin convertirlo en panel enterprise.

## 7. Pantalla principal: Mi día operativo

La home de MVP 2.1 debe dejar de ser una consola técnica y convertirse en una vista de foco.

Debe mostrar bloques como:

- Estado del sistema, compacto.
- Acciones que requieren atención.
- Compromisos vencidos o en riesgo.
- Pendientes por revisar.
- Compromisos activos.
- Responsables con más pendientes.
- Actividad reciente relevante.
- Acceso rápido a crear o revisar compromiso, si ya existe la capacidad.

No debe mostrar de inicio:

- todos los audit logs;
- todos los guardrails;
- todas las transiciones;
- todos los datos técnicos;
- tablas largas como primera experiencia.

## 8. Jerarquía de información

Aplicar capas:

Nivel 1 — Acción

Qué debo hacer ahora.

Nivel 2 — Contexto

Por qué importa.

Nivel 3 — Detalle

Datos del compromiso, responsable, fecha, estado.

Nivel 4 — Trazabilidad

Timeline, audit, guardrails y logs.

Regla:

El usuario no debe aterrizar directamente en nivel 4.

## 9. Traducción de lenguaje técnico a lenguaje humano

Reemplazar o complementar lenguaje técnico:

- Workspace -> Mi negocio / espacio operativo
- User -> Persona / responsable
- WorkspaceUser -> Participante
- Commitment -> Compromiso
- StateTransition -> Cambio de estado
- AuditLog -> Bitácora / historial
- GuardrailEvent -> Alerta de control
- Timeline -> Historia del compromiso
- ApiUsageLog -> Consumo del sistema

Regla:

El código puede seguir usando nombres técnicos internamente, pero la UI debe hablar como usuario.

## 10. Compromisos por atención requerida

La vista principal debe clasificar compromisos de forma útil:

- Vencidos o en riesgo.
- Pendientes por aceptar.
- En proceso.
- En revisión.
- Con corrección solicitada.
- Aprobados pendientes de cierre.
- Cerrados recientes.

No basta con listar todo.

Si el backend no tiene endpoint agregado para esto:

- calcularlo en frontend con los datos disponibles;
- no crear migraciones;
- no cambiar modelo Prisma salvo necesidad crítica;
- documentar si el cálculo es frontend temporal.

## 11. Acciones disponibles según estado

La UI debe mostrar acciones posibles de forma inteligente.

Reglas:

- mostrar acciones disponibles según estado actual;
- ocultar o deshabilitar acciones inválidas;
- si se muestran deshabilitadas, explicar por qué;
- pedir motivo solo cuando aplique;
- confirmar acciones críticas;
- mostrar resultado después de ejecutar;
- refrescar datos tras la acción.

Acciones disponibles:

- `accept`
- `submit_for_review`
- `approve`
- `request_correction`
- `reject`
- `close`
- `cancel`
- `suspend_by_guardrail`

No cambiar estados directamente desde frontend.

Usar siempre `POST /api/commitments/:id/actions`.

## 12. Detalle de compromiso

El detalle debe quedar como pantalla secundaria.

Debe mostrar:

- título;
- estado;
- responsable;
- fecha compromiso;
- prioridad;
- descripción;
- evidencia esperada si existe;
- acciones disponibles;
- historia/timeline colapsable;
- bitácora colapsable;
- alertas de control si existen.

Regla:

Timeline y audit deben estar disponibles, pero no dominar la primera vista.

## 13. Personas

La sección Personas debe mostrar a los responsables desde una lógica operativa:

- nombre;
- rol o participación;
- estatus;
- compromisos activos;
- vencidos o pendientes, si puede calcularse;
- últimas acciones, si existe información.

No debe sentirse como una tabla técnica de usuarios.

Si los cálculos no están disponibles en backend:

- calcular en frontend si es sencillo;
- documentar limitaciones.

## 14. Actividad

La sección Actividad debe traducir audit/timeline a historial entendible.

Ejemplos:

- Luisito creó un compromiso.
- Panchito aceptó un compromiso.
- Se solicitó corrección.
- Un compromiso fue cerrado.

No mostrar JSON crudo.

No saturar con logs técnicos.

No mostrar información sensible.

## 15. Control y guardrails

La sección Control puede mostrar:

- estado de backend;
- estado DB;
- OpenAI apagado;
- WhatsApp apagado;
- guardrails sin eventos o con eventos;
- audit básico secundario.

Regla:

Control es importante, pero no debe ser la pantalla principal para usuario operativo.

## 16. Estados vacíos

Crear estados vacíos útiles:

- No tienes pendientes por revisar.
- No hay compromisos vencidos.
- No hay guardrails activos.
- No hay actividad reciente.
- Aún no hay responsables con pendientes.

Cada estado vacío debe explicar qué significa y, si aplica, sugerir siguiente acción.

## 17. Manejo de errores

Los errores deben ser humanos y accionables.

Ejemplos:

- “Esta acción no está permitida desde el estado actual.”
- “Primero el responsable debe aceptar el compromiso.”
- “No pudimos cargar los compromisos. Revisa que el backend esté encendido.”
- “La base de datos no respondió.”

No mostrar errores técnicos crudos salvo en detalle secundario.

## 18. Diseño visual permitido

Mantener diseño:

- neutral;
- plano;
- claro;
- legible;
- sin identidad final;
- sin estilos heredados;
- sin gradientes complejos;
- sin sombras pesadas;
- sin iconografía sofisticada;
- sin librerías UI pesadas innecesarias.

Permitido:

- layout más ordenado;
- paneles simples;
- tarjetas claras;
- etiquetas de estado;
- tablas compactas;
- separación visual;
- tipografía del sistema;
- colores neutros.

## 19. Backend permitido durante MVP 2.1

MVP 2.1 debe ser principalmente frontend.

Codex solo puede tocar backend si:

- falta CORS;
- un endpoint impide la UI por un bug menor;
- falta un campo básico ya disponible en base;
- hay un error de contrato entre frontend y backend.

No permitido:

- refactor masivo;
- nuevas migraciones salvo necesidad crítica;
- reset de base;
- cambios de modelo Prisma;
- cambios profundos de reglas de transición;
- borrar datos.

Si se toca backend:

- documentar exactamente qué y por qué.

## 20. Datos existentes y residuales

La base local puede contener datos del seed y de pruebas.

Reglas:

- no borrar datos;
- no resetear base;
- no limpiar datos sin autorización;
- mostrar datos existentes;
- si hay ruido visual por datos de prueba, documentarlo.

## 21. README y documentación técnica

Actualizar README o docs internas del repo técnico con:

- qué incluye MVP 2.1;
- cómo levantar backend;
- cómo levantar frontend;
- qué cambió respecto a MVP 2;
- explicación de “Mi día operativo”;
- limitaciones;
- OpenAI apagado;
- WhatsApp apagado;
- no producción;
- no identidad visual final;
- no subir `.env`.

No modificar documentación estratégica de Obsidian durante ejecución MVP 2.1 salvo autorización explícita.

## 22. Validaciones finales esperadas

Al ejecutar MVP 2.1, Codex deberá validar:

- `npm.cmd run build`;
- `npm.cmd run test`;
- `npm.cmd run lint`;
- `GET /health`;
- web local carga;
- Mi día operativo muestra datos;
- compromisos se agrupan por atención requerida;
- pendientes por revisar se muestran;
- vencidos o en riesgo se muestran o estado vacío correcto;
- detalle de compromiso carga;
- timeline está disponible como detalle secundario;
- audit está disponible como detalle secundario;
- guardrails están disponibles como control secundario;
- acción válida sigue funcionando;
- transición inválida muestra error entendible;
- OpenAI sigue apagado;
- WhatsApp sigue apagado;
- `.env` no se muestra ni se versiona.

## 23. Criterios de aceptación MVP 2.1

MVP 2.1 será aceptado si:

- la home ya no se siente como consola técnica pura;
- existe una vista “Mi día operativo” o equivalente;
- el usuario ve primero lo que requiere atención;
- la navegación se organiza por intención;
- compromisos pueden consultarse sin saturación inicial;
- timeline, audit y guardrails quedan disponibles pero secundarios;
- acciones siguen funcionando;
- errores son claros;
- no se pierde funcionalidad de MVP 2;
- no se rompe MVP 1;
- no se conecta WhatsApp;
- no se conecta OpenAI;
- no se implementa marca final;
- no se instala Docker/pnpm;
- build/test/lint pasan.

## 24. Restricciones estrictas para Codex al ejecutar MVP 2.1

Incluir en el prompt final:

- No conectar OpenAI real.
- No conectar WhatsApp real.
- No usar WhatsApp Web.
- No mostrar `.env`.
- No versionar `.env`.
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

## 25. Resultado esperado de Codex al ejecutar MVP 2.1

Codex deberá entregar:

1. Resumen de archivos modificados en el repositorio técnico.
2. Componentes web creados/modificados.
3. Cambios UX realizados.
4. Cliente API modificado, si aplica.
5. Backend modificado, si aplica.
6. Validaciones realizadas.
7. Errores o pendientes.
8. Confirmación de que no se conectó OpenAI.
9. Confirmación de que no se conectó WhatsApp.
10. Confirmación de que `.env` no fue mostrado ni versionado.
11. Confirmación de que no instaló Docker ni pnpm.
12. Confirmación de que no implementó identidad visual final.
13. Confirmación de que no implementó Mina Mercedes ni Sunworks.
14. Recomendación del siguiente paso técnico.

## 26. Cierre del prompt

MVP 2.1 debe ser el primer paso para transformar la consola técnica de MVP 2 en una experiencia orientada al usuario.

No debe buscar perfección visual ni marca final.

Debe lograr que Gamora Bot empiece a sentirse menos como una tabla técnica y más como una guía operativa que ayuda al usuario a saber qué pasó, qué falta y qué debe hacer.

Al terminar la redacción del documento:

- Entrega resumen de cambios.
- Confirma que solo creaste `08_Prompts_Codex/prompt_mvp_2_1_ux_intencion_usuario.md`.
- Confirma que no modificaste roadmap maestro.
- Confirma que no modificaste decision_log.
- Confirma que no modificaste el repositorio técnico.
- Confirma que no ejecutaste código.
- Confirma que no avanzaste a MVP 2.1 ni MVP 3.
