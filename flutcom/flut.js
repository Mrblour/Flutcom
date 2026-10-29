/**
 * flutcom/flut.js — Helper Global de Flutcom
 *
 * Accesible en cualquier vista o script como:
 *   window.Flut  →  Flut.go('about'), Flut.set('usuario', 'Carlos'), etc.
 *
 * ════════════════════════════════════════════════════════════════
 *  API disponible:
 *
 *   Flut.go('nombreRuta')           → Navega a una ruta por hash
 *   Flut.set('clave', valor)        → Guarda un dato en el store
 *   Flut.get('clave')               → Lee un dato del store
 *   Flut.watch('clave', fn)         → Suscribirse a cambios de un dato
 *   Flut.modal('id').open()         → Abre un modal registrado
 *   Flut.modal('id').close()        → Cierra un modal
 *   Flut.toast('Mensaje')           → Muestra una notificación toast
 *   Flut.toast('Mensaje', 'error')  → Toast de tipo error / success / warning
 * ════════════════════════════════════════════════════════════════
 */

export function createFlutHelper(app) {
  const Flut = {

    // ─── Navegación ────────────────────────────────────────────────────────

    /**
     * Navega a una ruta registrada en flutcom.config.js.
     * @param {string} route  Clave de la ruta (ej: 'about', 'contact')
     */
    go(route) {
      window.location.hash = route;
    },


    // ─── Store Reactivo ────────────────────────────────────────────────────

    /**
     * Guarda un valor en el store global.
     * @param {string} key    Nombre de la clave
     * @param {*}      value  Cualquier valor (string, número, objeto, array)
     */
    set(key, value) {
      app.store.set(key, value);
    },

    /**
     * Lee un valor del store global.
     * @param {string} key  Nombre de la clave
     * @returns {*}
     */
    get(key) {
      return app.store.get(key);
    },

    /**
     * Suscribirse a cambios de una clave específica del store.
     * @param {string}   key  Nombre de la clave a observar
     * @param {function} fn   Callback que recibe el nuevo valor
     * @returns {function}    Función para cancelar la suscripción
     */
    watch(key, fn) {
      return app.store.subscribe((changedKey, newValue) => {
        if (changedKey === key) fn(newValue);
      });
    },

    /**
     * Alterna el valor booleano de una clave en el store.
     * @param {string} key
     */
    toggle(key) {
      this.set(key, !this.get(key));
    },

    /**
     * Incrementa un valor numérico en el store.
     * @param {string} key
     * @param {number} [step=1]
     */
    increment(key, step = 1) {
      const current = Number(this.get(key)) || 0;
      this.set(key, current + step);
    },

    /**
     * Decrementa un valor numérico en el store.
     * @param {string} key
     * @param {number} [step=1]
     */
    decrement(key, step = 1) {
      const current = Number(this.get(key)) || 0;
      this.set(key, current - step);
    },

    /**
     * Borra o resetea una clave del store.
     * @param {string} key
     */
    clear(key) {
      this.set(key, undefined);
    },


    // ─── Modales ───────────────────────────────────────────────────────────

    /**
     * Controla un modal por su ID.
     * @param {string} id  ID del elemento modal (sin #)
     * @returns {{ open: function, close: function }}
     */
    modal(id) {
      return {
        open() {
          document.dispatchEvent(new CustomEvent('fc-modal-open', { detail: { id } }));
        },
        close() {
          document.dispatchEvent(new CustomEvent('fc-modal-close', { detail: { id } }));
        },
      };
    },


    // ─── Toasts / Notificaciones ────────────────────────────────────────────

    /**
     * Muestra una notificación toast en pantalla.
     * @param {string} message            Texto del mensaje
     * @param {'info'|'success'|'error'|'warning'} [type='info']  Tipo visual
     * @param {number} [duration=3500]    Duración en milisegundos
     */
    toast(message, type = 'info', duration = 3500) {
      document.dispatchEvent(new CustomEvent('fc-toast', {
        detail: { message, type, duration },
      }));
    },
  };

  // Exponer en window para que las vistas puedan usarlo sin imports
  window.Flut = Flut;
  return Flut;
}
