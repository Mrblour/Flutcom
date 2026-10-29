/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  Plugin Nativo Flutcom: Menu                             ║
 * ║  Navegación SPA activa y control de menú móvil           ║
 * ╚══════════════════════════════════════════════════════════╝
 */

export default {
  name: "menu",
  version: "1.0.0",
  author: "Comunidad Flutcom",

  _options: {},
  _app: null,

  init(app, config) {
    this._app = app;
    this._options = config?.options || {};
    this._bindGlobalEvents();
    this._restoreActive();
    console.info(`[Flutcom Plugin: Menu] Inicializado`);
  },

  onNavigate(viewName, container) {
    this.setActive(viewName);
    this.closeMobileMenu();
  },

  setActive(viewName) {
    const clean = (viewName || 'home').replace('#', '');
    const activeClass = this._options.activeClass || 'active';
    document.querySelectorAll('a[data-view]').forEach(a => a.classList.remove(activeClass));
    try {
      const safe = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(clean) : clean.replace(/["\\]/g, '\\$&');
      document.querySelectorAll(`a[data-view="${safe}"]`).forEach(a => a.classList.add(activeClass));
    } catch {
      // Prevenir aborto de navegación ante selectores no estándar
    }

    if (this._options.persistActiveView !== false) {
      try { localStorage.setItem('activeView', clean); } catch {}
    }
  },

  closeMobileMenu() {
    const menu = document.querySelector('[data-mobile-menu]');
    if (menu) menu.setAttribute('hidden', '');
  },

  _restoreActive() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const saved = localStorage.getItem('activeView') || hash;
    this.setActive(saved);
  },

  _bindGlobalEvents() {
    // Delegación de clic para toggle móvil y enlaces data-view
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-mobile-toggle]');
      if (toggle) {
        const menu = document.querySelector('[data-mobile-menu]');
        if (!menu) return;
        menu.hasAttribute('hidden')
          ? menu.removeAttribute('hidden')
          : menu.setAttribute('hidden', '');
        return;
      }

      const link = e.target.closest('a[data-view]');
      if (link && link.dataset.view) {
        this.setActive(link.dataset.view);
        this.closeMobileMenu();
      }
    });

    // Header scrolled class
    const offset = this._options.scrolledOffset ?? 10;
    document.addEventListener('scroll', () => {
      const header = document.querySelector('header, flut-navbar, [fc-partial="navbar"]');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > offset);
      }
    }, { passive: true });
  }
};
