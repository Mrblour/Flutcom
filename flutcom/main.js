/**
 * flutcom/main.js — Punto de entrada del framework
 *
 * ⚠️  NO MODIFICAR ESTE ARCHIVO
 * Toda la configuración va en flutcom.config.js (raíz del proyecto).
 *
 * Este archivo solo:
 *   1. Lee flutcom.config.js
 *   2. Instancia el motor (core.js)
 *   3. Arranca la app
 *
 * Si necesitas hooks, guards o un 404 personalizado,
 * edita flutcom.config.js — sección "Personalización avanzada".
 */

import { Flutcom } from './core.js';
import {
  site,
  partials,
  routes,
  authRoutes,
  resources,
} from '../flutcom.config.js';

// ─── Instanciar el motor ───────────────────────────────────────────────────────
const app = new Flutcom({ site, partials, routes, authRoutes, resources });

// Exponer la instancia globalmente para que las vistas puedan usar app.store
window.flutcomApp = app;


// ─── Hooks de ciclo de vida ───────────────────────────────────────────────────
// Actualizar <title> al navegar entre vistas
app.on('afterEnter', (viewName) => {
  const title = viewName.charAt(0).toUpperCase() + viewName.slice(1);
  document.title = `${site.nombre} | ${title}`;

  // Open Graph básico (útil para compartir en redes)
  _setMeta('og:title',       `${site.nombre} | ${title}`);
  _setMeta('og:description', `${title} — ${site.descripcion}`);

  // Refrescar sistema de animaciones (plugins/animations.js)
  if (window.FlutcomAnimations) {
    window.FlutcomAnimations.refresh();
  }

  // Refrescar efectos premium (spotlight, etc)
  if (window.PremiumEffects) {
    window.PremiumEffects.refresh();
  }
});


// ─── Guards ───────────────────────────────────────────────────────────────────
// Para proteger una ruta: descomenta y adapta.
// app.guard('dashboard', () => !!localStorage.getItem('token'), 'home');


// ─── 404 personalizado ────────────────────────────────────────────────────────
// Para usar tu propia página 404: descomenta y personaliza.
// app.on404((contentEl) => {
//   contentEl.innerHTML = `<section>... tu 404 aquí ...</section>`;
// });


// ─── Arrancar ─────────────────────────────────────────────────────────────────
app.init();


// ─── Helpers internos ─────────────────────────────────────────────────────────
function _setMeta(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
