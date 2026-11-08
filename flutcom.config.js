// @ts-check
/**
 * Flutcom Application Configuration
 *
 * Central configuration file for routes, metadata, shell partials, and plugins.
 * Defines the core behavior and structure of the single-page application.
 */

/**
 * Site metadata and global routing defaults.
 *
 * @type {import('./types/flutcom').SiteConfig}
 */
export const site = {
  nombre      : "Flutcom",
  autor       : "yBlour",
  version     : "1.3.0",
  descripcion : "Ultra-fast, zero-dependency micro SPA framework",
  url         : "https://mrblour.github.io/Flutcom/",
  lang        : "es",

  /** Default view loaded on root navigation (e.g., #home) */
  defaultView : "home",

  /** Fallback 404 error view path when a route does not exist */
  notFoundView: "resources/views/public/404.html",
};


/**
 * Persistent shell partials (layout structure).
 * Injected into matching container IDs (e.g. #navbar, #footer) in index.html.
 *
 * @type {import('./types/flutcom').PartialsConfig}
 */
export const partials = {
  navbar : "resources/partials/header.html",
  footer : "resources/partials/footer.html",
};


/**
 * Public routes configuration.
 *
 * Supports two formats:
 * - Rich format (recommended): Object with `view`, `title`, `description`, `keywords`, `robots`, and `jsonLd`.
 * - Simple format: "hash": "path/to/view.html"
 *
 * @type {Record<string, import('./types/flutcom').RouteDefinition>}
 */
export const routes = {
  home: {
    view        : "resources/views/public/home.html",
    title       : "Home",
    description : "Lightweight, zero-runtime-dependency SPA micro-framework.",
    keywords    : ["flutcom", "spa", "vanilla js", "micro framework"],
    robots      : "index, follow",
  },
  ejemplos: {
    view        : "resources/views/public/ejemplos.html",
    title       : "Examples & Components",
    description : "Interactive gallery of modular Flutcom components.",
    keywords    : ["flutcom components", "reactive directives", "vanilla components"],
    robots      : "index, follow",
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
 * @type {Record<string, import('./types/flutcom').RouteDefinition>}
 */
export const authRoutes = {
  // login    : "resources/views/auth/login.html",
  // register : "resources/views/auth/register.html",
};


/**
 * Native Flutcom plugins (closed-environment, auto-loaded).
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
 *
 * @type {import('./types/flutcom').ResourceItem[]}
 */
export const resources = [
  // Standalone framework plugins / open-source scripts
  { type: "js", file: "plugins/modals.js" },
  // { type: "js", file: "plugins/responsive.js" },
];


