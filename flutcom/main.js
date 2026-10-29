/**
 * flutcom/main.js — Framework bootstrap & entry point
 *
 * ⚠️  FRAMEWORK RUNTIME
 * Most configuration should be handled inside flutcom.config.js (project root).
 *
 * Responsibilities:
 *   1. Reads configuration from flutcom.config.js
 *   2. Instantiates the Flutcom core engine
 *   3. Sets up global helpers, SEO lifecycle hooks, and route guards
 *   4. Boots the application
 */

import { Flutcom }         from './core.js';
import { createFlutHelper } from './flut.js';
import {
  site,
  partials,
  routes,
  authRoutes,
  resources,
  plugins,
} from '../flutcom.config.js';

// ─── Engine Initialization ───────────────────────────────────────────────────
const app = new Flutcom({ site, partials, routes, authRoutes, resources, plugins });

// Expose app instance globally so views & scripts can access app.store
window.flutcomApp = app;

// ─── Global Flut Helper ──────────────────────────────────────────────────────
// Available in any view or component as: Flut.go(), Flut.set(), Flut.toast(), etc.
createFlutHelper(app);


// ─── Lifecycle Hooks (Dynamic SEO & Meta) ────────────────────────────────────
// Updates document <title> and meta tags when switching views
app.on('afterEnter', (viewName) => {
  const route = app._currentRoute || {};
  const title = route.title || (viewName.charAt(0).toUpperCase() + viewName.slice(1));
  const description = route.description || site.descripcion;

  document.title = `${site.nombre} | ${title}`;

  _setMeta('name', 'description',      description);
  _setMeta('property', 'og:title',       `${site.nombre} | ${title}`);
  _setMeta('property', 'og:description', description);

  if (window.FlutcomAnimations) window.FlutcomAnimations.refresh();
  if (window.PremiumEffects)    window.PremiumEffects.refresh();
});


// ─── Route Guards ────────────────────────────────────────────────────────────
// Protect views with auth guards (example):
// app.guard('dashboard', () => !!localStorage.getItem('token'), 'home');


// ─── Custom 404 Handler ──────────────────────────────────────────────────────
// Custom in-memory fallback for unresolved routes (optional):
// app.on404((contentEl) => {
//   contentEl.innerHTML = `<section>... custom 404 content ...</section>`;
// });


// ─── Boot Application ────────────────────────────────────────────────────────
app.init();


// ─── Internal Helpers ────────────────────────────────────────────────────────
function _setMeta(attr, name, content) {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
