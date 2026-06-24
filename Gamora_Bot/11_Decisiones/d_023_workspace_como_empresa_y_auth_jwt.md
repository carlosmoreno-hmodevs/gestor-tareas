# D-023 — Workspace como empresa y autenticación JWT

**Fecha:** 2026-06  
**Estado:** Aceptada  
**Fase:** 6.0 — Fundación de identidad

## Contexto

El frontend modelaba empresas como `Tenant` con usuarios y roles en `localStorage`. El backend Gamora usa `Workspace` en MySQL con `User` y enum `UserRole`. El motor operativo (compromisos) ya filtra por `workspace_id`, pero no había autenticación: cualquier cliente con `X-Workspace-Slug` accedía al workspace.

## Decisión

1. **`Workspace` es la entidad oficial de empresa** en backend y documentación.
2. **`Tenant` del frontend se mapea gradualmente** a `Workspace` vía slug (`tenant-1` → `ferreteria-luisito`). No se elimina `Tenant` en esta fase; se deriva de la sesión autenticada.
3. **MVP: un usuario pertenece a un solo workspace** (`users.workspace_id`). Sin membresías multi-empresa hasta fase posterior.
4. **`UserRole` backend es la fuente de verdad inicial:** `admin`, `coordinator`, `assignee`, `viewer`.
5. **Permisos granulares del frontend** (`tasks.*`, `admin.*`, etc.) quedan **fuera del MVP** o se mapearán en Fase 6.5+.
6. **Autenticación:** JWT con `userId`, `workspaceId` y `role` en el payload. Rutas `/api/*` protegidas excepto login, health y webhooks WhatsApp.

## Consecuencias

- El header `X-Workspace-Slug` ya no autoriza por sí solo; debe coincidir con el workspace del token o omitirse.
- Webhooks WhatsApp y healthcheck siguen públicos.
- Recuperación de contraseña y RBAC granular se difieren.

## Referencias

- Fase 6 en `checklist_desarrollo.md`
- `backend/src/modules/auth/`
