# Modelo de Datos — Gamora Bot

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento define el modelo de datos técnico-conceptual del MVP de Gamora Bot.

Su propósito es traducir la arquitectura técnica, arquitectura funcional, módulos MVP, modelo de estados y flujos aprobados en entidades, relaciones, estados, índices sugeridos y reglas de integridad.

Este documento:

- No es migración SQL.
- No es Prisma schema.
- No es implementación final.
- Es base para diseño técnico, prompts Codex y desarrollo posterior.

El detalle final de tipos, constraints, migraciones, nombres exactos de tablas y relaciones deberá definirse durante la etapa de implementación.

## 2. Principios del modelo de datos

- Gamora Core es la fuente de verdad.
- WhatsApp no es la base de datos.
- Todo compromiso pertenece a un workspace.
- Todo usuario pertenece a uno o más workspaces.
- Todo mensaje/evento debe poder trazarse.
- Toda evidencia debe asociarse a un objeto funcional.
- Toda transición crítica debe quedar en bitácora.
- Todo consumo de API debe poder medirse.
- No mezclar datos entre empresas.
- Guardrails requieren datos propios.
- Las decisiones críticas deben poder auditarse después.
- La evidencia sensible debe estar protegida por permisos.

## 3. Motor recomendado de base de datos

Para el MVP real se recomienda PostgreSQL.

SQLite puede utilizarse únicamente para un prototipo local si fuera necesario, pero no es la recomendación principal para un MVP conectado a WhatsApp Business API, OpenAI API, evidencias, estados, bitácoras y guardrails.

### Razones para recomendar PostgreSQL

- Maneja relaciones complejas entre usuarios, workspaces, compromisos, evidencias y bitácora.
- Permite consultas por estado, vencimiento, responsable y workspace.
- Soporta auditoría y trazabilidad con mayor solidez.
- Facilita integridad referencial.
- Es adecuado para registrar eventos, consumo, logs y guardrails.
- Permite crecimiento razonable sin rediseño inmediato.

## 4. Clasificación de entidades

### Entidades indispensables MVP

- workspaces / companies
- users
- workspace_users
- roles / permissions
- invitations
- opt_ins
- commitments
- evidences
- evidence_reviews
- messages
- notifications
- state_transitions
- audit_logs
- webhook_events
- ai_usage_logs
- api_usage_logs
- guardrail_events

### Entidades MVP+ / estrés funcional

- projects
- milestones
- partial_reports
- commitment_dependencies

### Entidades futuras / fuera de alcance

- billing avanzado
- marketplace
- ERP integrations
- mobile devices
- advanced analytics
- multi-WABA enterprise
- computer vision analysis

## 5. Entidad: workspaces / companies

### Propósito

Representa empresa, cliente o espacio operativo donde viven usuarios, compromisos, evidencias, permisos, bitácoras y configuración básica.

### Campos sugeridos

- id
- name
- legal_name opcional
- status
- timezone
- country
- created_at
- updated_at

### Relaciones

- users mediante workspace_users
- commitments
- invitations
- evidences
- projects
- guardrail settings
- audit_logs
- webhook_events cuando aplique

### Reglas

- Todo compromiso debe pertenecer a un workspace.
- Todo dato operativo debe estar separado por workspace.
- Las consultas, reportes, evidencias y bitácoras deben filtrarse por workspace.
- No debe existir mezcla de datos entre empresas.

## 6. Entidad: users

### Propósito

Representa a una persona que puede interactuar con Gamora por WhatsApp, web/PWA o ambos canales.

### Campos sugeridos

- id
- full_name
- phone_number
- email opcional
- status
- whatsapp_status
- created_at
- updated_at

### Estados

- invitado
- pendiente de aceptación
- activo/enrolado
- WhatsApp desactivado
- suspendido
- eliminado/dado de baja

### Reglas

- phone_number debe normalizarse.
- No enviar mensajes si whatsapp_status está desactivado.
- Un usuario puede participar en más de un workspace si se permite en futuro.
- El estado global del usuario no sustituye su rol dentro de cada workspace.
- La baja de WhatsApp no equivale a eliminación automática de datos.

## 7. Entidad: workspace_users

### Propósito

Relación entre usuario, workspace, rol y unidad/frente.

Permite que una persona tenga distintos roles o estados operativos según el workspace en el que participa.

### Campos sugeridos

- id
- workspace_id
- user_id
- role
- status
- unit_name opcional
- created_at
- updated_at

### Reglas

- Un usuario puede tener distinto rol por workspace.
- Los permisos se validan por workspace.
- Un usuario suspendido en un workspace no necesariamente queda suspendido globalmente.
- Las unidades, sucursales o frentes pueden iniciar como texto simple y evolucionar a entidad formal si el MVP lo requiere.

## 8. Entidades: roles / permissions

### Roles mínimos

- administrador
- coordinador
- responsable_operativo
- supervisor_validador
- observador

### Campos sugeridos para roles

- id
- role_key
- name
- description

### Campos sugeridos para permissions

- action_key
- description
- role_key

### Reglas

- El backend valida permisos.
- El frontend no es barrera única.
- Las acciones críticas deben validar rol y workspace.
- Permisos sensibles: aprobar evidencia, rechazar, cerrar compromiso, ver evidencia sensible, pausar automatizaciones, consultar consumo.

## 9. Entidad: invitations

### Propósito

Registra invitaciones generadas para que una persona pueda iniciar enrolamiento.

### Campos sugeridos

- id
- workspace_id
- invited_phone
- invited_name
- invited_role
- status
- token_hash
- expires_at
- created_by
- accepted_at
- revoked_at
- created_at

### Estados

- creada
- enviada
- abierta
- aceptada
- expirada
- revocada
- rechazada

### Reglas

- Invitación no equivale a opt-in.
- token no debe guardarse en texto plano.
- Una invitación expirada no debe completar enrolamiento sin regeneración o regla explícita.
- La aceptación debe registrar evidencia funcional del consentimiento.

## 10. Entidad: opt_ins

### Propósito

Registra consentimiento y autorización para operar por canal WhatsApp u otros canales futuros.

### Campos sugeridos

- id
- workspace_id
- user_id
- phone_number
- channel
- accepted_text
- accepted_terms_version
- accepted_privacy_version
- accepted_at
- revoked_at
- status

### Reglas

- No enviar WhatsApp operativo sin opt-in activo.
- Opt-out no elimina automáticamente datos.
- Debe distinguirse consentimiento de administrador y consentimiento del usuario enrolado.
- El sistema debe poder mostrar qué versión de aviso/términos fue aceptada.

## 11. Entidad: commitments

### Propósito

Representa el objeto central de Gamora: el compromiso operativo trazable.

### Campos sugeridos

- id
- workspace_id
- title
- description
- responsible_user_id
- created_by_user_id
- validator_user_id opcional
- unit_or_front opcional
- due_at
- expected_evidence
- priority
- status
- source_channel
- created_at
- updated_at
- closed_at
- canceled_at

### Estados

- borrador
- pendiente_datos
- confirmacion_requerida
- creado_asignado
- pendiente_aceptacion
- aceptado_en_proceso
- evidencia_recibida
- en_revision
- correccion_solicitada
- rechazado
- aprobado
- cerrado_liberado
- vencido
- cancelado
- suspendido_por_guardrail

### Reglas

- No debe quedar activo sin responsable, descripción y fecha.
- El responsable debe estar enrolado para notificación WhatsApp.
- El cierre requiere rol autorizado.
- La IA puede proponer datos, pero no crear compromisos finales sin validación del backend y confirmación cuando aplique.
- Todo cambio crítico debe registrarse en state_transitions y audit_logs.

## 12. Entidad: commitment_dependencies

### Clasificación

MVP+ o soporte controlado.

### Propósito

Permite representar dependencias entre compromisos, como el caso Heriberto → Ariel en Mina Mercedes.

### Campos sugeridos

- id
- workspace_id
- commitment_id
- depends_on_commitment_id
- dependency_type
- status
- created_at
- resolved_at

### Estados

- pendiente_insumo
- bloqueado_por_dependencia
- dependencia_resuelta
- cancelada

### Reglas

- Debe distinguirse vencido de bloqueado por dependencia.
- Resolver la dependencia debe quedar en bitácora.
- El compromiso dependiente no debe cerrarse si el insumo requerido sigue pendiente, salvo regla autorizada.

## 13. Entidad: evidences

### Propósito

Registra evidencias enviadas por usuarios y las asocia con compromisos, hitos o reportes parciales.

### Campos sugeridos

- id
- workspace_id
- commitment_id nullable
- project_id nullable
- milestone_id nullable
- partial_report_id nullable
- uploaded_by_user_id
- source_channel
- media_type
- file_name
- storage_key
- mime_type
- size_bytes
- status
- is_sensitive
- created_at
- updated_at

### Estados

- recibida
- asociada
- pendiente_clasificacion
- sensible
- en_revision
- aprobada
- rechazada
- correccion_solicitada
- reemplazada
- archivada

### Reglas

- Evidencia sin asociación no cierra compromiso.
- Evidencia sensible requiere permisos.
- No almacenar archivos públicos sin control.
- No enviar archivos completos a IA por defecto.
- El acceso a evidencia sensible debe quedar registrado.

## 14. Entidad: evidence_reviews

### Propósito

Registra decisiones de revisión sobre evidencias.

### Campos sugeridos

- id
- evidence_id
- commitment_id
- reviewer_user_id
- decision
- comments
- created_at

### Decisiones

- aprobada
- aprobada_con_observacion
- correccion_solicitada
- rechazada

### Reglas

- Rechazo/corrección requiere motivo.
- Responsable no valida su propia entrega si el flujo lo exige.
- Aprobar evidencia no siempre implica cerrar compromiso si el flujo requiere cierre formal.
- La revisión debe respetar permisos por workspace y rol.

## 15. Entidad: messages

### Propósito

Registrar mensajes entrantes y salientes relevantes para trazabilidad, idempotencia y auditoría funcional.

### Campos sugeridos

- id
- workspace_id nullable
- user_id nullable
- phone_number
- direction
- channel
- provider_message_id
- message_type
- body_text
- related_commitment_id nullable
- related_evidence_id nullable
- status
- created_at

### Reglas

- No guardar más contenido del necesario si no aplica.
- provider_message_id ayuda a idempotencia.
- Mensajes de usuarios desconocidos pueden tener workspace_id nullable hasta resolver contexto.
- Mensajes con datos sensibles deben manejarse bajo reglas de minimización.

## 16. Entidad: notifications

### Propósito

Registrar notificaciones programadas, enviadas, fallidas, agrupadas o bloqueadas.

### Campos sugeridos

- id
- workspace_id
- user_id
- notification_type
- channel
- related_commitment_id nullable
- related_evidence_id nullable
- status
- scheduled_at
- sent_at
- failed_at
- retry_count
- provider_message_id

### Estados

- programada
- enviada
- entregada
- fallida
- reintentando
- reintentos_agotados
- cancelada
- bloqueada_opt_out
- bloqueada_guardrail
- agrupada_resumen

### Reglas

- No reintentos infinitos.
- Respetar opt-out.
- Evitar duplicados.
- No notificar usuarios no enrolados.
- Toda notificación debe tener intención válida.

## 17. Entidad: webhook_events

### Propósito

Registrar eventos recibidos de proveedores externos como WhatsApp Business Cloud API.

### Campos sugeridos

- id
- provider
- provider_event_id
- event_type
- payload_hash
- status
- received_at
- processed_at
- retry_count
- related_message_id nullable

### Estados

- recibido
- en_validacion
- procesado
- duplicado_detectado
- ignorado
- fallido
- reintento_programado
- reintentos_agotados
- bloqueado_guardrail

### Reglas

- provider_event_id o payload_hash sirven para idempotencia.
- Evento duplicado no debe duplicar compromiso/mensaje/evidencia.
- Reintentos deben tener límite.
- Fallos críticos deben registrarse.

## 18. Entidad: state_transitions

### Propósito

Registrar cambios de estado de objetos funcionales.

### Campos sugeridos

- id
- workspace_id
- object_type
- object_id
- from_state
- to_state
- changed_by_user_id nullable
- reason
- created_at

### Reglas

- Toda transición crítica se registra.
- No editable libremente.
- Debe permitir reconstruir historia de compromiso, evidencia, usuario, notificación, guardrail o hito.
- Cambios automáticos deben diferenciarse de cambios hechos por usuario.

## 19. Entidad: audit_logs

### Propósito

Registrar acciones críticas y eventos funcionales relevantes.

### Campos sugeridos

- id
- workspace_id
- actor_user_id nullable
- action
- object_type
- object_id
- description
- metadata_json
- created_at

### Reglas

- Registrar acciones críticas.
- Evitar datos sensibles innecesarios en metadata.
- Debe usarse para auditoría funcional, no como sustituto de tablas operativas.
- Accesos a evidencia sensible deben registrarse.

## 20. Entidades: ai_usage_logs y api_usage_logs

### ai_usage_logs

Campos sugeridos:

- id
- workspace_id
- user_id nullable
- conversation_id nullable
- purpose
- model
- input_tokens_estimated
- output_tokens_estimated
- cost_estimated
- status
- created_at

### api_usage_logs

Campos sugeridos:

- id
- workspace_id
- provider
- api_type
- units_used
- cost_estimated
- related_object_type
- related_object_id
- status
- created_at

### Reglas

- Todo uso de API de pago debe registrarse.
- Si no hay costo exacto, registrar estimación o unidades disponibles.
- El consumo debe poder consultarse por workspace.
- Guardrails deben poder usar estas entidades para límites básicos.

## 21. Entidad: guardrail_events

### Propósito

Registrar límites, bloqueos, pausas, eventos duplicados, loops y controles de consumo.

### Campos sugeridos

- id
- workspace_id
- guardrail_type
- scope_type
- scope_id
- status
- threshold
- current_value
- action_taken
- created_at
- resolved_at

### Tipos

- rate_limit
- ai_limit
- whatsapp_message_limit
- retry_limit
- duplicate_event
- loop_detected
- opt_out_block
- not_enrolled_block
- manual_pause
- anomaly_pause

### Reglas

- Guardrail activado debe quedar en bitácora.
- Límite alcanzado puede bloquear consumo adicional.
- Pausa manual o automática debe tener trazabilidad.
- Un evento duplicado detectado no debe ejecutar acción funcional repetida.

## 22. Entidades MVP+: projects, milestones, partial_reports

### projects

Campos sugeridos:

- id
- workspace_id
- name
- status
- supervisor_user_id
- created_by_user_id
- created_at

### milestones

Campos sugeridos:

- id
- project_id
- name
- code
- status
- reported_progress
- validated_progress
- closed_at

### partial_reports

Campos sugeridos:

- id
- project_id
- milestone_id nullable
- reported_by_user_id
- reported_progress
- validated_progress
- status
- created_at
- validated_at

### Reglas

- Avance reportado no es avance validado.
- Hito no cierra sin validación.
- IA no calcula avance por imagen.
- El supervisor o rol autorizado valida el avance oficial.
- Evidencia debe asociarse al reporte parcial correcto.

## 23. Índices sugeridos

Índices sugeridos para consultas MVP:

- workspace_id en tablas operativas.
- phone_number en users.
- provider_message_id en messages.
- provider_event_id en webhook_events.
- payload_hash en webhook_events.
- status en commitments, evidences, notifications.
- due_at en commitments.
- responsible_user_id en commitments.
- related_commitment_id en evidences/messages/notifications.
- commitment_id en evidences y evidence_reviews.
- created_at para auditoría/reportes.
- guardrail_type y scope_id en guardrail_events.
- workspace_id + created_at en ai_usage_logs y api_usage_logs.

### Pendiente de validación técnica

Los índices exactos dependerán del motor elegido, volumen esperado, consultas reales del dashboard y estrategia de paginación.

## 24. Reglas de integridad y seguridad

- Foreign keys por workspace cuando aplique.
- Validación de permisos en backend.
- Separación por workspace.
- Soft delete cuando aplique.
- No borrar bitácora crítica.
- Evidencia con acceso privado.
- No secretos en base de datos operativa.
- No logs con tokens.
- Normalización de teléfonos.
- Validar que usuarios, compromisos y evidencias pertenezcan al mismo workspace.
- Restringir actualización directa de estados finales.
- Registrar acciones automáticas y humanas de forma diferenciada.

## 25. Datos fuera de alcance MVP

- Facturación avanzada.
- Pagos.
- Marketplace.
- ERP.
- Nómina.
- RH.
- Inventario formal.
- Analítica avanzada.
- Visión computacional.
- Datos biométricos.
- Geolocalización obligatoria.
- Evaluación automática de calidad por imagen.
- Integraciones externas complejas.

## 26. Pendientes de validación técnica

- Estructura exacta de mensajes WhatsApp.
- Media IDs y descarga.
- Límites de tamaño de archivos.
- Modelo final de permisos.
- Retención de evidencias.
- Costo exacto por mensaje/API.
- Proveedor de storage.
- Proveedor de auth.
- Si projects/milestones entran en MVP inicial o quedan MVP+.
- Estrategia de soft delete vs hard delete.
- Política de archivado de bitácora.
- Definición de unidades, sucursales o frentes como texto o entidad propia.

## 27. Cierre del documento

Este modelo de datos debe permitir construir el MVP real sin perder trazabilidad, privacidad, control de costos ni separación por empresa.

Gamora Bot necesita persistir más que tareas: debe registrar usuarios enrolados, compromisos, evidencias, estados, mensajes, eventos, consumo, guardrails y bitácora. Esa estructura es la base para que WhatsApp sea un canal operativo de baja fricción, mientras Gamora Core conserva el control formal del sistema.
