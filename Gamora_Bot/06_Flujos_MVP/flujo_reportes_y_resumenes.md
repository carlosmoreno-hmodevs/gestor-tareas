# Flujo MVP — Reportes y Resúmenes

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del flujo

Este flujo documenta cómo un usuario autorizado consulta el estado de los compromisos, recibe resúmenes y obtiene visibilidad operativa sin buscar entre chats.

El objetivo es que Gamora Bot permita responder preguntas operativas básicas: qué está pendiente, qué venció, qué evidencia debe revisarse, qué tiene cada responsable, qué se cerró recientemente y cómo va el consumo básico de WhatsApp/IA.

Este documento no define modelo técnico, base de datos, APIs, endpoints ni código. Es un flujo funcional para orientar el MVP.

## 2. Principios del flujo

- Los reportes deben basarse en estados reales de Gamora Core.
- Las consultas deben filtrarse por rol y permisos.
- WhatsApp sirve para consultas rápidas.
- Web/PWA sirve para tablero y análisis visual básico.
- No se deben exponer datos de otros espacios de trabajo.
- No se deben generar resúmenes infinitos ni repetitivos.
- Los reportes deben distinguir pendientes, vencidos, evidencias en revisión, aprobados, cerrados y bloqueados por guardrail.
- Se debe poder consultar consumo básico de WhatsApp/IA.
- IA puede redactar resumen, pero no inventar datos.
- Si el reporte es largo o visual, Gamora debe ofrecer enlace a web/PWA.

## 3. Actores

### Coordinador / gerente

Usuario que necesita visibilidad operativa sobre pendientes, vencidos, evidencias y responsables.

Ejemplos: Luisito en Ferretería Luisito; Luis Felipe en Mina Mercedes.

### Supervisor / validador

Usuario que necesita conocer evidencias pendientes de revisión, entregas tardías o correcciones solicitadas.

### Administrador

Usuario autorizado para consultar configuración, usuarios, guardrails y consumo básico.

### Responsable operativo

Usuario que puede consultar sus propios pendientes, compromisos aceptados, vencidos o correcciones pendientes.

### Gamora Bot

Canal que recibe consultas por WhatsApp, responde resúmenes breves y dirige a web/PWA cuando se requiere más detalle.

### Web/PWA

Capa de tablero, filtros, revisión visual, evidencias y reportes operativos.

### Backend / Gamora Core

Núcleo funcional que consulta estados reales, permisos, bitácora, evidencias, guardrails y consumo disponible.

### IA auxiliar

Ayuda a interpretar consultas y redactar resúmenes, pero no inventa datos ni modifica estados.

### Guardrails

Controlan límites de consultas, consumo de IA, reportes repetitivos, loops y exposición indebida de información.

## 4. Precondiciones

- Empresa creada.
- Usuarios enrolados.
- Compromisos existentes.
- Estados actualizados.
- Bitácora activa.
- Permisos definidos.
- Guardrails operando dentro de límites.
- Web/PWA disponible para vistas ampliadas.

## 5. Flujo A — Consulta rápida por WhatsApp

### Ejemplos

- “Gamora, ¿qué está pendiente hoy?”
- “¿Qué tiene pendiente Panchito?”
- “¿Qué está vencido?”
- “¿Qué evidencias tengo que revisar?”

### Pasos

1. Usuario consulta por WhatsApp.
2. Gamora identifica usuario enrolado.
3. Backend valida rol, empresa y permisos.
4. IA auxiliar interpreta la consulta si aplica.
5. Backend consulta estados reales.
6. Gamora responde con resumen breve.
7. Si hay demasiados resultados, Gamora ofrece filtros o enlace a web/PWA.
8. Bitácora registra consulta si aplica.

### Regla

La respuesta debe ser útil, breve y basada en datos reales. Si el usuario no tiene permiso para consultar cierto alcance, Gamora debe limitar la respuesta.

## 6. Flujo B — Consulta por responsable

### Ejemplo

“Gamora, ¿qué tiene pendiente Panchito?”

### Debe mostrar

- Compromisos pendientes de aceptación.
- Compromisos en proceso.
- Compromisos vencidos.
- Evidencias pendientes de revisión.
- Cerrados recientes si se solicita.

### Reglas

- Solo mostrar información permitida por rol.
- No exponer compromisos de otra unidad si el usuario no tiene permiso.
- Si Panchito no existe o no está enrolado, responder claramente.
- Si hay varios usuarios con nombre similar, Gamora debe pedir aclaración.

### Respuesta funcional esperada

Gamora debe separar los compromisos por estado, evitando mezclar vencidos con pendientes normales o evidencias en revisión con compromisos todavía no aceptados.

## 7. Flujo C — Consulta de evidencias en revisión

### Ejemplo

“Gamora, ¿qué evidencias tengo que revisar?”

### Pasos

1. Gamora valida que el usuario sea coordinador/validador.
2. Lista compromisos con evidencia pendiente de revisión.
3. Agrupa por responsable, unidad o prioridad si aplica.
4. Ofrece enlace a web/PWA para revisar.
5. No permite aprobar desde resumen si el flujo requiere revisar evidencia.

### Regla

Consulta no equivale a aprobación.

La evidencia puede consultarse como pendiente, pero la decisión de aprobar, rechazar o pedir corrección debe respetar permisos y flujo de revisión.

## 8. Flujo D — Resumen diario automático

### Pasos

1. Gamora genera resumen diario para usuarios autorizados.
2. Incluye:
   - compromisos creados;
   - compromisos cerrados;
   - vencidos;
   - evidencias recibidas;
   - evidencias pendientes de revisión;
   - correcciones solicitadas;
   - próximos vencimientos;
   - guardrails relevantes si aplica.
3. Se envía por WhatsApp solo si el usuario tiene opt-in y canal activo.
4. Si hay muchas líneas, se resume y se ofrece enlace a web/PWA.

### Reglas

- Resumen configurable.
- No saturar.
- Agrupar notificaciones.
- Respetar opt-out.
- Registrar consumo.
- No generar resúmenes si no hay datos relevantes, salvo configuración expresa.

## 9. Flujo E — Tablero web/PWA

### Pasos

1. Usuario entra a web/PWA.
2. Ve tablero por estados.
3. Puede filtrar por:
   - responsable;
   - unidad/frente;
   - estado;
   - vencimiento;
   - evidencia pendiente;
   - prioridad;
   - guardrail/bloqueo.
4. Puede abrir compromiso y ver bitácora.
5. Puede revisar evidencias si tiene permiso.

### Regla

La web/PWA debe mostrar mayor detalle que WhatsApp, pero sin convertirse en un sistema pesado de gestión total de proyectos.

## 10. Flujo F — Consulta de consumo básico y guardrails

### Ejemplos

- “Gamora, ¿cómo va el consumo de mensajes?”
- “¿Estamos cerca del límite de IA?”
- “¿Hay flujos bloqueados?”

### Pasos

1. Usuario autorizado consulta.
2. Backend valida rol administrador/coordinador.
3. Gamora muestra consumo básico:
   - mensajes WhatsApp usados;
   - llamadas IA estimadas;
   - recordatorios enviados;
   - límites alcanzados;
   - flujos pausados o bloqueados.
4. Ofrece revisar detalle en web/PWA.

### Reglas

- No exponer costos o consumos a usuarios sin rol.
- No inventar estimaciones no disponibles.
- Si no hay medición exacta, decir “pendiente de medición técnica” o mostrar consumo básico disponible.
- Si un límite está alcanzado, Gamora debe indicarlo como estado funcional, no como falla oculta.

## 11. Flujo G — Reporte con datos insuficientes o ambiguos

### Ejemplo

“Gamora, ¿cómo vamos?”

### Pasos

1. IA detecta consulta general.
2. Backend define si puede responder con resumen general.
3. Si hay muchas opciones, Gamora pregunta:
   - ¿Quieres pendientes de hoy?
   - ¿Vencidos?
   - ¿Evidencias en revisión?
   - ¿Resumen por responsable?
4. Si el usuario no responde, flujo queda pausado.

### Reglas

- No generar reportes enormes por WhatsApp.
- Usar menú guiado.
- Ofrecer web/PWA.
- Si la intención sigue ambigua después de varios intentos, pausar flujo.
- No consumir IA indefinidamente para reformular la misma consulta.

## 12. Estados usados en el flujo

| Momento | Estado de conversación | Estado IA | Estado notificación/reporte | Estado guardrail |
|---|---|---|---|---|
| Consulta clara | Intención detectada | No requerida o interpretación generada | Reporte enviado | Normal |
| Consulta ambigua | Intención ambigua | Baja confianza | No enviado | Normal |
| Se ofrecen opciones | Menú guiado | Menú guiado requerido | No enviado | Normal |
| Resumen enviado | Flujo completado | Interpretación generada si aplica | Reporte enviado | Normal |
| Resultado largo | Flujo completado | Interpretación generada si aplica | Agrupado en resumen | Normal |
| Consulta sin permisos | Flujo completado | No requerida | Consulta bloqueada | Normal |
| Límite alcanzado | Flujo bloqueado por guardrail | Límite alcanzado | Bloqueado por guardrail | Límite alcanzado |
| Resumen repetitivo | Flujo pausado | Bloqueada por guardrail | Bloqueado por guardrail | Cerca de límite |

## 13. Bitácora requerida

El flujo debe registrar los siguientes eventos cuando apliquen:

- Consulta recibida.
- IA utilizada para interpretar.
- Reporte generado.
- Resumen enviado.
- Enlace web/PWA ofrecido.
- Consulta bloqueada por permisos.
- Consulta bloqueada por guardrail.
- Consumo reportado.
- Error o límite alcanzado.
- Menú guiado ofrecido.
- Flujo pausado por ambigüedad.

## 14. Guardrails aplicables

- Límite de consultas por usuario/periodo.
- Límite de uso de IA para resúmenes.
- No reportes infinitos.
- No respuestas repetitivas en loop.
- Agrupar resultados largos.
- Ofrecer web/PWA si excede longitud razonable.
- No exponer datos sin permisos.
- No inventar datos faltantes.
- Registrar consumo.
- Bloquear consulta si se alcanza límite.
- Respetar opt-out para resúmenes automáticos por WhatsApp.
- Evitar reenvío duplicado de resúmenes por evento repetido.

## 15. Notificaciones y resúmenes

### Resumen diario

Resumen automático configurable que muestra actividad relevante del día.

### Resumen bajo demanda

Respuesta generada cuando un usuario autorizado consulta por WhatsApp o web/PWA.

### Notificación de evidencias pendientes

Aviso para coordinadores o validadores con evidencias esperando revisión.

### Notificación de vencidos

Aviso sobre compromisos vencidos, separado de pendientes normales.

### Notificación de guardrail/límite

Aviso para administrador o coordinador cuando se alcance o se acerque un límite relevante.

### Resumen agrupado

Agrupación de notificaciones para reducir costo, ruido y saturación.

### Enlace a web/PWA

Recurso para continuar revisión detallada, filtros o análisis visual.

## 16. Salidas posibles del flujo

- Resumen breve enviado.
- Reporte agrupado enviado.
- Enlace a web/PWA enviado.
- Menú guiado ofrecido.
- Consulta bloqueada por permisos.
- Consulta bloqueada por guardrail.
- Consumo básico reportado.
- Flujo pausado por ambigüedad.
- Resumen automático omitido por falta de datos relevantes o por configuración.

## 17. Criterios de aceptación funcional

- Usuario autorizado puede consultar pendientes.
- Las respuestas respetan permisos.
- Se distinguen estados reales.
- Evidencias en revisión aparecen claramente.
- Vencidos aparecen separados de pendientes normales.
- Resumen diario no satura.
- Si hay demasiados datos, Gamora ofrece web/PWA.
- IA no inventa datos.
- Consumo básico/guardrails puede consultarse por rol autorizado.
- Todo reporte relevante queda registrado si aplica.
- Consultas ambiguas pasan a menú guiado.
- Resúmenes automáticos respetan opt-in, opt-out y canal activo.

## 18. Cierre del flujo

Este flujo entrega visibilidad operativa: Gamora no solo registra compromisos, también permite saber qué está pendiente, qué venció, qué requiere revisión y qué ya fue cerrado.

El valor del flujo está en evitar que el usuario tenga que buscar entre chats. Gamora convierte estados, evidencias y bitácora en respuestas útiles, resúmenes controlados y tableros básicos, siempre filtrados por permisos y protegidos por guardrails.
