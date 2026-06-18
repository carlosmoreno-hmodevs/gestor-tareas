# Checklist de desarrollo — Gamora Bot

Guía permanente de ejecución. Marcar `[x]` al completar cada ítem.

---

## Fase 1 — Progreso (2026-06-15)

**Estado:** Fase 1 validada E2E (mensaje → MySQL → tablero).

**Decisiones técnicas Fase 1:**
- Monorepo `frontend/` + `backend/` en el mismo repo
- Backend: **Express** + TypeScript + **Prisma** + MySQL 8
- Auth dev: header `X-Workspace-Slug` (sin JWT aún)
- Parser de texto **determinístico** (`text-intent.parser.ts`), sin LLM
- Idempotencia: `UNIQUE (channel, provider, external_message_id)` en `messages`
- Stubs vacíos: `media/`, `channels/whatsapp/` (parcial)
- `transcription/`, `jobs/` Fase 3; `ai/` Fase 3.1 (opcional con `AI_ENABLED`)

## Fase 1.1 — Confirmación humana (2026-06-18)

**Estado:** validado E2E.

## Fase 2 — Ciclo operativo y evidencias (2026-06-18)

**Estado:** validada E2E (aceptar → evidencia → revisión → cierre → timeline legible).

**Decisiones técnicas Fase 2:**
- Máquina de estados en `commitment-state.machine.ts` con validación en backend (422 si transición inválida)
- Estados: `assigned` → `accepted` → `evidence_submitted` → `in_review` → (`correction_requested` → `corrected` → `in_review`) → `closed`; `cancelled` desde cualquier estado no terminal
- Equivalencia UI Angular: estados Gamora en `observations`; chip Kanban usa mapeo en `commitment-task.mapper.ts`
- Evidencias: tabla `evidence_files`, archivos en `backend/uploads/{workspaceId}/{commitmentId}/`
- Upload multipart campo `file`; al subir en estado `accepted` → auto `evidence_submitted`
- `commitment_events`: `status_changed` con `from_status`, `to_status`, `payload_json.comment`, actor
- Evento `evidence_uploaded` al subir archivo
- Descarga de evidencia vía `GET .../evidence/:id/file` con header `X-Workspace-Slug`
- Actores dev: Panchito (aceptar/corregir), Luisito (revisión/cierre) — `GAMORA_DEV_CONTACTS`

## Fase 3 — Audio simulado y transcripción simulada (2026-06-18)

**Estado:** validada E2E en simulador Angular (audio → transcripción → confirmación → compromiso).

**Fuera de alcance en esta fase:** WhatsApp Cloud API real, descarga de audios desde Meta, proveedor STT real, LLM/IA real, templates Meta.

**Decisiones técnicas Fase 3:**
- `message_type=audio` en inbound simulador con `simulated_transcript` y `simulate_transcription_failure`
- Tabla `transcriptions` 1:1 con mensaje; proveedor `simulator`
- `ProcessInboundAudioJob` síncrono vía `JobQueue` in-process (preparado para cola async)
- Tras transcribir: `messages.text_body` = transcript, `status=ready`, evento `transcription_completed`
- Conversation Engine reutiliza `processInboundContent()` — mismo path que texto
- Fallo STT: `transcription_failed`, sin propuesta ni compromiso
- Endpoints debug: `GET /api/messages/:id`, `GET /api/messages/:id/transcription`
- UI Angular: toggle Texto / Audio simulado, checkbox fallo, hilo con 🎤 + transcripción

## Fase 3.1 — IA opcional e interpretación estructurada (2026-06-18)

**Estado:** implementado; `AI_ENABLED=false` por defecto (parser determinístico).

**Fuera de alcance:** WhatsApp real, STT real, templates Meta.

**Decisiones técnicas Fase 3.1:**
- Feature flag `AI_ENABLED` + `OPENAI_API_KEY`, `AI_MODEL`, `AI_MIN_CONFIDENCE` en `.env`
- `AiService.resolveCommitmentIntent()` — OpenAI JSON si IA activa; fallback a `text-intent.parser.ts`
- Tabla `ai_extractions` con `transcription_id` opcional, `status` proposed/confirmed/rejected/fallback
- IA solo propone; compromiso solo tras confirmación humana en `session_context_json`
- Resumen de confirmación estructurado (Actividad, Responsable, Ubicación, Fecha, Evidencia)
- Parser determinístico mejorado: ubicación sin “y mande foto”; evidencia separada; responsables Marco/Panchito/Luisito; mensaje si responsable no registrado

## Fase 3.2 — UX flujo operativo en detalle (2026-06-18)

**Estado:** validada visualmente.

**Mejoras:**
- `GamoraOperationalFlowComponent` — guía visual de etapas + siguiente paso
- Panel evidencia respeta estado (sin dropzone en estados inválidos)
- Refresh inmediato de evidencia/timeline tras upload (merge en `loadGamoraCommitments`)
- `gamora-api-error.mapper.ts` — errores 422 amigables
- Acciones con descripción guía; validación frontend antes de API
- Etiquetas de estado consistentes (Asignada, En progreso, Cerrada, etc.)

## Fase 4 — Staging + preparación WhatsApp adapter (2026-06)

**Estado:** implementado (mock). **WhatsApp real NO conectado.**

**Objetivo:** correr fuera de local en staging HTTPS; bases para WhatsApp Cloud API después.

**Backend:**
- [x] Config ambiente: `env.config.ts`, `.env.example`, `.env.staging.example`
- [x] Variables: `DATABASE_URL`, `PORT`, `CORS_ORIGIN`, `STORAGE_*`, `AI_*`, `WHATSAPP_*`
- [x] `AI_PROVIDER` openai / mock (+ factory para groq/ollama futuro)
- [x] `StorageProvider` local + interfaz s3/r2/azure documentada
- [x] `whatsapp.adapter.ts`, `whatsapp.webhook.controller.ts`, `whatsapp.sender.ts`
- [x] `GET /api/webhooks/whatsapp` — verify token + challenge
- [x] `POST /api/webhooks/whatsapp` — payload Meta mock → Conversation Engine → sender mock
- [x] Audio WA: `pending_transcription` + job encolado; sin descarga media
- [x] Seed: `channel_contact` whatsapp `5215512345678` → Luisito
- [x] Fixtures: `backend/fixtures/whatsapp-webhook-*-mock.json`

**Frontend:**
- [x] `environment.ts`, `environment.staging.ts`, `environment.prod.ts`
- [x] `angular.json` — configuraciones `staging` y `production` con `fileReplacements`

**Documentación:**
- [x] `Gamora_Bot/12_DevOps_y_Ambientes/staging_y_webhook_whatsapp_mock.md`
- [x] `backend/README.md` — sección webhook mock

**Pendiente (fases posteriores — explícitamente fuera de Fase 4):**
- [ ] Número real WhatsApp + tokens Meta en staging/prod
- [ ] Templates Meta aprobados
- [ ] STT real para audio WhatsApp
- [ ] Storage cloud (S3/R2/Azure)

**Checks manuales:**
- [x] GET webhook token correcto → challenge
- [x] GET webhook token incorrecto → 403
- [x] POST mock texto → propuesta + log `[WhatsappSender:mock]`
- [x] Simulador Angular sin regresiones (`POST /api/conversations/inbound`)

## Fase 5 — Despliegue staging HTTPS (2026-06)

**Estado:** documentado. **WhatsApp real NO conectado.**

**Objetivo:** guía clara para desplegar backend + frontend + MySQL staging con HTTPS y validar antes de Meta.

**Backend:**
- [x] `GET /api/health` → `{ status, env, timestamp }`
- [x] `PORT` configurable vía `envConfig.port`
- [x] Errores 500 genéricos en staging/prod (sin stack al usuario)
- [x] `.env.staging.example` ampliado; `.env.staging` en `.gitignore`
- [x] Documentación despliegue: VPS/PM2, Railway/Render, nginx

**Frontend:**
- [x] `ng build --configuration=staging` → `environment.staging.ts`
- [x] Script `npm run build:staging`
- [x] Documentación `gamoraApiUrl` y deploy estático

**Base de datos:**
- [x] MySQL staging separado documentado (no Docker local)
- [x] Comandos `db:push` + `db:seed` en servidor

**Validación:**
- [x] [`checklist_validacion_staging.md`](12_DevOps_y_Ambientes/checklist_validacion_staging.md)
- [x] Webhook público GET/POST mock documentado con URLs HTTPS
- [x] Seguridad: secretos, CORS, flags desactivados

**Documentación:**
- [x] [`despliegue_staging_https.md`](12_DevOps_y_Ambientes/despliegue_staging_https.md)
- [x] `backend/README.md` actualizado

**Pendiente (acción manual del operador):**
- [ ] Ejecutar despliegue real en host staging
- [ ] Completar checklist de validación en ambiente público

---

## Preparación del proyecto

- [x] **Definir monorepo** — `frontend/` + `backend/` en el mismo repositorio  
  **Resultado:** estructura de carpetas creada  
  **Dependencia:** ninguna  
  **Notas:** mantener Angular existente sin reescribir

- [x] **Configurar Node.js backend** — Express o NestJS, TypeScript, scripts dev/build  
  **Resultado:** servidor arranca en local  
  **Dependencia:** monorepo  
  **Notas:** Express elegido; `.env.example` en `backend/`

- [ ] **Configurar MySQL local** — docker-compose o instancia local  
  **Resultado:** conexión verificada desde backend  
  **Dependencia:** backend base  
  **Notas:** `docker-compose.yml` listo; pendiente arrancar Docker/MySQL en entorno dev

- [x] **Elegir ORM o migraciones** — Prisma, TypeORM o SQL migrations  
  **Resultado:** pipeline de migraciones funcional  
  **Dependencia:** MySQL  
  **Notas:** Prisma `db:push` + `seed.ts`; versionar schema en repo

- [x] **Definir ambientes** — `local`, `staging`, `production` en config  
  **Resultado:** config por ambiente documentada  
  **Dependencia:** backend base  
  **Notas:** Fase 4 — `environment.staging.ts` / `environment.prod.ts` + `.env.staging.example`

---

## Modelo de dominio

- [ ] **Documentar entidad Compromiso** — campos mínimos y actores  
  **Resultado:** acuerdo de dominio escrito  
  **Dependencia:** ninguna  
  **Notas:** responsable, fecha, evidencia esperada, estados

- [ ] **Documentar máquina de estados** — transiciones permitidas  
  **Resultado:** tabla estado → acciones válidas  
  **Dependencia:** entidad Compromiso  
  **Notas:** validación solo en Gamora Core

- [x] **Definir DTO `InboundMessageDTO`** — formato común entre canales  
  **Resultado:** interface TypeScript compartida  
  **Dependencia:** ninguna  
  **Notas:** `backend/src/modules/channels/inbound-message.dto.ts`

- [x] **Definir regla de idempotencia** — comportamiento ante duplicados  
  **Resultado:** spec: ignorar vs actualizar; job idempotency_key  
  **Dependencia:** DTO inbound  
  **Notas:** duplicado retorna 200 con mismo outbound; `IdempotencyService` implementado

- [x] **Documentar regla de confirmación humana** — texto y audio  
  **Resultado:** spec: transcripción/IA nunca crean compromiso sin confirmación  
  **Dependencia:** ninguna  
  **Notas:** implementado en simulador texto Fase 1.1 y audio Fase 3 (mismo engine post-transcripción)

---

## Base de datos MySQL

- [x] **Migración: workspaces**  
  **Resultado:** tabla creada con seed demo Ferretería Luisito  
  **Dependencia:** ORM/migraciones

- [x] **Migración: users + roles**  
  **Resultado:** usuarios demo (Luisito admin, Panchito assignee)  
  **Dependencia:** workspaces

- [x] **Migración: contacts + channel_contacts**  
  **Resultado:** contactos vinculados a canal simulador  
  **Dependencia:** users  
  **Notas:** UNIQUE en `(channel, provider, external_id)`

- [x] **Migración: commitments + commitment_assignees**  
  **Resultado:** tablas con FKs e índices  
  **Dependencia:** contacts

- [x] **Migración: commitment_events**  
  **Resultado:** bitácora persistida  
  **Dependencia:** commitments

- [x] **Migración: conversation_threads**  
  **Resultado:** hilos por canal y contacto  
  **Dependencia:** channel_contacts

- [x] **Migración: messages** (con soporte audio)  
  **Resultado:** tabla con `message_type`, `status`, `media_id`, `media_file_id`, `text_body`  
  **Dependencia:** conversation_threads  
  **Notas:** UNIQUE `(channel, provider, external_message_id)`; `media_file_id` reservado para fase media

- [x] **Migración: message_events + message_delivery_status**  
  **Resultado:** trazabilidad de procesamiento y entrega  
  **Dependencia:** messages  
  **Notas:** `message_events` implementado; delivery status en fase WhatsApp real

- [ ] **Migración: media_files**  
  **Resultado:** metadata de audio/imagen/documento sin BLOB  
  **Dependencia:** messages, workspaces  
  **Notas:** `source`, `media_type`, `storage_path`, `duration_seconds`, `retain_until`

- [x] **Migración: transcriptions**  
  **Resultado:** 1:1 con mensaje audio; status, errores; proveedor `simulator` en Fase 3  
  **Dependencia:** messages  
  **Notas:** sin `cost_estimate` aún; STT real en fase posterior

- [x] **Migración: evidence_files** (o unificar con media_files)  
  **Resultado:** evidencias de cumplimiento con metadatos en BD  
  **Dependencia:** commitments, messages  
  **Notas:** `evidence_files` implementado Fase 2 (web); `media_files` para audio/WhatsApp en fase posterior

- [ ] **Migración: jobs** (opcional)  
  **Resultado:** persistencia de jobs async con idempotency_key  
  **Dependencia:** ninguna  
  **Notas:** alternativa: solo BullMQ+Redis

- [ ] **Migración: message_templates** (estructura)  
  **Resultado:** tabla lista para staging Meta  
  **Dependencia:** workspaces

- [x] **Migración: ai_extractions** (con transcription_id)  
  **Resultado:** `input_text`, `transcription_id`, `requires_confirmation`, `extracted_json`  
  **Dependencia:** messages, transcriptions  
  **Notas:** Fase 3.1; status proposed/confirmed/rejected/fallback

---

## Backend — Gamora Core

- [x] **Módulo workspaces** — contexto multi-tenant  
  **Resultado:** middleware resuelve workspace en requests  
  **Dependencia:** migraciones base  
  **Notas:** `resolveWorkspaceSlug` + header `X-Workspace-Slug`

- [ ] **Módulo auth** — login JWT, guard de rutas  
  **Resultado:** endpoints login/me operativos  
  **Dependencia:** users

- [x] **CommitmentsService — crear**  
  **Resultado:** `POST /api/commitments` funcional  
  **Dependencia:** migraciones commitments  
  **Notas:** registra `commitment_event` tipo `created`

- [x] **CommitmentsService — listar y detalle**  
  **Resultado:** `GET /api/commitments`, `GET /api/commitments/:id`  
  **Dependencia:** crear

- [x] **CommitmentsService — actualizar**  
  **Resultado:** `PATCH /api/commitments/:id`  
  **Dependencia:** crear

- [x] **CommitmentStateMachine — transiciones**  
  **Resultado:** `PATCH /api/commitments/:id/status` valida reglas  
  **Dependencia:** crear  
  **Notas:** ciclo Fase 2 completo; cancelación global; comentario en `payload_json`

- [x] **CommitmentEventsService — bitácora**  
  **Resultado:** `GET /api/commitments/:id/events`  
  **Dependencia:** state machine

- [x] **Vincular origin_message_id** — al crear desde conversación  
  **Resultado:** compromiso sabe qué mensaje lo originó  
  **Dependencia:** messages + commitments

---

## Estados de compromisos

- [x] **Implementar estados mínimos** — draft → assigned → accepted → closed  
  **Resultado:** flujo básico operable  
  **Dependencia:** state machine  
  **Notas:** ciclo completo Fase 2 con evidencias y revisión

- [x] **Estado awaiting_confirmation** — flujo conversacional  
  **Resultado:** compromiso no se activa sin confirmación  
  **Dependencia:** conversation engine  
  **Notas:** `session_state = awaiting_confirmation` en thread; no es estado del compromiso en BD

- [x] **Estados de evidencia** — evidence_submitted, in_review, correction_requested  
  **Resultado:** ciclo evidencia completo  
  **Dependencia:** módulo evidence  
  **Notas:** `corrected` + reenvío a `in_review` implementado

- [x] **Estado closed con actor** — quién cerró y cuándo  
  **Resultado:** `closed_at` + evento en bitácora  
  **Dependencia:** state machine

---

## Evidencias

- [x] **Storage interface** — abstracción local / cloud  
  **Resultado:** `StorageProvider` intercambiable por env  
  **Dependencia:** ninguna  
  **Notas:** `local-storage.ts` Fase 2; cloud en staging/prod

- [x] **Upload local** — carpeta `uploads/` con nombres seguros  
  **Resultado:** archivo guardado fuera de MySQL  
  **Dependencia:** storage interface

- [x] **POST /api/commitments/:id/evidence** — multipart upload  
  **Resultado:** registro en `evidence_files`  
  **Dependencia:** upload local, commitments

- [ ] **Vincular evidencia a message_id** — cuando viene por canal  
  **Resultado:** trazabilidad mensaje → archivo  
  **Dependencia:** messages, evidence  
  **Notas:** solo web en Fase 2

- [ ] **Review status** — pending, approved, rejected, correction_requested  
  **Resultado:** flujo de revisión desde web  
  **Dependencia:** evidence endpoint  
  **Notas:** revisión vía transiciones de compromiso, no por archivo

- [x] **Servir archivos en dev** — ruta estática o endpoint firmado  
  **Resultado:** Angular puede mostrar preview  
  **Dependencia:** upload local  
  **Notas:** `GET .../evidence/:id/file`

---

## Conversaciones y mensajes

- [x] **MessagesRepository — persistir inbound/outbound**  
  **Resultado:** cada mensaje queda en BD  
  **Dependencia:** migración messages

- [x] **MessageEvents — log de procesamiento**  
  **Resultado:** eventos received, parsed, failed  
  **Dependencia:** messages

- [x] **ConversationThreads — crear/recuperar hilo activo**  
  **Resultado:** un hilo por contacto+canal  
  **Dependencia:** channel_contacts

- [x] **Session state en thread** — `session_context_json`  
  **Resultado:** engine recuerda flujo multi-paso  
  **Dependencia:** threads  
  **Notas:** `PendingCommitmentProposal` v1 en JSON; estados `idle`, `awaiting_confirmation`, `commitment_created`

- [x] **GET /api/conversations** — listar hilos  
  **Resultado:** historial consultable  
  **Dependencia:** threads, messages

- [x] **GET /api/conversations/:id** — hilo con mensajes  
  **Resultado:** detalle conversacional  
  **Dependencia:** listar

---

## Simulador WhatsApp

- [x] **SimulatorAdapter — normaliza payload a InboundMessageDTO**  
  **Resultado:** adapter sin lógica de negocio; soporta text y audio  
  **Dependencia:** DTO definido  
  **Notas:** audio simulado procesado Fase 3; WhatsApp real pendiente

- [x] **POST /api/conversations/inbound — texto**  
  **Resultado:** mensaje `message_type=text` persistido y procesado  
  **Dependencia:** adapter, idempotency

- [x] **POST /api/conversations/inbound — audio simulado**  
  **Resultado:** acepta `simulated_transcript`, `simulate_transcription_failure`  
  **Dependencia:** adapter, transcriptions, ProcessInboundAudioJob  
  **Notas:** transcripción síncrona in-process; sin descarga de media

- [x] **IdempotencyService — UNIQUE external_message_id**  
  **Resultado:** duplicado retorna 200 sin re-procesar  
  **Dependencia:** messages  
  **Notas:** obligatorio antes de WhatsApp real

- [x] **ConversationEngine — flujo crear compromiso (sin IA)**  
  **Resultado:** texto o transcript → borrador o propuesta  
  **Dependencia:** core, threads  
  **Notas:** propuesta + confirmación humana; creación en BD solo tras confirmar

- [x] **ConversationEngine — confirmación humana**  
  **Resultado:** resumen + esperar confirmación en hilo  
  **Dependencia:** flujo crear  
  **Notas:** `confirmation-summary.builder.ts` + `confirmation-intent.parser.ts`

- [ ] **POST /api/conversations/:id/reply** — respuesta saliente simulada  
  **Resultado:** mensaje outbound persistido  
  **Dependencia:** engine

- [x] **Flujo E2E simulador texto** — mensaje → compromiso → tablero  
  **Resultado:** prueba manual documentada  
  **Dependencia:** engine + Angular  
  **Notas:** flujo en dos pasos con confirmación; ver `backend/README.md`

- [x] **Flujo E2E simulador audio** — audio → transcript → confirmación → compromiso → tablero  
  **Resultado:** prueba manual documentada  
  **Dependencia:** jobs + transcription simulator  
  **Notas:** validado en simulador Angular

- [x] **UI simulador Angular** — toggle texto/audio, campo transcripción, simular fallo  
  **Resultado:** probar sin Postman; ver mensaje y transcripción en hilo  
  **Dependencia:** inbound/reply + GET messages  
  **Notas:** toggle Texto/Audio, transcripción simulada, checkbox fallo STT, hilo 🎤

---

## Integración Angular

- [ ] **ApiClientService — base HTTP + interceptors**  
  **Resultado:** auth token y errores centralizados  
  **Dependencia:** auth backend  
  **Notas:** `CommitmentApiService` directo con header workspace en Fase 1

- [x] **CommitmentApiService** — CRUD contra API  
  **Resultado:** reemplaza lectura principal de localStorage  
  **Dependencia:** endpoints commitments

- [x] **Tablero conectado a API**  
  **Resultado:** KPIs y lista desde backend  
  **Dependencia:** CommitmentApiService  
  **Notas:** tenant `tenant-1` / Ferretería Luisito

- [x] **Detalle de compromiso desde API**  
  **Resultado:** historial y estados reales  
  **Dependencia:** GET by id, events

- [ ] **Formulario creación/edición vía API**  
  **Resultado:** web como canal de control  
  **Dependencia:** POST/PATCH commitments

- [x] **Panel evidencias con upload API**  
  **Resultado:** subir y ver evidencias  
  **Dependencia:** evidence endpoint

- [x] **Acciones de workflow vía PATCH status**  
  **Resultado:** aprobar, corregir, cerrar desde web  
  **Dependencia:** state machine  
  **Notas:** `GamoraCommitmentActionsComponent` + guía operativa Fase 3.2

- [x] **UX flujo operativo en detalle** — guía visual, bloqueo evidencia, errores amigables  
  **Resultado:** usuario entiende estado, siguiente paso y acciones bloqueadas  
  **Dependencia:** Fase 2 workflow  
  **Notas:** `GamoraOperationalFlowComponent`; refresh evidencia sin recargar página; `gamora-api-error.mapper.ts`

- [x] **Refresh evidencia tras upload** — lista y timeline actualizados al instante  
  **Resultado:** merge de detalle en `loadGamoraCommitments` sin perder adjuntos  
  **Dependencia:** panel evidencia + TaskService

- [x] **Bloqueo subida evidencia por estado** — mensajes contextuales en panel  
  **Resultado:** sin 422 visible al usuario en flujo normal  
  **Dependencia:** `GamoraCommitmentWorkflowService.getEvidenceUploadPolicy`

- [x] **Deprecar localStorage para flujo principal** — mantener solo offline opcional  
  **Resultado:** API como fuente de verdad  
  **Dependencia:** integración completa  
  **Notas:** solo para tenant Gamora (`tenant-1`); otros tenants siguen en localStorage

- [ ] **Feature conversaciones (opcional)** — historial de hilos  
  **Resultado:** visibilidad de mensajes en web  
  **Dependencia:** conversation endpoints

---

## Jobs y cola async

- [x] **Abstracción de cola** — BullMQ+Redis o worker in-process (dev)  
  **Resultado:** `JobQueue` in-process Fase 3; sustituible por BullMQ  
  **Dependencia:** backend base  
  **Notas:** webhook WhatsApp debe responder < 5s (fase posterior)

- [x] **ProcessInboundAudioJob**  
  **Resultado:** transcribe (simulador) → actualiza mensaje → Conversation Engine  
  **Dependencia:** transcription module  
  **Notas:** síncrono Fase 3; idempotency vía `external_message_id` en mensaje inbound

- [ ] **Reintentos con backoff** — transcripción y descarga fallida  
  **Resultado:** attempt_count; no duplicar compromisos  
  **Dependencia:** job runner

- [ ] **Job runner en dev** — mismo proceso o script `npm run worker`  
  **Resultado:** pipeline audio funciona en local  
  **Dependencia:** cola configurada  
  **Notas:** Fase 3 usa job síncrono en request; worker separado en fase WhatsApp real

---

## Audios y transcripción WhatsApp

- [x] **Detectar mensaje tipo audio** — simulador (webhook pendiente)  
  **Resultado:** `message_type=audio`, `status=pending_transcription`  
  **Dependencia:** messages schema, adapters  
  **Notas:** Meta envía `media_id`, no transcripción — webhook en fase posterior

- [ ] **Webhook responde 200 OK rápido** — sin STT en request  
  **Resultado:** solo persistir + encolar job  
  **Dependencia:** whatsapp webhook controller  
  **Notas:** validar firma antes de encolar

- [ ] **Guardar mensaje con media_id** — antes del job  
  **Resultado:** registro en `messages` + `message_event: received`  
  **Dependencia:** messages

- [ ] **MediaService — descarga desde Meta** — Graph API con media_id  
  **Resultado:** archivo en storage + registro `media_files`  
  **Dependencia:** credenciales Meta, staging  
  **Notas:** en simulador, archivo opcional o mock

- [ ] **MediaValidator — MIME y tamaño**  
  **Resultado:** rechazar audio inválido; mensaje amigable al usuario  
  **Dependencia:** workspace limits (`audio_max_size_bytes`)

- [ ] **Validar duración máxima** — configurable por workspace  
  **Resultado:** rechazo antes o después de descarga según metadata  
  **Dependencia:** settings_json workspace

- [x] **Encolar job de transcripción** — tras guardar mensaje audio simulado  
  **Resultado:** `message_event: audio_queued`  
  **Dependencia:** jobs module  
  **Notas:** ejecución in-process Fase 3

- [x] **TranscriptionService — proveedor STT**  
  **Resultado:** `simulator.provider.ts` en dev; Whisper u otro en producción  
  **Dependencia:** transcript simulado en payload  
  **Notas:** sin `cost_estimate` en Fase 3

- [x] **Guardar transcriptions** — pending → completed/failed  
  **Resultado:** `transcript_text` en BD; actualizar `messages.text_body`  
  **Dependencia:** migración transcriptions

- [x] **Procesar transcript en Conversation Engine** — mismo path que texto  
  **Resultado:** `message.status=ready` → `processInboundContent()`  
  **Dependencia:** engine, transcripción completada

- [x] **Enviar resumen de confirmación** — canal saliente  
  **Resultado:** outbound message con propuesta de compromiso  
  **Dependencia:** engine, sender simulador/WhatsApp  
  **Notas:** simulador texto Fase 1.1

- [x] **Crear/actualizar compromiso solo tras confirmación**  
  **Resultado:** Gamora Core ejecuta con `ai_extractions.status=confirmed` o equivalente  
  **Dependencia:** state machine, engine  
  **Notas:** propuesta en `session_context_json`; `ai_extractions` Fase 3.1

- [x] **Registrar errores de transcripción** — `transcription_failed` + error_message  
  **Resultado:** usuario notificado; mensaje no procesado como compromiso  
  **Dependencia:** transcriptions, message_events

- [ ] **Normalizar texto transcrito** — trim, espacios, encoding  
  **Resultado:** input consistente para engine e IA  
  **Dependencia:** transcription service  
  **Notas:** trim básico en simulator; normalización avanzada con STT real

- [ ] **POST /api/messages/:id/reprocess** — reintento manual/admin  
  **Resultado:** re-encola job sin duplicar compromiso  
  **Dependencia:** jobs, idempotency

- [ ] **POST /api/media/:id/transcribe** — reprocesar STT  
  **Resultado:** nueva transcripción o retry  
  **Dependencia:** transcription service

- [x] **GET /api/messages/:id y /transcription**  
  **Resultado:** API para web y debugging  
  **Dependencia:** messages, transcriptions

- [ ] **Reflejar audio/transcripción en Web/PWA**  
  **Resultado:** detalle mensaje muestra tipo, estado, transcript  
  **Dependencia:** Angular message-api, conversaciones UI

- [ ] **Feature flag audio_enabled por workspace**  
  **Resultado:** rechazar audios si desactivado  
  **Dependencia:** workspaces.settings_json

- [ ] **Límites configurables** — duración, tamaño, retención original  
  **Resultado:** `settings_json` aplicado en validator  
  **Dependencia:** workspaces

- [ ] **Política retención audio original** — `retain_until` + borrado  
  **Resultado:** opción conservar solo transcripción + metadata  
  **Dependencia:** media_files, cron o job cleanup

- [ ] **Documentar costos y privacidad audio** — aviso al usuario  
  **Resultado:** texto en enrolamiento / primer audio  
  **Dependencia:** opt-in flow

- [ ] **Auditoría pipeline audio** — eventos en cada etapa  
  **Resultado:** message_events completos; quién envió el audio  
  **Dependencia:** audit, message_events

---

## IA (módulo opcional — Fase 3.1)

- [x] **Feature flag AI_ENABLED**  
  **Resultado:** IA desactivada por defecto (`AI_ENABLED=false`)  
  **Dependencia:** config  
  **Notas:** `backend/src/config/ai.config.ts` + `.env.example`

- [x] **AiService — llamada LLM API**  
  **Resultado:** extracción JSON desde `input_text` vía OpenAI  
  **Dependencia:** AI_ENABLED, API key  
  **Notas:** mismo servicio para texto escrito y transcrito; fallback si falla o baja confianza

- [x] **Guardar ai_extractions** — con transcription_id si aplica  
  **Resultado:** `requires_confirmation=true` por defecto  
  **Dependencia:** migración ai_extractions

- [x] **Integrar IA post-transcripción** — audio → STT → IA → confirmación  
  **Resultado:** flujo unificado con texto  
  **Dependencia:** transcription + engine  
  **Notas:** `transcription_id` en extracción cuando el mensaje es audio

- [x] **Integrar IA en ConversationEngine — solo propuesta**  
  **Resultado:** NL → resumen estructurado → confirmación  
  **Dependencia:** AiService  
  **Notas:** nunca crea compromiso sin confirmar

- [x] **Fallback parser determinístico** — IA off o baja confianza  
  **Resultado:** flujo determinístico operativo; ubicación/evidencia limpias; Marco en seed  
  **Dependencia:** `text-intent.parser.ts` mejorado  
  **Notas:** casos A/B/C en `backend/README.md`; responsable desconocido sin “el responsable indicado”

---

## Staging

- [ ] **Deploy backend staging HTTPS**  
  **Resultado:** URL pública estable  
  **Dependencia:** hosting

- [ ] **Deploy frontend staging**  
  **Resultado:** Angular apunta a API staging  
  **Dependencia:** backend staging

- [ ] **MySQL staging** — instancia separada de local  
  **Resultado:** datos aislados  
  **Dependencia:** hosting DB

- [ ] **Storage staging** — R2/S3 o equivalente  
  **Resultado:** evidencias fuera del servidor app  
  **Dependencia:** credenciales cloud

- [ ] **Validar simulador en staging** — mismo flujo que local  
  **Resultado:** E2E en ambiente remoto  
  **Dependencia:** deploy completo

---

## WhatsApp Cloud API

- [ ] **Cuenta Meta Business + app Developers**  
  **Resultado:** credenciales en secret manager  
  **Dependencia:** cuenta negocio  
  **Notas:** en paralelo, no bloquea simulador

- [ ] **Número dedicado de prueba** — no número personal activo  
  **Resultado:** número verificado en WABA  
  **Dependencia:** Meta account

- [ ] **WhatsappAdapter — normaliza webhook a InboundMessageDTO**  
  **Resultado:** mismo DTO que simulador  
  **Dependencia:** DTO, idempotency

- [ ] **GET /api/webhooks/whatsapp — verificación**  
  **Resultado:** hub.challenge responde correctamente  
  **Dependencia:** staging HTTPS

- [ ] **POST /api/webhooks/whatsapp — eventos text**  
  **Resultado:** persistir → engine (sync o encolar según diseño)  
  **Dependencia:** adapter

- [ ] **POST /api/webhooks/whatsapp — eventos audio**  
  **Resultado:** persistir → encolar job → 200 OK inmediato  
  **Dependencia:** adapter, jobs, media  
  **Notas:** no STT dentro del webhook

- [ ] **MetaMediaDownloader — descarga por media_id**  
  **Resultado:** audio en storage desde Graph API  
  **Dependencia:** token Meta, media module

- [ ] **WhatsappSender — mensajes salientes**  
  **Resultado:** respuestas por Cloud API  
  **Dependencia:** token Meta

- [ ] **message_delivery_status desde webhooks de estado**  
  **Resultado:** sent/delivered/read/failed registrados  
  **Dependencia:** webhook POST

- [ ] **Templates mínimos en Meta** — asignación, recordatorio  
  **Resultado:** templates aprobados en `message_templates`  
  **Dependencia:** cuenta Meta

- [ ] **Opt-in / BAJA-STOP** — actualizar channel_contacts  
  **Resultado:** no enviar a contactos revoked  
  **Dependencia:** channel_contacts

- [ ] **E2E staging con número Meta prueba**  
  **Resultado:** mismo flujo que simulador por WA real  
  **Dependencia:** todos los ítems WA

---

## Seguridad

- [ ] **JWT con expiración + refresh**  
  **Resultado:** sesiones web seguras  
  **Dependencia:** auth

- [ ] **Aislamiento por workspace** — todas las queries filtradas  
  **Resultado:** no hay fuga entre tenants  
  **Dependencia:** middleware workspace

- [ ] **Validación webhook Meta** — firma/token  
  **Resultado:** rechazar payloads no autenticados  
  **Dependencia:** webhook

- [ ] **Secrets fuera del repo** — .env en gitignore  
  **Resultado:** sin tokens en código  
  **Dependencia:** ninguna

- [ ] **Límites upload** — tamaño y tipos MIME permitidos  
  **Resultado:** rechazo de archivos peligrosos  
  **Dependencia:** evidence, media validator

- [ ] **Acceso restringido a audio/transcripción** — por workspace y rol  
  **Resultado:** endpoints media con autorización  
  **Dependencia:** auth, workspace middleware

- [ ] **HTTPS obligatorio** — staging y producción  
  **Resultado:** webhook y cookies seguros  
  **Dependencia:** deploy

---

## Auditoría

- [ ] **commitment_events para toda acción crítica**  
  **Resultado:** quién, qué, cuándo  
  **Dependencia:** core

- [ ] **message_events para procesamiento**  
  **Resultado:** trazabilidad técnica  
  **Dependencia:** messages

- [ ] **Registrar actor en transiciones** — contact_id o user_id  
  **Resultado:** no hay cambios anónimos  
  **Dependencia:** state machine

- [ ] **Log de duplicados ignorados** — evento duplicate_skipped  
  **Resultado:** diagnóstico de idempotencia  
  **Dependencia:** idempotency service

---

## Pruebas

- [x] **Seed reproducible** — Ferretería Luisito, Luisito, Panchito, Marco  
  **Resultado:** datos demo consistentes  
  **Dependencia:** migraciones  
  **Notas:** Marco asignable (`00000000-...-0003`); ejecutar `npm run db:seed`

- [ ] **Prueba: inbound duplicado no duplica compromiso**  
  **Resultado:** assert en idempotencia  
  **Dependencia:** simulador

- [ ] **Prueba: transición de estado inválida rechazada**  
  **Resultado:** 422 en API  
  **Dependencia:** state machine

- [x] **Prueba parser Caso A** — Panchito / sucursal Centro / mañana / foto  
  **Resultado:** resumen estructurado limpio  
  **Dependencia:** `text-intent.parser.ts`  
  **Notas:** ver `backend/README.md`

- [x] **Prueba parser Caso B** — Marco / tienda sur / sacar basura  
  **Resultado:** responsable Marco; ubicación sin evidencia mezclada  
  **Dependencia:** seed Marco + parser

- [x] **Prueba parser Caso C** — Pídele a Marco / almacén norte / evidencia  
  **Resultado:** actividad sin ubicación duplicada  
  **Dependencia:** parser

- [ ] **Prueba responsable desconocido** — nombre no en contacts  
  **Resultado:** mensaje claro sin propuesta de compromiso  
  **Dependencia:** parser + engine

- [ ] **Prueba: mensaje → compromiso → visible en GET**  
  **Resultado:** E2E API  
  **Dependencia:** simulador + core

- [ ] **Prueba: upload evidencia + vinculo a compromiso**  
  **Resultado:** archivo accesible, registro en BD  
  **Dependencia:** evidence

- [ ] **Prueba manual Angular** — tablero refleja cambios del simulador  
  **Resultado:** checklist de pantallas  
  **Dependencia:** integración Angular

- [ ] **Prueba webhook Meta en staging** — texto real entrante  
  **Resultado:** flujo idéntico al simulador  
  **Dependencia:** WhatsApp staging

- [x] **Prueba audio simulado E2E** — transcript → confirmación → compromiso  
  **Resultado:** sin duplicados en reintento  
  **Dependencia:** simulador + jobs  
  **Notas:** validado en simulador Angular (Fase 3)

- [x] **Prueba transcripción fallida** — `simulate_transcription_failure`  
  **Resultado:** no se crea compromiso; error registrado  
  **Dependencia:** simulador  
  **Notas:** validado vía API curl

- [ ] **Prueba audio excede límite** — duración/tamaño  
  **Resultado:** rechazo con mensaje al usuario  
  **Dependencia:** workspace limits

- [ ] **Prueba webhook Meta audio staging** — audio real → STT → confirmación  
  **Resultado:** paridad con simulador  
  **Dependencia:** WhatsApp + transcription prod-like

- [x] **Prueba idempotencia audio** — mismo external_message_id dos veces  
  **Resultado:** un solo compromiso posible tras confirmación única  
  **Dependencia:** idempotency + jobs  
  **Notas:** `duplicate: true` en segundo POST; validado vía API

---

## Pendientes para producción

- [ ] **Número WhatsApp producción**  
  **Resultado:** WABA productiva configurada  
  **Dependencia:** piloto staging exitoso

- [ ] **Storage producción** — R2/S3/Azure con backups  
  **Resultado:** evidencias persistentes y seguras  
  **Dependencia:** storage staging

- [ ] **Guardrails de costo** — límites mensajes, STT e IA por workspace  
  **Resultado:** alertas y bloqueo; sumar `transcriptions.cost_estimate`  
  **Dependencia:** métricas de uso

- [ ] **Backups MySQL automatizados**  
  **Resultado:** política de restore documentada  
  **Dependencia:** DB producción

- [ ] **Monitoreo y alertas** — errores webhook, fallos envío  
  **Resultado:** on-call o revisión periódica  
  **Dependencia:** deploy prod

- [ ] **Política retención evidencias y mensajes**  
  **Resultado:** documento legal/operativo  
  **Dependencia:** compliance

- [ ] **Aviso de privacidad y opt-in producción**  
  **Resultado:** flujo consentimiento activo  
  **Dependencia:** opt-in implementado

- [ ] **Runbook operativo** — qué hacer si Meta cae, token expira  
  **Resultado:** doc para equipo  
  **Dependencia:** WA en prod
