# Webhook y Eventos — Gamora Bot

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento define cómo Gamora Bot recibirá, validará, registrará, deduplicará, procesará y responderá eventos provenientes de WhatsApp Business Cloud API y otros eventos internos del MVP.

Su propósito es establecer el diseño técnico-conceptual del webhook, procesamiento de eventos, idempotencia, deduplicación, reintentos, estados, bitácora y guardrails.

Este documento:

- No es código.
- No sustituye documentación oficial de Meta.
- No define payloads exactos finales.
- Será base para implementación con Codex y pruebas reales.

Los detalles específicos de payloads, firma/verificación, suscripciones y comportamiento de reintentos deberán validarse con documentación oficial vigente y pruebas reales.

## 2. Principio rector del webhook

El webhook no debe ejecutar toda la lógica de negocio directamente.

Debe:

- Recibir evento.
- Validar.
- Registrar.
- Deduplicar.
- Normalizar.
- Enviar a Event Processor.
- Responder de forma segura.
- Evitar duplicados.
- Aplicar guardrails.

### Regla

Evento recibido no significa acción ejecutada.

Un evento entrante solo debe provocar una acción funcional después de validación, deduplicación, revisión de permisos, estado, opt-in/opt-out y guardrails.

## 3. Tipos de eventos a considerar

### Eventos entrantes de WhatsApp

- Mensaje de texto.
- Audio/voice note.
- Imagen.
- Documento/PDF.
- Respuesta/interacción.
- BAJA/STOP.
- Mensaje no soportado.

### Eventos de estado de mensajes

- Enviado.
- Entregado.
- Leído si disponible.
- Fallido.

### Eventos de media

- Media recibida.
- Media pendiente de descarga.
- Media descargada.
- Media fallida.

### Eventos internos Gamora

- Compromiso creado.
- Compromiso aceptado.
- Evidencia asociada.
- Evidencia pendiente de revisión.
- Corrección solicitada.
- Compromiso cerrado.
- Guardrail activado.
- Recordatorio programado.
- Resumen diario programado.

## 4. Flujo técnico general de evento entrante

1. Meta envía evento al webhook.
2. Webhook recibe request HTTPS.
3. Webhook valida método, estructura y origen según configuración oficial.
4. Se genera o identifica event_key.
5. Se registra evento en `webhook_events`.
6. Se calcula payload_hash si aplica.
7. Se verifica duplicado.
8. Si es duplicado, se marca como duplicado_detectado y no se ejecuta acción funcional.
9. Si es válido, pasa a Event Processor.
10. Event Processor normaliza evento.
11. Gamora Core valida usuario, workspace, opt-in, estado y permisos.
12. Se decide si requiere IA.
13. Se ejecuta regla funcional.
14. Se registran state_transitions/audit_logs/messages/evidences según aplique.
15. Si aplica, se programa respuesta o notificación.
16. Guardrails verifican límites.
17. Se actualiza estado del evento.

### Decisión técnica MVP

El webhook debe mantenerse liviano. La lógica funcional debe vivir en Event Processor y Gamora Core para evitar duplicación, acoplamiento y errores difíciles de auditar.

## 5. Estados del evento

| Estado | Significado | Cuándo entra | Salida esperada |
|---|---|---|---|
| recibido | El evento llegó al webhook. | Al recibir request válido en forma básica. | en_validacion. |
| en_validacion | El evento está siendo validado. | Después de recepción inicial. | procesado, ignorado, fallido o duplicado_detectado. |
| procesado | El evento fue procesado correctamente. | Después de ejecutar regla funcional o registrar resultado. | Estado final. |
| duplicado_detectado | El evento ya fue recibido/procesado o coincide con otro evento. | Al detectar provider_event_id, provider_message_id, event_key o payload_hash repetido. | Estado final sin acción funcional repetida. |
| ignorado | El evento es válido, pero no requiere acción. | Evento no relevante para MVP o sin efecto operativo. | Estado final. |
| fallido | El evento no pudo procesarse. | Error de validación, procesamiento, storage, IA, DB o proveedor. | reintento_programado o reintentos_agotados. |
| reintento_programado | Se programará nuevo intento dentro de límite. | Error recuperable. | procesado, fallido o reintentos_agotados. |
| reintentos_agotados | Se alcanzó límite de reintentos. | Repetición de fallos. | Estado final con alerta/bitácora. |
| bloqueado_guardrail | Guardrail bloqueó procesamiento. | Límite, opt-out, usuario no enrolado, loop o anomalía. | Revisión humana o restablecimiento posterior. |

## 6. Idempotencia y deduplicación

La idempotencia evita que un mismo evento genere dos compromisos, dos mensajes, dos evidencias o dos cierres.

### Claves posibles

- provider_event_id cuando exista.
- provider_message_id cuando exista.
- payload_hash como respaldo.
- event_key interno.
- Ventana de deduplicación.
- Relación con messages/evidences/notifications.

### Reglas

- Un evento duplicado no debe crear dos compromisos.
- Un mensaje duplicado no debe generar dos respuestas.
- Una evidencia duplicada no debe cerrar dos veces.
- Una notificación duplicada no debe enviarse dos veces.
- Duplicado detectado debe quedar registrado.

### Pendiente de validación técnica

Confirmar qué identificadores únicos entrega Meta para cada tipo de evento y cómo deben combinarse para una estrategia robusta de idempotencia.

## 7. Procesamiento por tipo de mensaje

### Texto

Uso funcional:

- Creación de compromiso.
- Consulta.
- Aceptación.
- Aclaración.
- BAJA/STOP si texto coincide.

Reglas:

- Validar usuario y workspace.
- Detectar opt-out antes de otras acciones.
- Usar IA solo si aporta interpretación funcional.
- No crear compromiso ambiguo sin confirmación.

### Audio

Uso funcional:

- Reporte de avance.
- Creación de compromiso dictado.
- Aclaración operativa.

Reglas:

- Registrar mensaje.
- Descargar/procesar según media.
- Transcribir si aplica.
- IA Service con límites.
- Fallback si falla.
- No reintentar transcripción indefinidamente.

### Imagen

Uso funcional:

- Evidencia.

Reglas:

- Registrar mensaje.
- Asociar a compromiso si hay contexto claro.
- Dejar pendiente de asociación si hay ambigüedad.
- No cerrar compromiso solo por recibir imagen.

### Documento/PDF

Uso funcional:

- Evidencia formal.
- Reporte.
- Cotización.
- Corte o archivo operativo.

Reglas:

- Guardar en storage privado.
- Asociar a compromiso.
- Notificar a revisor cuando corresponda.
- Marcar sensible si aplica.

### Mensaje no soportado

Uso funcional:

- Registrar interacción fuera de alcance.
- Responder con alternativa.

Reglas:

- No entrar en loop.
- Ofrecer menú guiado o pedir formato soportado.
- No consumir IA repetidamente si no aporta valor.

## 8. Eventos de salida y notificaciones

Eventos salientes funcionales:

- Notificación asignación.
- Recordatorio.
- Evidencia pendiente de revisión.
- Aprobación/corrección/rechazo.
- Resumen diario.
- Guardrail/límite.

### Reglas

- Toda salida debe pasar por Motor de Notificaciones.
- Validar opt-in, enrolamiento y WhatsApp activo.
- Reintentos limitados.
- Registrar `notifications`.
- Registrar `api_usage_logs`.
- Evitar duplicados.
- Bloquear mensajes a usuarios no enrolados.

## 9. Reintentos

### Tipos de reintento

- Reintentos de procesamiento interno.
- Reintentos de notificación saliente.
- Reintentos de descarga de media.
- Reintentos de IA.

### Reglas

- No reintentos infinitos.
- Límite por tipo.
- Si se agotan, estado reintentos_agotados.
- Registrar evento.
- Notificar a administrador si aplica.
- Guardrail puede bloquear.

### Decisión técnica MVP

Los reintentos deben ser conservadores. Es preferible registrar un fallo y pedir intervención humana antes que generar loops, duplicados o costos inesperados.

## 10. Manejo de errores

| Error | Respuesta funcional | Registro | ¿Reintentar? |
|---|---|---|---|
| Error de validación | Rechazar o ignorar evento según severidad. | webhook_events, error log. | No, salvo evento incompleto recuperable. |
| Usuario no identificado | Responder con flujo de identificación/enrolamiento si aplica. | messages, audit_logs. | No para acción operativa. |
| Usuario no enrolado | Bloquear acción operativa. | guardrail_events, audit_logs. | No. |
| Opt-out activo | Bloquear notificación WhatsApp. | notifications, guardrail_events. | No. |
| Permiso insuficiente | Bloquear acción. | audit_logs. | No. |
| Payload inválido | Marcar fallido o ignorado. | webhook_events, error log. | No, salvo criterio técnico futuro. |
| Media no descargable | Marcar evidencia/media fallida. | webhook_events, evidences si aplica. | Sí, con límite. |
| IA fallida | Usar fallback o menú guiado. | ai_usage_logs, audit_logs. | Sí, con límite bajo. |
| WhatsApp API fallida | Notificación fallida. | notifications, api_usage_logs. | Sí, con límite. |
| Base de datos fallida | Pausar procesamiento si afecta persistencia. | error log. | Sí, con control operacional. |
| Guardrail activo | Bloquear evento o flujo. | guardrail_events, webhook_events. | No hasta restablecimiento. |

## 11. Guardrails aplicables a eventos

- Límite de eventos por usuario/periodo.
- Límite de eventos por workspace.
- Límite de llamadas IA.
- Límite de reintentos.
- Detección de loops.
- Detección de duplicados.
- Bloqueo por opt-out.
- Bloqueo a no enrolados.
- Pausa manual.
- Pausa automática por anomalía.
- Circuit breaker básico.

### Regla

Si guardrail bloquea evento, debe registrarse en `guardrail_events` y `webhook_events`.

El bloqueo no debe quedar oculto: un usuario autorizado debe poder consultar el estado si impacta operación.

## 12. Relación con modelo de datos

| Entidad | Qué registra |
|---|---|
| webhook_events | Eventos recibidos, estado, deduplicación, fallos, reintentos y bloqueos. |
| messages | Mensajes entrantes/salientes relevantes, dirección, proveedor y relación funcional. |
| notifications | Notificaciones programadas, enviadas, fallidas, bloqueadas o agrupadas. |
| evidences | Media asociada a compromiso, hito o reporte parcial. |
| state_transitions | Cambios de estado producidos por eventos. |
| audit_logs | Acciones críticas y eventos funcionales comprensibles. |
| ai_usage_logs | Uso de IA para interpretación, transcripción o resumen. |
| api_usage_logs | Consumo de WhatsApp, IA u otros proveedores. |
| guardrail_events | Límites, duplicados, pausas, bloqueos y anomalías. |

## 13. Bitácora funcional vs logs técnicos

### Bitácora funcional

Eventos que el usuario autorizado puede entender:

- Compromiso creado.
- Evidencia recibida.
- Revisión.
- Aprobación.
- Cierre.
- Corrección.
- Guardrail activado si impacta flujo.

### Logs técnicos

Eventos para operación técnica:

- Payload inválido.
- Error de webhook.
- Retry interno.
- Error API.
- Latencia.
- Fallo de storage.
- Error de firma/verificación.
- Error de base de datos.

### Regla

No exponer logs técnicos sensibles en web/PWA operativa.

La bitácora funcional debe ser clara para usuarios; los logs técnicos deben servir para soporte, monitoreo y depuración.

## 14. Seguridad del webhook

### Reglas

- HTTPS obligatorio.
- Verify token.
- Validación de origen/firma según documentación oficial vigente.
- No exponer secretos.
- No guardar tokens en logs.
- Rate limiting.
- Rechazo de métodos no permitidos.
- Separación por ambiente.
- Monitoreo de errores.

### Pendientes

- Mecanismo exacto de firma/verificación.
- Configuración exacta de Meta App.
- Campos exactos usados para validación.
- Requisitos de producción.

## 15. Observabilidad mínima

Métricas mínimas:

- Eventos recibidos.
- Eventos procesados.
- Duplicados detectados.
- Eventos fallidos.
- Reintentos agotados.
- Mensajes enviados.
- Mensajes fallidos.
- Media descargada.
- Media fallida.
- Llamadas IA.
- Guardrails activados.
- Latencia promedio del webhook.
- Errores por tipo.

### Decisión técnica MVP

Desde el MVP debe existir una forma básica de ver si el webhook está sano: volumen, fallos, duplicados, latencia y eventos bloqueados.

## 16. Casos de prueba MVP

1. Texto entrante claro crea borrador/compromiso.
2. Texto ambiguo pasa a menú guiado.
3. Usuario no enrolado no recibe respuesta operativa.
4. BAJA/STOP desactiva canal.
5. Imagen se registra como evidencia.
6. PDF se registra como evidencia.
7. Media ambigua queda pendiente de asociación.
8. Evento duplicado no duplica compromiso.
9. Notificación fallida reintenta con límite.
10. Reintentos agotados quedan registrados.
11. IA falla y se usa fallback.
12. Guardrail bloquea evento.
13. Opt-out bloquea notificación.
14. Webhook inválido se rechaza.
15. Resumen diario no se duplica.

## 17. Fuera de alcance MVP

- Procesamiento avanzado de todos los tipos de mensajes.
- Grupos WhatsApp.
- Llamadas.
- Pagos.
- Campañas.
- Análisis automático de imágenes.
- Procesamiento masivo de media.
- Colas enterprise complejas.
- Observabilidad enterprise.
- Autoescalamiento sofisticado.
- Reprocesamiento masivo histórico.
- Integraciones externas no necesarias para el ciclo MVP.

## 18. Pendientes de validación técnica

- Estructura final de payloads.
- Verificación/firma exacta.
- Eventos a suscribir.
- Límites reales de webhook.
- Comportamiento exacto de estados de mensaje.
- Media URL expiración/descarga.
- Respuesta HTTP esperada ante reintentos de Meta.
- Si se requiere cola desde el primer MVP.
- Proveedor de logs.
- Estrategia de alertas.
- Identificadores únicos disponibles por tipo de evento.
- Reglas de retry de Meta ante respuestas no exitosas.

## 19. Cierre del documento

El webhook es una zona crítica del MVP: si no se controla, puede generar duplicados, loops, costos o estados erróneos.

Por eso debe diseñarse con idempotencia, guardrails, bitácora y observabilidad desde el inicio. Gamora Bot debe poder recibir eventos reales de WhatsApp sin convertir cada evento en una acción automática no controlada. El evento entra por el webhook, pero la verdad operativa vive en Gamora Core.
