# Staging, ambientes y webhook WhatsApp (mock)

Guía para correr Gamora Bot fuera de local y probar el adaptador WhatsApp **sin** conectar Meta real.

> **Fase 5:** para desplegar staging HTTPS (backend + frontend + MySQL dedicado), ver  
> [despliegue_staging_https.md](./despliegue_staging_https.md) y [checklist_validacion_staging.md](./checklist_validacion_staging.md).

**Alcance Fase 4:** configuración por ambiente, endpoints webhook, IA/storage por provider, envío mock.  
**Fuera de alcance:** número real, templates Meta, STT real, producción final.

---

## 1. Ambientes

| Ambiente | `APP_ENV` | Backend | Frontend |
|----------|-----------|---------|----------|
| Local | `local` | `backend/.env` desde `.env.example` | `environment.ts` → `http://localhost:3000` |
| Staging | `staging` | `.env` en host (ver `.env.staging.example`) | `ng build --configuration=staging` |
| Production | `production` | secrets en host | `ng build --configuration=production` |

### Variables backend (requeridas)

| Variable | Local típico | Notas |
|----------|--------------|-------|
| `DATABASE_URL` | MySQL docker | Obligatorio |
| `PORT` | `3000` | Puerto HTTP |
| `CORS_ORIGIN` | `http://localhost:4200` | Staging: URL HTTPS del frontend |
| `STORAGE_PROVIDER` | `local` | `s3` / `r2` / `azure` documentados, no implementados |
| `STORAGE_LOCAL_ROOT` | `uploads` | Staging: ruta absoluta persistente |
| `AI_ENABLED` | `false` | Por defecto parser determinístico |
| `AI_PROVIDER` | `openai` | También `mock` para pruebas sin API |
| `OPENAI_API_KEY` | vacío | Solo si `AI_ENABLED=true` |
| `AI_MODEL` | `gpt-4o-mini` | |
| `WHATSAPP_VERIFY_TOKEN` | token dev | Meta lo usará en GET verify |
| `WHATSAPP_ACCESS_TOKEN` | vacío | Fase Meta real |
| `WHATSAPP_PHONE_NUMBER_ID` | vacío | Fase Meta real |
| `WHATSAPP_DEFAULT_WORKSPACE_SLUG` | `ferreteria-luisito` | Workspace destino inbound WA |
| `WHATSAPP_SEND_ENABLED` | `false` | `true` + tokens → Graph API (fase posterior) |

Copiar plantillas:
```bash
cd backend
cp .env.example .env              # local
cp .env.staging.example .env      # staging (en servidor, no commitear)
```

### Frontend — `API_BASE_URL`

`gamoraApiUrl` en:
- `frontend/src/environments/environment.ts` (local)
- `frontend/src/environments/environment.staging.ts`
- `frontend/src/environments/environment.prod.ts`

Builds:
```bash
cd frontend
npm run build                          # production
ng build --configuration=staging       # staging
ng serve --configuration=development   # local (default)
```

---

## 2. Correr en local (sin cambios de comportamiento)

```bash
docker compose up -d
cd backend && cp .env.example .env && npm install && npm run db:push && npm run db:seed && npm run dev
cd frontend && npm install && ng serve
```

- Simulador Angular: sigue usando `POST /api/conversations/inbound`
- WhatsApp mock: `GET/POST /api/webhooks/whatsapp` (paralelo, no reemplaza simulador)

Tras actualizar seed (contacto WA mock `5215512345678` → Luisito):
```bash
cd backend && npm run db:seed
```

---

## 3. Staging HTTPS (checklist de despliegue)

1. **MySQL** accesible desde el host staging; `DATABASE_URL` configurada.
2. **Backend** detrás de reverse proxy (nginx/Caddy) con TLS.
3. **`CORS_ORIGIN`** = URL exacta del frontend staging (HTTPS).
4. **`STORAGE_LOCAL_ROOT`** = volumen persistente (ej. `/var/gamora/uploads`).
5. **`WHATSAPP_VERIFY_TOKEN`** = string largo aleatorio (mismo valor en Meta Developer Console después).
6. Ejecutar migraciones: `npm run db:push` + `npm run db:seed`.
7. **Frontend** build staging apuntando a `https://api-staging.tu-dominio.com`.
8. Verificar `GET https://api-staging.../health` → `{ "env": "staging", ... }`.

---

## 4. Webhook WhatsApp — pruebas mock

### GET — verificación Meta

Token correcto (debe devolver el challenge en texto plano):
```bash
curl -s "http://localhost:3000/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=gamora-dev-verify-token&hub.challenge=12345"
# Esperado: 12345
```

Token incorrecto:
```bash
curl -s -w "\nHTTP %{http_code}\n" "http://localhost:3000/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=mal&hub.challenge=12345"
# Esperado: 403 + JSON error
```

### POST — texto → propuesta + confirmación

Payload de ejemplo: `backend/fixtures/whatsapp-webhook-text-mock.json`

```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d @backend/fixtures/whatsapp-webhook-text-mock.json
# Respuesta inmediata: EVENT_RECEIVED (200)
```

En logs del backend (modo mock):
```
[WhatsappSender:mock] { to: '5215512345678', preview: '...confirmación...', ... }
```

Confirmar por webhook (nuevo `external_message_id`):
```bash
curl -X POST http://localhost:3000/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"object":"whatsapp_business_account","entry":[{"changes":[{"field":"messages","value":{"metadata":{"phone_number_id":"x"},"messages":[{"from":"5215512345678","id":"wamid.mock-text-002","type":"text","text":{"body":"sí"}}]}}]}]}'
```

### POST — audio (solo estructura, sin STT)

`backend/fixtures/whatsapp-webhook-audio-mock.json`

- Mensaje persistido con `status: pending_transcription`
- Evento `audio_queued` con `phase: awaiting_media_download_and_stt`
- **No** descarga media ni transcribe

---

## 5. Checklist antes de conectar Meta real

- [ ] Staging HTTPS estable; health OK
- [ ] `WHATSAPP_VERIFY_TOKEN` configurado y probado con GET mock
- [ ] POST mock texto crea propuesta y respuesta en logs
- [ ] Seed con `channel_contact` whatsapp/meta para wa_id de prueba
- [ ] `WHATSAPP_SEND_ENABLED=false` hasta tener tokens reales
- [ ] Documentar URL pública del webhook: `https://api-staging.../api/webhooks/whatsapp`
- [ ] Plan para `WHATSAPP_ACCESS_TOKEN` y `WHATSAPP_PHONE_NUMBER_ID` (Meta Business)
- [ ] Storage cloud si el host es efímero (S3/R2 — fase posterior)
- [ ] STT real para audio WA (fase posterior)
- [ ] Templates aprobados por Meta (fase posterior)

---

## 6. Extensiones preparadas (sin conectar aún)

### IA — `AI_PROVIDER`
- `openai` — comportamiento actual si `AI_ENABLED=true`
- `mock` — respuestas fijas para tests
- Futuro: `groq`, `ollama` en `backend/src/modules/ai/providers/`

### Storage — `STORAGE_PROVIDER`
- `local` — activo
- `s3` / `r2` / `azure` — interfaz en `backend/src/shared/storage/`; variables en `.env.example`

### WhatsApp
- `whatsapp.adapter.ts` — normaliza payload Meta → `InboundMessageDTO`
- `whatsapp.webhook.controller.ts` — GET verify + POST 200 rápido
- `whatsapp.webhook.service.ts` — Conversation Engine + sender
- `whatsapp.sender.ts` — mock log o Graph API cuando `WHATSAPP_SEND_ENABLED=true`

---

## 7. Verificación manual — no romper simulador

| Prueba | Comando / acción | Esperado |
|--------|------------------|----------|
| Simulador texto | Angular o `POST /api/conversations/inbound` | Igual que Fase 3.2 |
| GET webhook OK | curl con token correcto | Challenge |
| GET webhook fail | curl token mal | 403 |
| POST webhook texto | fixture text mock | Propuesta + log mock outbound |
| POST webhook audio | fixture audio mock | `pending_transcription`, sin STT |
| Health | `GET /health` | `env: local` |
