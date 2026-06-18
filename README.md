# gestor-tareas — Gamora Bot

Monorepo con **frontend Angular** (`frontend/`) y **backend Node.js** (`backend/`) para Gamora Bot.

Documentación de producto y arquitectura: carpeta `Gamora_Bot/`.

## Requisitos

- Node.js 20+
- Docker Desktop (MySQL) **o** MySQL 8 local en `localhost:3306`

## Arranque rápido (Fase 1)

```bash
# 1. Base de datos
docker compose up -d

# 2. Backend API (puerto 3000)
cd backend
cp .env.example .env   # si aún no existe
npm install
npm run db:push
npm run db:seed
npm run dev

# 3. Frontend Angular (puerto 4200)
cd ../frontend
npm install
npm start
```

Abrir `http://localhost:4200` con tenant **Ferretería Luisito**. En Tareas verás el panel **Simulador Gamora** para enviar mensajes de texto o usar **Recargar API**.

## Probar sin UI (curl)

**Paso A — enviar instrucción** (Gamora pide confirmación; aún no hay compromiso en tablero):

```bash
curl -X POST http://localhost:3000/api/conversations/inbound \
  -H "Content-Type: application/json" \
  -H "X-Workspace-Slug: ferreteria-luisito" \
  -d "{\"channel_contact_external_id\":\"luisito-sim\",\"message_type\":\"text\",\"text_body\":\"Dile a Panchito que mañana cuente los sacos de cemento de la sucursal Centro y mande foto.\",\"external_message_id\":\"sim-demo-001\"}"
```

**Paso B — confirmar** con `sí` (ahí se crea el compromiso y aparece en tablero):

```bash
curl -X POST http://localhost:3000/api/conversations/inbound \
  -H "Content-Type: application/json" \
  -H "X-Workspace-Slug: ferreteria-luisito" \
  -d "{\"channel_contact_external_id\":\"luisito-sim\",\"message_type\":\"text\",\"text_body\":\"sí\",\"external_message_id\":\"sim-demo-002\"}"
```

## Estructura

| Carpeta | Descripción |
|---------|-------------|
| `frontend/` | Angular — tablero, detalle, UI |
| `backend/` | Express + Prisma + MySQL — API Gamora |
| `Gamora_Bot/` | Plan, arquitectura, checklist |
| `docker-compose.yml` | MySQL 8.4 para desarrollo |

## Nota si Docker no está disponible

Inicia MySQL local con base `gamora_bot_dev`, usuario `gamora` / contraseña `gamora_dev` (o ajusta `backend/.env`) y ejecuta `npm run db:push` + `npm run db:seed`.
