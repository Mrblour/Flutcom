# 📋 Resumen del Proyecto — Flutcom

## ¿Qué es Flutcom?

**Flutcom** es un **micro-framework SPA (Single Page Application)** de código abierto, creado por **yBlour**, diseñado para transformar archivos HTML estáticos en aplicaciones web modernas y fluidas **sin dependencias de runtime**.

Es el equivalente liviano de Next.js / Astro para entornos puramente estáticos (GitHub Pages, Netlify, Vercel, CDNs).

---

## Problema que resuelve

Los frameworks modernos (React, Vue, Next.js) son potentes pero complejos: requieren un build step pesado, una CLI compleja, cientos de dependencias en runtime y sobrecarga innecesaria para páginas estáticas. **Flutcom** elimina esa fricción:

- ✅ Cero dependencias en tiempo de ejecución (Zero-runtime dependencies).
- ✅ Sin bundler (Vite, Webpack) requerido para servir o navegar las vistas.
- ✅ Sin React / Vue / Angular.
- ✅ Enrutamiento reactivo por hash (`#home`, `#contacto`) con soporte SEO completo.
- ✅ Despliegue instantáneo en cualquier CDN o servicio de hosting estático.

---

## Audiencia objetivo

- Desarrolladores que quieren la UX de una SPA sin la complejidad de un framework grande.
- Proyectos pequeños y medianos: portfolios, landing pages, paneles sencillos, documentación.
- Equipos que trabajan con HTML/CSS/JS puro pero quieren modularidad, componentes y estado reactivo.

---

## Stack técnico

| Capa | Tecnología |
| :--- | :--- |
| Lenguaje | Vanilla JavaScript (ES Modules) |
| Tipado | TypeScript (definiciones JSDoc + `types/flutcom.d.ts`) |
| Estilos | Tailwind CSS v4 (CLI) + CSS modular |
| Iconos | Bootstrap Icons (CDN) |
| Tipografía | Inter (Google Fonts) |
| Servidor dev | Node.js (`run/dev.js`) + `live-server` |
| Build producción | Node.js (`run/build.js`) con minificación y generación de `sitemap.xml` |
| Pruebas | Vitest (`vitest.config.mjs`) con entorno `jsdom` |
| CLI instalador | `npm create flutcom@latest` |

---

## Estado actual (v1.4.1)

- 🟢 **Core Engine v2.0**: Router por hash, store reactivo, lifecycle hooks, directivas declarativas (`fc-bind`, `fc-model`, `fc-show`, `fc-go`, `fc-toggle`, `fc-click`), guards, barra de progreso con reflow seguro.
- 🟢 **Seguridad**: CSP (Content Security Policy) en HTML, API congelada con `Object.freeze(window.Flut)`, opción `strictMode` en `fc-click`.
- 🟢 **Memoria**: Cleanup automático de observadores entre vistas (`_viewCleanups`).
- 🟢 **SEO y Rich Snippets**: Metadatos canónicos, Open Graph, Twitter Cards, Schema.org (JSON-LD), `sitemap.xml` dinámico y `robots.txt`.
- 🟢 **Plugins Nativos**: `timer`, `menu`, `animations`, `responsive` (cargados en paralelo con `Promise.all`).
- 🟢 **TypeScript**: Verificación estática con 0 errores (`npm run check`).
- 🟢 **Pruebas**: 14 tests automatizados pasando en Vitest (`npm test`).
- 📦 **CLI (`create-flutcom`)**: Instalador interactivo publicado en npm.

---

## Comandos útiles

```bash
npm run dev           # Servidor local con hot-reload y compilación de Tailwind
npm run check         # Comprobación de tipos TypeScript en 0.5s (tsc --noEmit)
npm test              # Ejecución de la suite completa de pruebas Vitest
npm run build         # Compilación de producción hacia dist/ (minifica y genera sitemap)
npm run preview       # Previsualiza la compilación de dist/ en localhost
npm run watch:css     # Compila Tailwind en modo watch (sin servidor web)
npm run serve         # Servidor web estático rápido en puerto 3000
```
