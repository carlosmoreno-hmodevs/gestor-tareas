# Arquitectura e implementación — Gamora Bot

**Versión:** 2.0  
**Stack:** Angular · Node.js · MySQL

---

## 1. Arquitectura recomendada

### Vista por capas

```
┌──────────────────────────────────────────────────────────────────┐
│  CANALES                                                          │
│  Web/PWA (Angular)  │  Simulador WhatsApp  │  WhatsApp Cloud API │
└──────────┬──────────────────┬─────────────────────┬────────────┘
           ▼                  ▼                     ▼
┌──────────────────────────────────────────────────────────────────┐
│  ADAPTADORES DE CANAL                                             │
│  Web Adapter  │  Simulator Adapter  │  WhatsApp Adapter           │
└──────────────────────────────┬───────────────────────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │  MESSAGE STORE      │  messages, message_events
                    │  + idempotencia     │  external_message_id UNIQUE
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           ▼ (texto)           ▼ (audio)           │
┌──────────────────┐   ┌──────────────────┐        │
│ CONVERSATION     │   │ JOB QUEUE        │        │
│ ENGINE (texto)   │   │ ProcessAudioJob  │        │
└────────┬─────────┘   └────────┬─────────┘        │
         │                      ▼                  │
         │             ┌──────────────────┐          │
         │             │ MEDIA MODULE     │        │
         │             │ descarga Meta    │        │
         │             │ valida MIME/size │        │
         │             └────────┬─────────┘        │
         │                      ▼                  │
         │             ┌──────────────────┐          │
         │             │ TRANSCRIPTION    │        │
         │             │ MODULE (STT)     │        │
         │             └────────┬─────────┘        │
         │                      ▼                  │
         └──────────────► CONVERSATION ENGINE ◄────┘
                          (texto transcrito)
                               │
                               ▼
                    ┌─────────────────────┐
                    │  AI MODULE          │  interpreta, extrae JSON
                    │  (feature flag)     │  no ejecuta acciones
                    └──────────┬──────────┘
                               ▼
                    ┌─────────────────────┐
                    │  GAMORA CORE        │
                    │  Commitment Service │
                    │  Evidence Service   │
                    │  Audit Service      │
                    └──────────┬──────────┘
                               ▼
              MySQL │ Storage (local/R2/S3) │ Audit
```

### Componentes

| Capa | Módulos | Responsabilidad |
|------|---------|-----------------|
| Adaptadores | `channels/web`, `channels/simulator`, `channels/whatsapp` | Normalizar a `InboundMessageDTO`; no lógica de negocio |
| Mensajería | `conversations/`, idempotency | Persistir mensajes y eventos |
| Async | `jobs/` | Procesar audio fuera del webhook |
| Media | `media/` | Descarga Meta, validación, storage, metadata |
| Transcripción | `transcription/` | STT, normalización texto, costos, errores |
| Conversación | `conversations/conversation-engine` | Sesiones, confirmaciones, enrutamiento |
| IA | `ai/` | Propuesta estructurada; mismo input para texto y transcrito |
| Core | `commitments/`, `evidence/`, `audit/` | Estados, permisos, ejecución tras confirmación |

### Regla: webhook no bloquea

`POST /api/webhooks/whatsapp` debe:

1. Validar firma/token si aplica
2. Idempotencia por `external_event_id` / `external_message_id`
3. Persistir mensaje (`message_type = audio` si aplica) + `message_event`
4. Si es audio → encolar `ProcessInboundAudioJob`
5. Responder **200 OK** de inmediato

La descarga, transcripción e IA ocurren en el worker.

### Escalado futuro (no MVP)

Workers de transcripción o IA podrían separarse a otro proceso si crece el volumen. Por ahora todo vive en Node.js modularizado.

---

## 2. Flujo de mensajes de audio

### WhatsApp real

```
1. Usuario envía audio por WhatsApp
2. Meta POST webhook → media_id, external_message_id
3. WhatsApp Adapter → InboundMessageDTO (type: audio)
4. Guardar message (status: pending_transcription) + media_id
5. Responder 200 OK a Meta
6. Job: descargar audio desde Graph API (media_id)
7. Guardar media_files + storage path
8. Validar MIME (audio/*) y tamaño/duración máximos
9. Transcription Service → transcript_text
10. Guardar transcriptions (status: completed | failed)
11. Actualizar message (text_body = transcript, status: ready)
12. Conversation Engine procesa transcript como texto
13. AI Module (si habilitado) → ai_extractions
14. Engine envía resumen de confirmación al usuario
15. Usuario confirma en WhatsApp
16. Gamora Core crea/actualiza compromiso
17. Web/PWA refleja vía API
```

### Simulador (sin Meta)

```
1. POST /api/conversations/inbound
   { message_type: "audio", simulated_transcript: "...", simulate_failure: false }
2. Guardar message tipo audio + media_files simulado (opcional)
3. Encolar mismo ProcessInboundAudioJob (o atajo con transcript pegado)
4. Resto idéntico al flujo real desde paso 9
```

### Confirmación humana (obligatoria)

```
Audio/Texto → STT (si audio) → IA interpreta → Gamora resume → usuario confirma → Core ejecuta
```

Nunca: `transcripción completada → compromiso creado` sin paso de confirmación.

---

## 3. Modelo mínimo de datos (MySQL)

### workspaces

| Campo | Tipo | Notas |
|-------|------|-------|
| id | CHAR(36) PK | |
| name | VARCHAR(255) | |
| slug | VARCHAR(100) UNIQUE | |
| settings_json | JSON | Ver límites audio abajo |
| created_at | DATETIME | |
| updated_at | DATETIME | |

**`settings_json` sugerido para audio:**

```json
{
  "audio_enabled": true,
  "audio_max_duration_seconds": 120,
  "audio_max_size_bytes": 16777216,
  "audio_retain_original": false,
  "transcription_provider": "openai_whisper"
}
```

---

### users, contacts, channel_contacts

Sin cambios respecto a v1.0. `channel_contacts` controla opt-in antes de procesar audio de WhatsApp.

---

### commitments, commitment_assignees, commitment_events

Sin cambios estructurales. `origin_message_id` puede apuntar al mensaje de audio que originó el compromiso (post-confirmación).

---

### messages (actualizado)

| Campo | Tipo | Notas |
|-------|------|-------|
| id | CHAR(36) PK | |
| conversation_thread_id | CHAR(36) FK | |
| workspace_id | CHAR(36) FK | |
| channel | ENUM | `simulator`, `whatsapp`, `web` |
| provider | VARCHAR(50) | `internal`, `meta` |
| external_message_id | VARCHAR(255) NULL | UNIQUE con channel+provider |
| external_event_id | VARCHAR(255) NULL | UNIQUE opcional por evento webhook |
| sender_contact_id | CHAR(36) FK NULL | |
| direction | ENUM | `inbound`, `outbound` |
| message_type | ENUM | `text`, `audio`, `image`, `document`, `system` |
| text_body | TEXT NULL | Texto directo o transcripción |
| media_id | VARCHAR(255) NULL | `media_id` de Meta |
| media_file_id | CHAR(36) FK NULL | FK a media_files |
| mime_type | VARCHAR(100) NULL | |
| status | ENUM | `received`, `pending_transcription`, `transcription_failed`, `ready`, `processing`, `processed`, `failed` |
| commitment_id | CHAR(36) FK NULL | |
| raw_payload_json | JSON NULL | |
| created_at | DATETIME | |
| processed_at | DATETIME NULL | |

**UNIQUE:** `(channel, provider, external_message_id)`  
**UNIQUE (opcional):** `(channel, provider, external_event_id)` donde not null

---

### media_files

| Campo | Tipo | Notas |
|-------|------|-------|
| id | CHAR(36) PK | |
| workspace_id | CHAR(36) FK | |
| commitment_id | CHAR(36) FK NULL | |
| message_id | CHAR(36) FK NULL | |
| uploaded_by_contact_id | CHAR(36) FK NULL | |
| uploaded_by_user_id | CHAR(36) FK NULL | |
| source | ENUM | `whatsapp`, `web`, `simulator` |
| media_type | ENUM | `audio`, `image`, `document` |
| original_filename | VARCHAR(255) NULL | |
| mime_type | VARCHAR(100) | |
| size_bytes | BIGINT | |
| duration_seconds | INT NULL | Audio |
| storage_provider | VARCHAR(50) | `local`, `r2`, `s3`, `azure` |
| storage_path | VARCHAR(500) | |
| private_url | VARCHAR(1000) NULL | URL firmada |
| retain_until | DATETIME NULL | Retención audio original |
| created_at | DATETIME | |

**Nota:** evidencias de cumplimiento pueden reutilizar esta tabla o `evidence_files` según implementación; evitar duplicar blobs en MySQL.

---

### transcriptions

| Campo | Tipo | Notas |
|-------|------|-------|
| id | CHAR(36) PK | |
| message_id | CHAR(36) FK UNIQUE | 1:1 con mensaje audio |
| media_file_id | CHAR(36) FK | |
| provider | VARCHAR(50) | `openai_whisper`, `deepgram`, `simulator` |
| transcript_text | TEXT NULL | |
| language | VARCHAR(10) NULL | `es` |
| confidence | DECIMAL(5,4) NULL | |
| duration_seconds | INT NULL | |
| status | ENUM | `pending`, `processing`, `completed`, `failed` |
| error_message | TEXT NULL | |
| cost_estimate | DECIMAL(10,6) NULL | USD o moneda ref |
| attempt_count | INT DEFAULT 0 | Reintentos |
| created_at | DATETIME | |
| completed_at | DATETIME NULL | |

---

### ai_extractions (actualizado)

| Campo | Tipo | Notas |
|-------|------|-------|
| id | CHAR(36) PK | |
| message_id | CHAR(36) FK | |
| transcription_id | CHAR(36) FK NULL | Si input vino de audio |
| thread_id | CHAR(36) FK | |
| input_text | TEXT | Texto analizado (escrito o transcrito) |
| detected_intent | VARCHAR(100) NULL | |
| extracted_json | JSON | Campos propuestos |
| confidence | DECIMAL(5,4) NULL | |
| requires_confirmation | BOOLEAN DEFAULT true | |
| model | VARCHAR(100) NULL | |
| status | ENUM | `proposed`, `confirmed`, `rejected`, `superseded` |
| created_at | DATETIME | |

---

### message_events, message_delivery_status, message_templates

Sin cambios. Agregar eventos: `audio_queued`, `media_downloaded`, `transcription_started`, `transcription_completed`, `transcription_failed`.

---

### jobs (tabla opcional para persistencia de cola)

| Campo | Tipo | Notas |
|-------|------|-------|
| id | CHAR(36) PK | |
| job_type | VARCHAR(50) | `process_inbound_audio` |
| payload_json | JSON | message_id, workspace_id |
| status | ENUM | `pending`, `processing`, `completed`, `failed` |
| attempt_count | INT | |
| last_error | TEXT NULL | |
| idempotency_key | VARCHAR(255) UNIQUE | Evita doble procesamiento |
| created_at | DATETIME | |
| completed_at | DATETIME NULL | |

Alternativa MVP: BullMQ + Redis sin tabla; la tabla ayuda a auditoría y reintentos manuales.

---

### Diagrama de relaciones (audio)

```
messages (audio) ──► media_files ──► transcriptions
       │                                    │
       └──────────────► ai_extractions ◄────┘
       │
       └──► commitment (tras confirmación, origin_message_id)
```

---

## 4. API REST mínima (actualizada)

### Compromisos

| Método | Ruta | Propósito |
|--------|------|-----------|
| `POST` | `/api/commitments` | Crear compromiso (web) |
| `GET` | `/api/commitments` | Listar con filtros |
| `GET` | `/api/commitments/:id` | Detalle |
| `PATCH` | `/api/commitments/:id` | Actualizar campos |
| `PATCH` | `/api/commitments/:id/status` | Transición de estado |
| `POST` | `/api/commitments/:id/evidence` | Subir evidencia (multipart) |
| `GET` | `/api/commitments/:id/events` | Bitácora |

### Conversaciones

| Método | Ruta | Propósito |
|--------|------|-----------|
| `POST` | `/api/conversations/inbound` | Entrada simulador: **texto o audio** (ver payload abajo) |
| `GET` | `/api/conversations` | Listar hilos |
| `GET` | `/api/conversations/:id` | Hilo + mensajes (incl. tipo y transcripción) |
| `POST` | `/api/conversations/:id/reply` | Respuesta saliente |

**`POST /api/conversations/inbound` — payload texto:**

```json
{
  "channel_contact_external_id": "luisito-sim",
  "message_type": "text",
  "text_body": "Dile a Panchito que cuente los sacos...",
  "external_message_id": "sim-msg-001"
}
```

**Payload audio simulado:**

```json
{
  "channel_contact_external_id": "luisito-sim",
  "message_type": "audio",
  "external_message_id": "sim-audio-001",
  "simulated_transcript": "Gamora, dile a Panchito que cuente los sacos de cemento...",
  "simulate_transcription_failure": false,
  "skip_transcription_job": false
}
```

- `simulated_transcript`: texto como si el STT ya hubiera corrido (pruebas sin proveedor).
- `simulate_transcription_failure`: prueba manejo de error.
- `skip_transcription_job`: si hay transcript, procesar directo (atajo dev).

### Mensajes y media

| Método | Ruta | Propósito |
|--------|------|-----------|
| `GET` | `/api/messages/:id` | Mensaje + media + transcripción + extracción IA |
| `GET` | `/api/messages/:id/transcription` | Solo transcripción |
| `POST` | `/api/messages/:id/reprocess` | Reintentar pipeline (admin/dev) |
| `POST` | `/api/media/:id/transcribe` | Reprocesar transcripción de un media_file |

### Webhook WhatsApp

| Método | Ruta | Propósito |
|--------|------|-----------|
| `GET` | `/api/webhooks/whatsapp` | Verificación Meta |
| `POST` | `/api/webhooks/whatsapp` | Eventos text + audio; responde 200 rápido; encola audio |

### Auth / workspace

| Método | Ruta | Propósito |
|--------|------|-----------|
| `POST` | `/api/auth/login` | Login web |
| `GET` | `/api/auth/me` | Usuario actual |
| `GET` | `/api/workspaces/current` | Config incl. flags audio |

---

## 5. Estructura de carpetas (actualizada)

```
gestor-tareas/
├── frontend/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── shared/
│   │   │   ├── database/
│   │   │   ├── queue/              # abstracción cola
│   │   │   └── types/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── workspaces/
│   │   │   ├── contacts/
│   │   │   ├── commitments/        # Gamora Core
│   │   │   ├── evidence/
│   │   │   ├── conversations/
│   │   │   │   ├── conversation-engine.service.ts
│   │   │   │   ├── messages.controller.ts
│   │   │   │   ├── messages.repository.ts
│   │   │   │   └── idempotency.service.ts
│   │   │   ├── channels/
│   │   │   │   ├── inbound-message.dto.ts
│   │   │   │   ├── simulator/
│   │   │   │   ├── whatsapp/
│   │   │   │   │   ├── whatsapp.adapter.ts
│   │   │   │   │   ├── whatsapp.webhook.controller.ts  # solo persistir+encolar
│   │   │   │   │   └── whatsapp.sender.ts
│   │   │   │   └── web/
│   │   │   ├── media/
│   │   │   │   ├── media.service.ts
│   │   │   │   ├── meta-media-downloader.ts
│   │   │   │   ├── media-validator.ts
│   │   │   │   └── media.controller.ts
│   │   │   ├── transcription/
│   │   │   │   ├── transcription.service.ts
│   │   │   │   ├── providers/
│   │   │   │   │   ├── transcription.provider.ts
│   │   │   │   │   ├── openai-whisper.provider.ts
│   │   │   │   │   └── simulator.provider.ts
│   │   │   │   └── transcriptions.repository.ts
│   │   │   ├── jobs/
│   │   │   │   ├── queue.ts
│   │   │   │   ├── process-inbound-audio.job.ts
│   │   │   │   └── job-runner.ts
│   │   │   ├── ai/
│   │   │   │   ├── ai.service.ts
│   │   │   │   ├── extraction.schema.ts
│   │   │   │   └── ai-extractions.repository.ts
│   │   │   └── audit/
│   │   └── routes/
│   ├── migrations/
│   ├── uploads/                    # audio/media local dev
│   └── package.json
└── Gamora_Bot/
```

### Frontend Angular

```
frontend/src/app/
├── core/api/
│   ├── commitment-api.service.ts
│   ├── conversation-api.service.ts
│   └── message-api.service.ts      # NUEVO
├── features/
│   ├── conversaciones/             # simulador + historial
│   │   ├── simulator-chat/         # texto + audio + transcript manual
│   │   └── message-detail/         # audio, transcripción, estado
│   └── tareas/
└── shared/models/
    ├── message.model.ts
    └── transcription.model.ts
```

---

## 6. Costos, límites y configuración

| Parámetro | Default sugerido | Descripción |
|-----------|------------------|-------------|
| `audio_enabled` | `true` (dev) | Feature flag por workspace |
| `audio_max_duration_seconds` | `120` | Rechazar con mensaje amigable |
| `audio_max_size_bytes` | `16 MB` | Antes de descargar o tras descarga |
| `audio_retain_original` | `false` (MVP) | Solo transcripción + metadata |
| `transcription_max_retries` | `3` | Job reintentos |
| `STT cost logging` | obligatorio | `transcriptions.cost_estimate` |

**Costos extra vs solo texto:** STT + storage audio + tokens IA sobre texto más largo + reintentos.

---

## 7. Seguridad y privacidad (audio)

- Informar al usuario que los audios se procesan para convertirlos en texto y gestionar compromisos.
- No crear compromisos automáticamente desde transcripción.
- Registrar `sender_contact_id` en cada mensaje de audio.
- Acceso a audio/transcripción restringido por workspace y rol.
- Política de retención: `media_files.retain_until`; borrado programado si `audio_retain_original = false`.
- Auditoría: `message_events` en cada etapa del pipeline.
- Minimizar envío de audio a terceros: solo al proveedor STT configurado.

---

## 8. Riesgos técnicos y mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Webhook timeout por STT en request | Meta reenvía eventos | Procesamiento async en jobs |
| Duplicar compromiso por reintento audio | Datos inconsistentes | Idempotency en message + job key |
| Transcripción incorrecta | Compromiso mal formulado | Confirmación humana obligatoria |
| Audio muy largo | Costos y timeouts | Límites configurables por workspace |
| Meta no da transcript | Pipeline incompleto | STT propio; no asumir texto en webhook |
| Storage de audios sensible | Privacidad | Retención corta; URLs firmadas; permisos |
| Costos STT+IA impredecibles | Presupuesto | `cost_estimate`, límites, flags por tenant |
| Simulador distinto a producción | Bugs en integración | Mismo job `ProcessInboundAudioJob` |
| IA en Node insuficiente a escala | Latencia | Documentado: separar workers en futuro |

---

## 9. Próximo paso recomendado

1. Migraciones: `messages` (con `message_type`, `status`), `media_files`, `transcriptions`, `jobs` (opcional).
2. `POST /api/conversations/inbound` con soporte `message_type: audio` + `simulated_transcript`.
3. `ProcessInboundAudioJob` + `transcription/providers/simulator.provider.ts`.
4. Conversation Engine: procesar `text_body` post-transcripción con flujo de confirmación.
5. Angular: simulador con toggle texto/audio y campo transcripción simulada.
6. Validar E2E: **audio simulado → transcripción → confirmación → compromiso → tablero**.

Después: `media/meta-media-downloader.ts` + webhook WhatsApp async.

Tareas detalladas: `checklist_desarrollo.md`.
