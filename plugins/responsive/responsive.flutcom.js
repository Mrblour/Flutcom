/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  Plugin Nativo Flutcom: Responsive                        ║
 * ║  Gestión de breakpoints reactivos (mobile/tablet/desktop) ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Características:
 *   · Asigna clases automáticas al <body>: .is-mobile, .is-tablet, .is-desktop
 *   · Sincroniza con el Store reactivo de Flutcom:
 *       Flut.get('device')   → 'mobile' | 'tablet' | 'desktop'
 *       Flut.get('isMobile') → true | false
 *   · Permite uso directo con directivas en HTML:
 *       <div fc-show="isMobile">Menú simplificado para móviles</div>
 *       <div fc-show="!isMobile">Barra completa de escritorio</div>
 */

export default {
  name: "responsive",
  version: "1.0.0",
  author: "Comunidad Flutcom",

  _options: {},
  _app: null,
  _currentDevice: '',

  init(app, config) {
    this._app = app;
    this._options = config?.options || {};
    this._apply();
    this._bindEvents();
    console.info(`[Flutcom Plugin: Responsive] Inicializado`);
  },

  onNavigate(viewName, container) {
    this._apply();
  },

  _apply() {
    const breakpoints = this._options.breakpoints || { mobile: 640, tablet: 1024 };
    const w = window.innerWidth;
    const body = document.body;
    if (!body) return;

    body.classList.remove('is-mobile', 'is-tablet', 'is-desktop');

    let device = 'desktop';
    if (w < breakpoints.mobile) {
      device = 'mobile';
      body.classList.add('is-mobile');
    } else if (w < breakpoints.tablet) {
      device = 'tablet';
      body.classList.add('is-tablet');
    } else {
      device = 'desktop';
      body.classList.add('is-desktop');
    }

    if (this._currentDevice !== device) {
      this._currentDevice = device;

      // Sincronizar reactivamente con el store global de Flutcom
      if (this._options.syncWithStore !== false && this._app?.store) {
        this._app.store.set('device', device);
        this._app.store.set('isMobile', device === 'mobile');
        this._app.store.set('isTablet', device === 'tablet');
        this._app.store.set('isDesktop', device === 'desktop');
      }
    }
  },

  _bindEvents() {
    const handler = () => this._apply();
    window.addEventListener('resize', handler, { passive: true });
    window.addEventListener('orientationchange', handler, { passive: true });
  }
};
