# 🤖 Flutcom — Configuración de Agentes de IA

Esta carpeta centraliza toda la configuración, contexto, reglas y habilidades
que cualquier Agente de IA (Antigravity, Copilot, Cursor, Claude Code, etc.) debe leer
y respetar al trabajar dentro del proyecto **Flutcom v1.4.1**.

## Estructura

```
.agents/
├── README.md                  → Este archivo (punto de entrada)
├── rules/                     → Reglas y restricciones obligatorias
│   ├── architecture.md        → Normas arquitectónicas del framework
│   ├── code-style.md          → Guía de estilo de código (HTML semántico y Vanilla JS)
│   ├── design-system.md       → Sistema visual monocromático (estilo Vercel / Linear)
│   └── development-guidelines.md → Buenas prácticas de desarrollo, rutas y plugins
├── context/                   → Contexto que el agente DEBE conocer antes de actuar
│   ├── project-overview.md    → Resumen del proyecto, misión y estado actual
│   └── file-map.md            → Mapa completo de archivos críticos y su función
└── skills/                    → Flujos de trabajo reutilizables paso a paso
    ├── add-route.md           → Cómo añadir una nueva ruta/vista (SEO híbrido)
    ├── create-plugin.md       → Cómo crear un plugin modular desde cero
    ├── create-component.md    → Motor v2: tags (<flut-*>) y slots ({{ slot }})
    └── reactive-directives.md → Directivas reactivas Zero-JS (fc-model, fc-bind, etc.)
```

## Capacidades Arquitectónicas del Framework (v1.4.1)

Los agentes deben tener en cuenta las siguientes capacidades:

1. **Tags de Layout Nativos (`Flutcom.LAYOUT_TAGS`)**:
   - `index.html` utiliza `<flut-navbar>`, `<flut-main>` y `<flut-footer>`.
   - El motor protege estos tags para que no sean eliminados ni tratados como componentes estándar.
2. **Motor de Componentes v2 con Slots**:
   - Tags directos: `<flut-alert ...>`, `<flut-card ...>` o genéricos `<flut-component name="..." />`.
   - Soporte de slots dinámicos vía `{{ slot }}` y propiedades `{{ prop }}` sin dependencias.
3. **Directivas Reactivas en HTML (Zero JS)**:
   - `fc-model`, `fc-bind`, `fc-show` (con soporte para condición negada `!`), `fc-go`, `fc-toggle`, `fc-click`.
4. **Helper Global `window.Flut`**:
   - Métodos unificados: `Flut.go()`, `Flut.set()`, `Flut.get()`, `Flut.watch()`, `Flut.modal()`, `Flut.toast()`.
   - Protegido contra manipulación externa con `Object.freeze(Flut)`.
5. **Tipado Estático con TypeScript**:
   - Definiciones completas en `types/flutcom.d.ts` (`SiteConfig`, `RouteConfig`, `RouteSEO`, `FlutHelper`).
   - Funciones tipadas `defineConfig()` y `definePlugin()` en `flutcom/config.js`.
   - Verificación estática rápida con `npm run check` (`tsc --noEmit`).
6. **Motor Avanzado de SEO y Rich Snippets**:
   - Metadatos enriquecidos en `flutcom.config.js` (`title`, `description`, `keywords`, `robots`, `image`, `canonical`, `jsonLd`).
   - Inyección dinámica en `flutcom/main.js` y sincronización con Schema.org.
   - Generación automática de `sitemap.xml` en `npm run build` y directivas en `robots.txt`.
7. **Prevención de Fugas de Memoria (`_viewCleanups`)**:
   - El motor desuscribe automáticamente los observadores del Store entre navegaciones SPA.
8. **Seguridad y Content Security Policy (CSP)**:
   - Encabezado CSP estricto en `index.html`.
   - Soporte para `site.strictMode: true` en `fc-click` que restringe llamadas a métodos seguros de `Flut.*()`.
9. **Suite de Pruebas Automatizadas**:
   - 14 tests unitarios en Vitest ejecutables con `npm test`.
10. **Sistema de Plugins Nativos Zero-Code (`plugins/<nombre>/`)**:
    - Par obligatorio: `<nombre>.flutcom.js` + `<nombre>.flutcom.json`.
    - Carga paralela con `Promise.all` para arranque ultra-rápido.
    - Scripts abiertos en `plugins/opensource/` declarados en `resources[]`.

## Archivos Puente Universales

Para máxima compatibilidad entre diferentes herramientas de IA, el proyecto cuenta con:
- `AGENTS.md` → Guía raíz rápida para cualquier agente.
- `.cursorrules` → Reglas automáticas para Cursor IDE.
- `CLAUDE.md` → Directivas para Claude Code (Anthropic).
- `.github/copilot-instructions.md` → Instrucciones para GitHub Copilot.

## ¿Cómo usarlo?

1. **Lee siempre** `context/project-overview.md` y `rules/architecture.md` antes de empezar.
2. **Consulta** `rules/` para normas de estilo y restricciones.
3. **Usa** `skills/` como receta paso a paso para añadir rutas, componentes o directivas.
4. **Verifica siempre**: ejecuta `npm run check` y `npm test` al concluir tus tareas.
