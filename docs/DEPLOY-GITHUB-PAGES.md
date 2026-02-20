# Deploy a GitHub Pages (gestor-tareas)

## Qué hace el workflow

El archivo **`.github/workflows/deploy-pages.yml`** en la raíz del repo:

1. Se ejecuta en cada **push a la rama `main`**.
2. Instala dependencias en **`frontend/`** con `npm ci`.
3. Compila la app Angular en modo producción con **`base-href`** para GitHub Pages.
4. Detecta la carpeta de salida del build (`dist/gestor-tareas/browser` o `dist/gestor-tareas`).
5. Copia **`index.html` → `404.html`** en esa salida para que las rutas de la SPA funcionen al recargar o al abrir un enlace directo.
6. Sube el contenido como artefacto y lo publica en **GitHub Pages** con la acción oficial.

## Deploy automático

- **Trigger:** push a `main`.
- **Build:** se usa el script `npm run build:pages` (definido en `frontend/package.json`).
- **Publicación:** GitHub Actions despliega el artefacto en el entorno **github-pages** del repositorio.

Para que el deploy funcione, en el repo debe estar configurado:

- **Settings → Pages → Build and deployment:** Source = **GitHub Actions**.

El workflow usa `npm ci` en `frontend/`; hace falta **`frontend/package-lock.json`** (si no existe, ejecuta `npm install` dentro de `frontend/` y sube el lock file).

## Dónde se define el base-href

- **En el build:** en `frontend/package.json`, el script `build:pages` ejecuta:
  ```bash
  ng build --configuration=production --base-href /gestor-tareas/
  ```
- Ese valor hace que la app espere estar servida en **`https://<usuario>.github.io/gestor-tareas/`** (subruta del repo). No hace falta tocar `angular.json` ni `index.html` a mano; el CLI sustituye `<base href>` en el build.

## URL esperada

- **Publicación:**  
  `https://<usuario-o-org>.github.io/gestor-tareas/`
- Sustituye `<usuario-o-org>` por el dueño del repo (ej. `https://tudominio.github.io/gestor-tareas/`).

## Si ves pantalla en blanco o 404 al recargar

1. **Pantalla en blanco**
   - Comprueba que en **Settings → Pages** la fuente sea **GitHub Actions**.
   - Revisa que el **base-href** del build sea exactamente **`/gestor-tareas/`** (con la barra final).
   - Abre la consola del navegador (F12) y mira si hay errores 404 al cargar JS/CSS; si la ruta base es incorrecta, los recursos no se encontrarán.

2. **404 al recargar una ruta (ej. `/gestor-tareas/proyectos/123`)**
   - GitHub Pages sirve archivos estáticos; sin `404.html` devolvería 404 para rutas que no son un archivo físico.
   - El workflow **copia `index.html` a `404.html`** en la carpeta que se sube a Pages. Así, cualquier ruta no encontrada sirve el mismo `index.html` y Angular Router puede interpretar la URL.
   - Si aun así ves 404 al recargar, confirma en el workflow que el paso **"SPA fallback (404.html)"** se ejecuta y que el artefacto que se sube contiene **`404.html`** junto a `index.html`.

3. **Rutas con hash (opcional)**
   - La app usa rutas normales (path), no hash (`#/ruta`). Eso está bien y es compatible con el truco de `404.html`.
   - Si en el futuro quisieras evitar depender de `404.html`, se podría cambiar el router a modo hash (`RouterModule.forRoot(..., { useHash: true })`), pero no es necesario con la configuración actual.

## Comando de build usado en CI

En el workflow se ejecuta:

```bash
cd frontend && npm run build:pages
```

Equivalente a:

```bash
ng build --configuration=production --base-href /gestor-tareas/
```

Para probar el build localmente antes de hacer push:

```bash
cd frontend
npm run build:pages
```

La salida estará en `frontend/dist/gestor-tareas/browser` (o `frontend/dist/gestor-tareas` según la versión de Angular). Servir esa carpeta con `--base-href /gestor-tareas/` en local no es exactamente igual que en GitHub Pages; para simular la URL real, sirve la carpeta y abre `http://localhost:8080/gestor-tareas/` (o la raíz si usas un servidor que permita configurar base path).
