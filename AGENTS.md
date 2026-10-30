# 🤖 Flutcom — Guía para Agentes de IA

**Lee este archivo antes de tocar cualquier parte del proyecto.**

> Para las reglas completas, contexto y skills, consulta la carpeta [`.agents/`](.agents/README.md).

---

## Resumen Rápido

**Flutcom** es un micro-framework SPA para sitios estáticos basado en **Vanilla JS (ES Modules)**
con enrutamiento por hash, sin dependencias de runtime.

## Archivos clave

| Archivo | Rol |
| :--- | :--- |
| `flutcom.config.js` | Configuración central (rutas, plugins, metadata) |
| `flutcom/core.js` | Motor del framework — **no modificar** |
| `flutcom/main.js` | Bootstrap — modificaciones mínimas |
| `resources/views/` | Vistas HTML inyectadas dinámicamente |
| `resources/partials/` | Header y footer persistentes |
| `plugins/` | Extensiones JS modulares |

## Reglas de oro

1. ❌ **No uses librerías de runtime** (React, Vue, etc.)
2. ✅ **Toda nueva ruta** → registrar en `flutcom.config.js`
3. ✅ **Plugins nativos** (`plugins/<nombre>/`) → registrar en `plugins[]` con su par obligatorio `.flutcom.js`/`.fc.js` y `.flutcom.json`/`.fc.json`. Scripts tradicionales/abiertos en `plugins/opensource/` y `resources[]`.
4. ❌ **No alterar `flutcom/core.js`** sin permiso explícito del usuario
5. ✅ **Estado global** → usar siempre `window.flutcomApp.store` (o `Flut.set()` / `Flut.get()`)
6. ✅ **Commits limpios** → registrar cambios mediante mensajes de commit claros y concisos en Git

## Documentación completa para agentes

📁 [`.agents/`](.agents/README.md) — Punto de entrada
- 📋 [`.agents/context/project-overview.md`](.agents/context/project-overview.md) — Qué es y para qué sirve
- 🗂️ [`.agents/context/file-map.md`](.agents/context/file-map.md) — Mapa de todos los archivos
- 🏗️ [`.agents/rules/architecture.md`](.agents/rules/architecture.md) — Reglas arquitectónicas
- 🎨 [`.agents/rules/code-style.md`](.agents/rules/code-style.md) — Estilo de código
- 🎭 [`.agents/rules/design-system.md`](.agents/rules/design-system.md) — Sistema visual
- 📖 [`.agents/skills/add-route.md`](.agents/skills/add-route.md) — Cómo añadir una ruta
- 🔌 [`.agents/skills/create-plugin.md`](.agents/skills/create-plugin.md) — Cómo crear un plugin
- 🧩 [`.agents/skills/create-component.md`](.agents/skills/create-component.md) — Cómo crear un componente
- ⚡ [`.agents/skills/reactive-directives.md`](.agents/skills/reactive-directives.md) — Directivas reactivas en HTML (Zero JS)
