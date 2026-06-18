# Decisión de Persistencia MVP 1 — Gamora Bot

## Versión
v0.1

## Estatus
Borrador inicial para validación de Luis Felipe García Duarte

## 1. Objetivo del documento

Este documento registra la decisión técnica de usar PostgreSQL real desde MVP 1 para el motor inicial de compromisos de Gamora Bot.

La decisión busca que el desarrollo del motor funcional trabaje desde el inicio con persistencia real, estados reales, migraciones y una base local de desarrollo, evitando una etapa intermedia basada en almacenamiento mock o SQLite que después tendría que reconvertirse.

## 2. Decisión

MVP 1 usará PostgreSQL real desde el inicio como motor de persistencia para el motor inicial de compromisos.

No se usará SQLite como sustituto funcional ni almacenamiento mock para la lógica principal de compromisos.

## 3. Razón

El motor de compromisos requiere persistencia real porque deberá manejar:

- estados;
- transiciones;
- bitácora;
- usuarios;
- workspaces;
- evidencias;
- logs;
- guardrails.

Usar PostgreSQL desde el inicio evita reconstrucción posterior y permite que MVP 1 se comporte lo más parecido posible al MVP final.

Prisma ya quedó preparado conceptualmente en MVP 0, por lo que la siguiente fase técnica puede avanzar hacia modelos reales, migraciones y pruebas con base local.

## 4. Alcance para desarrollo local

Para desarrollo local/MVP 1:

- PostgreSQL local será usado para desarrollo.
- No se usará Docker por ahora.
- La base local deberá tener una base de datos de desarrollo.
- Las credenciales serán locales y no productivas.
- No se guardará `.env` real en repositorio.
- `.env.example` conservará placeholders.

La base local no debe considerarse ambiente de piloto, staging ni producción.

## 5. Alcance para staging y producción

Staging y producción deberán usar PostgreSQL administrado más adelante.

Reglas futuras:

- No se usará la base local para pilotos reales.
- Las credenciales de staging/producción deberán separarse.
- Backups, monitoreo y seguridad se definirán antes del piloto real.
- La estrategia de hosting y base administrada deberá documentarse antes de exponer clientes reales.

## 6. Impacto en MVP 1

MVP 1 deberá contemplar:

- modelos Prisma iniciales reales;
- migraciones;
- conexión a PostgreSQL local;
- seed de datos demo/controlados;
- persistencia de workspaces;
- persistencia de usuarios;
- persistencia de compromisos;
- persistencia de estados;
- persistencia de bitácora básica;
- persistencia de guardrails básicos si aplica;
- pruebas con base real.

Esto implica que MVP 1 ya no deberá tratar la base de datos como un placeholder puramente documental.

## 7. Riesgos

Riesgos identificados:

- instalación local incorrecta;
- problemas de PATH con `psql`;
- contraseña local olvidada;
- conflicto de puerto 5432;
- diferencias futuras entre local y staging;
- exposición accidental de credenciales;
- migraciones mal ejecutadas;
- dependencia excesiva del ambiente local.

## 8. Mitigaciones

Mitigaciones recomendadas:

- no usar credenciales reales;
- documentar instalación;
- usar `.env` local fuera de Git;
- mantener `.env.example` sin secretos;
- usar Prisma migrations;
- no instalar Docker;
- validar `psql --version`;
- documentar usuario, base y puerto local sin exponer contraseña;
- crear scripts claros;
- validar con pruebas antes de MVP 1.

## 9. Pendientes antes de instalar PostgreSQL

Antes de instalar PostgreSQL local, falta confirmar:

- método de instalación;
- versión recomendada;
- usuario local;
- nombre de base local;
- puerto;
- si se instala pgAdmin o solo herramientas de línea de comando;
- si se usará contraseña local simple para desarrollo;
- si se actualizará `.env.example`.

Diagnóstico inicial:

- `psql --version`: no disponible.
- `postgres --version`: no disponible.
- `where psql`: no encontró ejecutable.
- `where postgres`: no encontró ejecutable.
- `Get-Service *postgres*`: no mostró servicios PostgreSQL instalados.
- `winget search PostgreSQL --source winget`: muestra candidatos disponibles, incluyendo `PostgreSQL.PostgreSQL.17` y `PostgreSQL.PostgreSQL.18`.

No se instaló PostgreSQL durante este diagnóstico.

## 10. Cierre

Esta decisión fortalece MVP 1 porque permitirá construir el motor de compromisos sobre persistencia real desde el inicio.

La prioridad será preparar PostgreSQL local de forma controlada, sin Docker, sin credenciales productivas y sin guardar secretos en el repositorio. Con esta base, MVP 1 podrá avanzar hacia modelos Prisma, migraciones y pruebas con datos reales de desarrollo.

## Resultado de preparación PostgreSQL local

PostgreSQL 17 fue seleccionado para desarrollo local de MVP 1.

Razón operativa:

- PostgreSQL 17 es moderno y suficientemente estable para desarrollo local.
- PostgreSQL 18 existe, pero para el primer entorno local se prefiere PostgreSQL 17 por madurez y menor riesgo operativo.
- PostgreSQL 19 beta no debe usarse.

Resultado de instalación:

- Método: `winget install --id PostgreSQL.PostgreSQL.17 -e --source winget`.
- Resultado: instalación correcta.
- Versión validada por ruta directa: `PostgreSQL 17.10`.
- Servicio detectado: `postgresql-x64-17`.
- Estado del servicio: `Running`.
- Inicio del servicio: `Automatic`.

Resultado de diagnóstico:

| Validación | Resultado | Observación |
|---|---|---|
| `psql --version` | No reconocido | PATH de la sesión actual no está actualizado. |
| `postgres --version` | No reconocido | PATH de la sesión actual no está actualizado. |
| `where.exe psql` | No encontró archivo | Requiere refrescar PATH o usar ruta directa. |
| `where.exe postgres` | No encontró archivo | Requiere refrescar PATH o usar ruta directa. |
| `Get-Service *postgres*` | Servicio `postgresql-x64-17` en ejecución | PostgreSQL local está instalado y corriendo. |
| Ruta directa `psql.exe --version` | `psql (PostgreSQL) 17.10` | Cliente PostgreSQL validado. |
| Ruta directa `postgres.exe --version` | `postgres (PostgreSQL) 17.10` | Servidor PostgreSQL validado. |

Estado de base `gamora_bot_dev`:

- Estado: creada y validada.
- Usuario usado: `postgres`.
- Puerto esperado: `5432`.
- Validación: `SELECT current_database();` devolvió `gamora_bot_dev`.
- Contraseña: no se capturó, mostró ni documentó.

Pendientes antes de MVP 1:

- Confirmar si se usará el usuario `postgres` o un usuario local específico para Gamora.
- Refrescar PATH o usar ruta directa a `C:\Program Files\PostgreSQL\17\bin`.
- Preparar `.env` local únicamente con autorización explícita y fuera de Git.
- No guardar contraseñas en Obsidian.
- No guardar `.env` real en Git.
- No ejecutar migraciones Prisma hasta que se autorice MVP 1.

## Resultado de reset controlado y base local

Fecha de ejecución: 2026-06-06

Motivo del reset:

La contraseña local del usuario `postgres` no fue aceptada durante la validación inicial.

Resultado:

- Reset controlado: realizado.
- Respaldo de configuración creado antes de modificar `pg_hba.conf`.
- Segundo respaldo creado durante el reintento controlado.
- Autenticación local temporal cambiada a `trust` solo para localhost.
- Reglas remotas no modificadas.
- Contraseña local de `postgres` actualizada por Luis Felipe en consola interactiva.
- `pg_hba.conf` restaurado a `scram-sha-256`.
- Conexión sin contraseña bloqueada nuevamente.
- Conexión con contraseña nueva validada por Luis Felipe.
- Base `gamora_bot_dev` creada.
- Base `gamora_bot_dev` validada con `SELECT current_database();`.

Respaldo principal:

`C:\Program Files\PostgreSQL\17\data\pg_hba.conf.bak_gamora_reset_20260606_200229`

Respaldo de reintento:

`C:\Program Files\PostgreSQL\17\data\pg_hba.conf.bak_gamora_reset_retry_20260606_201158`

Estado seguro final:

- `host all all 127.0.0.1/32 scram-sha-256`
- `host all all ::1/128 scram-sha-256`

Confirmaciones:

- No se documentó contraseña.
- No se creó `.env` real.
- No se modificó el repositorio técnico.
- No se ejecutaron migraciones Prisma.
- No se conectó OpenAI.
- No se conectó Meta/WhatsApp.
- No se instaló Docker.
- No se instaló pnpm.
- No se avanzó a MVP 1.

Pendientes antes de MVP 1:

- Definir si MVP 1 usará temporalmente el usuario local `postgres` o un usuario local específico para Gamora.
- Preparar `.env` local solo con autorización explícita y fuera de Git.
- Ejecutar migraciones Prisma únicamente cuando se autorice MVP 1.
- Mantener `.env.example` sin secretos reales.

## Decisión local temporal: uso de usuario `postgres` para MVP 1

Luis Felipe decidió usar temporalmente el usuario local `postgres` para MVP 1 en ambiente local.

Esta decisión se toma para reducir fricción técnica y avanzar con PostgreSQL real desde el inicio del motor inicial de compromisos.

Alcance de la decisión:

- Aplica únicamente para desarrollo local/MVP 1.
- La computadora local no es ambiente productivo ni staging.
- La base local será usada solo para desarrollo.
- La contraseña no debe documentarse.
- No debe crearse `.env` real todavía sin autorización explícita.
- Esta decisión no aplica para staging ni producción.

Regla para ambientes futuros:

En staging y producción deberá crearse un usuario específico de aplicación con permisos limitados, credenciales separadas, PostgreSQL administrado, backups, monitoreo, control de acceso y rotación de credenciales cuando aplique.

Esta decisión deberá revisarse antes de conectar clientes reales o desplegar fuera del ambiente local.
