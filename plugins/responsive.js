/**
 * plugins/responsive.js — Plugin de clases responsivas
 *
 * Añade al <body> una clase según el ancho de pantalla:
 *   · is-mobile   → < 640px
 *   · is-tablet   → 640px – 1023px
 *   · is-desktop  → ≥ 1024px
 *
 * Permite escribir CSS puro condicionado al breakpoint:
 *   .is-mobile  .mi-elemento { display: none; }
 *   .is-desktop .mi-elemento { display: flex; }
 *
 * Nota: si ya usas Tailwind, este plugin es opcional.
 * Activar en routes.js:
 *   { type: "js", file: "plugins/responsive.js" }
 */

(function () {
  const BREAKPOINTS = { mobile: 640, tablet: 1024 };

  function apply() {
    const w = window.innerWidth;
    document.body.classList.remove('is-mobile', 'is-tablet', 'is-desktop');
    if (w < BREAKPOINTS.mobile)       document.body.classList.add('is-mobile');
    else if (w < BREAKPOINTS.tablet)  document.body.classList.add('is-tablet');
    else                              document.body.classList.add('is-desktop');
  }

  window.addEventListener('resize',            apply);
  window.addEventListener('orientationchange', apply);
  document.addEventListener('DOMContentLoaded', apply);
})();
