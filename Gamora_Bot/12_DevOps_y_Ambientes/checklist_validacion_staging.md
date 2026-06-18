# Checklist — validación staging Gamora Bot

Completar **después** de desplegar backend HTTPS, frontend staging y MySQL staging.  
Guía de despliegue: [despliegue_staging_https.md](./despliegue_staging_https.md)

**Fecha de validación:** _______________  
**URLs:**
- Frontend: `https://staging._________________`
- API: `https://api-staging._________________`

---

## Infraestructura

- [ ] MySQL staging creado (`gamora_bot_staging`) — **no** es el Docker local
- [ ] `DATABASE_URL` staging configurado en `.env` del servidor
- [ ] `npm run db:push` ejecutado sin errores
- [ ] `npm run db:seed` ejecutado (workspace Ferretería Luisito)
- [ ] `STORAGE_LOCAL_ROOT` existe y es escribible (evidencias)
- [ ] Backend escucha en `PORT` configurado
- [ ] TLS/HTTPS activo en API y frontend

---

## Healthcheck

- [ ] `GET /api/health` responde 200:
  ```json
  { "status": "ok", "env": "staging", "timestamp": "..." }
  ```
- [ ] `GET /health` responde 200 (opcional, compatibilidad)

---

## Frontend

- [ ] `ng build --configuration=staging` (o `npm run build:staging`) completó OK
- [ ] Build usa `environment.staging.ts` (`gamoraApiUrl` apunta al API staging)
- [ ] Frontend carga en navegador sin errores de consola críticos
- [ ] Network tab: requests van a `https://api-staging...` (no localhost)

---

## Simulador y flujo operativo

- [ ] **Texto:** instrucción → propuesta confirmación → confirmar → compromiso en tablero
- [ ] **Audio simulado:** toggle audio → transcripción simulada → confirmación → compromiso
- [ ] **Evidencia:** upload imagen/PDF en detalle → visible en panel y timeline
- [ ] **Estados:** aceptar → evidencia → revisión → cerrar (o corrección) funciona
- [ ] Errores 422 se muestran amigables (no stack traces)

---

## Webhook WhatsApp (mock — sin Meta real)

- [ ] `WHATSAPP_SEND_ENABLED=false` confirmado en `.env`
- [ ] **GET** token correcto → devuelve `hub.challenge`
- [ ] **GET** token incorrecto → HTTP 403
- [ ] **POST** fixture texto mock → `EVENT_RECEIVED` + log `[WhatsappSender:mock]`
- [ ] **POST** fixture audio mock → `EVENT_RECEIVED` + `pending_transcription`

Comandos (reemplazar URLs y token):

```bash
curl -s "https://api-staging.TU-DOMINIO/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=TU_TOKEN&hub.challenge=99999"

curl -s -w "\nHTTP %{http_code}\n" "https://api-staging.TU-DOMINIO/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=mal&hub.challenge=99999"

curl -X POST https://api-staging.TU-DOMINIO/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d @backend/fixtures/whatsapp-webhook-text-mock.json

curl -X POST https://api-staging.TU-DOMINIO/api/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d @backend/fixtures/whatsapp-webhook-audio-mock.json
```

---

## Seguridad

- [ ] `.env` / `.env.staging` con secretos **no** está en git
- [ ] `AI_ENABLED=false` (salvo prueba explícita)
- [ ] `CORS_ORIGIN` = solo URL HTTPS del frontend staging
- [ ] Forzar error 500 (endpoint inexistente interno) → usuario ve mensaje genérico, no stack
- [ ] Logs del servidor accesibles (PM2, panel hosting, journald)

---

## Cierre

- [ ] Todos los ítems anteriores verificados
- [ ] **WhatsApp real NO conectado** — listo para fase Meta cuando corresponda

**Validado por:** _______________
