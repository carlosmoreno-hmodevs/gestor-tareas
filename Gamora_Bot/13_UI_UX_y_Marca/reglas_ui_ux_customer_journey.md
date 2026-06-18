# Reglas UI/UX desde Customer Journey — Gamora Bot

## Versión
v0.1

## Estatus
Regla inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento define las reglas de experiencia de usuario que deberán guiar las futuras interfaces web/PWA de Gamora Bot.

Estas reglas no definen todavía identidad visual, paleta, logo ni sistema de diseño final.

El objetivo es asegurar que la interfaz evolucione desde el Customer Journey, la baja fricción y las necesidades reales del usuario.

## 2. Principio rector

“Más poder con menos fricción.”

Gamora Bot debe darle al usuario más control, trazabilidad y capacidad operativa, pero sin convertir la experiencia en una pantalla pesada, técnica o saturada.

## 3. Aprendizaje de MVP 2

MVP 2 logró su propósito técnico porque hizo visible el motor de compromisos: backend, base de datos, workspaces, usuarios, compromisos, acciones, timeline, audit y guardrails.

Sin embargo, como experiencia futura de producto, la pantalla actual debe entenderse como consola técnica neutral, no como UX final.

Riesgo observado:

La interfaz puede saturar al usuario si muestra demasiados módulos, tablas, bitácoras, estados y acciones al mismo tiempo.

Conclusión:

MVP 2 es válido como herramienta de validación técnica, pero las siguientes interfaces deben organizarse desde la intención del usuario.

## 4. Regla base: diseñar desde el Customer Journey

Cada pantalla futura debe corresponder a una etapa o necesidad del Customer Journey.

Ejemplos de etapas:

- descubrimiento;
- onboarding;
- creación del primer espacio de trabajo;
- enrolamiento de usuarios;
- creación del primer compromiso;
- seguimiento diario;
- revisión de evidencias;
- aprobación o corrección;
- cierre;
- consulta de pendientes;
- reporte/resumen;
- expansión de uso.

## 5. No diseñar desde entidades técnicas

Aunque el sistema tenga workspaces, users, commitments, audit logs, guardrails, timelines y state transitions, el usuario no necesariamente piensa así.

El usuario piensa en preguntas como:

- ¿Qué tengo pendiente?
- ¿Qué necesita mi atención?
- ¿Quién no ha respondido?
- ¿Qué se venció?
- ¿Qué me enviaron para revisar?
- ¿Qué ya se cerró?
- ¿Qué está atorado?
- ¿Qué hizo Panchito?
- ¿Qué debo hacer ahora?

Por eso, la UI debe traducir entidades técnicas a tareas humanas.

## 6. Regla de no saturación

La interfaz no debe mostrar todos los datos disponibles en la primera vista.

Reglas:

- resumen primero;
- detalle bajo demanda;
- una acción principal por sección;
- evitar tablas largas cuando el usuario necesita decisión rápida;
- evitar mostrar audit, timeline y guardrails como elementos principales salvo que sean necesarios;
- evitar pantallas con demasiadas columnas;
- evitar que todo compita visualmente al mismo tiempo.

## 7. Divulgación progresiva

Gamora debe mostrar información por niveles.

Nivel 1:
Qué requiere atención.

Nivel 2:
Por qué requiere atención.

Nivel 3:
Detalle, historial, evidencia y bitácora.

Nivel 4:
Logs técnicos, guardrails y auditoría avanzada.

Regla:

El usuario operativo no debe aterrizar directamente en el nivel 4.

## 8. Vistas futuras orientadas a intención

Proponer vistas futuras no técnicas:

### Mi día operativo

Mostrar lo que requiere atención hoy.

### Pendientes por revisar

Mostrar evidencias, avances o cierres que requieren validación.

### Compromisos vencidos o en riesgo

Mostrar casos que pueden generar problema.

### Responsables con pendientes

Mostrar personas con carga o retrasos.

### Actividad reciente

Mostrar cambios importantes sin saturar con logs técnicos.

### Detalle de compromiso

Mostrar solo lo necesario para decidir: qué, quién, cuándo, evidencia, estado, acción.

### Bitácora completa

Disponible, pero como detalle secundario.

## 9. Reglas para acciones

Las acciones deben ser claras y guiadas.

Reglas:

- mostrar solo acciones posibles según estado;
- ocultar acciones inválidas o mostrarlas deshabilitadas con explicación;
- pedir motivo solo cuando sea necesario;
- confirmar acciones críticas;
- explicar el resultado después de ejecutar;
- mostrar qué sigue después de cada acción.

## 10. Reglas para usuarios PyME

Considerar que el usuario PyME:

- no quiere configurar demasiado;
- no quiere aprender software complejo;
- opera con prisa;
- ya usa WhatsApp;
- quiere saber qué está pendiente;
- quiere evidencia rápida;
- quiere responsables claros;
- quiere evitar estar persiguiendo gente;
- necesita confianza sin sentirse vigilado.

La UI debe hablar su idioma, no el idioma técnico del sistema.

## 11. Diferencia entre consola técnica y producto final

### Consola técnica MVP

Sirve para validar motor, datos y endpoints.

### Producto final

Debe guiar al usuario, reducir fricción y presentar información priorizada.

MVP 2 pertenece a consola técnica neutral.

Las siguientes fases deberán evolucionar hacia producto usable.

## 12. Regla para futuras pantallas

Antes de construir una nueva pantalla, se debe documentar:

- usuario objetivo;
- momento del journey;
- problema que resuelve;
- acción principal;
- información mínima visible;
- información secundaria;
- datos ocultos hasta detalle;
- criterio de éxito de la pantalla.

## 13. Relación con identidad visual futura

La identidad visual de Gamora Bot se definirá después.

Cuando llegue esa fase, el diseño de marca deberá respetar estas reglas UX:

- claridad;
- simplicidad;
- baja fricción;
- confianza;
- trazabilidad;
- acción inmediata;
- progresividad;
- cero saturación innecesaria.

## 14. Implicaciones para próximos MVPs

- MVP 2 puede quedar como consola neutral de validación.
- MVP 3 o siguientes deben empezar a ordenar experiencia por intención.
- Antes de conectar WhatsApp real, la web debe permitir revisar y controlar sin saturación.
- Antes de diseñar marca final, debe definirse arquitectura UX.
- No se debe confundir “más datos” con “más valor”.

## 15. Criterios de aceptación UX futuros

Una interfaz futura será aceptable si:

- el usuario entiende qué debe hacer;
- la acción principal es clara;
- no se muestran datos innecesarios de inicio;
- el usuario puede profundizar si lo necesita;
- los errores son entendibles;
- los estados se explican en lenguaje humano;
- audit y timeline están disponibles sin dominar la pantalla;
- la interfaz reduce persecución manual;
- la interfaz reduce fricción;
- la interfaz da sensación de control.

## 16. Cierre

Gamora Bot debe evolucionar hacia un producto que convierta caos operativo en claridad accionable.

La interfaz debe ser una herramienta de foco, no una pantalla llena de datos.

El objetivo final es que el usuario sienta que Gamora le da más poder operativo con menos esfuerzo.
