# Integración WhatsApp Business API — Gamora Bot

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento define el enfoque técnico de integración entre Gamora Bot y WhatsApp Business Cloud API para el MVP.

El objetivo es documentar cómo Gamora deberá recibir mensajes, audios, archivos y eventos; enviar notificaciones; manejar templates; registrar opt-in/opt-out; procesar media; medir consumo; aplicar guardrails; y mantener trazabilidad técnica y funcional.

Este documento:

- No es código.
- No sustituye documentación oficial de Meta.
- No define todavía todos los endpoints internos.
- Será base para `07_Modelo_Tecnico/webhook_y_eventos.md`, prompts Codex y pruebas reales.

Cuando una regla dependa de documentación oficial vigente, configuración real de Meta, BSP, WABA o aprobación de templates, se marca como pendiente de validación técnica.

## 2. Principio rector de integración

WhatsApp será el canal operativo principal, pero no la fuente de verdad.

Gamora Core gobernará usuarios, opt-in, compromisos, estados, evidencias, bitácora, permisos y guardrails.

### Reglas

- No leer chats personales.
- No operar sobre grupos personales.
- No mensajes a usuarios no enrolados.
- Respetar opt-in/opt-out.
- Registrar mensajes entrantes y salientes relevantes.
- Medir consumo.
- Evitar duplicados.
- Reintentos con límite.
- Web/PWA como capa de control.
- WhatsApp no debe sustituir la base de datos ni la bitácora.

## 3. Decisión técnica MVP: Cloud API

### Decisión técnica MVP

El MVP debe orientarse a WhatsApp Business Cloud API.

Cloud API será la ruta recomendada frente a alternativas no oficiales porque permite trabajar sobre la plataforma oficial de Meta, usar webhooks, enviar mensajes programáticamente y evitar dependencias riesgosas de WhatsApp Web, extensiones o automatizaciones no autorizadas.

### Pendientes

- WABA central de Gamora vs WABA por cliente.
- BSP recomendado vs Cloud API directa.
- Requisitos de verificación de negocio.
- Número oficial de prueba vs número productivo.
- Costos y límites aplicables según país, categoría y configuración vigente.

## 4. Componentes Meta/WhatsApp involucrados

Componentes conceptuales que deberán considerarse:

- Meta Business Account / Business Portfolio.
- WhatsApp Business Account, WABA.
- Número de WhatsApp Business.
- Phone Number ID.
- Access Token.
- App de Meta Developers.
- Webhook callback URL.
- Verify token.
- Message templates.
- Media IDs.
- Message IDs.
- Conversation/message status events.

### Aclaración

Los nombres exactos de campos, permisos, scopes y eventos deberán validarse contra documentación oficial vigente de Meta antes de implementación.

## 5. Flujo de configuración inicial

Pasos conceptuales:

1. Crear/configurar cuenta Meta Business.
2. Crear o asociar WABA.
3. Asociar número oficial de WhatsApp Business.
4. Configurar app Meta Developers.
5. Obtener credenciales/tokens.
6. Configurar webhook público HTTPS.
7. Verificar webhook.
8. Suscribirse a eventos necesarios.
9. Crear templates iniciales.
10. Probar envío/recepción con número de prueba.
11. Pasar a staging controlado.

### Pendientes de validación técnica

- Flujo exacto para configurar producción.
- Requisitos de revisión o verificación de negocio.
- Permisos necesarios para la app.
- Scopes requeridos para Cloud API y webhooks.
- Si conviene trabajar con BSP para onboarding y soporte.

## 6. Mensajes entrantes

| Tipo | Uso funcional en Gamora | Acción esperada | Entidad relacionada | Reglas |
|---|---|---|---|---|
| Texto | Crear compromiso, consultar pendientes, responder aclaraciones, aceptar compromiso. | Interpretar intención, validar usuario y aplicar flujo. | messages, commitments, audit_logs. | No crear acciones ambiguas sin confirmación. |
| Audio / voice note | Reportar avance, dictar compromiso, enviar aclaración. | Descargar/procesar según flujo, transcribir si aplica, interpretar. | messages, ai_usage_logs, evidences si se almacena. | Speech-to-text pendiente de validación técnica. |
| Imagen | Evidencia de compromiso o reporte parcial. | Descargar/guardar, asociar a compromiso o dejar pendiente de asociación. | evidences, messages. | No cerrar sin asociación. |
| Documento / PDF | Reporte, cotización, corte o evidencia formal. | Descargar/guardar, asociar, notificar revisión. | evidences, evidence_reviews. | Puede contener datos sensibles. |
| Video | Evidencia futura o soporte de campo. | Pendiente de alcance. | evidences. | Opcional/futuro. |
| Ubicación | Posible evidencia futura de campo. | Pendiente de alcance. | evidences o future location_events. | Opcional/futuro; privacidad a validar. |
| Respuestas/interacciones | Confirmación, aceptación o selección guiada. | Mapear a flujo activo. | messages, state_transitions. | Validar estado de conversación. |
| Mensajes no soportados | Contenido fuera de alcance MVP. | Responder con alternativa o menú guiado. | messages, audit_logs. | No generar loops. |
| BAJA/STOP | Opt-out. | Desactivar canal WhatsApp del usuario. | opt_ins, users, audit_logs. | No eliminar datos automáticamente. |

### Regla funcional

Todo mensaje entrante debe pasar por validación de usuario, workspace, enrolamiento, permisos y guardrails antes de provocar una acción crítica.

## 7. Mensajes salientes

Tipos funcionales:

- Confirmación de compromiso.
- Asignación de compromiso.
- Solicitud de datos faltantes.
- Recordatorio.
- Evidencia pendiente de revisión.
- Aprobación.
- Corrección solicitada.
- Rechazo.
- Resumen diario.
- Alerta de guardrail/límite.
- Invitación/enrolamiento, si aplica.

### Reglas

- Validar opt-in.
- Validar WhatsApp activo.
- Validar usuario enrolado.
- Validar permisos.
- Validar si requiere template.
- Registrar message_id/proveedor.
- Registrar consumo.
- Evitar duplicados.
- No reintentar indefinidamente.
- No enviar mensajes a usuarios suspendidos.

### Decisión técnica MVP

Todo mensaje saliente debe tener intención válida y relación con un objeto funcional: compromiso, evidencia, invitación, resumen, guardrail o flujo de enrolamiento.

## 8. Templates y ventanas de conversación

Algunos mensajes salientes pueden requerir templates aprobados por Meta.

La operación dentro de una ventana activa de conversación puede permitir respuestas de servicio según reglas vigentes, pero esto debe validarse contra la documentación oficial actual y configuración real.

El MVP debe diseñar templates mínimos para casos necesarios.

### Templates candidatos

- Invitación/enrolamiento.
- Compromiso asignado.
- Recordatorio.
- Evidencia pendiente de revisión.
- Corrección solicitada.
- Resumen diario.
- Aviso de baja/opt-out.

### Pendientes

- Categorías aplicables.
- Aprobación por Meta.
- Costos.
- Texto final.
- Idiomas.
- Cuándo aplica template vs respuesta dentro de ventana activa.

## 9. Opt-in, opt-out y enrolamiento

### Flujo técnico-funcional

- Invitación no equivale a opt-in.
- Usuario acepta desde WhatsApp.
- Se registra opt-in en `opt_ins`.
- Se relaciona teléfono con user/workspace.
- BAJA/STOP actualiza canal WhatsApp a desactivado.
- No se elimina automáticamente información histórica.
- Notificaciones se bloquean si existe opt-out.

### Campos relevantes

- phone_number;
- channel;
- accepted_text;
- terms/privacy version;
- accepted_at;
- revoked_at;
- status.

### Reglas

- No enviar WhatsApp operativo sin opt-in activo.
- El administrador no puede aceptar por el usuario.
- El opt-out debe respetarse antes de cualquier notificación saliente.
- La baja de WhatsApp no borra bitácora ni evidencias automáticamente.

## 10. Media: imágenes, audios y documentos

WhatsApp puede entregar referencias/media IDs o datos que deben procesarse según documentación oficial.

Gamora no debe usar WhatsApp como almacenamiento permanente. Debe descargar o recuperar media según flujo oficial, guardarla en storage privado y asociarla al objeto funcional correcto.

### Reglas

- Media debe asociarse a compromiso, evidencia o estado pendiente de asociación.
- Audios pueden pasar a transcripción si aplica.
- No enviar archivos completos a IA por defecto.
- PDFs/cortes/fotos pueden contener datos sensibles.
- Evidencia sensible debe tener permisos.
- Acceso a evidencia sensible debe quedar en bitácora.

### Campos sugeridos para modelo futuro

- provider_media_id;
- storage_key;
- mime_type;
- size_bytes;
- file_name;
- media_type;
- related_commitment_id;
- is_sensitive.

### Pendientes

- Flujo exacto de descarga.
- Límites de tamaño.
- Expiración de URLs/media.
- Formatos soportados.
- Retención.
- Estrategia de URLs privadas o temporales.

## 11. Estados de mensajes

Estados funcionales:

- recibido;
- procesado;
- enviado;
- entregado;
- leído, si disponible;
- fallido;
- reintentando;
- reintentos agotados;
- bloqueado por opt-out;
- bloqueado por guardrail;
- duplicado detectado.

### Aclaración

No todos los estados técnicos estarán disponibles igual o con la misma semántica. Debe validarse con documentación oficial de Meta y pruebas reales en staging.

## 12. Webhook y eventos

El detalle completo irá en `07_Modelo_Tecnico/webhook_y_eventos.md`.

En este documento se establece:

- WhatsApp enviará eventos al webhook de Gamora.
- Eventos deben validarse, normalizarse, deduplicarse y procesarse.
- Todo evento relevante se registra en `webhook_events`.
- Evento duplicado no debe duplicar mensajes, evidencias ni compromisos.
- Reintentos tienen límite.
- Fallos relevantes deben registrarse.

### Pendiente de validación técnica

- Estructura exacta del payload de mensajes.
- Estructura exacta de estados de mensaje.
- Verificación de origen/firma.
- Suscripciones necesarias.

## 13. Guardrails WhatsApp

Guardrails obligatorios:

- Límite de mensajes salientes por usuario/workspace/periodo.
- Límite de recordatorios.
- Reintentos limitados.
- Deduplicación por provider_message_id/provider_event_id/payload_hash.
- Bloqueo a no enrolados.
- Bloqueo por opt-out.
- Pausa manual de automatizaciones.
- Agrupación de notificaciones.
- Alerta de consumo.
- Logging en `api_usage_logs` y `guardrail_events`.

### Regla funcional

Si un guardrail bloquea una acción, debe quedar registro del bloqueo y el usuario autorizado debe poder verlo en web/PWA cuando aplique.

## 14. Costos y consumo

El MVP debe medir consumo de mensajes/notificaciones.

El pricing exacto depende de reglas vigentes de Meta, categoría, país, ventana, tipo de mensaje y configuración comercial. Por lo tanto, los costos exactos quedan pendientes de validación técnica/comercial.

Trial gratuito para el usuario no significa costo cero para Gamora.

### Datos mínimos

- provider;
- api_type;
- units_used;
- related_object;
- estimated_cost;
- status;
- created_at.

### Reglas

- Registrar unidades disponibles aunque no haya costo exacto.
- Medir consumo por workspace.
- Activar alerta cuando se alcance o se acerque un límite.
- Permitir consulta de consumo básico por rol autorizado.

## 15. Seguridad y credenciales

### Reglas

- Access tokens fuera del repositorio.
- Variables de entorno.
- Secretos por ambiente.
- Rotación futura.
- HTTPS obligatorio.
- No logs con tokens.
- Control de permisos para administración de WABA.
- Separación dev/staging/prod.
- No usar credenciales productivas en desarrollo local.

### Pendientes

- Estrategia de secret manager.
- Responsable de administración de WABA.
- Ciclo de rotación de tokens.
- Permisos mínimos para usuarios técnicos.

## 16. Relación con modelo de datos

| Entidad | Relación con WhatsApp |
|---|---|
| messages | Registra mensajes entrantes y salientes relevantes, provider_message_id, dirección, canal y relación con compromisos/evidencias. |
| notifications | Controla notificaciones programadas, enviadas, fallidas, bloqueadas o agrupadas. |
| webhook_events | Registra eventos recibidos, estado de procesamiento, deduplicación y reintentos. |
| opt_ins | Registra consentimiento, canal, versiones aceptadas y revocación. |
| evidences | Guarda referencias a media descargada/almacenada y su asociación funcional. |
| api_usage_logs | Registra consumo de WhatsApp y otros proveedores. |
| guardrail_events | Registra límites, bloqueos, duplicados y pausas. |
| state_transitions | Registra cambios de estado derivados de mensajes/eventos. |
| audit_logs | Registra acciones críticas y eventos funcionales. |

## 17. Casos técnicos MVP que deben probarse

1. Usuario enrolado envía texto para crear compromiso.
2. Usuario no enrolado intenta interactuar.
3. Responsable recibe compromiso.
4. Responsable acepta.
5. Responsable envía imagen como evidencia.
6. Responsable envía PDF.
7. Evidencia ambigua requiere aclaración.
8. Coordinador recibe notificación de evidencia pendiente.
9. Usuario escribe BAJA/STOP.
10. Mensaje duplicado no duplica compromiso.
11. Notificación fallida no reintenta indefinidamente.
12. Guardrail bloquea envío.
13. Resumen diario enviado a usuario con opt-in.
14. Usuario con WhatsApp desactivado no recibe mensaje.

## 18. Fuera de alcance MVP

- Grupos de WhatsApp.
- Leer chats personales.
- Coexistencia avanzada con WhatsApp Business App.
- Multi-WABA enterprise.
- Campañas marketing.
- Atención al cliente masiva.
- Chatbot generalista.
- Pagos por WhatsApp.
- Catálogos/ecommerce.
- Llamadas de voz.
- Stickers/reactions como funcionalidad principal.
- Automatización sin usuario enrolado.
- Integraciones externas no necesarias para el ciclo MVP.

## 19. Pendientes de validación técnica

- WABA central vs WABA por cliente.
- BSP vs integración directa.
- Requisitos de verificación de negocio.
- Flujo exacto de media.
- Templates exactos y categorías.
- Costos por país/categoría.
- Límites de mensajes.
- Ventanas de conversación.
- Estados técnicos disponibles.
- Reglas de opt-in aceptables.
- Número de prueba vs productivo.
- Requisitos para producción.
- Permisos/scopes exactos.
- Verificación del webhook.
- Suscripciones de eventos necesarias.

## 20. Cierre del documento

La integración WhatsApp debe permitir operar con baja fricción, pero con control formal, consentimiento, trazabilidad, guardrails y medición de consumo.

Gamora Bot no debe depender de WhatsApp como base de datos ni como sistema completo. WhatsApp será el canal operativo principal; Gamora Core conservará la verdad del sistema: usuarios enrolados, compromisos, evidencias, estados, bitácora, permisos, consumo y guardrails.
