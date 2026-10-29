# Flutcom — Instrucciones para Claude Code

Antes de realizar cualquier acción en este proyecto, **lee obligatoriamente**:

- [`AGENTS.md`](AGENTS.md) — Resumen rápido y reglas de oro
- [`.agents/README.md`](.agents/README.md) — Índice completo de la documentación para agentes
- [`.agents/rules/architecture.md`](.agents/rules/architecture.md) — Reglas arquitectónicas estrictas
- [`.agents/rules/code-style.md`](.agents/rules/code-style.md) — Estilo de código obligatorio
- [`.agents/rules/design-system.md`](.agents/rules/design-system.md) — Sistema visual de la UI
- [`.agents/context/project-overview.md`](.agents/context/project-overview.md) — Qué es Flutcom y para qué sirve
- [`.agents/context/file-map.md`](.agents/context/file-map.md) — Mapa de todos los archivos del proyecto

## Reglas críticas (resumen mínimo)

- ❌ NO uses librerías de runtime (React, Vue, Angular, etc.)
- ❌ NO modifiques `flutcom/core.js` sin permiso explícito del usuario
- ✅ Toda nueva ruta DEBE registrarse en `flutcom.config.js`
- ✅ Todo nuevo plugin DEBE declararse en `resources[]` de `flutcom.config.js`
- ✅ El estado global se maneja SIEMPRE con `window.flutcomApp.store`
- ✅ Las vistas son fragmentos HTML (sin `<html>`, `<head>`, `<body>`)
- ✅ Usar Vanilla JS (ES Modules) y Tailwind v4 como únicos toolings

## Skills disponibles (guías paso a paso)

Consulta antes de ejecutar tareas frecuentes:

- [`.agents/skills/add-route.md`](.agents/skills/add-route.md) — Añadir una nueva ruta/vista
- [`.agents/skills/create-plugin.md`](.agents/skills/create-plugin.md) — Crear un plugin
- [`.agents/skills/create-component.md`](.agents/skills/create-component.md) — Crear un componente
