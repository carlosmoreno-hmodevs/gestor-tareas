# Gamora Bot API

Backend Node.js + Express + Prisma + MySQL para Gamora Bot.

## Requisitos

- Node.js 20+
- Docker (MySQL) o MySQL 8 local

## Arranque rápido

```bash
# Desde la raíz del repo
docker compose up -d

cd backend
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

API: `http://localhost:3000`  
Health: `GET /health` o `GET /api/health`

## Probar simulador (Fase 1 + confirmación humana)

**Paso A — enviar instrucción:**
```bash
curl -X POST http://localhost:3000/api/conversations/inbound \
  -H "Content-Type: application/json" \
  -H "X-Workspace-Slug: ferreteria-luisito" \
  -d "{\"channel_contact_external_id\":\"luisito-sim\",\"message_type\":\"text\",\"text_body\":\"Dile a Panchito que mañana cuente los sacos de cemento de la sucursal Centro y mande foto.\",\"external_message_id\":\"sim-demo-001\"}"
```
Respuesta: `awaiting_confirmation: true` y `reply` pidiendo confirmación. **No** se crea compromiso aún.

**Paso B — confirmar:**
```bash
curl -X POST http://localhost:3000/api/conversations/inbound \
  -H "Content-Type: application/json" \
  -H "X-Workspace-Slug: ferreteria-luisito" \
  -d "{\"channel_contact_external_id\":\"luisito-sim\",\"message_type\":\"text\",\"text_body\":\"sí\",\"external_message_id\":\"sim-demo-002\"}"
```
Respuesta: `commitment` con folio. El tablero Angular muestra el compromiso tras recargar.

## Casos de prueba — parser determinístico (`AI_ENABLED=false`)

Contactos demo en seed: **Luisito**, **Panchito**, **Marco** (asignables en Ferretería Luisito).

| Caso | Mensaje | Esperado en resumen |
|------|---------|---------------------|
| **A** | `Dile a Panchito que mañana cuente los sacos de cemento de la sucursal Centro y mande foto.` | Responsable: Panchito · Actividad: Contar los sacos de cemento · Ubicación: Sucursal Centro · Fecha: mañana · Evidencia: foto |
| **B** | `Dile a Marco que saque la basura de la tienda sur y que mande foto.` | Responsable: Marco · Actividad: Sacar la basura · Ubicación: Tienda sur · Fecha: sin fecha indicada · Evidencia: foto |
| **C** | `Pídele a Marco que revise las luces del almacén norte y envíe evidencia.` | Responsable: Marco · Actividad: Revisar las luces · Ubicación: Almacén norte · Evidencia: evidencia |

Patrones soportados: `Dile a`, `Pídele a`, `Asigna a`, `Encarga a` + responsable + `que` + actividad.

Si el responsable no existe en el workspace: *«No encontré a {nombre} como responsable registrado. ¿Quieres seleccionar otro responsable?»* (sin propuesta ni confirmación).

Tras cambios en seed: `npm run db:seed`

## Ciclo operativo (Fase 2)

Tras crear el compromiso, en el **detalle de la tarea** (tenant Ferretería Luisito):

1. **Aceptar** → `accepted`
2. **Subir evidencia** (panel central, imagen/PDF) → `evidence_submitted`
3. **Enviar a revisión** → `in_review`
4. **Pedir corrección** o **Cerrar** → `correction_requested` / `closed`
5. Si hubo corrección: subir nueva evidencia → **Marcar corregido** → **Enviar a revisión** → **Cerrar**

Bitácora visible en timeline; transiciones inválidas devuelven HTTP 422.

## Audio simulado (Fase 3)

Sin WhatsApp real ni STT real. El simulador acepta una transcripción manual en el payload.

**Paso A — enviar audio simulado:**
```bash
curl -X POST http://localhost:3000/api/conversations/inbound \
  -H "Content-Type: application/json" \
  -H "X-Workspace-Slug: ferreteria-luisito" \
  -d "{\"channel_contact_external_id\":\"luisito-sim\",\"message_type\":\"audio\",\"external_message_id\":\"sim-audio-001\",\"simulated_transcript\":\"Dile a Panchito que mañana cuente los sacos de cemento de la sucursal Centro y mande foto.\"}"
```
Respuesta: `transcription_status: completed`, `awaiting_confirmation: true`.

**Paso B — confirmar** (igual que texto): enviar `text_body: "sí"` con nuevo `external_message_id`.

**Simular fallo de transcripción:**
```bash
curl -X POST http://localhost:3000/api/conversations/inbound \
  -H "Content-Type: application/json" \
  -H "X-Workspace-Slug: ferreteria-luisito" \
  -d "{\"channel_contact_external_id\":\"luisito-sim\",\"message_type\":\"audio\",\"external_message_id\":\"sim-audio-fail\",\"simulate_transcription_failure\":true}"
```
Respuesta: `transcription_status: failed`; no se crea propuesta ni compromiso.

**Debug:**
- `GET /api/messages/:id` — mensaje con transcripción y eventos
- `GET /api/messages/:id/transcription` — registro STT

## IA opcional (Fase 3.1)

Por defecto `AI_ENABLED=false` — se usa el parser determinístico.

Para activar OpenAI en `.env`:
```
AI_ENABLED=true
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
AI_MIN_CONFIDENCE=0.6
```

Para pruebas sin API externa: `AI_PROVIDER=mock` (con `AI_ENABLED=true`).

Si la IA falla o la confianza es baja, el sistema usa el parser determinístico automáticamente. La IA **nunca** crea compromisos; siempre pide confirmación humana.

## Ambientes y staging

- **Local:** `backend/.env` desde `.env.example`; frontend `environment.ts`
- **Staging:** plantilla `backend/.env.staging.example`; frontend `npm run build:staging`
- **Production:** `environment.prod.ts`; secrets en el host

Healthcheck staging:
```bash
curl https://api-staging.tu-dominio.com/api/health
# { "status": "ok", "env": "staging", "timestamp": "..." }
```

Guías:
- [Despliegue staging HTTPS](../Gamora_Bot/12_DevOps_y_Ambientes/despliegue_staging_https.md) — **Fase 5**
- [Checklist validación staging](../Gamora_Bot/12_DevOps_y_Ambientes/checklist_validacion_staging.md)
- [Webhook mock (Fase 4)](../Gamora_Bot/12_DevOps_y_Ambientes/staging_y_webhook_whatsapp_mock.md)

### Webhook WhatsApp (mock — sin Meta real)

**GET verify:**
```bash
curl "http://localhost:3000/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=gamora-dev-verify-token&hub.challenge=12345"
```

**POST texto** (contacto seed `5215512345678` = Luisito):
```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d @fixtures/whatsapp-webhook-text-mock.json
```

Respuesta HTTP inmediata: `EVENT_RECEIVED`. La propuesta de confirmación aparece en logs `[WhatsappSender:mock]` si `WHATSAPP_SEND_ENABLED=false`.

Tras cambios en seed (contacto WhatsApp): `npm run db:seed`

## Ejemplo PATCH estado (Fase 2)

```bash
# Ejemplo: aceptar compromiso
curl -X PATCH http://localhost:3000/api/commitments/{id}/status \
  -H "Content-Type: application/json" \
  -H "X-Workspace-Slug: ferreteria-luisito" \
  -d "{\"status\":\"accepted\",\"actor_contact_id\":\"00000000-0000-4000-8000-000000000002\"}"
```

## Estructura

- `src/modules/commitments` — Gamora Core
- `src/modules/conversations` — Conversation Engine + idempotency
- `src/modules/channels/simulator` — adaptador simulador
- `src/modules/channels/whatsapp` — adapter + webhook + sender (Fase 4 mock)
- `src/modules/transcription` — proveedor `simulator` (Fase 3)
- `src/modules/jobs` — `ProcessInboundAudioJob` in-process (Fase 3)
- `src/modules/ai` — providers openai/mock + fallback parser (Fase 3.1 / 4)
- `src/shared/storage` — `StorageProvider` local (+ extensión s3/r2/azure)
- `src/modules/media` — stub preparado

## Decisión técnica Fase 1

- **ORM:** Prisma + MySQL 8
- **Framework:** Express (ligero para MVP)
- **Parser texto:** determinístico (`text-intent.parser.ts`), sin LLM
- **Auth:** header `X-Workspace-Slug` en dev; JWT en fase posterior

## Decisión técnica Fase 2 — Ciclo operativo

- Estados y transiciones validados solo en backend (`assertTransition`)
- Evidencias web en `evidence_files` + disco `uploads/`
- Tras subir evidencia en `accepted` → `evidence_submitted` automático
- UI: `GamoraCommitmentActionsComponent` + panel evidencia existente

## Decisión técnica Fase 3 — Audio simulado

- `ProcessInboundAudioJob` transcribe (simulador) y delega en `processInboundContent()` — mismo path que texto
- Tabla `transcriptions` 1:1 con mensaje; eventos `audio_queued`, `transcription_completed`, `transcription_failed`
- Job síncrono en request HTTP; sustituible por cola async sin cambiar Conversation Engine
- Sin descarga de media, sin Whisper, sin WhatsApp Cloud API

## Decisión técnica Fase 3.1 — IA opcional

- `AI_ENABLED=false` por defecto; parser determinístico como fallback siempre disponible
- Con `AI_ENABLED=true` + `OPENAI_API_KEY`: extracción JSON vía OpenAI; fallback si falla o confianza < `AI_MIN_CONFIDENCE`
- `ai_extractions` registra cada propuesta; `confirmed` / `rejected` al confirmar o cancelar
- Resumen de confirmación en formato estructurado (Actividad, Responsable, Ubicación, Fecha, Evidencia)

## Decisión técnica Fase 1.1 — Confirmación humana

- El simulador **no** crea compromisos al recibir la instrucción inicial
- La propuesta se guarda en `conversation_threads.session_context_json` con `session_state = awaiting_confirmation`
- Respuestas afirmativas (`sí`, `si`, `confirmo`, `correcto`, `ok`, `adelante`) crean el compromiso
- Respuestas negativas (`no`, `cancelar`, `cancela`) descartan la propuesta
- `origin_message_id` del compromiso apunta al mensaje inbound original (no al de confirmación)

## Decisión técnica Fase 4 — Staging + WhatsApp adapter (mock)

- Config por ambiente: `APP_ENV`, `.env.example`, `.env.staging.example`, `environment.staging.ts` / `environment.prod.ts`
- `AI_PROVIDER`: `openai` (default) | `mock`; `AI_ENABLED=false` por defecto
- `STORAGE_PROVIDER`: `local` activo; interfaz lista para cloud
- Webhook `GET/POST /api/webhooks/whatsapp` — verify Meta + procesamiento async
- Audio WA: `pending_transcription` + `audio_queued`; sin descarga Graph API ni STT
- `WHATSAPP_SEND_ENABLED=false` — respuestas en log mock, no Graph API
- **WhatsApp real NO conectado** en esta fase

## Decisión técnica Fase 5 — Despliegue staging HTTPS

- Guía operativa: `Gamora_Bot/12_DevOps_y_Ambientes/despliegue_staging_https.md`
- `GET /api/health` — healthcheck para load balancers (`status`, `env`, `timestamp`)
- MySQL staging **separado** del `docker-compose` local
- Errores HTTP 500: mensaje genérico en staging/prod; detalle solo en logs
- `.env.staging` no se commitea; plantilla en `.env.staging.example`
- Frontend: `npm run build:staging` con `gamoraApiUrl` HTTPS del API staging
