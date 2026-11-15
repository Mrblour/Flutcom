# 🗂️ Mapa de Archivos — Flutcom v1.4.1

> Referencia rápida de todos los archivos del proyecto y su función exacta.

---

## Archivos Raíz

| Archivo | Función |
| :--- | :--- |
| `index.html` | Shell principal de la SPA. Contiene `<flut-navbar>`, `<flut-main>`, `<flut-footer>` y política CSP. **No agregar lógica aquí.** |
| `flutcom.config.js` | **Configuración central**. Rutas, plugins, parciales, metadata SEO del sitio. |
| `package.json` | Dependencias de desarrollo, scripts (`check`, `test`, `build`, `dev`) y metadata del paquete. |
| `tsconfig.json` | Configuración estricta de TypeScript para chequeo de tipos con JSDoc (`allowJs: true`, `noEmit: true`). |
| `vitest.config.mjs` | Configuración de la suite de pruebas unitarias Vitest en entorno `jsdom`. |
| `robots.txt` | Directivas estándar para motores de búsqueda (Googlebot, Bingbot) con enlace al sitemap. |
| `sitemap.xml` | Mapa de URLs y prioridades de rastreo generado automáticamente en cada build. |
| `flutcom.bat` | Atajo de Windows para iniciar el entorno de desarrollo. |

---

## `/flutcom/` — Motor del Framework

| Archivo | Función |
| :--- | :--- |
| `flutcom/core.js` | **⚠️ NO TOCAR.** Motor SPA: router por hash, carga de vistas/parciales, store reactivo, directivas `fc-*`, guards, barra de progreso y plugins. |
| `flutcom/main.js` | **⚠️ Mínima modificación.** Arranca el framework, registra hooks globales (`afterEnter` con actualización dinámica de SEO), gestión de foco accesible. |
| `flutcom/flut.js` | Helper global `window.Flut` (`go`, `set`, `get`, `watch`, `modal`, `toast`). Congelado con `Object.freeze` por seguridad. |
| `flutcom/config.js` | Funciones tipadas `defineConfig()` y `definePlugin()` para autocompletado en IDEs. |

---

## `/resources/` — Contenido de la App

| Ruta | Función |
| :--- | :--- |
| `resources/views/public/home.html` | Vista de inicio (ruta `#home`). |
| `resources/views/public/ejemplos.html` | Galería interactiva de directivas reactivas y componentes (#ejemplos). |
| `resources/views/public/404.html` | Vista de error "página no encontrada". |
| `resources/partials/header.html` | Navbar inyectado en `<flut-navbar>`. |
| `resources/partials/footer.html` | Footer inyectado en `<flut-footer>`. |
| `resources/components/alert.html` | Componente reutilizable `<flut-alert>` con soporte para `{{ slot }}`. |
| `resources/components/badge.html` | Componente reutilizable `<flut-badge>`. |
| `resources/components/card.html` | Componente modular `<flut-card>`. |

---

## `/plugins/` — Extensiones del Framework

| Ruta | Función |
| :--- | :--- |
| `plugins/<nombre>/` | **Plugins Nativos**: Autocontenidos, con `<nombre>.flutcom.js` + `<nombre>.flutcom.json`. Declarados en `plugins[]` de `flutcom.config.js`. |
| `plugins/timer/` | Plugin nativo: temporizadores y cuentas regresivas Zero-JS. |
| `plugins/menu/` | Plugin nativo: menú móvil hamburguesa accesible. |
| `plugins/animations/` | Plugin nativo: revelado por scroll con `IntersectionObserver` y limpieza en navegación. |
| `plugins/responsive/` | Plugin nativo: utilidades y eventos de breakpoints responsive. |
| `plugins/modals.js` | Sistema de modales y diálogos accesibles (script tradicional en `resources[]`). |
| `plugins/opensource/` | Scripts de terceros, librerías abiertas o scripts JS tradicionales. |

---

## `/types/` — Definiciones de Tipos

| Archivo | Función |
| :--- | :--- |
| `types/flutcom.d.ts` | Definiciones TypeScript para `SiteConfig`, `RouteConfig`, `RouteSEO`, `PartialsConfig`, `FlutHelper` y `FlutcomPlugin`. |

---

## `/tests/` — Pruebas Automatizadas

| Archivo | Función |
| :--- | :--- |
| `tests/router.test.js` | Pruebas de enrutamiento por hash y propagación de campos SEO en `_resolveRoute`. |
| `tests/store.test.js` | Pruebas de reactividad, suscripciones y emisión de cambios del Store global. |
| `tests/flut.test.js` | Pruebas de métodos auxiliares del helper `window.Flut`. |

---

## `/run/` — Scripts de Compilación y Servidores

| Archivo | Función |
| :--- | :--- |
| `run/dev.js` | Servidor de desarrollo con live reload y recarga de estilos Tailwind. |
| `run/build.js` | Compilador de producción hacia `dist/`: minifica Tailwind, copia assets y genera `sitemap.xml`. |
| `run/preview.js` | Servidor HTTP local para previsualizar el bundle compilado de `dist/`. |

---

## `/assets/` y `/src/` — Estilos y Recursos Gráficos

| Ruta | Función |
| :--- | :--- |
| `src/input.css` | Archivo fuente de Tailwind CSS v4 (donde se configuran `@layer` y variables de tema). |
| `assets/vendor/tailwind/tailwind.css` | CSS compilado de Tailwind (generado por CLI, no editar manualmente). |
| `assets/css/flutcom.css` | CSS base del framework (reset y transiciones de vista). |
| `assets/css/style.css` | CSS de personalización visual del proyecto. |
| `assets/img/` | Logotipos oficiales SVG (`flutcom.svg`, `flutcom-banner.svg`, diagramas). |

---

## `/create-flutcom/` — CLI del Instalador

| Archivo | Función |
| :--- | :--- |
| `create-flutcom/index.js` | CLI interactivo para inicializar proyectos mediante `npm create flutcom@latest`. |
| `create-flutcom/package.json` | Metadata del paquete npm del instalador. |
