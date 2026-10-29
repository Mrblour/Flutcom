/**
 * Flutcom Application Configuration
 *
 * Central configuration file for routes, metadata, shell partials, and plugins.
 * Defines the core behavior and structure of the single-page application.
 */

/**
 * Site metadata and global routing defaults.
 *
 * @type {{
 *   nombre: string,
 *   autor: string,
 *   version: string,
 *   descripcion: string,
 *   defaultView: string,
 *   notFoundView: string
 * }}
 */
export const site = {
  nombre      : "Flutcom",
  autor       : "yBlour",
  version     : "1.2.0",
  descripcion : "Ultra-fast, zero-dependency micro SPA framework",

  /** Default view loaded on root navigation (e.g., #home) */
  defaultView : "home",

  /** Fallback 404 error view path when a route does not exist */
  notFoundView: "resources/views/public/404.html",
};


/**
 * Persistent shell partials (layout structure).
 * Injected into matching container IDs (e.g. #navbar, #footer) in index.html.
 *
 * @type {Record<string, string>}
 */
export const partials = {
  navbar : "resources/partials/header.html",
  footer : "resources/partials/footer.html",
};


/**
 * Public routes configuration.
 *
 * Supports two formats:
 * - Rich format (recommended): Object with `view`, `title`, and `description` for per-route SEO.
 * - Simple format: "hash": "path/to/view.html"
 *
 * @type {Record<string, { view: string, title?: string, description?: string } | string>}
 */
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
  // about: {
  //   view        : "resources/views/public/about.html",
  //   title       : "About Us",
  //   description : "Learn more about the team and project mission.",
  // },
};


/**
 * Protected and authentication routes (optional).
 * Access rules can be enforced with app.guard() in flutcom/main.js.
 *
 * @type {Record<string, string>}
 */
export const authRoutes = {
  // login    : "resources/views/auth/login.html",
  // register : "resources/views/auth/register.html",
};


/**
 * Native Flutcom plugins (closed-environment, auto-loaded).
 *
 * Each entry must be the folder name of a plugin inside `plugins/`,
 * which MUST contain both required files:
 *   - `plugins/<name>/<name>.flutcom.js`  (or `<name>.fc.js`)
 *   - `plugins/<name>/<name>.flutcom.json` (or `<name>.fc.json`)
 *
 * Plugins without both files will be ignored by the engine.
 * For standalone `.js` scripts, use the `resources` array below instead.
 *
 * @type {string[]}
 */
export const plugins = [
  "timer",
  "menu",
  "animations",
  "responsive",
];


/**
 * Global modular plugins and scripts.
 * Register interactive JavaScript plugins and modular extensions here.
 *
 * Note: Core styling (e.g. style.css) should be linked in index.html for performance.
 *
 * @type {Array<{ type: "js" | "css", file: string }>}
 */
export const resources = [
  // Standalone framework plugins / open-source scripts
  { type: "js", file: "plugins/modals.js" },
  // { type: "js", file: "plugins/responsive.js" },
];


