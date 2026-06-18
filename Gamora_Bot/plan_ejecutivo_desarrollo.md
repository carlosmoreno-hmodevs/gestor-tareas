# Plan ejecutivo de desarrollo — Gamora Bot

**Versión:** 3.0  
**Stack:** Angular · Node.js · MySQL · Meta WhatsApp Cloud API  
**Estado:** Guía de ejecución técnica

---

## Resumen

Gamora Bot convierte conversaciones operativas (texto y **audio**) en **compromisos trazables** con responsable, fecha, evidencia, corrección, cierre e historial.

- **WhatsApp / simulador:** interfaz principal de operación (texto + audio).
- **Web/PWA (Angular):** control, tablero, evidencias, transcripciones, administración.
- **Gamora Core:** núcleo de negocio independiente del canal.
- **Conversation Engine:** capa conversacional común; procesa texto directo o texto transcrito.
- **Jobs/workers:** procesamiento asíncrono de audios (webhook responde rápido).

**Regla obligatoria:** audio o texto → IA interpreta → Gamora resume → usuario confirma → backend ejecuta. Nunca crear ni cerrar compromisos solo por transcribir un audio.

Meta **no entrega transcripción** de audios. El backend descarga el audio (`media_id`), transcribe con proveedor externo y alimenta el mismo flujo que el texto.

---

## Principios de arquitectura

| Principio | Descripción |
|-----------|-------------|
| Canal ≠ negocio | Simulador, WhatsApp y Web usan adaptadores; el core no depende de Meta |
| Webhook rápido | `POST /webhooks/whatsapp` persiste evento, responde 200 OK y encola audio |
| Simulador desde el inicio | Texto y audio simulado sin depender de Meta |
| Idempotencia | `external_message_id` y `external_event_id` evitan duplicados y re-procesos |
| Mismo flujo post-transcripción | Texto escrito y texto transcrito convergen en Conversation Engine |
| IA modular en Node.js | Módulo `ai/` en el mismo backend; sin Python ni microservicio por ahora |
| Confirmación humana | Transcripción e IA solo proponen; Gamora Core ejecuta tras confirmación |
| Ambientes progresivos | Local → Staging (simulador) → Staging (Meta prueba) → Producción |

---

## Alcance MVP — canales de mensaje

| Tipo | MVP | Notas |
|------|-----|-------|
| Texto (simulador / WhatsApp) | Sí | Desde fases tempranas |
| Audio (simulador) | Sí | Transcripción simulada pegada manualmente |
| Audio (WhatsApp real) | Sí, progresivo | Tras staging; descarga + transcripción async |
| Imagen / documento como evidencia | Sí | Ciclo evidencia en web y canal |
| IA sobre texto transcrito | Progresivo | Feature flag; no bloquea core |

---

## Fases de desarrollo

### Fase 1 — Fundación

- Monorepo `frontend/` + `backend/`
- MySQL: workspaces, users, contacts, commitments, conversations, messages
- Gamora Core + simulador texto: `POST /api/conversations/inbound`
- Angular conectado al API

**Criterio de cierre:** mensaje de texto simulado → compromiso → tablero.

---

### Fase 2 — Ciclo operativo + audio simulado

- Evidencias, estados completos, Conversation Engine con confirmación
- Tablas `media_files`, `transcriptions`; mensajes con `message_type`
- **Simulador audio:** inbound tipo audio + transcripción simulada
- Job interno para pipeline audio simulado (misma ruta que WhatsApp real)
- UI simulador: texto / audio / transcripción manual / simular fallo

**Criterio de cierre:** audio simulado → transcripción → confirmación → compromiso → tablero.

---

### Fase 3 — Módulos media, transcripción y jobs

- `media/`: descarga Meta, validación MIME/tamaño, storage
- `transcription/`: proveedor STT, costos, errores
- `jobs/`: cola async, reintentos, idempotencia en procesamiento
- Endpoints: `GET /messages/:id`, transcripción, reprocess
- Límites por workspace: duración, tamaño, feature flag audio

**Criterio de cierre:** pipeline audio completo en local/staging con simulador y jobs.

---

### Fase 4 — Staging y endurecimiento

- Deploy staging HTTPS, auditoría, privacidad documentada
- Angular: visualizar mensaje, audio, transcripción en conversación
- Retención configurable de audio original

**Criterio de cierre:** trazabilidad completa texto + audio en staging.

---

### Fase 5 — WhatsApp Cloud API (staging)

- Webhook GET/POST; eventos text y audio
- Webhook no bloquea: encola job `ProcessInboundAudioJob`
- Número Meta de prueba, opt-in, templates

**Criterio de cierre:** audio real WhatsApp → transcripción → confirmación → compromiso.

---

### Fase 6 — IA sobre texto (escrito o transcrito)

- `ai/` interpreta `input_text` unificado
- `ai_extractions` vinculado a `message_id` y `transcription_id`
- Feature flags `AI_ENABLED`, confirmación obligatoria

**Criterio de cierre:** audio WA → STT → IA → resumen → confirmación → compromiso.

---

### Fase 7 — Producción

- Número real, guardrails de costo (STT + IA + storage), retención, piloto

---

## Secuencia de ambientes

```
Local (simulador texto + audio)
    ↓
Staging HTTPS (simulador)
    ↓
Staging HTTPS (Meta número prueba — text + audio)
    ↓
Producción
```

---

## Costos adicionales por audio (referencia)

Meta no cobra transcripción; el costo extra viene de:

- Servicio de transcripción (STT)
- Almacenamiento de audio (si se conserva)
- Procesamiento IA sobre texto transcrito
- Reintentos fallidos

Límites MVP: duración máxima, tamaño máximo, audio solo usuarios autorizados, flag por workspace, costo estimado por transcripción, opción de conservar solo transcripción + metadata.

---

## Documentación complementaria

| Documento | Contenido |
|-----------|-----------|
| `arquitectura_implementacion.md` | Arquitectura, flujo audio, modelo de datos, endpoints, carpetas, privacidad, riesgos |
| `checklist_desarrollo.md` | Checklist por bloques incl. audios y transcripción |

---

## Próximo paso

Arrancar **Fase 1 + preparación Fase 2**: esquema MySQL con `messages.message_type`, estructura backend con `media/`, `transcription/`, `jobs/`, simulador texto y diseño del inbound audio simulado.

Detalle en `arquitectura_implementacion.md` § Flujo de audio y `checklist_desarrollo.md` § Audios y transcripción.
