# Fase 6 — Fundación de identidad (6.0–6.2)

Login real con JWT para dejar de depender de usuarios mock y `X-Workspace-Slug` como único control de acceso.

## Credenciales demo (local)

Tras `npm run db:seed`:

| Usuario | Correo | Rol | Contraseña |
|---------|--------|-----|------------|
| Luisito | `admin@luisito.test` | admin | `GamoraDemo123!` |
| Carla | `coordinator@luisito.test` | coordinator | `GamoraDemo123!` |
| Panchito | `panchito@luisito.test` | assignee | `GamoraDemo123!` |
| Vicente | `viewer@luisito.test` | viewer | `GamoraDemo123!` |

## Iniciar sesión en local

1. `docker compose up -d` + backend `npm run dev` + frontend `ng serve`
2. Abrir `http://localhost:4200` → redirige a `/login`
3. Ingresar credenciales demo
4. Tras login → tablero operativo (`tenant-1` / Ferretería Luisito)

## API — autenticación

### Login

```bash
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@luisito.test\",\"password\":\"GamoraDemo123!\"}"
```

Respuesta: `{ "data": { "token": "...", "user": {...}, "workspace": {...} } }`

### Sesión actual

```bash
curl -s http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TU_TOKEN"
```

Sin token → **401** `Debes iniciar sesión.`

### Logout (stateless)

```bash
curl -s -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer TU_TOKEN"
```

El cliente debe eliminar el token local.

## Rutas públicas vs protegidas

| Ruta | Auth |
|------|------|
| `POST /api/auth/login` | No |
| `GET /health`, `GET /api/health` | No |
| `GET/POST /api/webhooks/whatsapp` | No (mock Meta) |
| Resto de `/api/*` | **Bearer JWT obligatorio** |

`X-Workspace-Slug` ya **no autoriza** solo. Si se envía, debe coincidir con el workspace del token; si no, **403**.

## Variables `.env`

```
JWT_SECRET=cambiar-en-produccion-min-32-caracteres-aleatorios
JWT_EXPIRES_IN=8h
```

## Frontend

- Token en `localStorage` (`gamora.auth.session`)
- `authInterceptor` añade `Authorization: Bearer`
- `authGuard` protege rutas de la app
- `CommitmentApiService` ya no envía slug manual

## Compatibilidad curl (simulador)

Obtener token y llamar inbound:

```bash
# PowerShell
$login = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method POST -ContentType application/json -Body '{"email":"admin@luisito.test","password":"GamoraDemo123!"}'
$token = $login.data.token
Invoke-RestMethod -Uri http://localhost:3000/api/conversations/inbound -Method POST -ContentType application/json -Headers @{Authorization="Bearer $token"} -Body '{"channel_contact_external_id":"luisito-sim","message_type":"text","text_body":"Dile a Panchito que revise el inventario.","external_message_id":"sim-auth-001"}'
```

## Referencias

- ADR: [`11_Decisiones/d_023_workspace_como_empresa_y_auth_jwt.md`](../11_Decisiones/d_023_workspace_como_empresa_y_auth_jwt.md)

---

# Fase 6.3 — Empresa / Workspace

## API

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/api/workspaces/current` | cualquier autenticado | Datos del workspace del JWT |
| PATCH | `/api/workspaces/current` | **admin** | Editar `name`, `settings` (timezone, etc.) |

`slug` es solo lectura. `status` `inactive` bloquea login y acceso API.

## UI

- `/admin/empresa` — formulario conectado a la API (sin localStorage)

---

# Fase 6.4 — Usuarios reales

## API

| Método | Ruta | Rol |
|--------|------|-----|
| GET | `/api/users` | admin |
| POST | `/api/users` | admin |
| GET | `/api/users/:id` | admin |
| PATCH | `/api/users/:id` | admin |
| PATCH | `/api/users/:id/status` | admin |
| GET | `/api/users/me` | cualquier autenticado |
| PATCH | `/api/users/me` | cualquier autenticado |
| POST | `/api/users/me/password` | cualquier autenticado |

Al crear usuario (`POST /api/users`):
- Email único **por workspace**
- Contraseña temporal por defecto: **`GamoraTemp123!`** (en `meta.temporary_password`)
- Se crea **`Contact`** vinculado para roles operativos (`admin`, `coordinator`, `assignee`)

## Relación User ↔ Contact

```
User (login, rol)  ──1:N──▶  Contact (responsable en compromisos)
```

- `Contact.userId` apunta al `User`
- `Contact.displayName` se usa en el parser y asignaciones Gamora
- `viewer` no recibe contacto por defecto

## UI

- `/admin/usuarios` — lista, alta, edición, activar/desactivar (MySQL)
- `/perfil` — nombre, correo, rol, empresa; cambio de contraseña

## Pruebas rápidas

```powershell
$login = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method POST -ContentType application/json -Body '{"email":"admin@luisito.test","password":"GamoraDemo123!"}'
$h = @{ Authorization = "Bearer $($login.data.token)" }
Invoke-RestMethod -Uri http://localhost:3000/api/users -Headers $h
```

Usuario **assignee** que llame `GET /api/users` → **403**.

Usuario creado puede iniciar sesión con la contraseña temporal. Usuario **inactive** no puede iniciar sesión.

---

# Fase 6.5 — Backend roles y permisos (RBAC operativo)

## Módulo

`backend/src/modules/auth/commitment.permissions.ts`

Helpers principales:

| Helper | Uso |
|--------|-----|
| `requireRole(...)` | Middleware para rutas admin |
| `loadAuthActor(req)` | userId, workspaceId, role, contactId |
| `canViewCommitment` | Lectura de compromiso |
| `canCreateCommitment` | Alta de compromisos |
| `canTransitionCommitment` | Cambio de estado |
| `canUploadEvidence` | Subida de evidencia |
| `listScopeWhere` | Filtro de listado por rol |

## Matriz MVP

| Rol | Ver compromisos | Crear/asignar | Operar (aceptar, evidencia) | Revisar/cerrar/corrección | Admin empresa/usuarios |
|-----|-----------------|---------------|-----------------------------|---------------------------|------------------------|
| **admin** | Todo el workspace | Sí | Sí | Sí | Sí |
| **coordinator** | Todo el workspace | Sí | No | Sí | No |
| **assignee** | Solo asignados a su Contact | No | Sí (propios) | No | No |
| **viewer** | Todo el workspace (lectura) | No | No | No | No |

## Endpoints protegidos

- `GET /api/commitments` — scope por rol (`assignee` solo ve los suyos)
- `GET/PATCH /api/commitments/:id` — `assertCanView` / `assertCanUpdate`
- `PATCH /api/commitments/:id/status` — `assertCanTransition`
- `GET/POST /api/commitments/:id/evidence` — view / upload según rol

## Respuestas

| Código | Mensaje típico |
|--------|----------------|
| 401 | `Debes iniciar sesión.` |
| 403 | `No tienes permiso para realizar esta acción.` |
| 404 | `Compromiso no encontrado.` (cuando no hay acceso o no existe) |

## Pruebas rápidas (PowerShell)

```powershell
# Assignee no puede cerrar
$login = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method POST -ContentType application/json -Body '{"email":"panchito@luisito.test","password":"GamoraDemo123!"}'
$h = @{ Authorization = "Bearer $($login.data.token)" }
# PATCH status closed → 403

# Coordinator no administra usuarios
$coord = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method POST -ContentType application/json -Body '{"email":"coordinator@luisito.test","password":"GamoraDemo123!"}'
$hc = @{ Authorization = "Bearer $($coord.data.token)" }
Invoke-RestMethod -Uri http://localhost:3000/api/users -Headers $hc  # → 403
```

---

# Fase 6.6 — RBAC frontend

## PermissionService

`frontend/src/app/core/auth/permission.service.ts`

- Rol desde `/api/auth/me` vía `AuthService` (sin mock en localStorage)
- Filtra acciones Gamora en `GamoraCommitmentActionsComponent`
- Política de evidencia en detalle de tarea
- Menú **Administración** solo visible para `admin`

## Criterios UI

| Rol | Menú admin | Acciones compromiso |
|-----|------------|---------------------|
| admin | Sí | Todas |
| coordinator | No | Revisión/cierre/cancelar (no operar ni subir evidencia) |
| assignee | No | Solo en compromisos asignados a su Contact |
| viewer | No | Solo lectura |

El backend es la fuente de verdad; la UI oculta o deshabilita acciones y muestra mensajes cuando el rol no permite operar.

## Pruebas manuales

1. Login con cada usuario demo (4 roles)
2. Verificar lista de compromisos (assignee solo ve los suyos)
3. Intentar `/admin/usuarios` con coordinator/assignee/viewer → bloqueado
4. Intentar cerrar compromiso como assignee → 403 API + sin botón en UI
5. Viewer: sin botones de acción ni subida de evidencia
6. Simulador y tablero siguen operativos con JWT

---

# Fase 6.7 — Configuración operativa (mínima)

Campos en `workspace.settingsJson`, editables en `/admin/empresa` (solo admin):

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `timezone` | string | Zona horaria |
| `evidenceRequiredDefault` | boolean | Evidencia obligatoria por defecto |
| `defaultDueDays` | number (opcional) | Días para vencimiento por defecto |
| `allowAssigneeEvidenceAfterReview` | boolean | Permitir subir evidencia tras enviar a revisión |

API: `PATCH /api/workspaces/current` con `settings: { ... }` (merge sobre JSON existente).

---

# Fase 6.8 — Responsables / contactos operativos

## API `/api/contacts`

| Método | Ruta | Rol |
|--------|------|-----|
| GET | `/api/contacts` | admin/coordinator/viewer: todos; assignee: solo el suyo |
| GET | `/api/contacts/me` | contacto del usuario autenticado |
| GET | `/api/contacts/:id` | según scope |
| POST | `/api/contacts` | admin, coordinator |
| PATCH | `/api/contacts/:id` | admin, coordinator |
| PATCH | `/api/contacts/:id/status` | admin, coordinator |

Query: `?status=active|inactive`, `?for_assignment=true` (solo activos).

## Campos Contact

`displayName`, `phoneNumber`, `email`, `position`, `team`, `status`, `userId` (opcional).

## Reglas User ↔ Contact

1. Al crear usuario operativo (`admin`, `coordinator`, `assignee`) → se crea `Contact` automáticamente.
2. Al editar `displayName` del usuario → se sincroniza el `Contact` vinculado.
3. Al editar `displayName` del contacto con `userId` → también actualiza el `User`.
4. Cambiar rol a `viewer` **no** elimina el contacto (compromisos históricos intactos).
5. Cambiar rol de `viewer` a operativo **sin** contacto → se crea contacto en el próximo `PATCH` de usuario.
6. Contactos externos (ej. Marco) se crean en `/admin/responsables` sin `userId`.
7. No se puede asignar compromiso a contacto `inactive`; históricos siguen visibles.

## UI

- `/admin/responsables` — lista, alta, edición, activar/desactivar
- Coordinador: acceso a responsables (no a usuarios/empresa)
- Creación manual de compromiso en Tareas: selector de responsables activos (`POST /api/commitments`)
- Simulador: canal del contacto del usuario (`GET /api/contacts/me` → `simulatorExternalId`)

## Pruebas rápidas

```powershell
$login = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method POST -ContentType application/json -Body '{"email":"admin@luisito.test","password":"GamoraDemo123!"}'
$h = @{ Authorization = "Bearer $($login.data.token)" }
Invoke-RestMethod -Uri http://localhost:3000/api/contacts -Headers $h
```

---

# Fase 6.10 — Dashboard operativo y filtros API

## Endpoints

### Resumen KPIs

`GET /api/commitments/summary` — respeta RBAC (`listScopeWhere`).

Respuesta (`data`):

| Campo | Descripción |
|-------|-------------|
| `total` | Total compromisos visibles |
| `active` | No cerrados ni cancelados |
| `byStatus` | Conteo por estado Gamora |
| `overdue` | Vencidas y abiertas |
| `dueWithin48h` | Vencen en 48 h |
| `unassigned` | Sin responsable |
| `byAssignee` | Solo admin/coordinator/viewer |
| `byPriority` | Vacío (sin campo en schema aún) |

### Lista con filtros

`GET /api/commitments` — sin query params devuelve `{ data: [...] }` (compatibilidad).

Con filtros o paginación devuelve:

```json
{
  "data": {
    "items": [],
    "total": 0,
    "page": 1,
    "pageSize": 20
  }
}
```

**Query params:** `status` (comma-separated), `assigneeContactId`, `priority` (sin efecto hasta migración), `dueFrom`, `dueTo`, `overdue=true`, `dueWithin48h=true`, `unassigned=true`, `search`, `page`, `pageSize`.

**Reglas RBAC:**
- `assignee` solo ve su scope; `assigneeContactId` ajeno se ignora (usa su `contactId`)
- Filtros no pueden saltar el scope del rol

## Frontend

- **Tablero** (`/tablero-operativo`): KPIs desde `/api/commitments/summary` en modo Gamora
- **Tareas**: filtros conectados a query params API; paginación en vista lista
- KPIs de la franja superior usan `gamoraSummary` cuando aplica

## Pruebas rápidas

```powershell
$h = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri http://localhost:3000/api/commitments/summary -Headers $h
Invoke-RestMethod -Uri "http://localhost:3000/api/commitments?status=assigned&overdue=true&page=1&pageSize=10" -Headers $h
```

Comparar `summary.total` entre `admin@luisito.test` y `panchito@luisito.test` — assignee debe ser menor o igual.

---

# Fase 6.11 — UI operativa de compromisos + notificaciones MVP

## Enfoque visual (corrección)

Se **conserva el layout original** de Tareas (sidebar, KPI cards, tarjetas de lista, calendario y tablero) con ajustes de limpieza:

- Simulador **colapsado por defecto** (botón en toolbar)
- Filtros legacy ocultos en modo Gamora (proyecto, prioridad sidebar, exportar)
- Calendario y tablero conectados al backend (`hasDueDate`, Kanban Gamora)
- **Nuevo compromiso** → `/tareas/nueva` (formulario completo, no panel mínimo)

## Backend — Notificaciones internas

Tabla `notifications` (workspace-scoped, por usuario).

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/notifications` | Últimas notificaciones del usuario |
| `GET /api/notifications/unread-count` | Contador no leídas |
| `PATCH /api/notifications/:id/read` | Marcar una como leída |
| `PATCH /api/notifications/read-all` | Marcar todas |

**Triggers MVP:**
- Asignación de compromiso → usuario vinculado al contacto
- Evidencia subida → admin/coordinator
- Corrección solicitada → assignee
- Compromiso cerrado → assignee

## Frontend

### Vista Tareas (modo Gamora)

Layout original conservado (sidebar, KPI cards, tarjetas, calendario, tablero Gamora).

### Header global (modo Gamora)

- Buscador global → `/api/commitments?search=` + dropdown; Enter → `/tareas?search=`
- Campanita con badge numérico y dropdown (~360px): título, mensaje y fecha en líneas separadas; punto azul en no leídas; “Marcar todas”
- **Notificaciones de escritorio** (`BrowserNotificationService` + Web Notifications API):
  - Activación manual desde el footer del dropdown (no pide permiso al cargar la app)
  - Polling cada 45s + refresh tras acciones que generan notificaciones
  - Cursor en `localStorage` por usuario — no dispara popups de notificaciones antiguas al iniciar sesión
  - Clic en popup del SO → enfoca ventana y navega al compromiso
  - En producción requiere HTTPS; en localhost funciona en Chrome/Edge
- Ocultos: selector org legacy, badge “Modo: Normal”

## Pruebas rápidas

```powershell
$h = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri http://localhost:3000/api/notifications/unread-count -Headers $h
Invoke-RestMethod -Uri http://localhost:3000/api/notifications -Headers $h
```

Validar en UI: Lista/Calendario/Tablero con admin; assignee solo ve lo suyo; buscador y notificaciones funcionales.

### Probar notificaciones (flujo manual)

1. Login **admin** → `/tareas/nueva` → crear compromiso asignado a **Panchito**
2. Logout → login **panchito@luisito.test** → campanita debe mostrar contador ≥ 1
3. Panchito sube evidencia en detalle → logout
4. Login **coordinator** o **admin** → notificación de evidencia enviada
5. Coordinator solicita corrección → login Panchito → notificación de corrección
6. Admin cierra → Panchito recibe notificación de cierre

**Notificaciones de escritorio:** en el dropdown, clic en “Activar notificaciones de escritorio”. Luego, con otra sesión/usuario, genera una notificación nueva — debe aparecer popup del navegador (solo notificaciones posteriores al baseline de sesión).

**Nota:** Admin no ve las notificaciones de Panchito (cada usuario solo las suyas). Seed incluye mensaje `demo_welcome` para admin y panchito tras `npm run db:seed`.

