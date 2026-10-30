<p align="center">
  <a href="https://mrblour.github.io/Flutcom/">
    <img src="assets/img/flutcom-banner.svg" alt="Flutcom Banner" width="100%" />
  </a>
</p>

<div align="center">

[![License](https://img.shields.io/badge/License-MIT-111827.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.2.1-0284c7.svg)](#)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-ES%20Modules-eab308.svg)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](#)
[![Live Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-22c55e.svg?logo=github&logoColor=white)](https://mrblour.github.io/Flutcom/)

</div>

<p align="center">
  <a href="https://mrblour.github.io/Flutcom/">🌐 <strong>Live Demo</strong></a> •
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMrblour%2FFlutcom">▲ <strong>Deploy to Vercel</strong></a> •
  <a href="https://mrblour.github.io/doc-flutcom/#docs">📖 <strong>Official Docs</strong></a>
</p>

---

## Why Flutcom?

Modern web frameworks often require hundreds of megabytes of `node_modules`, complex bundler configurations, and heavy Virtual DOM abstractions just to ship a simple interactive Single Page Application (SPA).

**Flutcom** is built for static environments (GitHub Pages, Vercel, Netlify, Cloudflare Pages). It gives you client-side hash routing, reusable components with slot projection, zero-JS declarative reactivity (`fc-model`), and a reactive global store using standard **Vanilla JS (ES Modules)** and direct browser DOM manipulation — with **zero runtime dependencies**.

### Objective Technical Comparison

| Feature | ⚡ Flutcom | React | Vue | Classic Vanilla JS |
| :--- | :--- | :--- | :--- | :--- |
| **Runtime Overhead** | **0 KB** (zero external dependencies) | ~140 KB (`react` + `react-dom`) | ~90 KB (`vue` runtime) | 0 KB |
| **DOM Engine** | **Direct Native DOM** | Virtual DOM with diffing | Virtual DOM with Proxies | Manual DOM manipulation |
| **SPA Router** | **Built-in Hash Router** (`#home`) | Requires external library (`react-router`) | Requires external library (`vue-router`) | None (handwritten `hashchange`) |
| **Reactivity** | **Declarative Directives** (`fc-model`, `fc-bind`) | State & Hooks (`useState`) | Reactive Directives (`v-model`) | Manual event listeners & `innerHTML` |
| **Build Step** | **Optional** (runs directly in browser) | Required (JSX / Vite / Babel) | Required (`.vue` compiler) | None |
| **Learning Curve** | **Minimal** (standard HTML, CSS & JS) | Moderate to steep | Moderate | Low |
| **Best Suited For** | Static sites, landing pages, micro-SPAs, dashboards | Large-scale apps & complex web platforms | Medium-to-large interactive apps | Single-purpose scripts |

---

## Quick Start (30 Seconds)

Create a new project using the official interactive CLI:

```bash
npm create flutcom@latest
```

Or clone the repository directly:

```bash
git clone https://github.com/Mrblour/Flutcom.git my-app
cd my-app
npm install
npm run dev
```

### Development Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local dev server with live-reloading and Tailwind CSS continuous compilation. |
| `npm run build` | Compiles and minifies CSS, packaging production-ready static assets into the `dist/` folder. |
| `npm run preview` | Serves the production `dist/` build locally for verification. |

---

## Code Taste

### 1. Reusable Components & Zero-JS Two-Way Binding
```html
<!-- Component with slot projection and declarative reactivity -->
<flut-card title="My Profile">
  <!-- fc-model automatically syncs with the global store -->
  <input fc-model="username" placeholder="Type your username..." />
  
  <!-- fc-bind projects the value in real-time -->
  <p>Hello, <strong fc-bind="username">Guest</strong>!</p>

  <button fc-click="Flut.toast('Profile saved!')">Save</button>
</flut-card>
```

### 2. Declarative Route Mapping (`flutcom.config.js`)
```javascript
export const routes = {
  home:    { view: "resources/views/home.html",    title: "Home" },
  about:   { view: "resources/views/about.html",   title: "About Us" },
  contact: { view: "resources/views/contact.html", title: "Contact" }
};
```

### 3. Unified Global Helper (`Flut`)
```javascript
// Programmatic SPA navigation
Flut.go('about');

// Reactive global store
Flut.set('theme', 'dark');
const currentTheme = Flut.get('theme');

// Instant toast notifications
Flut.toast('Operation completed successfully');
```

---

## Deployment

Because Flutcom produces pure static assets and leverages native client-side hash routing (`#home`, `#about`), it deploys to any static hosting provider without requiring server-side URL rewrites.

### 1-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMrblour%2FFlutcom)

#### Recommended Vercel Settings:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

*(The repository includes a root `vercel.json` file pre-configuring these settings automatically).*

---

## Documentation & Resources

For the full API reference, step-by-step guides, and native plugin development:

👉 **[Flutcom Official Documentation](https://mrblour.github.io/doc-flutcom/#docs)**  
👉 **[GitHub Wiki](https://github.com/Mrblour/Flutcom/wiki)**

- [Creating Custom HTML Components](https://github.com/Mrblour/Flutcom/wiki/Components)
- [Reactive Directives Reference (`fc-*`)](https://github.com/Mrblour/Flutcom/wiki/Directives)
- [Zero-Code Native Plugin System](https://github.com/Mrblour/Flutcom/wiki/Plugins)
- [Navigation Lifecycle & Route Guards](https://github.com/Mrblour/Flutcom/wiki/Routing)

---

## License

Distributed under the [MIT](LICENSE) License. Free and open-source software for personal and commercial use.
