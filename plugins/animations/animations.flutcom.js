/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  Plugin Nativo Flutcom: Animations                       ║
 * ║  Revelado por scroll basado en Intersection Observer     ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Uso en HTML:
 *   · Clase .reveal con opcionales: .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale
 *   · Grupo con escalonado: .reveal-group
 *   · Atributo declarativo: data-delay="200" (en milisegundos)
 */

export default {
  name: "animations",
  version: "1.0.0",
  author: "Comunidad Flutcom",

  _options: {},
  _observer: null,

  init(app, config) {
    this._options = config?.options || {};
    this._injectStyles();
    this._setupObserver();
    console.info(`[Flutcom Plugin: Animations] Inicializado`);
  },

  onNavigate(viewName, container) {
    this._scan(container || document);
  },

  _injectStyles() {
    if (document.getElementById('fc-animations-styles')) return;

    const styles = `
      .reveal {
        opacity: 0;
        transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        will-change: transform, opacity;
      }
      .reveal-up { transform: translateY(40px); }
      .reveal-down { transform: translateY(-40px); }
      .reveal-left { transform: translateX(40px); }
      .reveal-right { transform: translateX(-40px); }
      .reveal-scale { transform: scale(0.94); }
      .reveal.active {
        opacity: 1;
        transform: translate(0, 0) scale(1);
      }
      .reveal-group > * {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .reveal-group.active > * {
        opacity: 1;
        transform: translateY(0);
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = 'fc-animations-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  },

  _setupObserver() {
    const observerOptions = {
      threshold: this._options.threshold ?? 0.12,
      rootMargin: this._options.rootMargin || "0px 0px -50px 0px"
    };

    const stagger = this._options.staggerDelayMs ?? 100;

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

          setTimeout(() => {
            el.classList.add('active');

            if (el.classList.contains('reveal-group')) {
              const children = el.children;
              for (let i = 0; i < children.length; i++) {
                children[i].style.transitionDelay = `${i * stagger}ms`;
              }
            }
          }, delay);
        }
      });
    }, observerOptions);
  },

  _scan(container) {
    if (!this._observer) this._setupObserver();
    const elements = container.querySelectorAll('.reveal, .reveal-group, [data-animate]');
    elements.forEach(el => this._observer.observe(el));
  }
};
