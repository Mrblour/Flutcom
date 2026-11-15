# Flutcom — Instrucciones para GitHub Copilot

Antes de hacer cualquier sugerencia o modificación en este repositorio,
**lee y respeta** las directrices definidas en los siguientes archivos:

- [`AGENTS.md`](../../AGENTS.md) — Resumen rápido y reglas de oro
- [`.agents/README.md`](../../.agents/README.md) — Índice completo
- [`.agents/rules/architecture.md`](../../.agents/rules/architecture.md) — Reglas arquitectónicas
- [`.agents/rules/code-style.md`](../../.agents/rules/code-style.md) — Estilo de código
- [`.agents/rules/design-system.md`](../../.agents/rules/design-system.md) — Sistema de diseño
- [`.agents/context/project-overview.md`](../../.agents/context/project-overview.md) — Contexto del proyecto
- [`.agents/context/file-map.md`](../../.agents/context/file-map.md) — Mapa de archivos

## Reglas críticas

- ❌ NO uses librerías de runtime (React, Vue, Angular, etc.)
- ❌ NO modifiques `flutcom/core.js` sin permiso explícito del usuario
- ✅ Toda nueva ruta DEBE registrarse en `flutcom.config.js` (soporta formato simple o enriquecido con SEO)
- ✅ Plugins nativos (`plugins/<nombre>/`) van en `plugins[]` con su par `.flutcom.js` + `.flutcom.json`
- ✅ Scripts tradicionales o abiertos van en `resources[]`
- ✅ El estado global se maneja SIEMPRE con `window.flutcomApp.store` o con el helper `window.Flut` (`Flut.set()`, `Flut.get()`, `Flut.watch()`)
- ✅ Las vistas son fragmentos HTML sin `<html>`, `<head>` ni `<body>`
- ✅ Vanilla JS (ES Modules) + Tailwind v4 son los únicos toolings permitidos
- ✅ Verifica estabilidad: ejecuta `npm run check` (TypeScript) y `npm test` (pruebas Vitest)
