# Arquitectura Técnica — Gamora Bot

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento define la arquitectura técnica de alto nivel del MVP de Gamora Bot.

Su propósito es traducir la arquitectura funcional, los módulos MVP, el modelo de estados y los flujos aprobados en una estructura técnica inicial que permita construir un MVP real.

Este documento:

- No es código.
- No es todavía modelo de datos detallado.
- No es especificación exhaustiva de endpoints.
- No sustituye la documentación oficial de Meta, WhatsApp Business Platform u OpenAI.
- Sirve como puente entre arquitectura funcional y desarrollo con Codex.

Cuando una decisión dependa de configuración, proveedor, documentación oficial vigente o validación con BSP/Meta/OpenAI, se marca como pendiente de validación técnica.

## 2. Principio técnico rector

Gamora Bot debe ser un MVP completamente funcional, no solo una simulación.

Debe demostrar:

- Comunicación real con WhatsApp Business API.
- Recepción real de mensajes, audios, archivos y eventos.
- Envío real de mensajes/notificaciones.
- Interpretación real con OpenAI API o proveedor IA definido.
- Web/PWA operativa.
- Persistencia real de usuarios, compromisos, evidencias, estados y bitácora.
- Guardrails técnicos mínimos.
- Logs y trazabilidad.

### Regla

WhatsApp es canal operativo; Gamora Core es el sistema; web/PWA es la capa de control; IA interpreta; backend gobierna; humano valida.

## 3. Vista técnica de alto nivel

Flujo conceptual:

Usuario WhatsApp  
↓  
WhatsApp Business Cloud API  
↓  
Webhook Gamora  
↓  
Event Intake / Validador de eventos  
↓  
Gamora Core Backend  
↓  
Motor de estados / compromisos / permisos / evidencias / bitácora  
↓  
IA Service / OpenAI API cuando aplique  
↓  
Base de datos + almacenamiento de evidencias  
↓  
Web/PWA  
↓  
Notificaciones salientes vía WhatsApp Business API

Los guardrails deben cruzar todo el sistema:

- IA.
- WhatsApp.
- Webhooks.
- Notificaciones.
- Reintentos.
- Consumo.
- Evidencias.
- Acciones críticas.

## 4. Componentes técnicos principales

### 1. WhatsApp Business Cloud API

**Propósito:** Conectar Gamora con el canal operativo WhatsApp.

**Responsabilidades:**

- Recibir mensajes de usuarios mediante eventos enviados al webhook.
- Permitir envío de mensajes salientes, notificaciones y respuestas.
- Recibir o referenciar media como imágenes, audios, PDFs y documentos.

**Qué no debe hacer:**

- Gobernar estados de negocio.
- Decidir permisos.
- Aprobar evidencias.
- Sustituir Gamora Core.

**Dependencias:**

- Cuenta WhatsApp Business Platform.
- Número oficial.
- Configuración de Cloud API.
- Webhook público con HTTPS.
- Templates cuando aplique.

**Pendiente de validación técnica:** modalidad exacta de operación: WABA central de Gamora, WABA por cliente, uso directo Cloud API o BSP.

### 2. Webhook receptor

**Propósito:** Recibir eventos entrantes desde WhatsApp Business Cloud API.

**Responsabilidades:**

- Exponer endpoint HTTPS para eventos.
- Validar origen y estructura del evento según configuración oficial.
- Entregar evento a Event Intake / Event Processor.
- Registrar recepción básica.

**Qué no debe hacer:**

- Ejecutar toda la lógica de negocio directamente.
- Crear compromisos sin validación.
- Enviar múltiples respuestas sin control.

**Dependencias:**

- Dominio público.
- HTTPS.
- Configuración webhook en Meta.
- Variables de entorno seguras.

### 3. Event Intake / Event Processor

**Propósito:** Normalizar, validar y enrutar eventos antes de que lleguen a Gamora Core.

**Responsabilidades:**

- Identificar tipo de evento: mensaje, audio, archivo, estado de mensaje, opt-out, error u otro.
- Aplicar idempotencia conceptual para evitar duplicados.
- Registrar evento recibido.
- Detectar eventos repetidos o inválidos.
- Enviar evento válido a Gamora Core.

**Qué no debe hacer:**

- Saltarse permisos.
- Crear estados finales.
- Reintentar indefinidamente.

**Dependencias:**

- Tabla o registro de webhook_events.
- Guardrails Service.
- Logs técnicos.

### 4. Gamora Core Backend

**Propósito:** Núcleo técnico del sistema.

**Responsabilidades:**

- Gobernar reglas de negocio.
- Coordinar motores de usuarios, compromisos, evidencias, estados, notificaciones y bitácora.
- Validar permisos.
- Ejecutar transiciones de estado.
- Coordinar llamadas a IA Service cuando aplique.

**Qué no debe hacer:**

- Delegar decisiones críticas a la IA.
- Enviar mensajes sin pasar por guardrails.
- Tratar WhatsApp como única fuente de verdad.

**Dependencias:**

- Base de datos.
- IA Service.
- Guardrails Service.
- Motor de notificaciones.
- Web/PWA.

### 5. Motor de usuarios/enrolamiento

**Propósito:** Administrar usuarios, invitaciones, opt-in, opt-out, roles y estado de WhatsApp.

**Responsabilidades:**

- Registrar usuarios.
- Manejar invitaciones.
- Registrar opt-in y versión de aviso aceptado.
- Registrar opt-out/baja.
- Bloquear mensajes a no enrolados.
- Relacionar usuario con empresa, rol y número WhatsApp.

**Qué no debe hacer:**

- Activar WhatsApp por el usuario sin aceptación.
- Enviar compromisos antes de enrolamiento.

**Dependencias:**

- Base de datos.
- Motor de notificaciones.
- Web/PWA.
- WhatsApp Business Cloud API.

### 6. Motor de compromisos

**Propósito:** Crear, asignar y administrar compromisos operativos.

**Responsabilidades:**

- Crear borradores.
- Validar datos mínimos.
- Asignar responsables.
- Manejar dependencias.
- Evitar compromisos ambiguos.
- Coordinar estados con evidencias y validación.

**Qué no debe hacer:**

- Cerrar compromisos sin validación requerida.
- Crear compromisos masivos sin control.
- Asignar a no enrolados por WhatsApp.

**Dependencias:**

- Motor de estados.
- Motor de usuarios.
- IA Service.
- Guardrails Service.
- Bitácora.

### 7. Motor de evidencias

**Propósito:** Recibir, asociar, proteger y preparar evidencias para revisión.

**Responsabilidades:**

- Asociar evidencia a compromiso, hito o reporte parcial.
- Marcar evidencia sensible.
- Controlar acceso según permisos.
- Registrar quién sube, revisa o accede.
- Coordinar almacenamiento seguro.

**Qué no debe hacer:**

- Tratar evidencia como adjunto sin contexto.
- Enviar archivos completos a IA por defecto.
- Permitir cierre con evidencia sin asociación.

**Dependencias:**

- Almacenamiento de evidencias.
- Base de datos.
- Motor de permisos.
- Bitácora.

### 8. Motor de estados

**Propósito:** Controlar transiciones funcionales.

**Responsabilidades:**

- Aplicar estados definidos en modelo_de_estados.md.
- Validar transiciones.
- Registrar cambios críticos.
- Evitar ambigüedad entre reportado, validado, cerrado, vencido y cancelado.

**Qué no debe hacer:**

- Permitir cambios críticos sin actor autorizado.
- Permitir transición final basada solo en IA.

**Dependencias:**

- Base de datos.
- Bitácora.
- Guardrails Service.

### 9. Motor de notificaciones

**Propósito:** Enviar mensajes salientes controlados.

**Responsabilidades:**

- Enviar compromisos asignados.
- Enviar recordatorios.
- Notificar evidencias pendientes.
- Comunicar aprobación, corrección o rechazo.
- Enviar resúmenes.
- Controlar reintentos.

**Qué no debe hacer:**

- Enviar mensajes a no enrolados.
- Ignorar opt-out.
- Reintentar indefinidamente.
- Enviar duplicados por eventos repetidos.

**Dependencias:**

- WhatsApp Business Cloud API.
- Guardrails Service.
- Registro de messages/notifications.
- Templates cuando aplique.

### 10. IA Service

**Propósito:** Encapsular llamadas a OpenAI API o proveedor IA definido.

**Responsabilidades:**

- Interpretar lenguaje natural.
- Interpretar o transcribir audios cuando aplique.
- Extraer responsables, fechas, evidencia esperada e intención.
- Preparar respuestas o resúmenes.
- Devolver resultados estructurados cuando sea posible.

**Qué no debe hacer:**

- Aprobar evidencias.
- Cerrar compromisos.
- Ejecutar acciones críticas.
- Consultar libremente toda la base de datos.

**Dependencias:**

- OpenAI API.
- Guardrails Service.
- Prompt/configuración de IA.
- Logs de uso.

### 11. Guardrails Service

**Propósito:** Proteger costos, canal, consumo, seguridad y acciones críticas.

**Responsabilidades:**

- Aplicar rate limits.
- Limitar llamadas IA.
- Limitar mensajes WhatsApp.
- Controlar reintentos.
- Detectar duplicados.
- Bloquear consumo adicional cuando se alcance límite.
- Activar pausa manual o automática.
- Registrar eventos de guardrail.

**Qué no debe hacer:**

- Reemplazar lógica de negocio.
- Ocultar errores críticos.
- Aprobar o cerrar compromisos.

**Dependencias:**

- Base de datos.
- Logs.
- Motor de estados.
- Motor de notificaciones.
- IA Service.

### 12. Base de datos

**Propósito:** Persistir la información central de Gamora Core.

**Responsabilidades:**

- Guardar usuarios, empresas, roles, compromisos, evidencias, estados y bitácora.
- Registrar eventos, mensajes, consumo y guardrails.
- Permitir consultas para web/PWA y WhatsApp.

**Qué no debe hacer:**

- Almacenar secretos sin protección.
- Mezclar datos entre empresas.

**Dependencias:**

- Backend.
- ORM.
- Estrategia de backups.

### 13. Almacenamiento de evidencias

**Propósito:** Guardar archivos, fotos, audios, PDFs y documentos.

**Responsabilidades:**

- Almacenar evidencia de forma segura.
- Permitir asociación con compromisos.
- Controlar acceso.
- Mantener referencias para revisión.

**Qué no debe hacer:**

- Exponer archivos públicamente sin control.
- Enviar todo a IA por defecto.

**Dependencias:**

- Proveedor storage.
- Backend.
- Permisos.
- Retención futura.

### 14. Web/PWA frontend

**Propósito:** Capa formal de control.

**Responsabilidades:**

- Login.
- Dashboard.
- Administración de usuarios.
- Revisión de evidencias.
- Aprobación/rechazo/corrección.
- Bitácora.
- Consumo/guardrails.
- Configuración básica.

**Qué no debe hacer:**

- Convertirse en ERP.
- Exponer datos sin permisos.
- Reemplazar controles de backend.

**Dependencias:**

- Backend API.
- Autenticación.
- Permisos.

### 15. Servicio de autenticación

**Propósito:** Controlar acceso a web/PWA y relacionar usuarios con empresa/rol.

**Responsabilidades:**

- Login.
- Sesiones.
- Roles.
- Bloqueos.
- Auditoría de acciones críticas.

**Qué no debe hacer:**

- Confiar solo en controles del frontend.
- Permitir acceso entre workspaces sin autorización.

**Dependencias:**

- Base de datos.
- Backend.
- Proveedor de autenticación pendiente de decisión.

### 16. Servicio de logs y auditoría

**Propósito:** Registrar trazabilidad funcional y técnica.

**Responsabilidades:**

- Logs funcionales.
- Logs técnicos.
- Audit logs.
- AI usage logs.
- API usage logs.
- Webhook events.
- Guardrail events.

**Qué no debe hacer:**

- Guardar datos sensibles innecesarios.
- Sustituir bitácora funcional.

**Dependencias:**

- Backend.
- Base de datos.
- Proveedor de observabilidad futuro.

### 17. Configuración y variables de entorno

**Propósito:** Manejar credenciales y parámetros por ambiente.

**Responsabilidades:**

- Guardar claves API fuera del código.
- Separar dev/staging/prod.
- Controlar tokens Meta/OpenAI/storage.
- Configurar límites.

**Qué no debe hacer:**

- Guardar secretos en repositorio.
- Reutilizar credenciales de producción en desarrollo.

**Dependencias:**

- Secret manager o variables de entorno.
- Proveedor de hosting.

### 18. Ambientes dev/staging/prod

**Propósito:** Separar desarrollo, pruebas y operación real.

**Responsabilidades:**

- Desarrollo local.
- Staging para pruebas reales controladas.
- Producción futura.
- Separación de credenciales.
- Pruebas antes de despliegue.

**Qué no debe hacer:**

- Probar mensajes reales sin control.
- Mezclar datos de clientes reales con pruebas.

**Dependencias:**

- Hosting.
- Dominio.
- HTTPS.
- Base de datos por ambiente.

## 5. Arquitectura MVP recomendada

### Stack técnico inicial propuesto

- Backend: Node.js + Express o NestJS.
- Base de datos: PostgreSQL recomendada para MVP real.
- ORM: Prisma o similar.
- Frontend Web/PWA: React / Next.js.
- Almacenamiento de evidencias: Azure Blob Storage, AWS S3 o equivalente.
- IA: OpenAI API.
- WhatsApp: Meta WhatsApp Business Cloud API.
- Hosting: Azure App Service, Render, Railway, Fly.io o equivalente.
- Logs: aplicación + tabla de auditoría + proveedor futuro.
- Cola simple o job worker: BullMQ/Redis o equivalente si se requiere.

### Decisión MVP recomendada

Para prototipo local se podría iniciar con SQLite, pero para un MVP real conectado a APIs, usuarios, evidencias, webhooks, bitácora y guardrails se recomienda PostgreSQL.

El stack final deberá validarse según presupuesto, hosting disponible, experiencia técnica y facilidad de despliegue.

## 6. Flujo técnico de entrada WhatsApp

1. Usuario envía mensaje, audio o archivo a número de WhatsApp Business.
2. Meta envía evento al webhook de Gamora.
3. Webhook valida evento.
4. Event Processor identifica tipo de evento.
5. Se valida usuario, empresa, enrolamiento y estado.
6. Se registra evento.
7. Se aplica idempotencia para evitar duplicados.
8. Se decide si requiere IA.
9. Backend ejecuta regla funcional.
10. Se registra bitácora.
11. Si aplica, se envía respuesta por WhatsApp.

### Decisiones MVP

- Todo evento entrante debe registrarse antes o durante su procesamiento.
- Todo evento debe tener protección contra duplicados.
- Todo mensaje de usuario no enrolado debe seguir flujo de invitación/enrolamiento o bloqueo funcional.
- Todo archivo o audio debe quedar asociado a una intención, compromiso o estado pendiente de aclaración.

### Pendiente de validación técnica

- Estructura exacta de payloads de Cloud API.
- Firma/verificación exacta del webhook.
- Flujo exacto para descargar media recibida.
- Tipos de eventos que deberán escucharse en el MVP.

## 7. Flujo técnico de salida WhatsApp

Los mensajes salientes pueden incluir:

- Notificación de compromiso asignado.
- Recordatorio.
- Evidencia pendiente de revisión.
- Aprobación/rechazo/corrección.
- Resumen diario.
- Guardrail/límite alcanzado.

### Reglas técnicas MVP

- Validar opt-in/opt-out antes de enviar.
- Bloquear mensajes a no enrolados.
- Validar si requiere template aprobado cuando aplique.
- Registrar mensaje saliente.
- Medir consumo.
- Reintentar con límite.
- Evitar duplicados.
- Asociar mensaje a intención válida, compromiso, evidencia, resumen o guardrail.

### Pendiente de validación técnica

- Categorías de mensajes aplicables.
- Templates necesarios.
- Costos por tipo de conversación o mensaje.
- Reglas vigentes de ventanas de conversación.

## 8. Integración OpenAI / IA Service

### Propósito

- Interpretar lenguaje natural.
- Interpretar audios transcritos.
- Detectar responsables, fechas y evidencias esperadas.
- Proponer clasificación de intención.
- Redactar resúmenes breves.

### Reglas

- No aprobar.
- No cerrar.
- No ejecutar acciones críticas.
- No consultar libremente base de datos.
- Backend decide herramientas/datos permitidos.
- Enviar mínimo contexto necesario.
- No enviar evidencia completa salvo justificación.
- Registrar uso y consumo.
- Aplicar límites por usuario/empresa/conversación/periodo.

### Capacidades técnicas a considerar

- Uso de Responses API para generación/interpretación de texto.
- Uso de structured output / JSON estructurado para devolver intención, responsable, fecha, evidencia esperada, confianza y datos faltantes.
- Speech-to-text para audios como capacidad técnica a validar.
- Fallback a menú guiado cuando haya baja confianza.

### Pendiente de validación técnica

- Modelo OpenAI recomendado.
- Costo por token estimado.
- Política de retención/procesamiento de datos.
- Manejo de audios largos.
- Si se usará transcripción directa, primero descargar audio desde WhatsApp y después procesarlo con OpenAI.

## 9. Guardrails técnicos mínimos

Los guardrails técnicos son obligatorios desde el MVP.

### Guardrails requeridos

- Rate limit por usuario.
- Rate limit por empresa.
- Rate limit por conversación.
- Límite de llamadas IA.
- Límite de mensajes WhatsApp.
- Límite de reintentos.
- Idempotencia de eventos.
- Prevención de mensajes duplicados.
- Circuit breaker manual.
- Pausa manual de automatizaciones.
- Bloqueo por opt-out.
- Bloqueo a usuarios no enrolados.
- Límite de archivos/evidencias por compromiso.
- Logging de consumo.
- Alertas básicas.
- Fallback a menú guiado.
- Estado “bloqueado por guardrail”.

### Decisiones MVP

- Si se alcanza un límite, el sistema debe bloquear consumo adicional según regla.
- Si hay baja confianza de IA, no se crea compromiso directo.
- Si hay error repetido, se pausa flujo.
- Si un webhook llega duplicado, no debe duplicar mensaje, evidencia ni compromiso.
- Si un administrador pausa automatizaciones, no deben enviarse notificaciones no críticas.

## 10. Modelo de persistencia a alto nivel

El detalle se desarrollará en `modelo_datos.md`. A alto nivel, el MVP debe contemplar entidades como:

- companies / workspaces;
- users;
- user_roles;
- invitations;
- opt_ins;
- commitments;
- commitment_dependencies;
- evidences;
- evidence_reviews;
- messages;
- notifications;
- state_transitions;
- audit_logs;
- ai_usage_logs;
- api_usage_logs;
- guardrail_events;
- webhook_events;
- projects;
- milestones;
- partial_reports.

### Decisión MVP

PostgreSQL es la base recomendada para persistencia real del MVP, especialmente por relaciones entre usuarios, compromisos, evidencias, estados, dependencias y bitácora.

## 11. Evidencias y archivos

El MVP debe soportar recepción y gestión de evidencias.

### Capacidades

- Recepción de media desde WhatsApp.
- Descarga/almacenamiento seguro.
- Asociación con compromiso, hito o reporte parcial.
- Permisos.
- Evidencia sensible.
- Bitácora de acceso.
- Retención futura.
- No enviar archivos completos a IA por defecto.

### Decisiones MVP

- Toda evidencia debe tener referencia a un objeto funcional.
- Evidencia sin asociación no puede cerrar compromisos.
- Evidencia sensible debe restringirse por rol.
- Acceso a evidencia sensible debe registrarse.

### Pendientes

- Confirmar flujo exacto de descarga de media con WhatsApp Cloud API.
- Definir proveedor de storage.
- Definir retención inicial.
- Definir estrategia de URLs temporales o acceso privado.

## 12. Web/PWA

### Vistas mínimas

- Login.
- Dashboard.
- Compromisos.
- Detalle de compromiso.
- Evidencias pendientes.
- Usuarios/enrolamiento.
- Bitácora.
- Consumo/guardrails.
- Configuración básica.

### Reglas

- Permisos por rol.
- Separación por empresa.
- Revisión de evidencia.
- Aprobación/rechazo/corrección.
- Pausa manual de automatizaciones.
- No exponer evidencia o compromisos fuera del workspace autorizado.

## 13. Autenticación y autorización

### Capacidades

- Login web/PWA.
- Relación usuario-empresa-rol.
- Permisos por acción.
- Usuarios WhatsApp vinculados por número y opt-in.
- Sesiones.
- Bloqueo/suspensión.
- Auditoría de acciones críticas.

### Decisión MVP

El backend debe validar permisos en cada acción crítica. El frontend no debe ser la única barrera.

### Pendiente de validación técnica

- Proveedor definitivo de autenticación.
- Autenticación propia vs servicio externo.
- Reglas de recuperación de cuenta.
- Política de sesiones.

## 14. Ambientes y DevOps mínimo

### Ambientes

- Desarrollo local.
- Staging.
- Producción futura.

### Requisitos mínimos

- Variables de entorno.
- Secretos.
- Dominios.
- HTTPS obligatorio para webhooks.
- Backups.
- Logs.
- Monitoreo básico.
- Despliegue controlado.

### Reglas

- No exponer tokens.
- No guardar credenciales en repositorio.
- Separar credenciales por ambiente.
- No probar producción con datos reales sin control.

## 15. Seguridad y privacidad técnica

### Reglas mínimas

- Separación por workspace.
- Control de evidencias.
- Bitácora.
- Cifrado en tránsito.
- Almacenamiento seguro.
- Control de acceso.
- No lectura de chats personales.
- Minimización de datos enviados a IA.
- Retención futura.
- Eliminación/bloqueo según política.

### Decisión MVP

La seguridad no debe tratarse como fase posterior. El MVP debe impedir exposición básica de datos, evidencia y mensajes desde el primer ciclo funcional.

## 16. Observabilidad y auditoría

### Registros requeridos

- Logs funcionales.
- Logs técnicos.
- Audit logs.
- AI usage logs.
- API usage logs.
- Webhook events.
- Error logs.
- Guardrail events.

### Métricas mínimas

- Mensajes recibidos.
- Mensajes enviados.
- Llamadas IA.
- Errores webhook.
- Duplicados detectados.
- Reintentos agotados.
- Guardrails activados.
- Evidencias recibidas.
- Notificaciones bloqueadas.
- Consumo por empresa.

## 17. Riesgos técnicos principales

| Riesgo | Impacto | Mitigación resumida |
|---|---|---|
| Webhook duplicado | Compromisos, mensajes o evidencias duplicadas. | Idempotencia, webhook_events, deduplicación y guardrails. |
| Caída de WhatsApp/API | Interrupción del canal operativo. | Registro de fallos, reintentos limitados, web/PWA como capa de control. |
| Tokens expuestos | Riesgo de seguridad y costos. | Variables de entorno, secret management, no credenciales en repositorio. |
| Consumo excesivo IA | Costos inesperados. | Límites por empresa/usuario/conversación, usage logs y alertas. |
| Mensajes duplicados | Mala experiencia y riesgo de spam. | Idempotencia, message logs y prevención de reenvío. |
| Media no asociada | Evidencia inútil para cierre. | Estado pendiente de asociación y bloqueo de cierre. |
| Error en permisos | Exposición o acciones indebidas. | Validación backend por acción y audit logs. |
| Evidencia visible a no autorizados | Riesgo de privacidad. | Permisos por rol, evidencia sensible y bitácora de acceso. |
| Falta de HTTPS | Webhook inseguro o inválido. | HTTPS obligatorio en staging/prod. |
| Pérdida de bitácora | Pérdida de trazabilidad. | Persistencia robusta, backups y auditoría. |
| Costos no medidos | MVP inviable financieramente. | api_usage_logs, ai_usage_logs y límites. |
| IA interpreta mal | Compromiso incorrecto o evidencia mal asociada. | Confirmación humana, backend valida, menú guiado. |
| Base de datos insuficiente | Rediseño temprano. | PostgreSQL recomendado para MVP real. |
| Dependencia excesiva de WhatsApp | Riesgo por cambios de canal. | Gamora Core independiente y web/PWA operativa. |

## 18. Fuera de alcance técnico del MVP

- Multi-WABA avanzado.
- App móvil nativa.
- ERP.
- Integraciones externas complejas.
- Analítica avanzada.
- Visión computacional para validar fotos.
- Aprobación automática por IA.
- Escalamiento enterprise.
- FinOps avanzado.
- Infraestructura multi-región.
- Autoescalamiento sofisticado.
- Gestión avanzada de project management.
- Automatización total sin humano.

## 19. Pendientes de validación técnica

- WABA central de Gamora vs WABA por cliente.
- BSP recomendado o uso directo Cloud API.
- Flujo exacto de opt-in y templates.
- Categorías de mensajes y costos.
- Descarga/retención de media.
- Proveedor cloud definitivo.
- Proveedor de storage.
- Modelo OpenAI recomendado.
- Costos estimados de tokens/mensajes.
- Requerimientos legales para evidencias.
- Estrategia de backups.
- Estrategia de monitoreo.
- Política de rate limits por plan/trial.
- Proveedor de autenticación.

## 20. Relación con documentos siguientes

Este documento será base para:

- `07_Modelo_Tecnico/modelo_datos.md`
- `07_Modelo_Tecnico/integracion_whatsapp_business_api.md`
- `07_Modelo_Tecnico/webhook_y_eventos.md`
- Prompts Codex.
- Pruebas funcionales.
- Backlog técnico.

Cada documento posterior deberá tomar esta arquitectura como punto de partida y profundizar solo su área correspondiente.

## 21. Cierre del documento

La arquitectura técnica de Gamora Bot debe permitir construir un MVP real, conectado, medible y seguro, sin perder la premisa de baja fricción del usuario operativo.

El sistema debe operar con WhatsApp como canal, pero no depender conceptualmente de WhatsApp como único producto. Gamora Core debe gobernar estados, permisos, compromisos, evidencias, bitácora y guardrails. La IA debe ayudar a interpretar, no a decidir. La web/PWA debe dar control formal. Y cada integración con APIs de pago debe estar limitada, registrada y protegida desde el primer MVP.
