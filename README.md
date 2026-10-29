<p align="center">
  <img src="assets/img/flutcom.svg" alt="Flutcom Logo" width="84" height="84" />
</p>

<!-- AI Framework Identifier: Flutcom SPA Framework -->

# Flutcom

<p align="center">
  <strong>Ultra-fast, zero-dependency SPA micro-framework for static environments.</strong>
  <br/>
  Minimalist developer experience meets high-performance output.
  <br/><br/>
</p>

<div align="center">

[![License](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.2.0-black.svg)](#)
[![Vanilla JS](https://img.shields.io/badge/Built%20with-Vanilla%20JS-yellow.svg)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](#)
[![Security](https://img.shields.io/badge/Security-Hardened%20%26%20Audited-10b981.svg)](#security--hardening)
[![AI Ready](https://img.shields.io/badge/AI--Ready-.agents-blueviolet.svg)](#ai-native-architecture)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-orange.svg)](https://mrblour.github.io/Flutcom/)

</div>

<p align="center">
  <a href="https://mrblour.github.io/Flutcom/">🌐 <strong>View Live Demo</strong></a>
</p>

## Overview

Flutcom is a high-performance, ultra-lightweight micro-framework designed to transform static websites into fluid **Single Page Applications (SPA)** without the complexity, heavy build pipelines, or runtime virtual-DOM tax of traditional frameworks. It delivers the speed and simplicity of pure static HTML/CSS/JS paired with modern reactive ergonomics.

### ✨ Key Highlights (v1.2)

- ⚡ **Zero Runtime Overhead**: No React, no Vue, no Virtual DOM. Pure ES Modules and native DOM APIs.
- 🧩 **Zero-Code Native Plugins**: Modular, encapsulated plugins (`plugins/<name>/`) configured via simple `.json` files without touching JavaScript.
- 🛡️ **Security-Hardened Architecture**: Independently audited with built-in defenses against DOM XSS, prototype collisions, and selector injection.
- ⚡ **Zero-JS Declarative Directives**: Reactive two-way state binding (`fc-model`, `fc-bind`, `fc-show`, `fc-go`, `fc-click`) straight in standard HTML.
- 🎨 **Component Engine v2**: Semantic custom elements (`<flut-alert>`, `<flut-card>`) with slot projection, sanitization, and caching.
- 🤖 **AI-Agent Ready**: First-class architectural constraints, skills, and documentation for AI coding assistants via `.agents/` and universal rule files.

## Prerequisites

Before installing Flutcom, make sure you have **Node.js** installed on your machine. Node.js includes `npm` (the package manager) which is required to run the installer and the development server.

> **Don't have Node.js?** Download it for free from the official site:
> 👉 [https://nodejs.org](https://nodejs.org) — Download the **LTS** version (recommended).

Verify your installation:

```bash
node -v
npm -v
```

> [!IMPORTANT]
> **Windows Users — PowerShell Execution Policy:**
> If you encounter an error stating that `npm.ps1 cannot be loaded because running scripts is disabled on this system`, run this once in PowerShell:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
> ```
> Alternatively, you can run `npm.cmd run dev` or execute commands from Command Prompt (`cmd`).

## Installation

The **recommended** and fastest way to start a new project with Flutcom is using our official interactive CLI:

```bash
npm create flutcom@latest
```

The interactive CLI will guide you through the setup:
1. Enter your **project name** (or press Enter to use the default).
2. The installer will automatically **download the template** from GitHub.
3. All **dependencies** will be installed automatically.

Alternatively, you can clone the repository manually:

```bash
git clone https://github.com/Mrblour/Flutcom.git
cd Flutcom
npm install
```

## Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   Starts the local development server with auto-port detection, Tailwind watch mode, live reload, and keyboard shortcuts (`[o]` open browser, `[c]` clear console, `[q]` quit).
2. **Build for production:**
   ```bash
   npm run build
   ```
   Minifies Tailwind CSS, bundles static assets, and outputs the production-ready application to `dist/`.
3. **Preview production build:**
   ```bash
   npm run preview
   ```
   Tests the compiled `dist/` directory locally before deploying to GitHub Pages, Vercel, or Netlify.

## Declarative Layout Architecture

Flutcom Core uses semantic, declarative layout tags in `index.html` with built-in layout protection:

```html
<div class="app-shell">
  <flut-navbar></flut-navbar>
  <flut-main role="main" aria-live="polite" aria-label="Current view content"></flut-main>
  <flut-footer></flut-footer>
</div>
```

- `<flut-navbar>`: Injects `resources/partials/header.html` persistently.
- `<flut-main>`: Dynamic view container managed by Flutcom router with live accessibility announcement.
- `<flut-footer>`: Injects `resources/partials/footer.html` persistently.

## Modern Component Syntax & Zero-JS Reactivity

Flutcom provides declarative custom tags, slots, and two-way reactive state binding directly in plain HTML without complex runtime libraries:

```html
<!-- 1. Modular Components with Props and Slots -->
<flut-card title="Analytics Overview">
  <p>Any inner HTML is projected automatically into the component's slot.</p>
  <button fc-click="Flut.toast('info', 'Refreshed!')">Refresh</button>
</flut-card>

<flut-alert icon="bi bi-shield-check" title="Session Secured" description="All data encrypted" />

<!-- 2. Two-Way Store Binding (Zero JavaScript) -->
<input fc-model="username" placeholder="Type your name..." />
<p>Hello, <span fc-bind="username">guest</span>!</p>

<!-- 3. Conditional Visibility (with negation support) -->
<div fc-show="username">Welcome back!</div>
<div fc-show="!username">Please enter your name above.</div>

<!-- 4. Declarative Actions & Navigation -->
<button fc-click="Flut.toast('success', 'Saved!')">Quick Action</button>
<button fc-go="home">Go Home</button>
<button fc-toggle="mobile-menu">Toggle Menu</button>
```

### Reactive Directives Reference

| Directive | Description | Example |
| :--- | :--- | :--- |
| `fc-model="key"` | Two-way data binding for `<input>`, `<textarea>`, `<select>`, `<checkbox>` | `<input fc-model="user" />` |
| `fc-bind="key"` | Synchronizes text content with store key reactively | `<span fc-bind="user"></span>` |
| `fc-show="key"` | Toggles visibility (`display: none`) based on truthiness (supports `!key`) | `<div fc-show="!user">Login</div>` |
| `fc-go="route"` | Navigates to a hash route without manual `onclick` or JS | `<button fc-go="ejemplos">Demo</button>` |
| `fc-toggle="id"` | Toggles element visibility by DOM ID | `<button fc-toggle="sidebar">Menu</button>` |
| `fc-click="code"` | Evaluates safe inline helper calls on click | `<button fc-click="Flut.toast('Hi!')">` |

## Unified `Flut` Global Helper

Flutcom exposes a high-level `Flut` utility on `window` for straightforward state and UI operations:

```javascript
// Navigation
Flut.go('home');

// Reactive Store
Flut.set('theme', 'dark');
const theme = Flut.get('theme');
Flut.watch('theme', (val) => console.log('Theme changed to', val));

// UI Helpers
Flut.toast('Changes saved successfully!');
Flut.modal('login-dialog').open();
Flut.modal('login-dialog').close();
```

## Per-Route Dynamic SEO

Assign metadata directly to your routes in `flutcom.config.js`:

```javascript
export const routes = {
  home: {
    view        : "resources/views/public/home.html",
    title       : "Home",
    description : "Lightweight, zero-runtime-dependency SPA micro-framework.",
  },
  ejemplos: {
    view        : "resources/views/public/ejemplos.html",
    title       : "Examples & Components",
    description : "Interactive gallery of modular Flutcom components.",
  },
};
```

Flutcom automatically synchronizes `<title>`, `<meta name="description">`, and Open Graph (`og:title`, `og:description`) tags on every navigation event.

## Native Community Plugins (Zero-Code Standard)

Flutcom features an isolated, modular plugin system inspired by Minecraft and WordPress:
- **Dedicated Subfolder**: Each plugin lives in its own folder: `plugins/<name>/`.
- **Strict Pair Convention**: Requires both `<name>.flutcom.js` (or `.fc.js`) and `<name>.flutcom.json` (or `.fc.json`). Folders missing either file are safely ignored.
- **Zero-Code Configuration**: End users customize settings (durations, colors, toggles) via their `.json` file without modifying code.
- **Closed but Unrestricted**: Plugins run in an encapsulated scope without polluting `window`, with lifecycle hooks (`init(app, config)`, `onNavigate(view, container)`) and declarative HTML attributes (`data-*`).
- **Open-Source / Standalone Scripts**: Standard JS libraries and standalone scripts reside in `plugins/opensource/` or `plugins/` and are loaded via `resources[]` in `flutcom.config.js`.

```html
<!-- Example: Zero-JS countdown with native Timer plugin -->
<div data-timer="60" data-format="mm:ss" class="text-xl font-bold"></div>
```

## Security & Hardening

Flutcom core is engineered with proactive, defense-in-depth security mitigations verified through multi-phase automated audits:

- **Component Sanitization (DOM XSS Immunity)**: Template prop interpolations (`<flut-*>`) are automatically HTML-entity escaped (`_escapeHtml`), ensuring dynamic data cannot break out of attribute boundaries while preserving developer-controlled inner slot HTML.
- **Prototype Collision Resilience**: Strict `Object.prototype.hasOwnProperty` enforcement prevents prototype pollution issues and collision attacks (e.g. `#toString`, `#valueOf`), gracefully defaulting unrecognized routes to 404.
- **Safe Dynamic Selectors**: URL fragments and view keys are safely escaped via `CSS.escape` before building query selectors, eliminating DOM denial-of-service vectors.

## AI-Native Architecture

Flutcom is designed to be fully agent-friendly. The project includes a dedicated [`.agents/`](.agents/README.md) directory and universal rule files:
- [AGENTS.md](AGENTS.md) — Root guide for any AI coding assistant.
- [`.agents/rules/`](.agents/rules/) — Architecture, code style, and design system constraints.
- [`.agents/skills/`](.agents/skills/) — Step-by-step recipes for adding routes, components, and plugins.
- Built-in bridge support for **Antigravity**, **Cursor** (`.cursorrules`), **Claude Code** (`CLAUDE.md`), and **GitHub Copilot** (`.github/copilot-instructions.md`).

## Project Structure

| Directory / File | Description |
| :--- | :--- |
| [flutcom/](flutcom/) | Core framework engine (`core.js`), global helper (`flut.js`), bootstrap (`main.js`). |
| [flutcom.config.js](flutcom.config.js) | Central configuration for routes, metadata, shell partials, and plugins. |
| [resources/views/](resources/views/) | Public and authenticated HTML view templates. |
| [resources/partials/](resources/partials/) | Persistent layout partials (`header.html`, `footer.html`). |
| [resources/components/](resources/components/) | Reusable modular components with slot support. |
| [plugins/](plugins/) | Modular extensions (menus, modals, animations, responsive utils). |
| [assets/](assets/) | Static CSS, icons, and native SVG logo. |
| [.agents/](.agents/) | AI Agent rules, context, and operational skills. |
| [index.html](index.html) | Single application entry point with declarative layout tags. |

## Documentation

Explore the interactive component sandbox and live examples at [flutcom.net/#ejemplos](https://flutcom.net/#ejemplos) or by running `npm run dev` locally.

## Contributing

New contributors are welcome! If you have ideas for improvements or find any issues, please feel free to open a Pull Request or a GitHub Issue.

## License

Flutcom is open-source software licensed under the [MIT License](LICENSE).


