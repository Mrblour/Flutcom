/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  MYAPP CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 *  This is the main (and only) configuration file for your framework.
 *  Here you define routes, site metadata, and active plugins.
 * 
 *  Equivalent to vite.config.js / next.config.js / astro.config.mjs
 */

// ╭─────────────────────────────────────────────────────────────────────────╮
// │ 1. SITE METADATA                                                        │
// ╰─────────────────────────────────────────────────────────────────────────╯
export const site = {
  nombre      : "Flutcom",
  autor       : "yBlour",
  version     : "1.0.0",
  descripcion : "My ultra-fast, zero-dependency web application",
  
  // Initial view when loading the page (e.g., #home)
  defaultView : "home",
  
  // Error view path (When a URL hash does not exist)
  notFoundView: "resources/views/public/404.html",
};


// ╭─────────────────────────────────────────────────────────────────────────╮
// │ 2. UI PARTIALS (MAIN STRUCTURE)                                         │
// ╰─────────────────────────────────────────────────────────────────────────╯
// These files are injected into the <div id="navbar"></div> and 
// <div id="footer"></div> containers inside your index.html.
export const partials = {
  navbar : "resources/partials/header.html",
  footer : "resources/partials/footer.html",
};


// ╭─────────────────────────────────────────────────────────────────────────╮
// │ 3. PUBLIC ROUTES                                                        │
// ╰─────────────────────────────────────────────────────────────────────────╯
// Format: "hash" : "path/to/file.html"
// Example: If the user visits #about, "views/about.html" will be loaded
export const routes = {
  home : "resources/views/public/home.html",
  // about : "resources/views/public/about.html",
  // contact : "resources/views/public/contact.html",
};


// ╭─────────────────────────────────────────────────────────────────────────╮
// │ 4. AUTH ROUTES (PROTECTED) - Optional                                   │
// ╰─────────────────────────────────────────────────────────────────────────╯
// Same structure as 'routes', but intended for Login/Register views.
// Use app.guard() in main.js to protect these routes.
export const authRoutes = {
  // login    : "resources/views/auth/login.html",
  // register : "resources/views/auth/register.html",
};


// ╭─────────────────────────────────────────────────────────────────────────╮
// │ 5. GLOBAL PLUGINS & SCRIPTS                                             │
// ╰─────────────────────────────────────────────────────────────────────────╯
// CSS files (Tailwind, style.css) must go in index.html for performance
// reasons. Only interactive scripts and modals are loaded here.
export const resources = [
  
  // ─── ESSENTIAL FRAMEWORK PLUGINS ───
  { type: "js", file: "plugins/menu.js" },
  { type: "js", file: "plugins/modals.js" },
  // { type: "js", file: "plugins/responsive.js" },
  
  // ─── VISUAL EFFECTS & ANIMATIONS (Uncomment to use) ───
  // { type: "js", file: "plugins/animations.js" },
  // { type: "js", file: "plugins/premium-effects.js" },
  // { type: "js", file: "plugins/liquid-glass.js" },
  
  // ─── YOUR CUSTOM PLUGINS ───
  // { type: "js", file: "plugins/my-plugin.js" },
];
