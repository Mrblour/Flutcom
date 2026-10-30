# 📝 Flutcom — Registro de Actualizaciones (Update Log)

Historial cronológico de cambios, mejoras y evolución arquitectónica del framework Flutcom.

---

## [1.2.1] — 2026-10-29

### ☁️ Despliegue & Integración Vercel
- **Soporte y Documentación para Vercel (`vercel.json`, `README.md`)**:
  - Creado `vercel.json` con configuración para detección automática de `buildCommand` (`npm run build`) y `outputDirectory` (`dist`).
  - Actualizado [README.md](file:///c:/Users/chamb/Desktop/update/README.md) con insignias oficiales de Vercel, enlace a demo en vivo en Vercel, botón oficial *1-Click Deploy with Vercel* y guía de configuración paso a paso.

---

## [1.2.0] — 2026-10-28

### 🛡️ Seguridad y Robustez (Parches de Auditoría)
- **Mitigación DOM XSS en Componentes (`flutcom/core.js`)**:
  - Incorporado el método auxiliar `_escapeHtml()` para sanear caracteres peligrosos (`&`, `<`, `>`, `"`, `'`) en valores dinámicos.
  - Saneamiento automático de todas las propiedades/atributos (`props`) interpoladas en las plantillas de componentes (`<flut-*>`), previniendo ejecución arbitraria de scripts mientras se preserva el contenido HTML intencional de slots (`{{ slot }}`).
- **Mitigación DoS por Inyección de Selectores CSS (`plugins/menu/menu.flutcom.js`)**:
  - Implementado escape de fragmentos URL (`CSS.escape`) al consultar enlaces de navegación activa `a[data-view="..."]`.
  - Envuelto en bloque de protección ante excepciones DOM para evitar la denegación de servicio (DoS) y el bloqueo del ciclo de vida de la SPA ante fragmentos maliciosos o malformados (ej. `/#"]`).
- **Prevención de Colisión con Prototipos de Objeto en Enrutamiento (`flutcom/core.js`)**:
  - Verificación estricta de propiedad propia (`Object.prototype.hasOwnProperty`) en resolución de rutas (`_resolveRoute`), enlaces de navegación (`_assignNavLinks`) y guards (`_initRouter`).
  - Previene que rutas coincidentes con métodos nativos (`#toString`, `#valueOf`, `#__proto__`) resuelvan objetos inválidos, evitando cargas anidadas recursivas de la página base y activando limpiamente la vista 404.

---

## [Unreleased / En Desarrollo] — 2026-10-27

### 🧩 Sistema de Plugins Nativos Zero-Code & Entorno Cerrado
- **Convención de Plugins Nativos de Flutcom**:
  - Cada plugin vive en su propia subcarpeta dentro de `plugins/<nombre>/`.
  - **Par obligatorio de archivos**: Requiere estrictamente `<nombre>.flutcom.js` (o `.fc.js`) y `<nombre>.flutcom.json` (o `.fc.json`). Sin ambos, el motor ignora la carpeta.
  - **Configuración Zero-Code (`.json`)**: Configuración externa estilo Minecraft/WordPress sin tocar código JS.
  - **Entorno cerrado pero no limitado**: Cada plugin corre en su propio ámbito modular sin contaminar el `window` global, pero con acceso a `app`, `Flut`, DOM y ciclo de vida (`init`, `onNavigate`).
- **Separación de Scripts OpenSource y Tradicionales**:
  - Creada la carpeta `plugins/opensource/` para librerías de terceros y scripts JS que no sigan el estándar nativo.
  - Declarados mediante `resources: [{ type: "js", file: "..." }]` en `flutcom.config.js`.
- **Motor de Carga en `flutcom/core.js`**:
  - Nuevo método `_loadFlutcomPlugins()`: lee el JSON, valida `enabled: true`, importa dinámicamente el módulo JS y ejecuta `init(app, config)`.
  - En cada navegación SPA, `_navigate()` invoca automáticamente `onNavigate(viewName, container)` en todos los plugins activos.
- **Configuración Centralizada en `flutcom.config.js`**:
  - Nuevo array exportado `plugins = []` conectado directamente al bootstrap de `flutcom/main.js`.
- **Primer Plugin Oficial Piloto: `plugins/timer/`**:
  - Implementado con `timer.flutcom.json` y `timer.flutcom.js`.
  - Temporizadores y cuentas regresivas Zero-JS mediante directivas HTML declarativas (`data-timer="60"`, `data-format="mm:ss"`, `data-warning="5"`, `data-end="..."`).
  - Reinicio declarativo sin JS vía atributo `data-timer-restart="#id-del-timer"`.
  - Panel interactivo en vivo añadido al Poster 08 en `resources/views/public/ejemplos.html` con 3 demostraciones (estándar, alerta y prueba rápida de 10s).
- **Migración de Plugins Existentes al Estándar Nativo**:
  - `plugins/menu/`: Migrado desde script suelto a plugin nativo con `menu.flutcom.json` y `menu.flutcom.js` (soporte de `onNavigate`, persistencia y clases activas sin contaminar el scope global).
  - `plugins/animations/`: Migrado desde script suelto a plugin nativo con `animations.flutcom.json` y `animations.flutcom.js` (inyección modular de estilos y re-escaneo con `IntersectionObserver` por navegación SPA).
  - `plugins/responsive/`: Migrado desde script suelto a plugin nativo con `responsive.flutcom.json` y `responsive.flutcom.js`. Inyecta clases (`.is-mobile`, `.is-tablet`, `.is-desktop`) y sincroniza reactivamente con el store global de Flutcom (`Flut.get('isMobile')` y soporte para `fc-show="isMobile"`).
  - Removidos los scripts sueltos antiguos `plugins/menu.js`, `plugins/animations.js` y `plugins/responsive.js`.
  - Registrados en `flutcom.config.js` bajo `plugins: ["timer", "menu", "animations", "responsive"]`.
- **Regla Estricta para Agentes de IA**:
  - Añadida regla de oro #6 en `AGENTS.md` y sección 5 en `.agents/rules/development-guidelines.md` que exige registrar obligatoriamente todo cambio importante en `update-log.md`.
- **Plan y Especificación de Componentes HTML v2 (`pronto2.md` y `pronto.md`)**:
  - Definido el estándar completo para `resources/components/`: sintaxis de invocación nativa (`<flut-nombre>`), props booleanas automáticas, valores por defecto (`{{ prop ?? 'val' }}`), limpieza estricta de props omitidas y soporte de slots nombrados (`{{ slot:footer }}`).
  - Creado documento dedicado [**`pronto2.md`**](file:///c:/Users/chamb/Desktop/update/pronto2.md) y sección ampliada en [**`pronto.md`**](file:///c:/Users/chamb/Desktop/update/pronto.md).
- **Documentación y Skills de Agentes**:
  - Actualizados `AGENTS.md`, `.agents/README.md`, `.agents/rules/architecture.md`, `.agents/rules/development-guidelines.md`, `.agents/context/file-map.md` y `.agents/skills/create-plugin.md`.

---

## [Unreleased / En Desarrollo] — 2026-10-26

### 🎨 Rediseño Monocromático Minimalista (Estilo Vercel) y Logo Nativo en Negro
- **Logo SVG nativo en negro (`assets/img/flutcom.svg`)**:
  - Incorporada matriz de color SVG (`feColorMatrix`) y regla CSS de brillo nulo para renderizar el logo en negro puro directamente en el vector sin depender de clases `invert` externas.
- **Limpieza de colores oscuros y gradientes en CSS (`assets/css/style.css` y `assets/css/flutcom.css`)**:
  - Eliminados todos los fondos oscuros (`#09090b`, `#27272a`), esferas de brillo multicolor y gradientes hiper-saturados estilo IA.
  - Barra de progreso `#fc-bar` simplificada a 2px negro minimalista (`#000000`).
  - Paleta monocromática 100% estilo Vercel Light: blanco puro (`#ffffff`), bordes de 1px en gris neutro (`#eaeaea`), textos secundarios legibles (`#666666`) y elementos de acento en negro profundo (`#000000`).
- **Vista Home y 404 simplificadas tipo starter**:
  - `home.html` y `404.html` completamente libres de orbes difuminados y gradientes artificiales.
  - Maquetación 100% basada en utilidades Tailwind con diseño sobrio y limpio.
- **Reducción y limpieza radical de `assets/css/style.css`**:
  - Eliminadas más de 230 líneas de clases redundantes (`.bento-card`, `.fc-header`, etc.).
  - Como Tailwind cubre todo el diseño de componentes, `style.css` se preserva solo con el layout base esencial (`.app-shell`) y un espacio despejado para estilos personalizados del usuario.

---

## [1.1.0] — 2026-10-25

### 🤖 Configuración y Soporte para Agentes de IA
- **Carpeta `.agents/` creada**:
  - `rules/architecture.md`: Normas arquitectónicas estrictas del framework.
  - `rules/code-style.md`: Convenciones de Vanilla JS, HTML semántico y Tailwind CSS.
  - `rules/design-system.md`: Sistema de diseño visual (Apple/Linear/Vercel style, tipografía, paleta y micro-animaciones).
  - `context/project-overview.md`: Resumen detallado del framework y su propósito.
  - `context/file-map.md`: Mapa completo de todos los archivos y carpetas del proyecto.
  - `skills/add-route.md`: Guía paso a paso para crear nuevas rutas y vistas.
  - `skills/create-plugin.md`: Guía paso a paso para desarrollar plugins modulares.
  - `skills/create-component.md`: Guía para crear y modularizar componentes HTML.
- **Archivos puente universales**:
  - `AGENTS.md`: Punto de entrada universal en la raíz.
  - `.cursorrules`: Compatibilidad inmediata con Cursor IDE.
  - `CLAUDE.md`: Compatibilidad inmediata con Claude Code (Anthropic).
  - `.github/copilot-instructions.md`: Compatibilidad con GitHub Copilot.

---

## ✅ Motor de Componentes v2 + Helper Global `Flut`

### Nuevas syntaxis de componentes (sin JSON, sin JS)

**Antes (complejo, propenso a errores):**
```html
<div fc-component="resources/components/alert.html"
     fc-props='{"icon":"bi bi-check","title":"OK","description":"Guardado"}'>
</div>
```

**Ahora — 3 formas equivalentes y simples:**

```html
<!-- Forma 1: Tag propio de Flutcom (recomendado) -->
<flut-alert icon="bi bi-check" title="OK" description="Guardado correctamente" />

<!-- Forma 2: Tag genérico con name -->
<flut-component name="alert" icon="bi bi-check" title="OK" description="Guardado" />

<!-- Forma 3: Legado (sigue funcionando para compatibilidad) -->
<div fc-component="resources/components/alert.html"
     fc-props='{"icon":"bi bi-check","title":"OK","description":"Guardado"}'>
</div>
```

### Soporte de Slots (contenido dinámico dentro del componente)

Los componentes pueden recibir HTML hijo con `{{ slot }}`:

```html
<!-- resources/components/card.html -->
<div class="bg-white rounded-[2rem] p-8">
  <h2 class="text-2xl font-bold">{{ title }}</h2>
  <div class="mt-4">{{ slot }}</div>
</div>
```

```html
<!-- En cualquier vista -->
<flut-card title="Mi Panel">
  <p>Cualquier HTML aquí se inyecta en el slot.</p>
  <button>Acción</button>
</flut-card>
```

### Nuevo helper global `Flut`

```js
Flut.go('about');              // Navegar a una ruta
Flut.set('usuario', 'Carlos'); // Guardar en el store
Flut.get('usuario');           // Leer del store
Flut.watch('usuario', fn);     // Reaccionar a cambios del store
Flut.modal('login').open();    // Abrir/cerrar modales
Flut.toast('¡Guardado!');      // Notificación toast
```

### Archivos modificados y creados
- `flutcom/core.js` → Soporte para Directivas Declarativas (`_bindDirectives` y método público `bind()`) + Motor de componentes v2.
- `flutcom/flut.js` → Métodos auxiliares de store: `toggle()`, `increment()`, `decrement()`, `clear()`.
- `flutcom/main.js` → Exposición de helper `Flut` global.
- `flutcom.config.js` → Registrada nueva ruta `#ejemplos`.
- `resources/views/public/ejemplos.html` → Demostración interactiva en vivo con sandbox para `fc-bind`, `fc-model`, `fc-show`, `fc-go` y `fc-toggle`.
- `resources/components/alert.html` → Estilizado moderno con soporte de slot.
- `resources/components/card.html` → Componente Bento card con icon, badge y slot.
- `resources/components/badge.html` → Componente chip/pill de estado reutilizable.
- `resources/partials/header.html` → Enlace a "Ejemplos" en la barra de navegación superior.
- `resources/views/public/home.html` → Caja interactiva de acceso directo al laboratorio de componentes.

---

## ⚡ Directivas Reactivas en HTML (Zero JavaScript)

Permiten conectar el HTML directamente con el estado global sin escribir código JS en scripts:

| Directiva | Qué hace | Ejemplo |
| :--- | :--- | :--- |
| `fc-model="clave"` | Enlace bidireccional en inputs, textarea, select, checkbox | `<input fc-model="nombre" />` |
| `fc-bind="clave"` | Muestra el valor del store y se actualiza solo | `Hola, <span fc-bind="nombre"></span>` |
| `fc-show="clave"` | Muestra/oculta un elemento según si es verdad (soporta `!`) | `<div fc-show="mostrar">Contenido</div>` |
| `fc-go="ruta"` | Navega a una ruta sin escribir onclick ni JS | `<button fc-go="home">Inicio</button>` |
| `fc-toggle="id"` | Alterna la visibilidad de cualquier elemento por ID | `<button fc-toggle="menu">Menú</button>` |
| `fc-click="acción"` | Dispara helpers o código seguro al hacer clic | `<button fc-click="Flut.toast('¡Hola!')">Toast</button>` |

---

## 🧹 Limpieza y Modernización del Flujo de Trabajo
- **Eliminación de `flutcom.bat`**: Se removió el script `.bat` obsoleto. El estándar ahora es totalmente multiplataforma (Windows, Linux, macOS) usando la terminal:
  ```bash
  npm run dev
  ```
- **Metadata de Framework en `package.json`**:
  - `description` actualizada a: *"Flutcom – a ultra-fast, zero-dependency SPA framework for static sites"*.
  - Keywords agregados (`flutcom`, `spa`, `vanilla-js`, `framework`).
- **Documentación de Resolución de Problemas en Windows (PowerShell Execution Policy)**:
  - Añadido aviso importante en inglés en `README.md` explicando cómo habilitar la ejecución de scripts (`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force`) o usar `npm.cmd` si Windows bloquea `npm.ps1`.
- **Auto-detección y resilencia en `run/dev.js`**:
  - `dev.js` ahora detecta si Node.js no está en `PATH` en Windows e inyecta la ruta por defecto automáticamente para los subprocesos de Tailwind y Serve.

---

## 🧹 Optimización y Limpieza Semántica de `index.html` — 2026-10-26

### Archivos modificados
- `index.html`

### Cambios aplicados

**`<head>` — Limpieza de meta tags innecesarios:**
- ✂️ Eliminados los bloques completos de **OpenGraph** y **Twitter Card** que apuntaban a URLs externas temporales (imagen de Pinterest, URL de GitHub sin personalizar). Producían ruido en el árbol sin aportar valor real.
- ✂️ Reducidos los pesos cargados de **Google Fonts Inter**: de 7 variantes (`300;400;500;600;700;800;900`) a 5 (`400;500;600;700;800`), eliminando los pesos `300` (nunca usado en el proyecto) y `900` (ultra-black, solo decorativo en dev.js por consola).
- ✅ Reordenados los `<link>` de CSS siguiendo el orden lógico de capas:
  1. Tailwind (utilitarios generales)
  2. `style.css` (estilos de la app)
  3. `flutcom.css` (motor: barra de progreso y transiciones, última capa)
- ✅ Corregido el idioma del documento de `lang="en"` a `lang="es"` (el contenido del proyecto es en español).
- ✅ Atributo `rel="shortcut icon"` modernizado a `rel="icon"`.

**`<body>` — Mejora de semántica y accesibilidad:**
- ✅ `<div id="navbar">` → `<header id="navbar">` (semántica correcta conforme a `.agents/rules/code-style.md`).
- ✅ `<div id="footer">` → `<footer id="footer">` (semántica correcta).
- ✅ `<main id="content">` ahora incluye `role="main"`, `aria-live="polite"` y `aria-label` para accesibilidad (lectores de pantalla notifican cambios de vista automáticamente).
- ✅ Añadidos comentarios descriptivos sobre qué archivo parcial inyecta Flutcom en cada contenedor.

### Resultado
- `index.html` pasó de **65 líneas / 2855 bytes** a **53 líneas / ~1900 bytes**.
- El árbol DOM inicial es ahora 100% semántico y compatible con lectores de pantalla.
- Los IDs de contrato (`#navbar`, `#content`, `#footer`) se mantienen intactos para el motor de Flutcom Core.

---

## ⚡ Layout Declarativo de Flutcom Core (`<flut-navbar>`, `<flut-main>`, `<flut-footer>`) — 2026-10-26

### Archivos modificados
- `flutcom/core.js`
- `assets/css/flutcom.css`
- `assets/css/style.css`
- `index.html`

### Cambios aplicados
- **Motor Flutcom Core (`flutcom/core.js`)**:
  - Implementado helper `_getContainer(name)` que resuelve automáticamente:
    1. Tags declarativos: `<flut-navbar>`, `<flut-header>`, `<flut-main>`, `<flut-content>`, `<flut-footer>`.
    2. Directivas: `[fc-partial="navbar"]`, `[fc-partial="header"]`, `[fc-partial="footer"]`, `[fc-main]`, `[fc-content]`.
    3. IDs clásicos: `#navbar`, `#content`, `#footer` (100% retrocompatible).
  - Actualizados `_navigate()`, `_show404()` y `_loadHTML()` para resolver el contenedor dinámicamente vía `_getContainer()`.
- **Estilos (`assets/css/flutcom.css` & `assets/css/style.css`)**:
  - Declarado `display: block;` para los nuevos elementos custom en `flutcom.css`.
  - Integrado `.app-shell flut-main, .app-shell flut-content` en el flex layout de `style.css`.
- **Estructura del Shell (`index.html`)**:
  - Árbol DOM modernizado a la sintaxis nativa de Flutcom:
    ```html
    <div class="app-shell">
      <flut-navbar></flut-navbar>
      <flut-main role="main" aria-live="polite" aria-label="Contenido de la vista actual"></flut-main>
      <flut-footer></flut-footer>
    </div>
    ```

---

## 🐛 Bugfix Crítico — `LAYOUT_TAGS` en `_mountComponents` — 2026-10-26

### Problema detectado
Los tags `<flut-navbar>`, `<flut-main>` y `<flut-footer>` introducidos en `index.html`
eran recogidos por `_mountComponents` como si fueran **componentes HTML** (cualquier
`<flut-*>` era tratado igual). El motor intentaba cargar archivos como
`resources/components/navbar.html` que no existen, y al no encontrarlos **eliminaba
el nodo del DOM silenciosamente** (`el.remove()`), rompiendo el layout completo.

### Solución aplicada (`flutcom/core.js`)
- Añadida propiedad estática `Flutcom.LAYOUT_TAGS` como fuente de verdad única:
  ```js
  static get LAYOUT_TAGS() {
    return new Set(['flut-navbar', 'flut-header', 'flut-main', 'flut-content', 'flut-footer']);
  }
  ```
- `_mountComponents` ahora excluye estos tags del pipeline de componentes:
  ```js
  return tag.startsWith('flut-') && tag !== 'flut-component' && !Flutcom.LAYOUT_TAGS.has(tag);
  ```
- Extender en el futuro es trivial: agregar el tag a `LAYOUT_TAGS` lo protege automáticamente.

---

## 🧹 Limpieza y Simplificación de `index.html` — 2026-10-26

### Archivo modificado
- `index.html`

### Cambios aplicados
- **Eliminación de comentarios redundantes**: Se removieron todos los comentarios explicativos que sobrecargaban el código (`<!-- Navbar: ... -->`, `<!-- Google Fonts ... -->`, etc.).
- **Estructura ultra-limpia**: El documento HTML queda reducido a su mínima y más elegante expresión (32 líneas), manteniendo la semántica y accesibilidad intactas.

---

## 🚦 Rutas Enriquecidas con SEO Declarativo (Híbrido) — 2026-10-26

### Archivos modificados
- `flutcom.config.js`
- `flutcom/core.js`
- `flutcom/main.js`

### Cambios aplicados

**`flutcom.config.js`** — Rutas ahora admiten formato objeto con SEO:
```js
export const routes = {
  home: {
    view        : "resources/views/public/home.html",
    title       : "Inicio",
    description : "Micro-framework SPA ultraligero sin dependencias de runtime.",
  },
};
```

**`flutcom/core.js`** — Nuevo método `_resolveRoute(hash)`:
- Normaliza rutas string o objeto a `{ path, title, description }`.
- Guarda la ruta resuelta en `this._currentRoute` antes de navegar.
- Retrocompatible: si la ruta es string, genera title y description automáticamente.

**`flutcom/main.js`** — Hook `afterEnter` actualizado:
- Lee `app._currentRoute` para obtener el `title` y `description` reales.
- Actualiza `document.title`, `<meta name="description">` y Open Graph en cada navegación.
- `_setMeta` rediseñada para soportar `name=` y `property=` correctamente.

---

## 🧪 Actualización del Laboratorio de Ejemplos & Documentación — 2026-10-26

### Archivos modificados
- `resources/views/public/ejemplos.html`
- `README.md`

### Mejoras incorporadas
1. **Sección 4 enriquecida**:
   - Demostración de condición invertida `fc-show="!clave"`.
   - Demostración de ejecución declarativa de acciones con `fc-click="Flut.toast(...)"`.
2. **Nueva Sección 6 (SEO Dinámico en Vivo)**:
   - Inspector en tiempo real que lee directamente del DOM `document.title`, `<meta name="description">` y `<meta property="og:title">`.
   - Botón para refrescar metadatos y probar navegación hacia `#home`.
3. **Nueva Sección 7 (Sintaxis Genérica & Layout Seguro)**:
   - Demostración de `<flut-component name="badge">` conviviendo con `<flut-badge>`.
   - Documentación y visualización de la protección de etiquetas de layout (`<flut-navbar>`, `<flut-main>`, `<flut-footer>`).
4. **Sincronización en `README.md`**:
   - Nuevas secciones "Modern Component Syntax & Zero-JS Reactivity" y "Per-Route Dynamic SEO" con ejemplos prácticos de código.

---

## 🎨 Rediseño Visual Editorial "Sites For Developers" — 2026-10-26

### Archivo modificado
- `resources/views/public/ejemplos.html`
- `assets/img/flutcom_laptop_mockup.jpg`
- `assets/img/flutcom_phone_mockup.jpg`

### Características del nuevo diseño
1. **Fondo Papel Cuadriculado (Graph Paper Aesthetic)**:
   - Fondo cálido texturizado con cuadrícula milimetrada técnica en CSS puro.
2. **Formato Carrusel de Posters Editoriales**:
   - Encabezados técnicos (`Sites for developers` / `flutcom.net`).
   - Títulos gigantes e impactantes con acentos tipográficos audaces.
   - Mockups de hardware (MacBook en perspectiva y smartphone en mano monocromática) generados a medida.
   - Marcos de pantalla estilo macOS/terminal que albergan código y componentes vivos interactivos.
   - Footers con avatar de autor (`@yBlour`), badge de arquitectura y botón funcional `🔖 SAVE FOR LATER`.
3. **100% Interactivo y Funcional**:
   - Mantiene componentes `<flut-alert>`, slots, Two-Way Data Binding (`fc-model`), reactividad en vivo (`fc-bind`), condiciones (`fc-show="!clave"`), toasts e inspector de SEO dinámico.

---

## 💎 Rediseño Glassmorphism del Header & Unificación de Marca — 2026-10-26

### Archivos modificados
- `resources/partials/header.html`
- `resources/partials/footer.html`

### Cambios aplicados
1. **Header flotante estilo Apple / Linear**:
   - Píldora moderna con efecto `glassmorphism` (`bg-white/75`, `backdrop-blur-xl`, `border border-black/5`, sombra difuminada suave).
   - Soporte automático para `.scrolled` al hacer scroll.
2. **Navegación simplificada centrada en Home**:
   - Enlace `Inicio` (`#home`), botón a GitHub y CTA directo a Star.
   - Eliminados enlaces hardcodeados temporales a vistas que no formarán parte de producción.
3. **Identidad unificada**:
   - Sustituido `MyApp` por `Flutcom v1.1` tanto en Header como en Footer.

---

## ⚡ Starter Minimalista Estilo Astro / Vite / React — 2026-10-26

### Archivos modificados
- `resources/partials/header.html`
- `resources/views/public/home.html`
- `resources/partials/footer.html`

### Cambios aplicados
1. **Header Minimalista**:
   - Barra limpia `sticky top-0` con fondo `bg-white/80` y borde sutil.
   - Logo negro natural de Flutcom (sin filtro `invert`), con nombre y versión `v1.1`.
   - Navegación simplificada: `Home` y `GitHub`.
2. **Home Estilo Starter Oficial (Astro / React)**:
   - Logo negro icónico centrado con efecto de elevación.
   - Titular limpio: `Welcome to Flutcom`.
   - Caja interactiva: *"To get started, edit resources/views/public/home.html"*.
   - Botón interactivo `"count is 0"` reactivo al instante.
   - Comando `$ npm run dev` copiable en un clic.
   - 3 tarjetas directas de recursos: Documentation, Modular UI y Zero Runtime.
3. **Footer Ligero**:
   - Línea minimalista con información de autor y licencia MIT.





