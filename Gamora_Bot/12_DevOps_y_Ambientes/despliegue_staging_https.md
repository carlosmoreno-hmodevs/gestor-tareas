# Despliegue staging HTTPS — Gamora Bot

Guía para desplegar **backend**, **frontend** y **MySQL staging** en un ambiente público con HTTPS, antes de conectar Meta/WhatsApp real.

**Alcance Fase 5:** documentación, healthcheck, seguridad básica, checklist de validación.  
**Fuera de alcance:** número WhatsApp real, templates Meta, envío Graph API, STT real, producción final.

Documentos relacionados:
- [Preparación webhook mock (Fase 4)](./staging_y_webhook_whatsapp_mock.md)
- [Checklist validación staging](./checklist_validacion_staging.md)

---

## Arquitectura objetivo

```
                    ┌─────────────────────────────────────┐
  Usuario/browser   │  https://staging.tu-dominio.com     │
        │           │  (Angular static — CDN/nginx/Vercel)  │
        ▼           └─────────────────┬───────────────────┘
                                      │ API HTTPS
                    ┌─────────────────▼───────────────────┐
                    │  https://api-staging.tu-dominio.com │
                    │  Node.js + Express (PORT configurable)│
                    │  /api/health  /api/webhooks/whatsapp  │
                    └─────────────────┬───────────────────┘
                                      │ DATABASE_URL
                    ┌─────────────────▼───────────────────┐
                    │  MySQL staging (instancia dedicada)   │
                    │  gamora_bot_staging                   │
                    └─────────────────────────────────────┘
```

**Importante:** staging **no** debe usar el MySQL de `docker compose` local. Son bases de datos separadas.

---

## 1. Backend staging

### Opciones de despliegue recomendadas

| Opción | Cuándo usarla | TLS | Notas |
|--------|---------------|-----|-------|
| **VPS + nginx + PM2** | Control total, costo predecible | Let's Encrypt en nginx | Recomendada para MVP staging |
| **Railway / Render / Fly.io** | Despliegue rápido sin administrar OS | Incluido en la plataforma | Buena para primer staging |
| **Docker en VPS** | Si ya tienes orquestación | Traefik / nginx | Usar imagen Node 20+ |

Para todos los casos:
- El proceso Node escucha en `PORT` (default `3000`) **sin TLS**.
- Un reverse proxy termina HTTPS y reenvía a `http://127.0.0.1:PORT`.
- Variables desde `.env` en el servidor (plantilla: `backend/.env.staging.example`).

### Pasos — VPS + PM2 (referencia)

```bash
# En el servidor staging
git clone <repo-url> /var/gamora/gestor-tareas
cd /var/gamora/gestor-tareas/backend

cp .env.staging.example .env
# Editar .env con secretos reales (DATABASE_URL, WHATSAPP_VERIFY_TOKEN, CORS_ORIGIN)

npm ci
npm run build
npm run db:push
npm run db:seed

# PM2 (instalar globalmente si aplica)
pm2 start dist/server.js --name gamora-api-staging
pm2 save
```

### Variables críticas (`.env` en staging)

| Variable | Valor staging | Obligatorio |
|----------|---------------|-------------|
| `APP_ENV` | `staging` | Sí |
| `NODE_ENV` | `production` | Sí |
| `PORT` | `3000` (o el que use el host) | Sí — **configurable** |
| `DATABASE_URL` | MySQL staging dedicado | Sí |
| `CORS_ORIGIN` | `https://staging.tu-dominio.com` | Sí — **solo frontend staging** |
| `STORAGE_LOCAL_ROOT` | `/var/gamora/uploads` | Sí (evidencias) |
| `WHATSAPP_SEND_ENABLED` | `false` | Sí — **no activar** |
| `AI_ENABLED` | `false` | Recomendado |
| `WHATSAPP_VERIFY_TOKEN` | token largo aleatorio | Sí (webhook verify) |

### nginx — ejemplo reverse proxy

```nginx
server {
    listen 443 ssl http2;
    server_name api-staging.tu-dominio.com;

    ssl_certificate     /etc/letsencrypt/live/api-staging.tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api-staging.tu-dominio.com/privkey.pem;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Healthcheck

```bash
curl -s https://api-staging.tu-dominio.com/api/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "env": "staging",
  "timestamp": "2026-06-15T12:00:00.000Z"
}
```

También disponible: `GET /health` (incluye `service` y flags adicionales).

---

## 2. Frontend staging

### Confirmación: build staging usa `environment.staging.ts`

En `frontend/angular.json`, la configuración `staging` tiene:

```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.staging.ts"
  }
]
```

### Configurar `API_BASE_URL`

Editar `frontend/src/environments/environment.staging.ts`:

```typescript
export const environment = {
  production: false,
  gamoraApiEnabled: true,
  gamoraApiUrl: 'https://api-staging.tu-dominio.com',
};
```

El frontend consume la API vía `environment.gamoraApiUrl` (`CommitmentApiService`, mappers de evidencia, etc.).

### Build y deploy

```bash
cd frontend
npm ci

# Verificar que el build usa staging
npm run build:staging
# equivalente: ng build --configuration=staging

# Artefactos en:
# frontend/dist/gestor-tareas/browser/
```

**Deploy del artefacto estático** (elegir una):

| Destino | Comando / acción |
|---------|------------------|
| **nginx** | Copiar `dist/gestor-tareas/browser/*` a `/var/www/gamora-staging` |
| **Netlify / Vercel** | Conectar repo; build command: `npm run build:staging`; output: `dist/gestor-tareas/browser` |
| **S3 + CloudFront** | `aws s3 sync dist/gestor-tareas/browser s3://bucket-staging` |

Configurar HTTPS en el host del frontend (`https://staging.tu-dominio.com`).

**CORS:** el valor de `CORS_ORIGIN` en el backend debe coincidir **exactamente** con la URL del frontend staging.

---

## 3. Base de datos staging

### Crear MySQL staging

Opciones:
- **Managed MySQL** (Railway, PlanetScale, DigitalOcean, AWS RDS)
- **MySQL en VPS** dedicado al ambiente staging

```sql
CREATE DATABASE gamora_bot_staging CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'gamora_staging'@'%' IDENTIFIED BY 'PASSWORD_SEGURO';
GRANT ALL PRIVILEGES ON gamora_bot_staging.* TO 'gamora_staging'@'%';
FLUSH PRIVILEGES;
```

`DATABASE_URL` ejemplo:
```
mysql://gamora_staging:PASSWORD_SEGURO@mysql-staging-host:3306/gamora_bot_staging
```

### Migrar y seed (en el servidor backend)

```bash
cd backend
# .env con DATABASE_URL staging ya configurado
npm run db:push
npm run db:seed
```

### ⚠️ No usar Docker local para staging

| Ambiente | Base de datos |
|----------|---------------|
| **Local dev** | `docker compose up -d` → `gamora_bot_dev` en localhost |
| **Staging** | Instancia MySQL remota/dedicada → `gamora_bot_staging` |

El `docker-compose.yml` del repo es **solo para desarrollo local**. No apuntar staging al MySQL de tu laptop ni compartir datos entre ambientes.

---

## 4. Webhook público (mock — sin Meta)

URL pública del webhook:
```
https://api-staging.tu-dominio.com/api/webhooks/whatsapp
```

### GET — token correcto

```bash
curl -s "https://api-staging.tu-dominio.com/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=TU_WHATSAPP_VERIFY_TOKEN&hub.challenge=12345"
```
Esperado: respuesta `12345` (texto plano, HTTP 200).

### GET — token incorrecto

```bash
curl -s -w "\nHTTP %{http_code}\n" \
  "https://api-staging.tu-dominio.com/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=token-invalido&hub.challenge=12345"
```
Esperado: HTTP `403` + `{"error":"Token de verificación inválido"}`.

### POST — fixture texto mock

Desde tu máquina (o CI), apuntando al staging público:

```bash
curl -X POST https://api-staging.tu-dominio.com/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d @backend/fixtures/whatsapp-webhook-text-mock.json
```

Esperado:
- HTTP 200, cuerpo `EVENT_RECEIVED`
- En logs del servidor: `[WhatsappSender:mock]` con propuesta de confirmación
- **No** envía WhatsApp real (`WHATSAPP_SEND_ENABLED=false`)

Cambiar `id` del mensaje en el fixture en cada prueba (idempotencia).

### POST — fixture audio mock

```bash
curl -X POST https://api-staging.tu-dominio.com/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d @backend/fixtures/whatsapp-webhook-audio-mock.json
```

Esperado:
- HTTP 200 `EVENT_RECEIVED`
- Mensaje con `pending_transcription`; evento `audio_queued`
- Sin descarga de media ni STT

---

## 5. Checklist de validación staging

Usar [`checklist_validacion_staging.md`](./checklist_validacion_staging.md) al terminar el despliegue.

Resumen:

- [ ] `GET /api/health` → `{ status: "ok", env: "staging", timestamp: "..." }`
- [ ] Frontend carga en `https://staging.tu-dominio.com`
- [ ] Frontend consume API staging (Network tab → requests a `api-staging...`)
- [ ] Simulador texto: instrucción → propuesta → confirmación → compromiso en tablero
- [ ] Simulador audio: transcripción simulada → confirmación
- [ ] Evidencia: upload en detalle de compromiso → visible en timeline
- [ ] Webhook GET público (token correcto / incorrecto)
- [ ] Webhook POST mock texto y audio
- [ ] Logs del backend visibles (PM2 / plataforma)
- [ ] Errores 500 no muestran stack ni mensajes técnicos al usuario

---

## 6. Seguridad básica staging

### Secretos — no commitear

| Archivo | En repo | En servidor |
|---------|---------|-------------|
| `.env.staging.example` | ✅ plantilla | — |
| `.env` / `.env.staging` con secretos | ❌ **nunca** | ✅ |

`.env.staging` está en `backend/.gitignore`.

### Secretos requeridos en staging

| Secreto | Uso |
|---------|-----|
| `DATABASE_URL` | Conexión MySQL staging |
| `WHATSAPP_VERIFY_TOKEN` | Verificación webhook Meta (futuro) |
| `CORS_ORIGIN` | Origen permitido del frontend |

Opcionales (mantener vacíos/desactivados en staging):
- `WHATSAPP_ACCESS_TOKEN` — vacío hasta fase Meta
- `OPENAI_API_KEY` — solo si `AI_ENABLED=true`

### Flags de seguridad por defecto

```
WHATSAPP_SEND_ENABLED=false
AI_ENABLED=false
CORS_ORIGIN=https://staging.tu-dominio.com   # un solo origen, sin wildcard
```

### Errores HTTP

- **422** (reglas de negocio): mensajes legibles para el usuario — OK en frontend vía `gamora-api-error.mapper.ts`
- **500**: en staging/prod el backend responde `"Error interno del servidor"` sin detalles técnicos; el stack queda solo en logs del servidor

---

## 7. Orden recomendado de despliegue

1. Crear MySQL staging + `DATABASE_URL`
2. Desplegar backend con `.env` staging → `db:push` + `db:seed`
3. Verificar `GET /api/health`
4. Configurar `environment.staging.ts` con URL del API
5. Build y deploy frontend staging
6. Validar simulador + evidencias en UI
7. Probar webhooks públicos (GET/POST mock)
8. Completar [`checklist_validacion_staging.md`](./checklist_validacion_staging.md)

---

## 8. Antes de conectar Meta (fase posterior)

- [ ] Todos los ítems de la checklist staging en verde
- [ ] URL webhook pública estable probada con GET verify
- [ ] `WHATSAPP_SEND_ENABLED` sigue en `false` hasta tener tokens
- [ ] Decidir storage cloud si el disco del host es efímero
- [ ] Plan de templates y número de prueba Meta Business

**WhatsApp real sigue desactivado en Fase 5.**
