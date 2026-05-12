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

</div>

## Overview

Flutcom is a high-performance micro-framework designed to transform static websites into fluid **Single Page Applications (SPA)** without the complexity of traditional heavy frameworks. It's the ideal solution for developers seeking the speed of a static site with the user experience of a modern application.

## Install

The **recommended** way to start a new project with Flutcom is by cloning the core repository:

```bash
git clone https://github.com/yBlour/flutcom.git
```

Alternatively, you can manually download the source and include it in your project folder. No build step or complex installation is required.

## Quick Start

1. **Configure Routes:** Define your application structure in `flutcom.config.js`.
2. **Create Views:** Add your HTML templates in the `resources/views/` directory.
3. **Launch:** Open `index.html` using a local development server (like Live Server) to see your SPA in action.

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
