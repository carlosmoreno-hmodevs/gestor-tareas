# Flujo MVP — Caso Mina Mercedes

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del flujo

Este flujo documenta un caso realista multi-actor donde Luis Felipe coordina compromisos operativos con contratistas y cliente interno.

El caso Mina Mercedes permite probar cómo Gamora Bot ayuda a registrar, asignar, recordar, evidenciar, revisar y cerrar compromisos que normalmente quedarían dispersos en conversaciones de WhatsApp.

El flujo busca demostrar cómo Gamora evita que Luis Felipe olvide pedir reportes, cotizaciones, techos presupuestales y evidencias, usando WhatsApp como canal operativo y web/PWA como capa formal de control.

## 2. Contexto operativo

Mina Mercedes representa un frente operativo donde existen varios temas tecnológicos abiertos, múltiples responsables y dependencias entre personas.

Heriberto es superintendente de TI de la mina y funciona como solicitante, cliente interno o validador posible de algunos entregables.

Luis Felipe actúa como intermediario y coordinador principal. Su trabajo consiste en dar seguimiento a contratistas, recopilar reportes, pedir cotizaciones, validar entregables y mantener informado a Heriberto.

Los responsables operativos principales son:

- Fermín: CCTV, barreras, biométricos y control de accesos.
- Román: telecomunicaciones.
- Ariel: servidores, storage, switches, virtualización e infraestructura tecnológica.

El problema operativo es que Luis Felipe gestiona muchos frentes simultáneamente y puede olvidar pedir reportes, cotizaciones o insumos clave hasta que Heriberto se lo recuerda.

Gamora Bot debe funcionar como memoria operativa y capa formal de seguimiento para que cada compromiso tenga responsable, fecha, evidencia, estado, notificación y bitácora.

## 3. Actores

### Luis Felipe

Coordinador principal. Crea compromisos, da seguimiento, revisa evidencias y consulta reportes.

### Heriberto

Solicitante / cliente interno / validador posible. Solicita información, define techos presupuestales y puede validar entregables si está enrolado.

### Fermín

Responsable operativo para CCTV, barreras, biométricos y control de accesos.

### Román

Responsable operativo para telecomunicaciones y cotizaciones relacionadas con torres y repetidores.

### Ariel

Responsable operativo de servidores, storage, switches, virtualización e infraestructura tecnológica. Su avance puede depender de insumos de Heriberto.

### Gamora Bot

Canal formal que recibe instrucciones, confirma compromisos, notifica responsables, recibe evidencias y genera recordatorios/resúmenes.

### Web/PWA

Capa de control donde Luis Felipe revisa evidencias, consulta bitácora, filtra pendientes y valida entregables.

### IA auxiliar

Interpreta mensajes de Luis Felipe, detecta responsables, fechas, evidencias esperadas y dependencias posibles.

### Guardrails

Controlan límites, duplicados, reintentos, mensajes a no enrolados, creación ambigua y consumo de WhatsApp/IA.

## 4. Compromisos del caso

| Compromiso | Responsable | Solicitante / interesado | Evidencia esperada | Fecha compromiso | Dependencia | Validador |
|---|---|---|---|---|---|---|
| Enviar reporte PDF para TI y Seguridad Patrimonial. | Fermín | Luis Felipe / Heriberto | PDF de reporte. | Hoy antes de las 11:00. | Ninguna inicial. | Luis Felipe o Heriberto si está enrolado. |
| Enviar cotización de mantenimiento de torres. | Román | Luis Felipe / Heriberto | Cotización en PDF o documento. | Fecha definida por Luis Felipe. | Ninguna inicial. | Luis Felipe. |
| Enviar cotización de repetidores de telefonía celular. | Román | Luis Felipe / Heriberto | Cotización en PDF o documento. | Fecha definida por Luis Felipe. | Ninguna inicial. | Luis Felipe. |
| Definir techos presupuestales para proyecto de infraestructura tecnológica. | Heriberto | Luis Felipe / Ariel | Montos, rangos o documento de techos presupuestales. | Fecha definida por Luis Felipe. | Insumo requerido para Ariel. | Luis Felipe. |
| Terminar cotización de servidores/storage/switches/virtualización. | Ariel | Luis Felipe / Heriberto | Cotización técnica/comercial. | Fecha dependiente de insumo. | Techos presupuestales de Heriberto. | Luis Felipe. |

## 5. Flujo A — Configuración del frente Mina Mercedes

1. Luis Felipe crea espacio/frente Mina Mercedes en Gamora.
2. Registra actores: Heriberto, Fermín, Román y Ariel.
3. Invita a Fermín, Román, Ariel y Heriberto.
4. Cada usuario acepta enrolamiento desde su propio WhatsApp.
5. Gamora registra roles.
6. Queda listo el frente para compromisos.

### Regla

Nadie recibe compromisos por WhatsApp sin enrolamiento.

Si Heriberto no está enrolado, Gamora no debe enviarle solicitudes por WhatsApp. En ese caso, Luis Felipe puede registrar el compromiso internamente o invitarlo a participar.

## 6. Flujo B — Creación de compromisos por WhatsApp

### Ejemplo

“Gamora, crea pendiente para Fermín: enviar reporte PDF para TI y Seguridad Patrimonial de Mina Mercedes hoy antes de las 11.”

### Pasos

1. Luis Felipe escribe al WhatsApp de Gamora.
2. IA interpreta intención, responsable, frente, fecha y evidencia esperada.
3. Backend valida rol, frente y responsable.
4. Gamora confirma resumen.
5. Luis Felipe confirma.
6. Compromiso queda creado.
7. Gamora notifica a Fermín.
8. Fermín acepta.

### Repetición conceptual

El mismo patrón se utiliza para:

- Román: cotización de mantenimiento de torres.
- Román: cotización de repetidores de telefonía celular.
- Heriberto: definición de techos presupuestales.

### Regla

Si Gamora detecta que hay dos compromisos diferentes para Román, debe crearlos por separado para evitar mezclar evidencias, fechas o estados.

## 7. Flujo C — Compromisos dependientes

### Caso

Ariel no puede terminar cotización hasta que Heriberto defina techos presupuestales.

### Pasos

1. Luis crea compromiso para Heriberto: definir techos presupuestales.
2. Luis crea compromiso para Ariel: preparar cotización de infraestructura.
3. Gamora marca que Ariel depende de insumo de Heriberto.
4. Mientras Heriberto no entregue, Ariel puede quedar “Bloqueado por dependencia” o “Pendiente de insumo”.
5. Cuando Heriberto entrega techos, Gamora notifica a Luis y a Ariel.
6. Ariel puede continuar y enviar cotización.

### Regla

Gamora debe distinguir incumplimiento del responsable vs bloqueo por dependencia externa.

El compromiso de Ariel no debe tratarse igual que un retraso común si la causa es que Heriberto todavía no entrega el insumo necesario.

## 8. Flujo D — Entrega de reporte de Fermín

### Pasos

1. Fermín envía PDF al WhatsApp de Gamora.
2. Gamora identifica compromiso.
3. Gamora asocia PDF.
4. Gamora notifica a Luis Felipe que el reporte está pendiente de revisión.
5. Luis revisa en web/PWA.
6. Si aprueba, Gamora permite marcarlo listo para enviar/compartir con Heriberto.
7. Si requiere corrección, Gamora notifica a Fermín.
8. Cierre queda en bitácora.

### Validación de Heriberto

Puede manejarse de dos formas:

- Opción A: Luis valida y luego informa a Heriberto.
- Opción B: Heriberto valida como cliente interno si está enrolado.

### Regla

El PDF de Fermín no debe quedar como archivo suelto. Debe estar asociado al compromiso de reporte para TI y Seguridad Patrimonial.

## 9. Flujo E — Cotizaciones de Román

1. Román recibe dos compromisos separados:
   - cotización mantenimiento de torres;
   - cotización repetidores telefonía celular.
2. Román acepta ambos.
3. Envía documentos o PDFs.
4. Gamora asocia cada archivo al compromiso correcto.
5. Si los envía juntos o sin texto, Gamora pregunta cuál archivo corresponde a cuál cotización.
6. Luis revisa.
7. Luis aprueba, pide corrección o marca listo para presentación a mina.

### Regla

Gamora debe distinguir las dos cotizaciones de Román como compromisos separados. Una evidencia de torres no debe cerrar el compromiso de repetidores, ni al revés.

## 10. Flujo F — Techos presupuestales de Heriberto y cotización de Ariel

1. Heriberto debe definir techos presupuestales.
2. Gamora le recuerda según fecha si está enrolado y tiene WhatsApp activo.
3. Heriberto responde con montos o documento.
4. Gamora notifica a Luis y Ariel.
5. Ariel recibe insumo.
6. Ariel termina cotización.
7. Ariel sube cotización.
8. Luis revisa.
9. Se cierra flujo.

### Regla

El compromiso de Ariel no debe marcarse vencido injustamente si la dependencia de Heriberto sigue abierta, salvo que exista una fecha propia para avances parciales o preparación previa.

Gamora debe mostrar con claridad que Ariel está pendiente de insumo y no simplemente incumplido.

## 11. Flujo G — Recordatorios y prevención de olvido

Gamora ayuda a Luis Felipe a no depender de su memoria personal.

Debe contemplar:

- Recordatorios antes de vencimiento.
- Alerta de vencido.
- Resumen diario para Luis Felipe.
- Evidencias pendientes de revisión.
- Pendientes bloqueados por dependencia.
- Pendientes por responsable.

### Ejemplos de mensajes funcionales

“Luis Felipe, hoy tienes 3 compromisos de Mina Mercedes por vencer.”

“Román no ha enviado cotización de torres.”

“Fermín subió reporte PDF pendiente de revisión.”

“Cotización de Ariel bloqueada por techos presupuestales pendientes de Heriberto.”

### Regla

Los recordatorios deben ser útiles y limitados. No deben convertirse en ruido ni reintentos infinitos.

## 12. Flujo H — Reporte rápido por WhatsApp

### Ejemplos de consulta

- “Gamora, ¿qué falta de Mina Mercedes?”
- “¿Qué tiene pendiente Román?”
- “¿Qué está bloqueado por Heriberto?”
- “¿Qué evidencias tengo que revisar?”

### Respuestas funcionales esperadas

Para “¿qué falta de Mina Mercedes?”, Gamora debe responder separando:

- pendientes por responsable;
- vencidos;
- evidencias pendientes de revisión;
- compromisos bloqueados por dependencia;
- compromisos cerrados recientes si se solicita.

Para “¿qué tiene pendiente Román?”, Gamora debe mostrar sus dos cotizaciones por separado, con estado individual.

Para “¿qué está bloqueado por Heriberto?”, Gamora debe mostrar que Ariel depende de techos presupuestales.

Para “¿qué evidencias tengo que revisar?”, Gamora debe listar PDFs o documentos recibidos que requieren revisión en web/PWA.

## 13. Estados usados en el caso

| Objeto | Estado inicial | Estado intermedio | Estado final posible | Observación |
|---|---|---|---|---|
| Compromiso Fermín | Pendiente de aceptación | Aceptado/en proceso, Evidencia recibida, En revisión | Aprobado, Cerrado/liberado, Corrección solicitada, Vencido | Reporte PDF para TI y Seguridad Patrimonial. |
| Cotización torres Román | Pendiente de aceptación | Aceptado/en proceso, Evidencia recibida, En revisión | Aprobado, Cerrado/liberado, Corrección solicitada, Vencido | Debe separarse de repetidores. |
| Cotización repetidores Román | Pendiente de aceptación | Aceptado/en proceso, Evidencia recibida, En revisión | Aprobado, Cerrado/liberado, Corrección solicitada, Vencido | Debe separarse de torres. |
| Techos presupuestales Heriberto | Pendiente de aceptación | Aceptado/en proceso, Evidencia recibida | Aprobado, Cerrado/liberado, Vencido | Insumo para Ariel. |
| Cotización Ariel | Pendiente de insumo | Bloqueado por dependencia, Aceptado/en proceso | Aprobado, Cerrado/liberado, Corrección solicitada | Depende de techos de Heriberto. |
| Evidencias/PDFs | Recibida | Asociada, En revisión | Aprobada, Rechazada, Corrección solicitada, Archivada | No deben quedar como adjuntos sueltos. |
| Dependencia Ariel-Heriberto | Pendiente de insumo | Bloqueado por dependencia | Dependencia resuelta | Distingue bloqueo vs incumplimiento. |
| Guardrails | Normal | Cerca de límite, Bloqueado por guardrail | Restablecido o flujo pausado | Evita duplicados, loops y exceso de mensajes. |

## 14. Bitácora requerida

El caso debe registrar:

- Compromiso creado.
- Responsable notificado.
- Aceptación.
- Recordatorio enviado.
- Vencimiento.
- Evidencia recibida.
- Evidencia asociada.
- Dependencia creada.
- Dependencia resuelta.
- Revisión.
- Aprobación/corrección/rechazo.
- Cierre.
- Consulta de reporte.
- Guardrail activado.
- Notificación bloqueada por usuario no enrolado o WhatsApp desactivado.

## 15. Guardrails aplicables

- No mensajes a no enrolados.
- Límite de recordatorios.
- No duplicar notificaciones.
- No reintentos infinitos.
- No enviar archivo completo a IA sin necesidad.
- Si se envían varios archivos, pedir asociación.
- Bloquear creación ambigua.
- Registrar consumo de mensajes/IA.
- Pausar flujo ante comportamiento anómalo.
- Evitar que un webhook o evento repetido duplique un compromiso o una notificación.

## 16. Notificaciones clave

- Compromiso asignado.
- Aceptación.
- Recordatorio antes de vencimiento.
- Vencido.
- Evidencia recibida.
- Evidencia pendiente de revisión.
- Corrección solicitada.
- Dependencia pendiente.
- Dependencia resuelta.
- Compromiso cerrado.
- Resumen diario.
- Guardrail o límite alcanzado, si aplica.

## 17. Salidas posibles

- Compromisos cerrados.
- Compromisos en corrección.
- Compromisos vencidos.
- Compromisos bloqueados por dependencia.
- Evidencias pendientes de revisión.
- Cotizaciones listas para presentar.
- Reporte listo para enviar a Heriberto.
- Flujo pausado por guardrail.
- Compromiso guardado como borrador si el responsable no está enrolado.

## 18. Criterios de aceptación funcional

- Luis puede crear compromisos para varios responsables.
- Cada responsable recibe solo sus compromisos.
- Gamora distingue dos cotizaciones de Román.
- Gamora asocia PDFs al compromiso correcto.
- Gamora notifica evidencia pendiente de revisión.
- Gamora maneja dependencias Heriberto → Ariel.
- Gamora genera resumen de Mina Mercedes.
- Gamora responde “qué falta”.
- No se envían mensajes a no enrolados.
- Guardrails evitan duplicados, loops y recordatorios excesivos.
- La web/PWA permite revisar evidencias y bitácora.
- Los vencidos se distinguen de bloqueados por dependencia.

## 19. Cierre del flujo

Mina Mercedes valida que Gamora puede operar como memoria y sistema de seguimiento de Luis Felipe, sin depender de que él recuerde todo manualmente.

El caso demuestra la diferencia entre coordinación informal por WhatsApp y compromisos operativos trazables: Gamora registra responsables, fechas, evidencias, dependencias, revisiones, cierres, recordatorios y reportes en un canal formal, sin leer chats personales ni enviar mensajes a usuarios no enrolados.
