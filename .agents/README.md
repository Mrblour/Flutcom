# 🤖 Flutcom — Configuración de Agentes de IA

Esta carpeta centraliza toda la configuración, contexto, reglas y habilidades
que cualquier Agente de IA (Antigravity, Copilot, Cursor, Claude Code, etc.) debe leer
y respetar al trabajar dentro del proyecto **Flutcom v1.1**.

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

## Novedades Arquitectónicas Clave (v1.1)

Los agentes deben tener en cuenta las siguientes capacidades introducidas recientemente:

1. **Tags de Layout Nativos (`Flutcom.LAYOUT_TAGS`)**:
   - `index.html` utiliza `<flut-navbar>`, `<flut-main>` y `<flut-footer>`.
   - El motor protege estos tags para que no sean eliminados ni tratados como componentes estándar.
2. **Motor de Componentes v2 con Slots**:
   - Tags directos: `<flut-alert ...>`, `<flut-card ...>` o genéricos `<flut-component name="..." />`.
   - Soporte de slots dinámicos vía `{{ slot }}` sin parsers pesados ni runtime JS.
3. **Directivas Reactivas en HTML (Zero JS)**:
   - `fc-model`, `fc-bind`, `fc-show` (con soporte para condición negada `!`), `fc-go`, `fc-toggle`, `fc-click`.
4. **Helper Global `Flut`**:
   - Métodos unificados: `Flut.go()`, `Flut.set()`, `Flut.get()`, `Flut.watch()`, `Flut.modal()`, `Flut.toast()`.
5. **Rutas Enriquecidas con SEO Dinámico**:
   - Rutas en `flutcom.config.js` pueden ser objetos `{ view, title, description }` con sincronización automática de `<title>` y Open Graph.
6. **Diseño Monocromático Minimalista**:
   - Estética limpia inspirada en Vercel Light (blanco puro `#fff`, bordes `#eaeaea`, acentos en negro `#000`). Logo SVG nativo sin filtros invertidos.
7. **Sistema de Plugins Nativos Zero-Code (`plugins/<nombre>/`)**:
   - Plugins modulares autocontenidos en ambiente cerrado pero no limitado.
   - Par de archivos obligatorio: `<nombre>.flutcom.js` (o `.fc.js`) + `<nombre>.flutcom.json` (o `.fc.json`).
   - Ciclo de vida estandarizado con `init(app, config)` y `onNavigate(view, container)`.
   - Scripts abiertos o tradicionales organizados en `plugins/opensource/` y declarados en `resources[]`.

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

