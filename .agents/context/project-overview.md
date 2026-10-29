# 📋 Resumen del Proyecto — Flutcom

## ¿Qué es Flutcom?

**Flutcom** es un **micro-framework SPA (Single Page Application)** de código abierto, creado por **yBlour**, diseñado para transformar archivos HTML estáticos en aplicaciones web modernas y fluidas **sin dependencias de runtime**.

Es el equivalente liviano de Next.js / Astro para entornos puramente estáticos (GitHub Pages, Netlify, Vercel, CDNs).

---

## Problema que resuelve

Los frameworks modernos (React, Vue, Next.js) son potentes pero complejos: requieren un build step, una CLI, cientos de dependencias y conocimiento previo. **Flutcom** elimina esa fricción:

- ✅ Sin build step obligatorio para el HTML.
- ✅ Sin bundler (Vite, Webpack, etc.) necesario para las vistas.
- ✅ Sin React/Vue/Angular.
- ✅ Despliegue instantáneo en cualquier CDN.

---

## Audiencia objetivo

- Desarrolladores que quieren la UX de una SPA sin la complejidad de un framework grande.
- Proyectos pequeños/medianos: portfolios, landing pages, paneles sencillos, documentación.
- Equipos que trabajan con HTML/CSS/JS puro pero quieren una mejor experiencia de navegación.

---

## Stack técnico

| Capa | Tecnología |
| :--- | :--- |
| Lenguaje | Vanilla JavaScript (ES Modules) |
| Estilos | Tailwind v4 (CLI) + CSS personalizado |
| Iconos | Bootstrap Icons (CDN) |
| Tipografía | Inter (Google Fonts) |
| Servidor dev | Node.js (`run/dev.js`) + `live-server` |
| CLI instalador | `npm create flutcom@latest` |

---

## Estado actual

- 🟢 **Core v2.0**: Router por hash, store reactivo, lifecycle hooks, guards, barra de progreso.
- 🟢 **Plugins**: `menu.js`, `modals.js`, `animations.js`, `responsive.js`.
- 🟡 **En desarrollo / por implementar**: Ver backlog del proyecto.
- 📦 **CLI (`create-flutcom`)**: Instalador interactivo publicado en npm.

---

## Comandos útiles

```bash
npm run dev           # Arranca servidor local + hot-reload CSS
npm run watch:css     # Compila Tailwind en modo watch (sin servidor)
npm run serve         # Sirve estáticos en puerto 3000
```
