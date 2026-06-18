# Prompt MVP 0 — Base del Repositorio Técnico

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del prompt

Este prompt instruye a Codex para crear la base técnica del repositorio del MVP de Gamora Bot.

MVP 0 no implementa todavía los flujos funcionales completos del producto. Su objetivo es dejar preparada una base limpia, segura y extensible para construir después:

- backend;
- frontend web/PWA;
- base de datos;
- configuración;
- servicios WhatsApp;
- servicios OpenAI;
- guardrails;
- logs;
- documentación técnica;
- pruebas básicas.

El resultado debe ser un repositorio técnico inicial que pueda ejecutarse localmente sin credenciales reales, sin llamadas a APIs de pago y sin depender todavía de Docker ni PostgreSQL local corriendo.

## 2. Contexto que debe conocer Codex

Gamora Bot es un motor de compromisos operativos sobre WhatsApp Business.

Principios vigentes del producto:

- WhatsApp es canal operativo, no fuente de verdad.
- Gamora Core es el sistema.
- Web/PWA es la capa formal de control.
- IA interpreta, backend gobierna, humano valida.
- AI & API Guardrails son obligatorios desde el diseño.
- Gamora no lee chats personales.
- Gamora no envía mensajes a usuarios no enrolados.
- El MVP debe ser real, no una simulación visual.
- El ambiente local actual usa Node.js, npm/npm.cmd y Git.
- No se usará Docker por ahora.
- PostgreSQL se preparará conceptualmente vía Prisma, pero no se exige conexión real en MVP 0.
- OpenAI y WhatsApp Business API no deben conectarse todavía.
- No deben usarse credenciales reales.

## 3. Alcance exacto de MVP 0

MVP 0 debe crear:

- repositorio base;
- estructura de carpetas;
- backend base;
- frontend base;
- configuración de entorno;
- Prisma/PostgreSQL preparado;
- healthcheck;
- README técnico;
- documentación de variables de entorno;
- placeholders de servicios:
  - WhatsApp Service;
  - OpenAI / IA Service;
  - Guardrails Service;
  - Event Processor;
  - Notification Service;
  - Evidence Storage Service;
- estructura inicial de logs;
- pruebas mínimas de arranque.

MVP 0 no debe implementar todavía:

- creación completa de compromisos;
- flujo WhatsApp real completo;
- webhook productivo completo;
- integración OpenAI productiva;
- envío real de mensajes;
- subida real de evidencias;
- interfaz completa;
- autenticación final;
- flujos Mina Mercedes o Sunworks.

## 4. Stack técnico recomendado

Stack recomendado para MVP 0:

- Monorepo simple.
- Backend: Node.js + TypeScript + Express.
- Frontend: React / Next.js.
- Base de datos: PostgreSQL preparada conceptualmente.
- ORM: Prisma.
- Gestor de paquetes inicial: npm.
- Comandos npm en Windows: usar `npm.cmd` si PowerShell bloquea `npm`.
- Storage: placeholder para Azure Blob / S3 / equivalente.
- IA: placeholder OpenAI API.
- WhatsApp: placeholder Meta WhatsApp Business Cloud API.
- Testing básico: Vitest/Jest o equivalente.
- Lint/format: ESLint/Prettier si aplica.

Codex puede proponer ajustes razonables si detecta una alternativa más simple para MVP 0, pero no debe cambiar la intención del producto ni avanzar a funcionalidades fuera de alcance.

## 5. Estructura sugerida del repositorio

Estructura sugerida:

```text
gamora-bot/
  apps/
    api/
    web/
  packages/
    shared/
  prisma/
  docs/
  scripts/
  .env.example
  README.md
```

Dentro de `apps/api`:

```text
src/
  config/
  modules/
    users/
    workspaces/
    commitments/
    evidences/
    notifications/
    webhooks/
    ai/
    whatsapp/
    guardrails/
    audit/
  services/
  utils/
  server.ts
```

Dentro de `apps/web`:

```text
src/
  app/
  components/
  pages/
  services/
  styles/
```

La estructura puede adaptarse al framework elegido, pero debe conservar separación clara entre API, web, shared, prisma, documentación y scripts.

## 6. Variables de entorno mínimas

Crear `.env.example` con placeholders, nunca con secretos reales:

- `DATABASE_URL`
- `APP_ENV`
- `API_BASE_URL`
- `WEB_BASE_URL`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- `OPENAI_API_KEY`
- `STORAGE_PROVIDER`
- `STORAGE_CONNECTION_STRING`
- `JWT_SECRET`
- `LOG_LEVEL`

Regla:

No guardar secretos reales en el repositorio, en README, en pruebas, en fixtures ni en comentarios.

## 7. Base de datos inicial

MVP 0 debe dejar Prisma configurado y preparado, pero no necesita una base PostgreSQL real corriendo todavía.

Debe incluir:

- configuración conceptual para PostgreSQL;
- `.env.example` con `DATABASE_URL` placeholder;
- Prisma preparado si aplica;
- nota de que el modelo completo se desarrollará en MVP 1;
- aclaración de que SQLite no es la decisión principal del MVP real.

Regla:

Si Prisma requiere conexión real para migrar, no forzar migración en MVP 0. Dejar preparado y documentado.

## 8. Backend base

El backend base debe incluir:

- servidor inicial;
- endpoint `/health`;
- estructura modular;
- configuración centralizada;
- manejo básico de errores;
- logger básico;
- carga de variables de entorno;
- separación dev/staging/prod;
- placeholder de webhook;
- placeholder de WhatsApp Service;
- placeholder de IA Service;
- placeholder de Guardrails Service.

Endpoint mínimo:

- `GET /health`

Respuesta esperada:

- status ok;
- app name;
- environment;
- timestamp.

## 9. Frontend base web/PWA

El frontend base debe incluir:

- app inicial;
- pantalla simple de inicio;
- layout base;
- vista de estado MVP;
- preparación para dashboard futuro;
- no implementar todavía flujos complejos.

Texto sugerido para la pantalla inicial:

`Gamora Bot MVP — Base técnica inicial`

## 10. Guardrails base obligatorios

Aunque MVP 0 no implemente lógica completa, debe dejar estructura explícita para:

- rate limit placeholder;
- límites de IA placeholder;
- límites WhatsApp placeholder;
- circuit breaker manual placeholder;
- logging de consumo placeholder;
- deduplicación placeholder;
- estado bloqueado por guardrail placeholder.

Reglas:

- Ningún flujo futuro debe saltarse Guardrails Service.
- Ninguna llamada futura a API de pago debe quedar sin registro.
- Ningún webhook futuro debe procesarse sin considerar idempotencia.
- Ningún reintento futuro debe quedar sin límite.
- Ningún mensaje futuro debe enviarse sin validar enrolamiento, opt-in y estado WhatsApp.

## 11. Webhook placeholder

MVP 0 debe preparar estructura para webhook, sin conectar todavía a producción:

- ruta placeholder;
- validación futura de verify token;
- recepción futura de eventos;
- registro básico en logs;
- comentario de idempotencia futura;
- no ejecutar lógica de negocio completa.

Regla:

Evento recibido no significa acción ejecutada. En MVP 0 el webhook debe ser una base de entrada controlada, no un flujo productivo.

## 12. OpenAI / IA placeholder

MVP 0 debe preparar servicio vacío o mock controlado para:

- interpretar intención;
- responder estructura dummy;
- registrar uso futuro;
- aplicar límites futuros;
- permitir fallback futuro a menú guiado.

Regla:

No llamar OpenAI real en MVP 0, salvo que una fase posterior lo configure explícitamente con autorización y guardrails.

No consumir tokens reales en MVP 0.

## 13. WhatsApp placeholder

MVP 0 debe preparar servicio vacío o mock controlado para:

- enviar mensaje;
- recibir evento;
- registrar payload;
- validar estructura futura;
- preparar medición de consumo futuro.

Regla:

No enviar mensajes reales en MVP 0, salvo configuración explícita futura con autorización.

No consumir mensajes reales en MVP 0.

No usar WhatsApp Web ni alternativas no oficiales.

## 14. Documentación README

El README debe incluir:

- propósito del repo;
- stack;
- instalación;
- variables de entorno;
- scripts;
- cómo levantar backend;
- cómo levantar frontend;
- cómo correr pruebas;
- estado de MVP 0;
- qué está fuera de alcance;
- advertencia de no usar credenciales reales en desarrollo.

Debe explicar de forma clara cuándo usar `npm` y cuándo usar `npm.cmd` en Windows.

## 15. Scripts mínimos

Incluir scripts sugeridos:

- install;
- dev;
- build;
- test;
- lint;
- prisma generate;
- prisma migrate dev, si aplica posteriormente.

Considerar que en PowerShell puede requerirse `npm.cmd`.

Los scripts deben permitir validar MVP 0 sin Docker, sin PostgreSQL local activo y sin credenciales reales.

## 16. Pruebas mínimas

MVP 0 debe incluir pruebas o validaciones básicas:

- backend levanta;
- `/health` responde;
- frontend compila;
- variables requeridas se validan o avisan;
- no se requieren credenciales reales para correr modo local;
- servicios placeholder no ejecutan llamadas reales;
- guardrails placeholder puede importarse o inicializarse sin error.

## 17. Criterios de aceptación

MVP 0 se considera aceptable si:

- El repositorio se puede instalar.
- Backend levanta en local.
- Frontend levanta en local.
- `/health` responde.
- `.env.example` existe sin secretos reales.
- README explica arranque.
- Prisma queda preparado.
- Servicios placeholder existen.
- Guardrails placeholder existe.
- No hay llamadas reales a WhatsApp/OpenAI por defecto.
- No se implementan funcionalidades fuera de MVP 0.
- No se requiere Docker.
- No se requiere PostgreSQL real corriendo en MVP 0.
- No se requiere pnpm.
- La estructura deja claro dónde crecerá MVP 1.

## 18. Restricciones para Codex

Codex debe respetar estas restricciones:

- No crear integraciones reales todavía.
- No usar credenciales reales.
- No instalar Docker.
- No instalar PostgreSQL.
- No instalar pnpm.
- No implementar flujos funcionales completos todavía.
- No crear hacks con WhatsApp Web.
- No usar SQLite como decisión principal del MVP real.
- No omitir guardrails.
- No avanzar a MVP 1 sin validación.
- No hacer llamadas reales a APIs de pago.
- No crear motor completo de compromisos.
- No implementar Mina Mercedes ni Sunworks.
- No modificar documentación estratégica salvo que se le autorice explícitamente.

## 19. Resultado esperado de Codex

Al terminar la ejecución futura de este prompt, Codex deberá entregar:

- resumen de archivos creados/modificados;
- comandos para instalar/ejecutar;
- validaciones realizadas;
- errores o pendientes;
- confirmación de que no se usaron credenciales reales;
- confirmación de que no se hicieron llamadas reales a APIs de pago;
- confirmación de que no se instaló Docker/PostgreSQL/pnpm;
- confirmación de que no se avanzó a MVP 1;
- recomendación del siguiente paso técnico.

## 20. Cierre del prompt

MVP 0 debe ser una base limpia, segura y extensible para construir el motor real de Gamora Bot en fases posteriores.

La prioridad no es demostrar funcionalidades complejas todavía. La prioridad es dejar el repositorio listo para crecer con orden: backend, web/PWA, Prisma, servicios placeholder, guardrails, logs, documentación y pruebas mínimas, sin consumir APIs de pago ni usar credenciales reales.
