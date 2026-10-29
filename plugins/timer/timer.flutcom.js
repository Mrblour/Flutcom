/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  Plugin Nativo Flutcom: Timer                            ║
 * ║  Temporizadores y Cuentas Regresivas Zero-JS             ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Uso en HTML declarativo:
 *   <div data-timer="60" data-format="mm:ss"></div>
 *   <span data-timer="120" data-end="¡Terminado!" class="text-xl"></span>
 *   <div data-timer="30" data-on-end="alert"></div>
 */

export default {
  name: "timer",
  version: "1.0.0",
  author: "Comunidad Flutcom",

  // Estado interno encapsulado
  _activeTimers: [],
  _options: {},
  _app: null,

  /**
   * Ciclo de vida: Inicialización del plugin.
   * Recibe la instancia del framework y la configuración del JSON.
   */
  init(app, config) {
    this._app = app;
    this._options = config?.options || {};
    this._bindEvents();
    console.info(`[Flutcom Plugin: Timer] Inicializado con opciones:`, this._options);
  },

  _bindEvents() {
    // Delegación declarativa Zero-JS para reiniciar temporizadores
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-timer-restart]');
      if (!btn) return;

      const targetSel = btn.getAttribute('data-timer-restart');
      const targetEl = targetSel ? document.querySelector(targetSel) : btn.closest('[data-timer], [fc-timer]');
      if (targetEl) {
        this._mountTimer(targetEl);
      }
    });
  },

  /**
   * Ciclo de vida: Ejecutado en cada navegación SPA.
   * Limpia temporizadores previos y escanea el contenedor nuevo.
   */
  onNavigate(viewName, container) {
    this._clearAll();
    this._scanElements(container || document);
  },

  /**
   * Escanea el contenedor en busca de elementos con [data-timer] o [fc-timer].
   */
  _scanElements(container) {
    const elements = container.querySelectorAll('[data-timer], [fc-timer]');
    elements.forEach(el => this._mountTimer(el));
  },

  /**
   * Monta e inicia un temporizador individual en el elemento DOM.
   */
  _mountTimer(el) {
    // Si ya tenía un timer corriendo, limpiarlo para reiniciar
    if (el._fcTimerId) {
      clearInterval(el._fcTimerId);
      el._fcTimerId = null;
    }

    const rawVal = el.getAttribute('data-timer') || el.getAttribute('fc-timer');
    let totalSeconds = parseInt(rawVal, 10);

    if (isNaN(totalSeconds) || totalSeconds <= 0) {
      totalSeconds = this._options.defaultDuration || 60;
    }

    const format = el.getAttribute('data-format') || 'mm:ss';
    const endMessage = el.getAttribute('data-end') || this._options.endMessage || '00:00';
    const warningThreshold = parseInt(el.getAttribute('data-warning') || this._options.warningThreshold || '10', 10);
    const warningClass = el.getAttribute('data-warning-class') || this._options.warningClass || 'text-red-600 font-bold';

    // Remover clases de advertencia previas al reiniciar
    warningClass.split(' ').forEach(cls => { if (cls) el.classList.remove(cls); });

    let remaining = totalSeconds;
    el.textContent = this._formatSeconds(remaining, format);

    const intervalId = setInterval(() => {
      // Si el elemento ya no está en el DOM, limpiar el intervalo
      if (!document.body.contains(el)) {
        clearInterval(intervalId);
        return;
      }

      remaining--;

      if (remaining <= warningThreshold && warningThreshold > 0) {
        warningClass.split(' ').forEach(cls => { if (cls) el.classList.add(cls); });
      }

      if (remaining <= 0) {
        clearInterval(intervalId);
        el._fcTimerId = null;
        el.textContent = endMessage;

        // Disparar evento personalizado en el elemento
        el.dispatchEvent(new CustomEvent('fc-timer-end', {
          bubbles: true,
          detail: { duration: totalSeconds }
        }));
        return;
      }

      el.textContent = this._formatSeconds(remaining, format);
    }, 1000);

    el._fcTimerId = intervalId;
    this._activeTimers.push(intervalId);
  },

  /**
   * Da formato a los segundos según el patrón pedido.
   */
  _formatSeconds(totalSeconds, format) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');

    if (format === 'hh:mm:ss') {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    if (format === 'ss') {
      return `${totalSeconds}s`;
    }
    // Default mm:ss
    return `${pad(minutes + hours * 60)}:${pad(seconds)}`;
  },

  /**
   * Limpia todos los intervalos activos para evitar memory leaks.
   */
  _clearAll() {
    this._activeTimers.forEach(id => clearInterval(id));
    this._activeTimers = [];
  }
};
