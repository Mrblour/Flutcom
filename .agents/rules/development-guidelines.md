# Reglas de Desarrollo y Buenas Prácticas de Flutcom

Este archivo contiene las directrices de desarrollo para el entorno de trabajo `.agents/rules/`.

## 1. Patrones de Rutas y Navegación
- Toda nueva ruta debe definirse en `flutcom.config.js` bajo el objeto `routes` o `authRoutes`.
- Las rutas protegidas deben protegerse con `app.guard(nombreRuta, validadorFn, rutaRedireccion)`.
- El hash `#` es el mecanismo de transporte de vistas. Todo enlace interno de navegación debe apuntar a `href="#nombre-de-ruta"`.

## 2. Componentes y Vistas
- Las vistas en `resources/views/` deben ser fragmentos HTML limpios (sin `<html>`, `<head>`, o `<body>`).
- Flutcom inyecta automáticamente el fragmento dentro de `<main id="content">`.
- Cada vista debe tener un contenedor padre descriptivo y clases responsivas adecuadas (móvil, tablet, escritorio).

## 3. Plugins
- **Plugins Nativos**: Se alojan en su propia carpeta `plugins/<nombre>/` con el par obligatorio `<nombre>.flutcom.js` (o `.fc.js`) y `<nombre>.flutcom.json` (o `.fc.json`). Se declaran en `plugins: ['<nombre>']` en `flutcom.config.js`.
- **Scripts Tradicionales / Abiertos**: Se alojan en `plugins/` o `plugins/opensource/` y se declaran en `resources: [...]` en `flutcom.config.js`.
- Deben inicializarse de manera idempotente y responder a las navegaciones mediante `onNavigate(view, container)` o el evento `afterEnter`.

## 4. Estilos y CSS
- Tailwind v4 CLI compila `src/input.css` hacia `assets/vendor/tailwind/tailwind.css`.
- Estilos personalizados del framework van en `assets/css/flutcom.css` o `assets/css/style.css`.
- No alterar dependencias innecesariamente.

## 5. Registro Obligatorio de Actualizaciones (Update Log)
- **REGLA DE ORO**: Todo cambio importante, nueva característica, refactorización, plugin o evolución arquitectónica **DEBE registrarse inmediatamente en `update-log.md`** con la fecha y el detalle de archivos modificados.
- El registro en `update-log.md` es la fuente de verdad histórica del proyecto tanto para el usuario como para los agentes de IA.
