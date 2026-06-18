# Modelo de Estados — Gamora Bot

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento define los estados funcionales mínimos que necesitará Gamora Bot para operar de forma trazable, controlada y segura.

El modelo de estados permite distinguir qué está pendiente, qué fue aceptado, qué fue reportado, qué fue validado, qué fue cerrado, qué fue bloqueado y qué requiere intervención humana.

Este documento no es un modelo técnico, no define base de datos, endpoints, APIs ni código. Es una definición funcional que servirá como base para flujos MVP, modelo técnico, pruebas y backlog.

## 2. Principios del modelo de estados

- Todo estado debe ser comprensible para usuarios.
- Todo cambio de estado crítico debe quedar en bitácora.
- No debe haber cambios de estado por IA sin validación del backend.
- Acciones críticas requieren rol autorizado.
- Los estados deben evitar ambigüedad entre reportado, validado, cerrado, vencido y cancelado.
- Los guardrails también deben tener estados para evitar loops, duplicados y consumo sin control.
- Los estados deben proteger el principio fundacional: Gamora no lee chats personales ni envía compromisos a usuarios no enrolados.
- WhatsApp opera como canal principal, pero el estado oficial vive en Gamora Core.

## 3. Estados de usuario

| Estado | Descripción | Cómo se entra | Qué permite | Qué bloquea | Evento de salida |
|---|---|---|---|---|---|
| Invitado | Persona registrada por un administrador, pero todavía sin aceptación propia. | Administrador crea invitación. | Puede recibir link, código o QR de invitación. | Recibir compromisos por WhatsApp, aceptar tareas, enviar evidencias operativas. | Abre invitación y pasa a pendiente de aceptación, o la invitación expira/revoca. |
| Pendiente de aceptación | Usuario inició flujo de enrolamiento, pero aún no acepta términos, aviso y consentimiento. | Abre invitación o inicia contacto con código. | Revisar propósito y condiciones básicas. | Recibir compromisos operativos. | Acepta consentimiento o rechaza enrolamiento. |
| Activo / enrolado | Usuario autorizado con opt-in registrado. | Acepta desde su propio WhatsApp y queda asociado al espacio de trabajo. | Operar según rol: recibir compromisos, aceptar, evidenciar, validar o consultar. | Acciones fuera de su rol. | Baja de WhatsApp, suspensión o baja administrativa. |
| WhatsApp desactivado | Usuario sigue existiendo en Gamora, pero no recibe mensajes por WhatsApp. | Usuario solicita BAJA/STOP o administrador desactiva canal según regla. | Puede operar por web/PWA si su rol lo permite. | Mensajes y notificaciones WhatsApp. | Reactivación consentida del canal o suspensión. |
| Suspendido | Usuario bloqueado temporal o administrativamente. | Administrador suspende o regla de seguridad lo bloquea. | Ninguna operación activa. | WhatsApp, web/PWA y acciones sobre compromisos. | Reactivación por administrador autorizado. |
| Eliminado / dado de baja administrativamente | Usuario retirado del espacio de trabajo, sujeto a política de retención. | Administrador realiza baja o proceso legal/operativo lo requiere. | Nada operativo. | Acceso y operación. | No aplica, salvo regla futura de restauración controlada. |

### Reglas

- Invitado no recibe compromisos.
- Pendiente de aceptación no recibe compromisos.
- Activo/enrolado sí puede operar según rol.
- WhatsApp desactivado no recibe mensajes por WhatsApp, pero puede existir en web/PWA.
- Suspendido no opera.
- Eliminado requiere política de retención/legal.

## 4. Estados de invitación/enrolamiento

| Estado | Descripción |
|---|---|
| Invitación creada | El administrador registró a la persona y generó una invitación. |
| Invitación enviada | La invitación fue compartida por link, código o QR. |
| Invitación abierta | La persona abrió la invitación o inició contacto con Gamora. |
| Consentimiento aceptado | La persona aceptó términos, aviso de privacidad y consentimiento operativo. |
| Enrolamiento completado | El usuario quedó activo/enrolado dentro del espacio de trabajo. |
| Invitación expirada | La invitación perdió vigencia antes de aceptarse. |
| Invitación revocada | El administrador invalidó la invitación. |
| Enrolamiento rechazado | La persona decidió no participar o no aceptó condiciones. |

### Reglas

- La invitación no equivale a opt-in.
- El enrolamiento ocurre cuando el usuario acepta.
- Debe registrarse versión de aviso/términos.
- No hay mensajes operativos antes de enrolamiento.
- La aceptación debe ocurrir desde el canal propio del usuario, no por sustitución del administrador.

## 5. Estados del compromiso operativo

| Estado | Descripción | Quién puede llevarlo a ese estado | Próximas acciones posibles | Reglas |
|---|---|---|---|---|
| Borrador | Compromiso detectado o iniciado, todavía no activo. | Coordinador, administrador, IA como propuesta validada por backend. | Completar datos o solicitar confirmación. | No notifica. |
| Pendiente de datos | Falta responsable, fecha, evidencia esperada u otro dato mínimo. | Backend/Gamora al detectar datos incompletos. | Pedir información faltante. | No se asigna hasta completar mínimos. |
| Confirmación requerida | Hay datos suficientes, pero se requiere confirmación por ambigüedad o acción crítica. | Backend/Gamora. | Confirmar, corregir o cancelar. | Evita acciones ambiguas de IA. |
| Creado / asignado | Compromiso ya registrado y asignado a responsable. | Coordinador o administrador autorizado. | Notificar al responsable. | Responsable debe estar enrolado. |
| Pendiente de aceptación | Se notificó al responsable y se espera respuesta. | Gamora después de asignación válida. | Aceptar, rechazar o solicitar aclaración. | No se considera en proceso todavía. |
| Aceptado / en proceso | Responsable aceptó el compromiso. | Responsable operativo. | Ejecutar, enviar avance o evidencia. | Queda aceptación en bitácora. |
| Evidencia recibida | Responsable envió evidencia. | Responsable operativo o usuario autorizado. | Asociar, clasificar y revisar. | No equivale a aprobación. |
| En revisión | Evidencia o avance está siendo revisado. | Coordinador, supervisor o backend al recibir evidencia válida. | Aprobar, rechazar o pedir corrección. | IA no valida. |
| Corrección solicitada | La entrega requiere ajuste. | Supervisor, validador o coordinador autorizado. | Responsable corrige y reenvía evidencia. | Debe registrar motivo. |
| Rechazado | La entrega no cumple y queda rechazada. | Supervisor, validador o coordinador autorizado. | Crear nuevo compromiso, corregir si se permite o cerrar como no cumplido según regla futura. | Debe registrar motivo. |
| Aprobado | La entrega fue validada. | Supervisor, validador o coordinador autorizado. | Cerrar/liberar. | No siempre cierra automáticamente si requiere paso final. |
| Cerrado / liberado | Compromiso completado y registrado como cerrado. | Rol autorizado. | Consultar bitácora. | No debe reabrirse sin regla futura. |
| Vencido | La fecha compromiso pasó sin cierre. | Backend por regla de vencimiento. | Solicitar prórroga, nueva fecha, evidencia o escalar. | No debe cerrar automáticamente. |
| Cancelado | Compromiso detenido antes de cierre. | Coordinador, administrador o rol autorizado. | Consultar motivo y bitácora. | Requiere motivo. |
| Suspendido por guardrail | Compromiso o flujo detenido por límite, anomalía o riesgo. | Guardrail funcional o administrador. | Revisión humana, corrección o reactivación. | Requiere revisión humana. |

### Reglas

- Borrador no notifica.
- Pendiente de datos requiere completar información.
- Confirmación requerida evita acciones ambiguas de IA.
- Pendiente de aceptación espera respuesta del responsable.
- Vencido no debe cerrar automáticamente.
- Cerrado/liberado no debe reabrirse sin regla futura.
- Suspendido por guardrail requiere revisión humana.

## 6. Transiciones principales del compromiso

| De estado | A estado | Evento que dispara transición | Actor permitido | Bitácora obligatoria | Notificación |
|---|---|---|---|---|---|
| Borrador | Pendiente de datos | Faltan datos mínimos. | Backend/Gamora. | Sí. | No. |
| Pendiente de datos | Confirmación requerida | Datos completados, pero requieren confirmación. | Coordinador o backend. | Sí. | Sí, al coordinador. |
| Confirmación requerida | Creado/asignado | Coordinador confirma creación. | Coordinador autorizado. | Sí. | Sí, al responsable. |
| Creado/asignado | Pendiente de aceptación | Compromiso enviado a responsable. | Gamora/backend. | Sí. | Sí. |
| Pendiente de aceptación | Aceptado/en proceso | Responsable acepta. | Responsable operativo. | Sí. | Sí, al coordinador si aplica. |
| Aceptado/en proceso | Evidencia recibida | Responsable envía evidencia. | Responsable operativo. | Sí. | Sí, al revisor. |
| Evidencia recibida | En revisión | Evidencia asociada y lista para revisión. | Backend o revisor. | Sí. | Sí, al revisor. |
| En revisión | Aprobado | Revisor aprueba. | Supervisor/coordinador autorizado. | Sí. | Sí, al responsable. |
| En revisión | Corrección solicitada | Revisor pide ajuste. | Supervisor/coordinador autorizado. | Sí. | Sí, al responsable. |
| En revisión | Rechazado | Revisor rechaza. | Supervisor/coordinador autorizado. | Sí. | Sí, al responsable. |
| Corrección solicitada | Evidencia recibida | Responsable reenvía evidencia. | Responsable operativo. | Sí. | Sí, al revisor. |
| Aprobado | Cerrado/liberado | Rol autorizado libera cierre. | Coordinador/supervisor autorizado. | Sí. | Sí. |
| Aceptado/en proceso | Vencido | Fecha compromiso vencida. | Backend por regla. | Sí. | Sí. |
| Vencido | En proceso | Se autoriza prórroga o nueva fecha. | Coordinador/supervisor autorizado. | Sí. | Sí. |
| Cualquier estado operativo | Suspendido por guardrail | Límite, anomalía, duplicado o comportamiento riesgoso. | Guardrail/backend/administrador. | Sí. | Sí, a administrador si aplica. |
| Cualquier estado no cerrado | Cancelado | Cancelación autorizada. | Coordinador/administrador autorizado. | Sí. | Sí, a usuarios involucrados si aplica. |

## 7. Estados de evidencia

| Estado | Descripción |
|---|---|
| Recibida | La evidencia llegó por WhatsApp o web/PWA. |
| Asociada | La evidencia fue vinculada a un compromiso, hito o reporte parcial. |
| Pendiente de clasificación | Falta determinar si es normal, sensible o si corresponde a otro compromiso. |
| Sensible | Evidencia marcada con acceso restringido por contenido o contexto. |
| En revisión | Evidencia lista para ser evaluada. |
| Aprobada | Evidencia aceptada por rol autorizado. |
| Rechazada | Evidencia no aceptada. |
| Corrección solicitada | Se requiere nueva evidencia o ajuste. |
| Reemplazada | Una nueva evidencia sustituye una entrega previa, conservando referencia histórica según política. |
| Archivada | Evidencia conservada como parte de la bitácora o expediente operativo. |

### Reglas

- Evidencia sin asociación debe resolverse antes de revisión.
- Evidencia sensible requiere permisos.
- Evidencia rechazada no cierra compromiso.
- Reemplazo debe conservar histórico o referencia según política.
- No debe enviarse evidencia completa a IA salvo necesidad justificada.

## 8. Estados de validación

| Estado | Descripción |
|---|---|
| Sin revisión | El compromiso todavía no requiere o no ha recibido revisión. |
| Pendiente de revisión | Hay evidencia o avance esperando revisor. |
| En revisión | Revisor está evaluando la entrega. |
| Aprobada | La entrega cumple. |
| Aprobada con observación | Se acepta, pero queda comentario o ajuste menor registrado. |
| Rechazada | La entrega no cumple. |
| Corrección solicitada | Se requiere acción adicional del responsable. |
| Liberada | El ciclo de validación queda cerrado. |

### Reglas

- IA no valida.
- Responsable operativo no valida su propia entrega si hay flujo de supervisión.
- Todo rechazo/corrección debe tener motivo.
- Liberación cierra el ciclo.

## 9. Estados de recordatorios y notificaciones

| Estado | Descripción |
|---|---|
| Programado | Notificación pendiente de envío. |
| Enviado | Mensaje enviado por el canal correspondiente. |
| Entregado | Confirmación funcional de entrega, si está disponible. |
| Fallido | El envío no se completó. |
| Reintentando | Se intenta nuevamente dentro de límite permitido. |
| Reintentos agotados | Se alcanzó el límite de reintentos. |
| Cancelado | Notificación cancelada por cambio de estado o decisión autorizada. |
| Bloqueado por opt-out | Usuario desactivó WhatsApp o solicitó baja. |
| Bloqueado por guardrail | Límite, anomalía o regla impide envío. |
| Agrupado en resumen | La notificación se integró a un resumen para reducir ruido y costo. |

### Reglas

- No reintentos infinitos.
- Mensajes a usuarios no enrolados bloqueados.
- Opt-out bloquea notificaciones WhatsApp.
- Duplicados deben prevenirse.
- Todo fallo relevante se registra.

## 10. Estados de conversación WhatsApp

| Estado | Descripción |
|---|---|
| Nueva conversación | Se recibe primer contacto o nueva interacción. |
| Usuario desconocido | El número no está registrado. |
| Usuario invitado | El número corresponde a invitación pendiente. |
| Usuario enrolado | El número pertenece a usuario activo. |
| Intención detectada | Gamora identifica intención funcional. |
| Intención ambigua | La intención no es suficientemente clara. |
| Menú guiado | Gamora ofrece opciones estructuradas para resolver ambigüedad. |
| Esperando respuesta | Gamora espera dato o confirmación del usuario. |
| Esperando evidencia | Gamora espera archivo, foto, audio o documento. |
| Flujo completado | El flujo terminó correctamente. |
| Flujo pausado | El flujo se detuvo temporalmente. |
| Flujo cancelado | El usuario o rol autorizado cancela el flujo. |
| Flujo bloqueado por guardrail | Guardrail impide continuar por límite, anomalía o riesgo. |
| Baja solicitada | Usuario pide desactivar WhatsApp. |

### Reglas

- Cada flujo debe tener salida.
- No loops infinitos.
- Si hay ambigüedad repetida, pasar a menú guiado.
- Si el usuario solicita BAJA, desactivar canal WhatsApp.
- Usuario desconocido no recibe compromisos operativos.

## 11. Estados de IA auxiliar

| Estado | Descripción |
|---|---|
| No requerida | El flujo puede resolverse sin IA. |
| Solicitud preparada | Se prepara una llamada a IA con propósito funcional. |
| En procesamiento | IA está generando interpretación o resumen. |
| Interpretación generada | IA devuelve una propuesta estructurada. |
| Baja confianza | La interpretación no alcanza umbral funcional. |
| Requiere confirmación | La propuesta necesita validación humana. |
| Menú guiado requerido | La ambigüedad requiere opciones estructuradas. |
| Error de IA | La llamada falló o devolvió resultado inválido. |
| Límite alcanzado | Se alcanzó límite de uso permitido. |
| Bloqueada por guardrail | Guardrail impide nueva llamada o acción. |

### Reglas

- Baja confianza no ejecuta acción.
- Límite alcanzado no llama de nuevo.
- Error repetido debe pausar flujo.
- Toda acción sugerida por IA pasa por backend.
- Toda llamada a IA debe tener propósito funcional claro.

## 12. Estados de guardrails

| Estado | Descripción |
|---|---|
| Normal | Operación dentro de límites. |
| Cerca de límite | El consumo se aproxima al umbral definido. |
| Límite alcanzado | Se alcanzó límite de mensajes, IA, reintentos u otro consumo. |
| Bloqueado temporalmente | El flujo queda detenido por regla de control. |
| Pausa manual | Administrador o rol autorizado pausa automatizaciones. |
| Pausa automática por anomalía | Gamora pausa por comportamiento anómalo. |
| Revisión humana requerida | Se requiere intervención antes de continuar. |
| Restablecido | La operación vuelve a estado permitido. |

### Aplicación

Estos estados aplican a:

- Mensajes WhatsApp.
- Llamadas IA.
- Reintentos.
- Recordatorios.
- Webhooks/eventos.
- Conversaciones.
- Trial/plan.

### Reglas

- Límite alcanzado bloquea consumo adicional según tipo.
- Pausa manual detiene automatizaciones no críticas.
- Pausa por anomalía requiere revisión.
- Restablecimiento queda en bitácora.

## 13. Estados de webhook / evento recibido

Aunque este documento no desarrolla modelo técnico, Gamora debe considerar conceptualmente estados para eventos recibidos con el fin de evitar duplicados, loops o efectos repetidos.

| Estado | Descripción |
|---|---|
| Evento recibido | Gamora recibe un evento desde un canal o sistema. |
| Evento en validación | Se verifica si el evento es válido, esperado y procesable. |
| Evento procesado | El evento se aplicó correctamente. |
| Evento duplicado detectado | El evento ya fue recibido o corresponde a una acción repetida. |
| Evento ignorado | El evento no requiere acción o no debe procesarse. |
| Evento fallido | El evento no pudo procesarse. |
| Reintento programado | Se agenda reintento dentro de límite permitido. |
| Reintentos agotados | Se alcanzó límite de reintentos. |
| Bloqueado por guardrail | Guardrail impide procesamiento adicional. |

### Reglas

- Debe existir idempotencia conceptual.
- Evento duplicado no debe generar mensaje duplicado.
- Reintentos deben tener límite.
- Fallos críticos deben registrarse.

## 14. Estados de proyecto/hito/reportes parciales — Sunworks

### Estados de proyecto

| Estado | Descripción |
|---|---|
| No iniciado | Proyecto creado, sin ejecución activa. |
| En proceso | Proyecto con hitos o actividades activas. |
| En revisión | Proyecto en etapa de evaluación general. |
| Con observaciones | Proyecto con correcciones o pendientes detectados. |
| Completado | Todos los elementos relevantes están validados. |
| Cerrado | Proyecto formalmente cerrado. |
| Suspendido | Proyecto pausado por decisión operativa o guardrail. |
| Cancelado | Proyecto detenido definitivamente. |

### Estados de hito

| Estado | Descripción |
|---|---|
| No iniciado | Hito definido, sin avance activo. |
| En proceso | Hito en ejecución. |
| Reporte parcial recibido | Se recibió avance o evidencia parcial. |
| En revisión | Supervisor revisa avance/evidencia. |
| Observado / corrección solicitada | Se requiere ajuste o evidencia adicional. |
| Validado parcialmente | Supervisor validó avance menor a 100%. |
| Validado 100% | Supervisor validó cumplimiento total del hito. |
| Cerrado | Hito formalmente cerrado. |

### Estados de reporte parcial

| Estado | Descripción |
|---|---|
| Recibido | Reporte parcial enviado por responsable o jefe de cuadrilla. |
| Pendiente de asociación | Falta vincularlo a proyecto/hito correcto. |
| Asociado a hito | Reporte vinculado al hito correspondiente. |
| Pendiente de validación | Espera revisión del supervisor. |
| Aprobado | Reporte aceptado. |
| Aprobado con ajuste | Supervisor acepta, pero corrige porcentaje u observación. |
| Corrección solicitada | Se requiere nuevo reporte o evidencia. |
| Rechazado | Reporte no aceptado. |
| Integrado al avance validado | El avance aprobado se suma al avance oficial. |

### Reglas

- Avance reportado no es avance oficial.
- Avance oficial = avance validado.
- Supervisor valida.
- IA no calcula avance por foto.
- Hito no llega a 100% sin validación.
- El usuario operativo no debe memorizar claves técnicas.

## 15. Matriz resumida de objetos y estados

| Objeto funcional | Estados principales | Estado crítico | Quién puede cambiarlo | Bitácora requerida |
|---|---|---|---|---|
| Usuario | Invitado, pendiente, activo, WhatsApp desactivado, suspendido, eliminado. | Activo / enrolado. | Administrador, usuario para opt-in/opt-out. | Sí. |
| Invitación | Creada, enviada, abierta, aceptada, expirada, revocada, rechazada. | Consentimiento aceptado. | Administrador y usuario invitado. | Sí. |
| Compromiso | Borrador, asignado, aceptado, revisión, aprobado, cerrado, vencido, cancelado. | Cerrado / liberado. | Coordinador, responsable, supervisor según transición. | Sí. |
| Evidencia | Recibida, asociada, sensible, revisión, aprobada, rechazada, archivada. | Sensible / aprobada. | Responsable, backend, supervisor/coordinador. | Sí. |
| Validación | Sin revisión, pendiente, en revisión, aprobada, rechazada, liberada. | Liberada. | Supervisor/coordinador autorizado. | Sí. |
| Notificación | Programada, enviada, fallida, reintentando, bloqueada, agrupada. | Reintentos agotados / bloqueada. | Backend/guardrail/administrador. | Sí si es relevante. |
| Conversación WhatsApp | Nueva, desconocida, enrolada, ambigua, menú guiado, pausada, baja. | Baja solicitada / bloqueada. | Usuario, backend, guardrail. | Sí. |
| IA auxiliar | No requerida, procesando, interpretación, baja confianza, límite, bloqueada. | Baja confianza / límite alcanzado. | Backend/guardrail. | Sí cuando aplique. |
| Guardrail | Normal, cerca de límite, límite, bloqueado, pausa, revisión, restablecido. | Límite alcanzado / pausa por anomalía. | Backend, guardrail, administrador. | Sí. |
| Webhook/evento | Recibido, validación, procesado, duplicado, fallido, reintento, bloqueado. | Duplicado detectado / reintentos agotados. | Backend/guardrail. | Sí. |
| Proyecto | No iniciado, proceso, revisión, observaciones, completado, cerrado. | Cerrado. | Coordinador/supervisor autorizado. | Sí. |
| Hito | No iniciado, proceso, reporte recibido, revisión, validado parcial, validado 100%, cerrado. | Validado 100%. | Supervisor/validador. | Sí. |
| Reporte parcial | Recibido, asociado, validación, aprobado, ajuste, corrección, rechazado, integrado. | Integrado al avance validado. | Responsable, backend, supervisor. | Sí. |

## 16. Reglas no negociables del modelo de estados

- No mensajes a usuarios no enrolados.
- No acción crítica desde IA sin backend/humano.
- No cierre sin validación cuando el flujo lo requiere.
- No evidencia sin asociación para cierre.
- No reintentos infinitos.
- No loops conversacionales.
- No duplicados por evento repetido.
- No consumo adicional si límite está alcanzado.
- No avance reportado como avance oficial.
- No baja WhatsApp como eliminación automática de datos.
- Toda transición crítica debe registrarse.

## 17. Casos límite que deben contemplarse

- Usuario acepta invitación después de expirada.
- Usuario responde BAJA con compromiso activo.
- Responsable envía evidencia sin compromiso claro.
- Usuario manda varios compromisos en un mensaje.
- Usuario manda evidencia antes de aceptar compromiso.
- IA detecta responsable no enrolado.
- WhatsApp falla al enviar notificación.
- Webhook duplicado llega dos veces.
- Usuario no responde después de varios intentos.
- Se alcanza límite de IA.
- Se alcanza límite de mensajes WhatsApp.
- Supervisor rechaza evidencia después de vencimiento.
- Responsable intenta aprobar su propia evidencia.
- Administrador suspende usuario con compromisos abiertos.
- Cliente quiere eliminar evidencia usada en bitácora.
- Raúl reporta avance de varios hitos mezclados.

## 18. Relación con siguientes documentos

Este modelo será base para:

- Flujos MVP.
- Modelo técnico.
- Webhook y eventos.
- Pruebas funcionales.
- Backlog técnico.
- Prompts Codex.

También servirá para diseñar pruebas de transición, permisos, guardrails, estados bloqueados, bajas de WhatsApp, evidencias sensibles y escenarios complejos tipo Sunworks.

## 19. Cierre del documento

Un buen modelo de estados evita ambigüedad, reduce riesgos, controla costos, protege privacidad y permite construir un MVP realmente funcional.

Gamora Bot debe ser fácil de operar para el usuario, pero estricto en su núcleo: cada compromiso, evidencia, validación, notificación, consumo y cambio crítico debe tener un estado claro, una regla de transición y una bitácora.
