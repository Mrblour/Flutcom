# 🗂️ Mapa de Archivos — Flutcom

> Referencia rápida de todos los archivos críticos del proyecto y su función exacta.

---

## Archivos Raíz

| Archivo | Función |
| :--- | :--- |
| `index.html` | Shell principal de la SPA. Contiene `#navbar`, `#content`, `#footer`. **No agregar lógica aquí.** |
| `flutcom.config.js` | **Configuración central**. Rutas, plugins, parciales, metadata del sitio. |
| `package.json` | Dependencias de desarrollo (Tailwind, live-server, concurrently). |
| `flutcom.bat` | Atajo de Windows para iniciar el entorno de desarrollo. |

---

## `/flutcom/` — Motor del Framework

| Archivo | Función |
| :--- | :--- |
| `flutcom/core.js` | **⚠️ NO TOCAR.** Motor SPA: router por hash, carga de vistas/parciales, store reactivo, guards, progress bar. |
| `flutcom/main.js` | **⚠️ Mínima modificación.** Arranca el framework, registra hooks globales (`afterEnter`, etc.). |

---

## `/resources/` — Contenido de la App

| Ruta | Función |
| :--- | :--- |
| `resources/views/public/home.html` | Vista de inicio (ruta `#home`). |
| `resources/views/public/404.html` | Vista de error "página no encontrada". |
| `resources/partials/header.html` | Navbar inyectado en `<div id="navbar">`. |
| `resources/partials/footer.html` | Footer inyectado en `<div id="footer">`. |
| `resources/components/` | Componentes HTML reutilizables (botones, cards, etc.). |

---

## `/plugins/` — Extensiones del Framework

| Ruta | Función |
| :--- | :--- |
| `plugins/<nombre>/` | **Plugins Nativos**: Autocontenidos, con `<nombre>.flutcom.js` + `<nombre>.flutcom.json`. |
| `plugins/timer/` | Plugin nativo de temporizadores y cuentas regresivas Zero-JS. |
| `plugins/opensource/` | Scripts de terceros, utilidades abiertas o scripts JS tradicionales. |
| `plugins/menu.js` | Menú hamburguesa y navegación móvil (script tradicional). |
| `plugins/modals.js` | Sistema de modales/diálogos accesibles (script tradicional). |
| `plugins/animations.js` | Reveal de elementos al hacer scroll (script tradicional). |
| `plugins/responsive.js` | Utilidades de adaptabilidad y breakpoints (script tradicional). |

---

## `/assets/` — Recursos Estáticos

| Ruta | Función |
| :--- | :--- |
| `assets/css/flutcom.css` | CSS base del framework (reset, utilidades core). |
| `assets/css/style.css` | CSS personalizado del proyecto. |
| `assets/vendor/tailwind/tailwind.css` | Output compilado de Tailwind v4 (no editar manualmente). |
| `assets/img/` | Imágenes, iconos SVG, etc. |

---

## `/src/` — Fuentes de Compilación

| Archivo | Función |
| :--- | :--- |
| `src/input.css` | Archivo fuente de Tailwind CSS (donde se añaden directivas `@layer`, `@apply`). |

---

## `/create-flutcom/` — CLI del Instalador

| Archivo | Función |
| :--- | :--- |
| `create-flutcom/index.js` | Script interactivo para `npm create flutcom@latest`. |
| `create-flutcom/package.json` | Metadata del paquete npm del instalador. |

---

## `/.agents/` — Configuración para Agentes de IA

| Ruta | Función |
| :--- | :--- |
| `.agents/README.md` | Punto de entrada para agentes. Leer primero. |
| `.agents/rules/` | Reglas obligatorias: arquitectura, estilos, diseño. |
| `.agents/context/` | Contexto del proyecto: resumen, mapa de archivos. |
| `.agents/skills/` | Guías paso a paso para tareas frecuentes. |
