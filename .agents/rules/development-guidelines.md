# Reglas de Desarrollo y Buenas Prácticas de Flutcom

Este archivo contiene las directrices de desarrollo para el entorno de trabajo `.agents/rules/`.

## 1. Patrones de Rutas y Navegación
- Toda nueva ruta debe definirse en `flutcom.config.js` bajo el objeto `routes` o `authRoutes`.
- Soporta formato simple (`"ruta": "path.html"`) o enriquecido con SEO (`{ view, title, description, keywords, robots, image, canonical, jsonLd }`).
- Las rutas protegidas deben protegerse con `app.guard(nombreRuta, validadorFn, rutaRedireccion)`.
- El hash `#` es el mecanismo de transporte de vistas. Todo enlace interno de navegación debe apuntar a `href="#nombre-de-ruta"` o usar directivas declarativas `fc-go="nombre-de-ruta"`.

## 2. Componentes y Vistas
- Las vistas en `resources/views/` deben ser fragmentos HTML limpios (sin `<html>`, `<head>`, o `<body>`).
- Flutcom inyecta automáticamente el fragmento dentro de `<flut-main>`.
- Cada vista debe tener un contenedor padre descriptivo y clases responsivas adecuadas (móvil, tablet, escritorio).
- Los componentes reutilizables residen en `resources/components/` y pueden invocarse como tags custom (ej. `<flut-alert title="...">`) con interpolación de `{{ slot }}` y atributos `{{ prop }}`.

## 3. Plugins
- **Plugins Nativos**: Se alojan en su propia carpeta `plugins/<nombre>/` con el par obligatorio `<nombre>.flutcom.js` (o `.fc.js`) y `<nombre>.flutcom.json` (o `.fc.json`). Se declaran en `plugins: ['<nombre>']` en `flutcom.config.js`.
- **Scripts Tradicionales / Abiertos**: Se alojan en `plugins/` o `plugins/opensource/` y se declaran en `resources: [...]` en `flutcom.config.js`.
- Deben inicializarse de manera idempotente y responder a las navegaciones mediante `onNavigate(view, container)` o el evento `afterEnter`.

## 4. Estilos y CSS
- Tailwind v4 CLI compila `src/input.css` hacia `assets/vendor/tailwind/tailwind.css`.
- Estilos personalizados del framework van en `assets/css/flutcom.css` o `assets/css/style.css`.
- No alterar dependencias innecesariamente.

## 5. Control de Calidad y Tipos
- Todo cambio debe pasar `npm run check` (TypeScript estricto vía JSDoc sin errores).
- Todas las pruebas unitarias deben pasar con `npm test` (Vitest).

## 6. Registro de Cambios y Archivos Locales
- Los registros de actualización y notas personales locales (como `update.md` y `croquis.md`) se mantienen en local y no deben comitearse al repositorio público.
