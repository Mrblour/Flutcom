<p align="center">
  <img src="assets/img/flutcom.svg" alt="Flutcom Logo" width="84" height="84" />
</p>

# Flutcom

<p align="center">
  <strong>Ultra-fast, zero-dependency SPA micro-framework for static environments.</strong>
  <br/>
  Pure HTML5, CSS & modern Vanilla ES Modules. No Virtual DOM. Zero runtime tax.
</p>

<div align="center">

[![License](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.2.1-black.svg)](#)
[![Vanilla JS](https://img.shields.io/badge/Built%20with-Vanilla%20JS-yellow.svg)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](#)
[![Security](https://img.shields.io/badge/Security-Hardened-10b981.svg)](#)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000.svg?logo=vercel&logoColor=white)](https://flutcom.vercel.app/)

</div>

<p align="center">
  <a href="https://flutcom.vercel.app/">🌐 <strong>Live Demo</strong></a> •
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMrblour%2FFlutcom">▲ <strong>Deploy to Vercel</strong></a> •
  <a href="https://github.com/Mrblour/Flutcom/wiki">📖 <strong>Wiki & Docs</strong></a>
</p>

---

## ⚡ Why Flutcom?

| Feature | ⚡ Flutcom | ⚛️ React | 💚 Vue | 🍦 Vanilla JS |
| :--- | :---: | :---: | :---: | :---: |
| **Runtime Size** | **0 KB** | ~140 KB | ~90 KB | 0 KB |
| **Dependencies** | **0 runtime** | 1,000+ | 1,000+ | 0 |
| **DOM Engine** | 🚀 **Direct Native** | Virtual DOM | Virtual DOM | Direct |
| **Build Step** | ❌ **Optional** | ✅ Mandatory | ✅ Mandatory | ❌ No |
| **Reactivity** | ✅ **Zero-JS (`fc-*`)** | Complex Hooks | Requires `<script>` | Manual listeners |
| **Components** | ✅ **`<flut-*>` + Slots** | JSX | SFC (`.vue`) | Verbose WebComponents |
| **Learning Curve** | 🟢 **10 min** | 🔴 Steep | 🟡 Medium | 🟡 Moderate |

---

## 🚀 Quick Start

Create a new project in seconds:

```bash
npm create flutcom@latest
```

Or clone manually:

```bash
git clone https://github.com/Mrblour/Flutcom.git my-app
cd my-app && npm install && npm run dev
```

| Command | Action |
| :--- | :--- |
| `npm run dev` | Dev server with Tailwind live watch |
| `npm run build` | Compile & optimize bundle to `dist/` |
| `npm run preview` | Test production build locally |

---

## 💡 How It Looks

### Declarative Components & Reactivity (Zero JS)
```html
<flut-card title="Profile">
  <input fc-model="name" placeholder="Type your name..." />
  <p>Hello, <strong fc-bind="name">Guest</strong>!</p>
  <button fc-click="Flut.toast('Saved!')">Save</button>
</flut-card>
```

### Global Store & Navigation
```javascript
Flut.go('home');                 // Navigate SPA
Flut.set('theme', 'dark');       // Reactive global store
Flut.toast('Welcome back!');     // Toast notification
```

---

## 📦 Key Highlights

- 🧩 **Zero-Code Plugins**: Configured via `.json` (`plugins/<name>/`), isolated and self-contained.
- 🛡️ **Hardened by Design**: Built-in DOM XSS protection, safe CSS selector queries, and prototype pollution guards.
- 🎯 **Per-Route SEO**: Automatic dynamic `<title>`, `<meta>` and OpenGraph sync.
- 🤖 **AI-Agent Ready**: Pre-tuned guidelines in [`.agents/`](.agents/README.md) for Cursor, Claude Code, and Antigravity.

---

## ▲ Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMrblour%2FFlutcom)

```bash
npm i -g vercel && vercel --prod
```

| Setting | Value |
| :--- | :--- |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

> ⚡ **Edge Optimized**: Native SPA hash routing works immediately on Vercel's Edge Network with 0ms cold starts.

---

## 📚 Documentation & License

Explore guides and API reference in the **[Flutcom Wiki](https://github.com/Mrblour/Flutcom/wiki)**.

Licensed under [MIT](LICENSE).
