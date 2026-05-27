# js-app-lista-tareas

Aplicación de lista de tareas (Todo App) construida con JavaScript vanilla y [Vite](https://vite.dev/) como bundler.

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior

## Instalación y desarrollo local

```bash
# 1. Clonar el repositorio
git clone https://github.com/ebenito/js-app-lista-tareas.git
cd js-app-lista-tareas

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con hot-reload |
| `npm run build` | Genera la build de producción en `/dist` |
| `npm run preview` | Previsualiza la build de producción localmente |

## Despliegue en GitHub Pages

### Opción A — GitHub Actions (recomendado)

Esta opción despliega automáticamente cada vez que haces push a `main`.

1. Crea el archivo `.github/workflows/deploy.yml` en tu repositorio con este contenido:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

2. Ve a **Settings → Pages** en tu repositorio de GitHub.
3. En **Source**, selecciona **GitHub Actions**.
4. Haz push a `main` — el workflow se ejecutará automáticamente y publicará la app.

> La URL resultante será: `https://ebenito.github.io/js-app-lista-tareas/`

---

### Opción B — Deploy manual con `gh-pages`

```bash
# 1. Instalar gh-pages como dependencia de desarrollo
npm install --save-dev gh-pages

# 2. Generar la build de producción
npm run build

# 3. Publicar el contenido de /dist en la rama gh-pages
npx gh-pages -d dist
```

Después ve a **Settings → Pages** y selecciona la rama `gh-pages` como fuente.

---

> **Nota:** El archivo `vite.config.js` ya incluye `base: '/js-app-lista-tareas/'` para que los assets carguen correctamente bajo la subruta de GitHub Pages.

## Tecnologías

- JavaScript ES6+
- [Vite](https://vite.dev/) — bundler y dev server
- [uuid](https://www.npmjs.com/package/uuid) — generación de IDs únicos
- CSS3
