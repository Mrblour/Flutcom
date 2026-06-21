/**
 * plugins/menu.js — Plugin de navegación
 *
 * Funciones:
 *   · Marca el enlace activo (.active) según el hash actual
 *   · Persiste la vista activa en localStorage
 *   · Cierra el menú móvil al navegar
 *   · Añade clase .scrolled al header cuando se hace scroll
 *   · Toggle del menú hamburguesa móvil (data-mobile-toggle / data-mobile-menu)
 *
 * Uso en HTML:
 *   <a href="#home" data-view="home">Home</a>
 *   <button data-mobile-toggle>☰</button>
 *   <nav data-mobile-menu hidden>...</nav>
 *
 * Activar en routes.js:
 *   { type: "js", file: "plugins/menu.js" }
 */

(function () {

  // ─── Estado activo del enlace ───────────────────────────────────────────────

  function setActive(viewName) {
    document.querySelectorAll('a[data-view]').forEach(a => a.classList.remove('active'));
    const target = document.querySelector(`a[data-view="${viewName}"]`);
    if (target) target.classList.add('active');
    localStorage.setItem('activeView', viewName);
    closeMobileMenu();
  }

  function restoreActive() {
    const saved = localStorage.getItem('activeView');
    if (saved) setActive(saved);
  }

  // ─── Menú móvil ────────────────────────────────────────────────────────────

  function closeMobileMenu() {
    const menu = document.querySelector('[data-mobile-menu]');
    if (menu) menu.setAttribute('hidden', '');
  }

  document.addEventListener('click', function (e) {
    // Toggle hamburguesa
    const toggle = e.target.closest('[data-mobile-toggle]');
    if (toggle) {
      const menu = document.querySelector('[data-mobile-menu]');
      if (!menu) return;
      menu.hasAttribute('hidden')
        ? menu.removeAttribute('hidden')
        : menu.setAttribute('hidden', '');
      return;
    }

    // Click en enlace de vista → marcar activo
    const link = e.target.closest('a[data-view]');
    if (link) setActive(link.dataset.view);
  });

  // ─── Header scroll ─────────────────────────────────────────────────────────

  document.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // ─── Sincronizar con hash ───────────────────────────────────────────────────

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    setActive(hash);
  });

  // ─── Restaurar al cargar y cuando el DOM cambie (navbar dinámico) ──────────

  const mo = new MutationObserver(() => {
    if (document.querySelector('a[data-view]')) restoreActive();
  });
  mo.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('DOMContentLoaded', restoreActive);

})();
