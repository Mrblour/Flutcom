![Flutcom Banner](https://i.pinimg.com/736x/fa/9b/45/fa9b459ad0de42d2830ae0d689e97d1e.jpg)

# Flutcom

<p align="center">
  <br/>
  <strong>Flutcom</strong> is a lightweight SPA framework for static environments —
  <br/>
  minimalist developer experience meets high-performance output.
  <br/><br/>
</p>

<div align="center">

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](#)
[![Vanilla JS](https://img.shields.io/badge/Built%20with-Vanilla%20JS-yellow.svg)](#)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-orange.svg)](https://mrblour.github.io/Flutcom/)

</div>

<p align="center">
  <a href="https://mrblour.github.io/Flutcom/">🌐 <strong>View Live Demo</strong></a>
</p>

## Overview

Flutcom is a high-performance micro-framework designed to transform static websites into fluid **Single Page Applications (SPA)** without the complexity of traditional heavy frameworks. It's the ideal solution for developers seeking the speed of a static site with the user experience of a modern application.

## Prerequisites

Before installing Flutcom, make sure you have **Node.js** installed on your machine. Node.js includes `npm` (the package manager) which is required to run the installer.

> **Don't have Node.js?** Download it for free from the official site:
> 👉 [https://nodejs.org](https://nodejs.org) — Download the **LTS** version (recommended).

Once installed, verify it works by opening your terminal and running:

```bash
node -v
npm -v
```

If both commands print a version number, you're all set! ✅

## Install

The **recommended** and fastest way to start a new project with Flutcom is by using our official CLI installer. Just open your terminal and run:

```bash
npm create flutcom@latest
```

The interactive CLI will guide you through the setup:
1. Enter your **project name** (or press Enter to use the default).
2. The installer will automatically **download the template** from GitHub.
3. All **dependencies** will be installed for you automatically.

Alternatively, if you prefer a manual setup, you can clone the core repository:

```bash
git clone https://github.com/Mrblour/Flutcom.git
cd Flutcom
npm install
```


## Quick Start

1. **Create your app:** Run `npm create flutcom@latest` to generate your project.
2. **Start the development server:** Navigate to your project folder and run:
   ```bash
   npm run dev
   ```
   This will start a local server at `http://localhost:3000` with hot-reloading for CSS.
3. **Configure Routes:** Define your application structure in `flutcom.config.js`.
4. **Create Views:** Add your HTML templates in the `resources/views/` directory.

## Key Features

- **Zero Latency Navigation:** Hash-based routing system for instant page transitions.
- **Centralized Configuration:** Manage routes, metadata, and plugins from a single `flutcom.config.js` file.
- **Plugin Architecture:** Extend core capabilities with modular plugins (Modals, Menus, Effects).
- **Partial Rendering:** Automatic injection of reusable components like navbars and footers.
- **SEO Ready:** Structured for better indexing and performance in static environments.

## Project Structure

| Directory | Description |
| --------- | ----------- |
| [flutcom/](flutcom/) | Core framework engine and routing logic. |
| [plugins/](plugins/) | Modular extensions and UI enhancements. |
| [resources/](resources/) | Application views, partials, and components. |
| [assets/](assets/) | Static resources including CSS and images. |
| [index.html](index.html) | Main application entry point. |

## Documentation

For detailed guides on routing, plugin development, and configuration, you can visit the integrated documentation at [flutcom.net/#docs](https://flutcom.net/#docs).

## Contributing

New contributors are welcome! If you have ideas for improvements or find any issues, please feel free to open a Pull Request or a GitHub Issue.

## License

Flutcom is open-source software licensed under the [MIT License](LICENSE).

