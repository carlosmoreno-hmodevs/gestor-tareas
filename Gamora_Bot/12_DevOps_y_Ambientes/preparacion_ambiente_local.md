# Preparación de Ambiente Local — Gamora Bot

## Versión
v0.1

## Estatus
Diagnóstico actualizado tras instalación autorizada de Git for Windows

## 1. Objetivo del documento

Este documento registra el diagnóstico inicial del ambiente local de Windows donde se preparará el desarrollo del MVP de Gamora Bot.

El objetivo no es instalar herramientas todavía, ni conectar servicios reales, ni crear el repositorio técnico. El objetivo es saber qué ya existe, qué falta y qué decisiones deben tomarse antes de avanzar a Fase 8 — Prompts Codex.

## 2. Alcance del diagnóstico

Este diagnóstico revisa herramientas básicas necesarias para construir posteriormente un MVP real:

- Node.js.
- npm.
- pnpm.
- Git.
- PostgreSQL / psql.
- Docker.
- Visual Studio Code CLI.
- winget.

Se instaló únicamente Git for Windows con autorización explícita de Luis Felipe.

No se conectó OpenAI.

No se conectó Meta / WhatsApp Business API.

No se usaron credenciales reales.

No se creó repositorio técnico.

## 3. Resultado de comandos ejecutados

| Herramienta | Comando ejecutado | Resultado | Estado | Comentario |
|---|---|---|---|---|
| Node.js | `node -v` | `v24.15.0` | Instalado | Node está disponible. La versión es muy reciente; conviene validar compatibilidad con el stack antes de desarrollar. |
| npm | `npm -v` | Bloqueado por política de PowerShell | Instalado, pero bloqueado por alias PowerShell | PowerShell no permite ejecutar `npm.ps1`. |
| npm alternativo | `npm.cmd -v` | `11.12.1` | Instalado | npm funciona usando `npm.cmd`. El problema no es npm, sino la política de ejecución de scripts en PowerShell. |
| pnpm | `pnpm -v` | No reconocido | No instalado o no disponible en PATH | Se podrá instalar después si se decide usar pnpm. No instalar todavía sin autorización. |
| Git | `git --version` | No reconocido en la sesión actual | Instalado, pendiente refrescar PATH en terminal nueva | Git fue instalado con winget, pero PowerShell actual aún no reconoce `git`. |
| Git directo | `& 'C:\Program Files\Git\cmd\git.exe' --version` | `git version 2.54.0.windows.1` | Instalado | Confirma que Git está instalado correctamente en disco. |
| Git winget | `winget list --id Git.Git --source winget` | `Git.Git 2.54.0` | Instalado | Confirma instalación desde winget. |
| Git con PATH refrescado | recargar PATH desde variables de Windows y ejecutar `git --version` / `where.exe git` | `git version 2.54.0.windows.1` / `C:\Program Files\Git\cmd\git.exe` | Instalado y verificable | Confirma que al refrescar PATH, Git queda disponible correctamente. |
| psql | `psql --version` | No reconocido | No instalado o no disponible en PATH | Cliente PostgreSQL no disponible. |
| postgres | `postgres --version` | No reconocido | No instalado o no disponible en PATH | Servidor PostgreSQL local no disponible. |
| Docker | `docker --version` | No reconocido | No instalado o no disponible en PATH | No se instalará Docker por instrucción explícita. |
| VS Code CLI | `code --version` | No reconocido | VS Code CLI no disponible en PATH | Puede estar instalado VS Code, pero el comando `code` no está disponible en terminal. |
| winget | `winget --version` | `v1.28.240` | Instalado | winget está disponible para instalaciones futuras si Luis Felipe lo autoriza. |

## 4. Lectura simple del diagnóstico

El ambiente local tiene una base parcial.

Lo positivo:

- Node.js está instalado.
- npm está instalado.
- winget está instalado.
- Git for Windows quedó instalado.

Lo que falta o debe corregirse:

- La terminal normal actual todavía no reconoce `git`; al refrescar PATH desde Windows dentro del comando, Git sí responde correctamente.
- pnpm no está disponible.
- PostgreSQL no está disponible localmente.
- Docker no está disponible y no debe instalarse por ahora.
- El comando `code` de VS Code no está disponible en terminal.
- PowerShell bloquea `npm.ps1`, aunque `npm.cmd` sí funciona.

En términos simples: la computadora ya puede ejecutar JavaScript/Node y Git ya está instalado. Para trabajar cómodamente con `git` sin ruta manual, conviene cerrar y abrir PowerShell o reiniciar la sesión de Codex para que PATH se refresque de forma natural.

## 5. Herramientas mínimas recomendadas para desarrollo local

Antes de iniciar prompts de código, conviene dejar listo:

- Node.js estable compatible con el stack.
- npm funcionando sin fricción.
- Git.
- Editor de código.
- PostgreSQL local o una base de datos staging administrada.
- `.env.example` para variables sin secretos reales.
- Terminal validada.

Docker no se instalará por ahora.

## 6. Observaciones por herramienta

### Node.js

Node está instalado como `v24.15.0`.

Esto permite ejecutar proyectos modernos en JavaScript/TypeScript, pero es una versión muy reciente. Para desarrollo productivo puede convenir usar una versión LTS si el stack o dependencias lo requieren.

Pendiente:

- Validar si se usará la versión actual o una versión LTS.

### npm

npm está instalado como `11.12.1`, pero `npm -v` falla en PowerShell porque intenta ejecutar `npm.ps1`, y la política de ejecución de scripts lo bloquea.

Mientras no se ajuste esa política, se puede usar:

```powershell
npm.cmd -v
```

Pendiente:

- Decidir si se ajusta la política de ejecución para el usuario actual.
- O usar `npm.cmd` como workaround temporal.

### pnpm

pnpm no está instalado o no está en PATH.

No es bloqueante si el proyecto usa npm, pero puede ser útil si se decide usar pnpm como gestor de paquetes.

Pendiente:

- Decidir si el MVP usará npm o pnpm.

### Git

Git for Windows fue instalado correctamente con winget.

La instalación reportó:

```powershell
Git.Git 2.54.0
```

Y la ruta directa confirmó:

```powershell
git version 2.54.0.windows.1
```

Sin embargo, la sesión actual de PowerShell todavía no reconoce:

```powershell
git --version
```

Esto suele ocurrir porque Windows actualiza el PATH después de la instalación, pero la terminal abierta no refresca esa información automáticamente.

Se hizo una prueba segura recargando PATH desde las variables de Windows dentro del comando. Con esa sesión refrescada, Git respondió correctamente:

```powershell
git version 2.54.0.windows.1
C:\Program Files\Git\cmd\git.exe
```

Esto confirma que Git está bien instalado y que el pendiente es refrescar la terminal normal.

Esto sí es importante antes de crear el repositorio técnico, porque Git será necesario para:

- controlar versiones;
- crear ramas;
- revisar cambios;
- colaborar;
- preparar commits;
- conectar con GitHub/GitLab.

Pendiente:

- Cerrar y abrir una nueva terminal PowerShell.
- Repetir `git --version`.
- Si funciona, Git queda listo para crear el repositorio técnico cuando Luis Felipe lo autorice.
- Si sigue sin funcionar, revisar PATH.

### PostgreSQL

`psql` y `postgres` no están disponibles.

Esto significa que no hay cliente ni servidor PostgreSQL accesible desde terminal.

Para el MVP hay dos caminos:

- instalar PostgreSQL localmente;
- usar una base de datos staging administrada desde el inicio.

Pendiente:

- Decidir si se usará PostgreSQL local o proveedor administrado.

### Docker

Docker no está disponible.

Por instrucción explícita, no se instalará Docker.

Esto significa que el ambiente local deberá funcionar sin contenedores. Si se necesita PostgreSQL, deberá instalarse localmente o usarse una base de datos administrada.

### Visual Studio Code CLI

El comando `code` no está disponible.

Esto puede significar:

- VS Code no está instalado;
- VS Code sí está instalado, pero no está agregado al PATH.

No bloquea totalmente el trabajo, pero conviene tener un editor listo.

Pendiente:

- Validar si VS Code está instalado.
- Si está instalado, agregar comando `code` al PATH si Luis Felipe lo desea.

### winget

winget está instalado como `v1.28.240`.

Esto permite instalar herramientas desde terminal en el futuro, con autorización explícita.

No se usó winget para instalar nada.

## 7. Riesgos si se programa sin preparar esto

Si se inicia código sin corregir o decidir estos puntos, pueden aparecer problemas como:

- No poder crear commits si la terminal no reconoce Git después de reiniciar PowerShell.
- No poder instalar dependencias de forma consistente.
- No poder levantar base de datos local.
- Mezclar pruebas con ambientes reales.
- Usar credenciales de forma insegura.
- No poder reproducir el ambiente en otra máquina.
- Bloqueos por PowerShell al ejecutar scripts.
- Costos inesperados si se conecta OpenAI o WhatsApp sin guardrails.

## 8. Recomendación práctica antes de Fase 8

Antes de generar prompts de código, se recomienda:

1. Decidir gestor de paquetes: npm o pnpm.
2. Reabrir PowerShell y confirmar `git --version`.
3. Decidir PostgreSQL local vs PostgreSQL administrado.
4. Validar editor de código.
5. Definir si se ajustará la política de PowerShell o se usará `npm.cmd`.
6. Crear repositorio técnico solo cuando Git esté listo.
7. Mantener Docker fuera del alcance por ahora.
8. No conectar OpenAI ni WhatsApp hasta tener `.env.example`, guardrails y staging definidos.

## 9. Comandos de diagnóstico ejecutados

Comandos solicitados:

```powershell
node -v
npm -v
pnpm -v
git --version
psql --version
postgres --version
docker --version
code --version
winget --version
```

Comando adicional seguro ejecutado para confirmar npm:

```powershell
npm.cmd -v
```

Comandos autorizados y ejecutados para instalar/verificar Git:

```powershell
winget install --id Git.Git -e --source winget
& 'C:\Program Files\Git\cmd\git.exe' --version
winget list --id Git.Git --source winget
```

Resultado:

- Git instalado correctamente.
- Versión confirmada por ruta directa: `git version 2.54.0.windows.1`.
- Versión confirmada por winget: `Git.Git 2.54.0`.
- `git --version` no funciona en la sesión normal actual.
- `git --version` sí funciona si se refresca PATH desde las variables de Windows.
- Se recomienda cerrar y abrir PowerShell o reiniciar la sesión de Codex antes de crear el repositorio técnico.

Comando seguro usado para simular una sesión con PATH refrescado:

```powershell
$machinePath=[Environment]::GetEnvironmentVariable('Path','Machine')
$userPath=[Environment]::GetEnvironmentVariable('Path','User')
$env:Path="$machinePath;$userPath"
git --version
where.exe git
```

## 10. Comandos útiles para repetir diagnóstico

Luis Felipe puede repetir el diagnóstico en PowerShell con:

```powershell
node -v
npm.cmd -v
pnpm -v
git --version
psql --version
postgres --version
docker --version
code --version
winget --version
```

Si `npm -v` falla pero `npm.cmd -v` funciona, el problema es la política de ejecución de PowerShell, no la instalación de npm.

## 11. Checklist de preparación local

- [x] Node.js instalado.
- [x] npm instalado.
- [x] winget instalado.
- [x] Git instalado.
- [x] Git verificado con PATH refrescado.
- [ ] npm usable directamente como `npm` en PowerShell.
- [ ] Git disponible como `git` en terminal normal después de reabrir PowerShell/Codex.
- [ ] pnpm disponible, si se decide usar.
- [x] PostgreSQL local instalado.
- [ ] PostgreSQL local disponible en PATH como `psql`/`postgres`.
- [x] Base local `gamora_bot_dev` creada y validada.
- [x] Persistencia MVP 1 definida: PostgreSQL real.
- [x] Decisión usuario DB local MVP 1: `postgres` temporal.
- [ ] Usuario específico de aplicación para staging/producción.
- [ ] Editor de código validado.
- [ ] Comando `code` disponible, si se usará VS Code desde terminal.
- [ ] Estrategia de `.env` definida.
- [ ] Repositorio técnico creado.
- [ ] Sin credenciales reales en documentación.

## 12. Estado actual del ambiente

Estado general:

Ambiente parcialmente preparado, con Git instalado y verificado mediante PATH refrescado.

Puede servir para diagnóstico y documentación. Para iniciar desarrollo ordenado del MVP 0 base repositorio, conviene reabrir PowerShell o reiniciar la sesión de Codex para que `git --version` funcione sin ruta manual.

Bloqueantes principales antes de programar:

- Base de datos local o administrada no definida.
- npm bloqueado como comando directo en PowerShell.
- Editor/CLI no confirmado.

No bloqueantes inmediatos:

- Docker no disponible, porque no se instalará por ahora.
- pnpm no disponible, si se decide usar npm.

## 13. Próximo paso recomendado

El siguiente paso recomendado es:

- Cerrar y abrir una nueva terminal PowerShell.
- Ejecutar `git --version`.
- Si funciona, avanzar después a MVP 0 base repositorio cuando Luis Felipe lo autorice.
- Si no funciona, revisar PATH de Git.
- Ajustar PowerShell para npm o usar `npm.cmd`.
- Elegir npm o pnpm.
- Elegir PostgreSQL local o base administrada.
- Confirmar editor de código.

Después de eso se podrá preparar el repositorio técnico base. Aún no se debe avanzar a prompts de código hasta que Luis Felipe autorice explícitamente MVP 0 base repositorio.

## 14. Cierre

Este diagnóstico evita iniciar programación sobre un ambiente incompleto.

Gamora Bot necesitará conectarse a APIs reales, almacenar evidencias, recibir webhooks y medir consumo. Por eso el ambiente local debe prepararse con orden antes de generar código.

Por ahora solo se instaló Git for Windows con autorización explícita. No se instaló Docker, PostgreSQL ni pnpm; no se conectó ningún servicio externo y no se usaron credenciales reales.

## Decisión posterior: PostgreSQL real para MVP 1

Luis Felipe decidió usar PostgreSQL real desde MVP 1.

Implicaciones:

- PostgreSQL local será preparado para desarrollo.
- No se usará SQLite como sustituto funcional.
- No se usará almacenamiento mock para la lógica principal del motor de compromisos.
- No se instalará Docker.
- Staging y producción usarán PostgreSQL administrado más adelante.
- Antes de instalar PostgreSQL local, se hará diagnóstico y plan controlado.

Diagnóstico PostgreSQL posterior:

| Comando | Resultado | Lectura |
|---|---|---|
| `psql --version` | No reconocido | Cliente PostgreSQL no disponible en PATH. |
| `postgres --version` | No reconocido | Servidor PostgreSQL no disponible en PATH. |
| `where.exe psql` | No encontró archivo | `psql` no está instalado o no está en PATH. |
| `where.exe postgres` | No encontró archivo | `postgres` no está instalado o no está en PATH. |
| `Get-Service *postgres*` | Sin servicios listados | No se detectó servicio PostgreSQL local activo/instalado. |
| `winget search PostgreSQL` | Intentó consultar Microsoft Store y pidió aceptar términos | No se usó para instalar; se repitió búsqueda limitada a origen `winget`. |
| `winget search PostgreSQL --source winget` | Mostró candidatos disponibles | Existen opciones instalables como `PostgreSQL.PostgreSQL.17` y `PostgreSQL.PostgreSQL.18`. |

Estado:

- PostgreSQL local: pendiente de instalación/configuración.
- Persistencia MVP 1: decisión tomada, PostgreSQL real.

Plan recomendado antes de instalar:

1. Confirmar versión de PostgreSQL a instalar.
2. Confirmar método de instalación con winget.
3. Definir usuario local, base local y puerto.
4. Decidir si se instala pgAdmin o solo herramientas de línea de comando.
5. Definir contraseña local de desarrollo sin exponerla en documentación ni repositorio.
6. Actualizar `.env.example` solo si hace falta, manteniendo placeholders.
7. Instalar PostgreSQL únicamente con autorización explícita adicional.

## Instalación PostgreSQL local para MVP 1

Luis Felipe autorizó instalar PostgreSQL 17 para desarrollo local de MVP 1.

La instalación se realizó con winget:

```powershell
winget install --id PostgreSQL.PostgreSQL.17 -e --source winget
```

Resultado:

- PostgreSQL 17 fue instalado correctamente.
- Versión instalada validada por ruta directa: `PostgreSQL 17.10`.
- Servicio detectado: `postgresql-x64-17`.
- Estado del servicio: `Running`.
- Inicio del servicio: `Automatic`.

Validaciones ejecutadas:

| Validación | Resultado | Observación |
|---|---|---|
| `psql --version` | No reconocido | PATH de la sesión actual no está actualizado. |
| `postgres --version` | No reconocido | PATH de la sesión actual no está actualizado. |
| `where.exe psql` | No encontró archivo | `psql` no está disponible globalmente en esta sesión. |
| `where.exe postgres` | No encontró archivo | `postgres` no está disponible globalmente en esta sesión. |
| `Get-Service *postgres*` | `postgresql-x64-17`, `Running`, `Automatic` | El servicio local fue detectado y está corriendo. |
| `C:\Program Files\PostgreSQL\17\bin\psql.exe --version` | `psql (PostgreSQL) 17.10` | Cliente validado por ruta directa. |
| `C:\Program Files\PostgreSQL\17\bin\postgres.exe --version` | `postgres (PostgreSQL) 17.10` | Servidor validado por ruta directa. |

Ruta detectada de binarios:

`C:\Program Files\PostgreSQL\17\bin`

Base local:

- Nombre recomendado: `gamora_bot_dev`.
- Estado: creada y validada.

Se intentó crear la base con:

```powershell
& 'C:\Program Files\PostgreSQL\17\bin\createdb.exe' -U postgres gamora_bot_dev
```

El primer intento no terminó porque quedó esperando autenticación interactiva del usuario local `postgres`. No se documentó ni se capturó contraseña. Los procesos residuales fueron detenidos para evitar que quedaran esperando entrada.

Posteriormente se realizó un reset controlado de la contraseña local del usuario `postgres`, sin documentar la contraseña.

Resultado posterior:

- Contraseña local de `postgres`: actualizada por Luis Felipe en consola interactiva.
- Conexión con contraseña nueva: validada por Luis Felipe.
- Base local `gamora_bot_dev`: creada.
- Validación de base: `SELECT current_database();` devolvió `gamora_bot_dev`.
- Usuario usado: `postgres`.
- Puerto esperado: `5432`.

Decisiones respetadas:

- No se usó Docker.
- No se instaló pnpm.
- No se conectó OpenAI.
- No se conectó Meta/WhatsApp.
- No se usaron credenciales reales de producción.
- No se guardó contraseña en Obsidian.
- No se creó `.env` real.
- No se modificó el repositorio técnico.
- No se ejecutaron migraciones Prisma.
- No se avanzó a MVP 1.

## Decisión local temporal sobre usuario de base de datos

Para MVP 1 local se usará temporalmente el usuario `postgres`.

Condiciones:

- Aplica únicamente para desarrollo local/MVP 1.
- La base local será `gamora_bot_dev`.
- Puerto esperado: `5432`.
- La contraseña queda privada y no documentada.
- No se creará `.env` real hasta que Luis Felipe lo autorice explícitamente.
- No se debe interpretar esta decisión como práctica válida para staging o producción.

En staging y producción se usará un usuario específico de aplicación con permisos limitados, credenciales separadas y controles operativos adecuados.

Pendientes:

1. Refrescar PATH abriendo una nueva terminal o agregando temporalmente `C:\Program Files\PostgreSQL\17\bin` a la sesión.
2. Confirmar si se usará usuario `postgres` para desarrollo o un usuario local específico para Gamora.
3. Preparar `.env` local solo cuando Luis Felipe lo autorice, manteniéndolo fuera de Git.

## Reset controlado de contraseña local y creación de base

Motivo:

La autenticación con el usuario local `postgres` falló con:

`FATAL: la autentificación password falló para el usuario «postgres»`

Proceso ejecutado:

1. Se localizó `pg_hba.conf` en:

   `C:\Program Files\PostgreSQL\17\data\pg_hba.conf`

2. Se creó respaldo de configuración antes de modificar:

   `pg_hba.conf.bak_gamora_reset_20260606_200229`

3. Se realizó un segundo respaldo durante el reintento controlado:

   `pg_hba.conf.bak_gamora_reset_retry_20260606_201158`

4. Se cambió temporalmente a `trust` únicamente para conexiones locales:

   - `127.0.0.1/32`
   - `::1/128`

5. No se modificaron reglas remotas.

6. Luis Felipe actualizó la contraseña local del usuario `postgres` desde consola interactiva.

7. Se restauró `pg_hba.conf` a modo seguro:

   - `host all all 127.0.0.1/32 scram-sha-256`
   - `host all all ::1/128 scram-sha-256`

8. Se confirmó que la conexión sin contraseña vuelve a fallar con `fe_sendauth: no password supplied`, lo que valida que `trust` ya no quedó activo.

9. Luis Felipe validó conexión con la contraseña nueva.

10. Luis Felipe creó y validó la base local:

   `gamora_bot_dev`

Resultado:

- Reset controlado: realizado.
- `pg_hba.conf`: restaurado a modo seguro.
- PostgreSQL: corriendo.
- Conexión con contraseña nueva: validada.
- Base `gamora_bot_dev`: creada y validada.

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
