# Diseño: SaaS Multi-Tenant con Jerarquías Organizacionales

> Documento de arquitectura para preparar el gestor de tareas como SaaS multi-empresa (multi-tenant) sin refactor posterior.

---

## 1. Diagrama de Datos (ERD conceptual)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           CAPA TENANCY (Cliente que contrata)                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌──────────────┐         ┌──────────────────┐         ┌────────────────────┐     │
│   │   Tenant     │         │   TenantUser     │         │   CurrentSession   │     │
│   ├──────────────┤         ├──────────────────┤         ├────────────────────┤     │
│   │ id           │◄────────│ tenantId         │         │ tenantId           │     │
│   │ name         │         │ userId           │         │ userId             │     │
│   │ slug         │         │ globalRole       │         │ (en memoria/ctx)   │     │
│   │ logoUrl?     │         │   OWNER          │         └────────────────────┘     │
│   │ theme?       │         │   TENANT_ADMIN   │                                     │
│   └──────────────┘         │   MEMBER         │                                     │
│                            │   VIEWER         │                                     │
│                            └──────────────────┘                                     │
│                                    │                                                │
│                                    ▼                                                │
│                            User (AdminUser) - existe en Admin                        │
│                            pero visible solo si está en TenantUser del tenant       │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    CAPA ORG TREE (Estructura interna del tenant)                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐   │
│   │  OrgUnitType    │         │     OrgUnit      │         │UserOrgMembership │   │
│   ├─────────────────┤         ├──────────────────┤         ├──────────────────┤   │
│   │ id              │         │ id               │         │ id               │   │
│   │ tenantId        │◄────────│ tenantId         │         │ tenantId         │   │
│   │ key             │         │ parentId?        │◄─┐      │ userId           │   │
│   │   GROUP         │         │ typeKey          │──┘      │ orgUnitId        │   │
│   │   COMPANY       │         │ name             │◄────────│ localRole?       │   │
│   │   BU            │         │ code?            │         └──────────────────┘   │
│   │   REGION        │         │ isActive         │                                 │
│   │   DISTRICT      │         └──────────────────┘                                 │
│   │   STORE         │                  │                                            │
│   │   DEPARTMENT    │                  │ parentId → self-reference                  │
│   │   (custom...)   │                  ▼                                            │
│   └─────────────────┘         [ árbol jerárquico ]                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    CAPA WORK (Iniciativas / Proyectos / Tareas)                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐  │
│   │  Initiative (futuro)│     │      Project        │     │        Task         │  │
│   ├─────────────────────┤     ├─────────────────────┤     ├─────────────────────┤  │
│   │ id                  │     │ id                  │     │ id                  │  │
│   │ tenantId     ★      │     │ tenantId     ★      │     │ tenantId     ★      │  │
│   │ name                │     │ primaryOrgUnitId? ★ │     │ orgUnitId?    ★     │  │
│   │ initiativeScope[]   │     │ projectScope[]? ★   │     │ projectId?          │  │
│   └─────────────────────┘     │ ...resto igual      │     │ ...resto igual      │  │
│                               └─────────────────────┘     └─────────────────────┘  │
│                                         │                            │              │
│                                         └────────────────────────────┘              │
│                                    Task hereda scope de Project si no tiene         │
│                                                                                     │
│   ┌─────────────────────┐                                                           │
│   │   ProjectScope      │ (opcional, para INCLUDE/EXCLUDE multi-unidad)             │
│   ├─────────────────────┤                                                           │
│   │ projectId           │                                                           │
│   │ orgUnitId           │                                                           │
│   │ mode: INCLUDE|EXCLUDE│                                                          │
│   └─────────────────────┘                                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘

★ = campos nuevos o modificados
```

---

## 2. Relaciones Resumidas

| Entidad | Relación | Descripción |
|---------|----------|-------------|
| Tenant | 1:N TenantUser | Un tenant tiene muchos usuarios asignados |
| TenantUser | N:1 User (AdminUser) | Usuario puede estar en varios tenants |
| OrgUnitType | 1:N OrgUnit | Define tipos (REGION, STORE, etc.) por tenant |
| OrgUnit | self-reference | parentId → árbol jerárquico |
| OrgUnit | 1:N UserOrgMembership | Usuarios asignados a unidades |
| Project | N:1 Tenant | Siempre pertenece a un tenant |
| Project | N:1 OrgUnit? | primaryOrgUnitId = scope principal |
| Task | N:1 Tenant | Siempre pertenece a un tenant |
| Task | N:1 OrgUnit? | scope; hereda de project si vacío |
| Task | N:1 Project? | ya existe |

---

## 3. Estructura de Archivos / Folders

```
frontend/src/app/
├── core/
│   ├── data/
│   │   ├── admin-initial.ts           # existente (añadir tenantId a users/roles si aplica)
│   │   ├── projects-initial.ts        # existente (añadir tenantId)
│   │   ├── dummy-data.ts              # existente (añadir tenantId a TASKS)
│   │   ├── tenant-initial.ts          # NUEVO: tenants dummy + TenantUser
│   │   └── org-initial.ts             # NUEVO: OrgUnitType + OrgUnit dummy por tenant
│   │
│   ├── guards/
│   │   ├── admin.guard.ts             # existente (ajustar: usar globalRole)
│   │   └── tenant.guard.ts            # NUEVO: exigir tenant seleccionado
│   │
│   ├── services/
│   │   ├── tenant-context.service.ts  # NUEVO: CurrentSession, tenant$, setTenant, getTenants
│   │   ├── org.service.ts             # NUEVO: getOrgTree, CRUD org units, assignUser
│   │   ├── current-user.service.ts    # existente (ajustar: filtrar por tenant)
│   │   ├── admin.service.ts           # existente (ajustar: tenant-aware users/roles)
│   │   ├── project.service.ts         # existente (ajustar: filtrar por tenant + org)
│   │   ├── task.service.ts            # existente (ajustar: filtrar por tenant + org)
│   │   ├── data.service.ts            # existente (ajustar: delegar a tenant-aware)
│   │   └── offline-snapshot.service.ts# existente (ajustar: keys por tenant)
│   │
│   └── layout/
│       └── shell/
│           ├── shell.component.ts
│           ├── shell.component.html   # añadir Tenant Switcher + Context Selector
│           └── shell.component.scss
│
├── shared/
│   ├── models/
│   │   ├── tenant.model.ts            # NUEVO: Tenant, TenantUser, GlobalRole, CurrentSession
│   │   ├── org.model.ts               # NUEVO: OrgUnitType, OrgUnit, UserOrgMembership
│   │   ├── project.model.ts           # existente (+ tenantId, primaryOrgUnitId, projectScope?)
│   │   ├── task.model.ts              # existente (+ tenantId, orgUnitId)
│   │   ├── admin.model.ts             # existente (AdminUser sin tenantId; TenantUser lo resuelve)
│   │   └── index.ts                   # exportar nuevos
│   │
│   └── components/
│       ├── tenant-switcher/           # NUEVO: dropdown en topbar
│       │   ├── tenant-switcher.component.ts
│       │   ├── tenant-switcher.component.html
│       │   └── tenant-switcher.component.scss
│       └── context-selector/          # NUEVO: scope All / [org unit]
│           ├── context-selector.component.ts
│           ├── context-selector.component.html
│           └── context-selector.component.scss
│
├── features/
│   ├── admin/
│   │   ├── admin-layout/
│   │   ├── admin-users/
│   │   ├── admin-organization/        # NUEVO: Org Tree + CRUD
│   │   │   ├── admin-organization.component.ts
│   │   │   ├── admin-organization.component.html
│   │   │   └── admin-organization.component.scss
│   │   └── ...
│   ├── tenant-select/                 # NUEVO: pantalla "Select tenant" (demo)
│   │   ├── tenant-select.component.ts
│   │   ├── tenant-select.component.html
│   │   └── tenant-select.component.scss
│   └── ...
│
└── app.routes.ts                      # añadir TenantGuard, ruta /select-tenant
```

---

## 4. Persistencia localStorage (por tenant)

| Key | Descripción |
|-----|-------------|
| `ctx.currentTenantId` | Tenant seleccionado actualmente |
| `ctx.{tenantId}.orgUnitId` | Contexto org seleccionado por tenant (null = All) |
| `gestor-tareas:snapshot:tasks.{tenantId}` | Tasks del tenant |
| `gestor-tareas:snapshot:projects.{tenantId}` | Projects del tenant |
| `gestor-tareas:snapshot:admin.{tenantId}` | Admin snapshot por tenant (opcional; puede ser global) |

**Nota:** Admin (users, roles, categories) puede ser:
- **Opción A:** Global (un solo conjunto; TenantUser filtra qué usuarios pertenecen a qué tenant)
- **Opción B:** Por tenant (cada tenant tiene sus users/roles/cats)

Para MVP dummy: **Opción A** es más simple. AdminUser sigue siendo global; TenantUser indica en qué tenants está cada user.

---

## 5. Plan de Implementación (6 pasos)

### Paso 1: Modelos + TenantContextService + Tenant Switcher + persistencia
- Crear `tenant.model.ts` (Tenant, TenantUser, GlobalRole, CurrentSession)
- Crear `tenant-initial.ts` (2-3 tenants dummy + TenantUser)
- Crear `TenantContextService` (signals: currentTenant, tenants; setCurrentTenant; persist `ctx.currentTenantId`)
- Crear `TenantSwitcherComponent` (dropdown en topbar)
- Integrar en Shell
- **No rompe:** Si no hay tenant, usar primer tenant por defecto (hasta Paso 6)

### Paso 2: OrgService + Org Tree dummy + Context Selector + persistencia
- Crear `org.model.ts` (OrgUnitType, OrgUnit, UserOrgMembership)
- Crear `org-initial.ts` (tipos + árbol por tenant)
- Crear `OrgService` (getOrgTree, getOrgUnits, getOrgUnitTypes, CRUD mock)
- Crear `ContextSelectorComponent` (All / [org unit]; persist `ctx.{tenantId}.orgUnitId`)
- Crear `OrgContextService` (opcional) o integrar en TenantContextService
- Integrar en Shell

### Paso 3: Project/Task/User services tenant-aware
- Añadir `tenantId` a Project, Task
- Añadir `primaryOrgUnitId?` a Project; `orgUnitId?` a Task
- `OfflineSnapshotService`: keys `snapshot.tasks.{tenantId}`, `snapshot.projects.{tenantId}`
- `ProjectService`: filtrar por tenantId; filtrar por org context si no es All
- `TaskService`: filtrar por tenantId; filtrar por org; createTask set tenantId, heredar orgUnitId
- `DataService`/`AdminService`: getUsers() filtra por TenantUser del tenant actual
- Dummy data: repartir projects/tasks entre tenants

### Paso 4: Admin > Organization (mock CRUD)
- Crear `AdminOrganizationComponent` (vista tree + lista)
- CRUD mock de OrgUnit (add/update/deactivate)
- Ruta `/admin/organization`
- Añadir al menú lateral de admin

### Paso 5: Forms Project/Task con scope opcional
- Project create/edit: campo opcional "Scope" (org unit picker)
- Task create/edit: campo opcional "Scope" (heredable; default desde project)

### Paso 6: Guards (TenantGuard + AdminGuard) + routing
- `TenantGuard`: si no hay tenant → `/select-tenant`
- `TenantSelectComponent`: lista tenants, selecciona uno
- `AdminGuard`: verificar globalRole (OWNER, TENANT_ADMIN)
- Routing: aplicar TenantGuard a rutas principales

---

## 6. Dummy Data de Ejemplo

### Tenants
| id | name | slug |
|----|------|------|
| tenant-1 | Taller Pepito | taller-pepito |
| tenant-2 | Grupo X | grupo-x |

### OrgUnits (por tenant)
- **Taller Pepito:** Región Norte → Tienda Centro → Depto Ventas
- **Grupo X:** Grupo → Empresa A → Región Sur → Tienda 1

### Users
- user-owner, user-1, user-2 en ambos tenants (TenantUser)
- user-3 solo en Taller Pepito
- user-4 solo en Grupo X

### Projects/Tasks
- Repartir entre tenants; algunos con primaryOrgUnitId

---

## 7. Validación Final (Checklist)

- [x] 2 tenants dummy visibles en Tenant Switcher
- [x] Cambiar tenant → proyectos/tareas/usuarios cambian (data separada)
- [x] Context selector filtra por región/tienda (incluye descendientes)
- [x] Admin > Organization permite CRUD de org units
- [x] Todo persiste en localStorage por tenant
- [x] Compilación OK en cada paso
- [x] Catálogos/reglas por tenant
- [x] Snapshots con versionado
- [x] AdminGuard con globalRole (OWNER/TENANT_ADMIN)

---

*Documento creado para guiar la implementación sin refactor posterior.*
