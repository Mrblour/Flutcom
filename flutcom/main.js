// @ts-check
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
window.flutcomApp = /** @type {any} */ (app);

// ─── Global Flut Helper ──────────────────────────────────────────────────────
// Available in any view or component as: Flut.go(), Flut.set(), Flut.toast(), etc.
createFlutHelper(/** @type {any} */ (app));


// ─── Lifecycle Hooks (Dynamic SEO & Meta) ────────────────────────────────────
// Updates document <title>, canonical links, and social/search meta tags when switching views
app.on('afterEnter', (viewName) => {
  const allRoutes = { ...routes, ...authRoutes };
  const rawRoute = allRoutes[viewName];
  /** @type {import('../types/flutcom').RouteConfig} */
  const route = /** @type {import('../types/flutcom').RouteConfig} */ (
    typeof rawRoute === 'object' ? rawRoute : (app._currentRoute || {})
  );

  const title = route.title || (viewName.charAt(0).toUpperCase() + viewName.slice(1));
  const description = route.description || site.descripcion || '';
  const canonicalUrl = route.canonical || (site.url ? `${site.url.replace(/\/$/, '')}/#${viewName}` : '');
  const image = route.image || site.image || (site.url ? `${site.url.replace(/\/$/, '')}/assets/img/flutcom-banner.svg` : '');

  document.title = `${site.nombre} | ${title}`;

  if (site.lang) {
    document.documentElement.lang = site.lang;
  }

  // SEO Básico para Googlebot
  _setMeta('name', 'description', description);
  if (route.keywords) {
    const kw = Array.isArray(route.keywords) ? route.keywords.join(', ') : route.keywords;
    _setMeta('name', 'keywords', kw);
  }
  _setMeta('name', 'robots', route.robots || 'index, follow');
  if (canonicalUrl) _setLink('canonical', canonicalUrl);

  // Open Graph (Facebook, WhatsApp, LinkedIn)
  _setMeta('property', 'og:title', `${site.nombre} | ${title}`);
  _setMeta('property', 'og:description', description);
  _setMeta('property', 'og:type', 'website');
  if (canonicalUrl) _setMeta('property', 'og:url', canonicalUrl);
  if (image) _setMeta('property', 'og:image', image);

  // Twitter Cards
  _setMeta('name', 'twitter:card', 'summary_large_image');
  _setMeta('name', 'twitter:title', `${site.nombre} | ${title}`);
  _setMeta('name', 'twitter:description', description);
  if (image) _setMeta('name', 'twitter:image', image);

  // Datos Estructurados Schema.org para Google Rich Snippets
  if (route.jsonLd) {
    _setJsonLd(route.jsonLd);
  }

  if (window.FlutcomAnimations) window.FlutcomAnimations.refresh();
  if (window.PremiumEffects)    window.PremiumEffects.refresh();

  // Accesibilidad: enfocar el contenedor principal al cambiar de vista
  // Permite que lectores de pantalla anuncien el nuevo contenido en SPAs
  const mainEl = document.querySelector('flut-main, flut-content, [fc-main], #content');
  if (mainEl instanceof HTMLElement) {
    mainEl.setAttribute('tabindex', '-1');
    mainEl.focus({ preventScroll: true });
  }
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
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function _setLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function _setJsonLd(data) {
  let el = /** @type {HTMLScriptElement | null} */ (document.querySelector('script#fc-route-jsonld'));
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = /** @type {HTMLScriptElement} */ (document.createElement('script'));
    el.id = 'fc-route-jsonld';
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}
