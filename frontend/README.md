# Gestor de Tareas

Aplicación MVP tipo Gestor de Tareas desarrollada con **Angular 21.1.4** (standalone components), **Node.js 24.x**, **Bootstrap** y **Angular Material**. Mobile-first, con modo oscuro, PWA instalable (semi-offline) y datos dummy navegables.

## Requisitos previos

- Node.js 24.x
- npm 11.x

## Cómo correr el proyecto

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm start
```

Abre el navegador en `http://localhost:4200/`.

## Scripts disponibles

| Script   | Descripción                         |
|----------|-------------------------------------|
| `npm start` | Levanta el servidor de desarrollo |
| `npm run build` | Compila para producción         |
| `npm run format` | Formatea con Prettier           |

## Estructura de carpetas

```
src/
├── app/
│   ├── core/                    # Layout, servicios base, config
│   │   ├── data/                # Datos dummy
│   │   ├── layout/shell/        # AppShell (toolbar + sidenav)
│   │   └── services/            # ThemeService, TaskService, DataService
│   ├── shared/
│   │   ├── components/          # UI reutilizables
│   │   │   ├── confirm-dialog/
│   │   │   ├── empty-state/
│   │   │   ├── page-header/
│   │   │   ├── priority-pill/
│   │   │   ├── status-chip/
│   │   │   └── task-card/
│   │   ├── models/              # Interfaces (Task, User, Project, etc.)
│   │   └── pipes/               # DateFormatPipe
│   ├── features/
│   │   ├── tareas/              # Lista, detalle, formulario
│   │   ├── tablero/             # KPIs operativos
│   │   ├── alertas/             # Reglas de vencimiento
│   │   ├── documentos/          # Repositorio de evidencias
│   │   ├── admin/               # Catálogos (CRUD mock)
│   │   ├── ia/                  # Asistente IA (mock)
│   │   └── proyectos/           # Vista de proyectos
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.ts
├── styles/
│   ├── _tokens.scss             # Design tokens
│   └── _helpers.scss            # Clases utilitarias
├── index.html
├── main.ts
└── styles.scss
```

## Rutas

| Ruta            | Descripción                     |
|-----------------|---------------------------------|
| `/`             | Redirige a `/tablero`           |
| `/tablero`      | KPIs: activas, vencidas, por vencer, completadas |
| `/tareas`       | Lista de tareas con filtros     |
| `/tareas/:id`   | Detalle de tarea (centro de control) |
| `/alertas`      | Reglas de vencimiento y escalamiento |
| `/documentos`   | Repositorio de archivos         |
| `/admin`        | Administración y catálogos      |
| `/ia`           | Asistente IA (captura asistida) |
| `/proyectos`    | Vista general de proyectos      |
| `/offline`      | Pantalla informativa sin conexión |

## Pantallas listas y navegación

- **Tablero**: cards KPI, carga por responsable y prioridad (barras CSS).
- **Tareas**: lista con búsqueda, filtros (Hoy, Vencidas, Alta, Sin asignar), estado/prioridad. Vista cards en móvil, tabla en desktop. Botón "Nueva tarea" abre dialog.
- **Detalle tarea**: resumen, cambio de estado/prioridad/asignado, comentarios (mock), evidencias (mock), timeline/bitácora.
- **Alertas**: reglas con umbral, frecuencia, escalamiento. Editar regla (dialog mock).
- **Documentos**: tabla de archivos dummy, botón subir (mock).
- **Admin**: tabs Categorías, Estados, Prioridades, Equipos, Reglas.
- **IA**: captura asistida (genera tarea mock), consultas rápidas (Por vencer, Vencidas, Carga).
- **Proyectos**: cards de proyectos con KPIs y miembros.

## Diseño

- Mobile-first con breakpoints Bootstrap.
- Tema claro/oscuro con toggle en toolbar (persistido en `localStorage`).
- Tokens SCSS: spacing, radius, typography, colors.
- Angular Material (toolbar, sidenav, buttons, icons, form fields, dialogs, chips, tables).

## Datos dummy

- ~30 tareas con estados, prioridades y fechas variadas.
- Usuarios, proyectos, documentos, reglas de alerta y catálogos precargados.

---

## PWA: Instalación en dispositivo (iOS y Android)

La aplicación es una **PWA instalable** con soporte semi-offline. Puedes añadirla a la pantalla de inicio para usarla como app nativa.

### Instalar en iOS (iPhone / iPad)

1. Abre **Safari** y ve a la URL de la aplicación (ej. `https://tu-dominio.com`).
2. Toca el botón **Compartir** (cuadro con flecha hacia arriba).
3. Desplázate y selecciona **"Añadir a la pantalla de inicio"**.
4. Edita el nombre si lo deseas y toca **"Añadir"**.

La app aparecerá en tu pantalla de inicio y se abrirá en modo **standalone** (sin barra de Safari).

### Instalar en Android

1. Abre **Chrome** y navega a la aplicación.
2. Toca el menú (tres puntos) → **"Instalar aplicación"** o **"Añadir a la pantalla de inicio"**.
3. Confirma en el diálogo.

### Comportamiento offline

- **App shell cacheado**: La interfaz se carga aunque no haya conexión.
- **Último estado conocido**: Las tareas y el tablero se guardan localmente. Sin conexión se muestran los datos de la última sincronización.
- **Banner de estado**: Se muestra un aviso cuando no hay conexión y la fecha de la última sincronización cuando sí la hay.
- **Acciones deshabilitadas**: Crear tarea, exportar y otras acciones que requieren red se deshabilitan offline con mensajes claros.

### Notificaciones

- Por defecto: notificaciones **in-app** y por **correo**.
- **Web Push** (PWA): preparado con feature flag; requiere backend con VAPID para activarlo.

### Iconos PWA (opcional)

Para una experiencia de instalación completa, añade iconos en `public/icons/`:
- `icon-192x192.png`, `icon-512x512.png`, `icon-maskable-512x512.png`

Puedes generar iconos con [RealFaviconGenerator](https://realfavicongenerator.net/) o herramientas similares. Sin ellos, la PWA usará el favicon por defecto.
