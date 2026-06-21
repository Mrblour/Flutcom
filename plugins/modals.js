/**
 * plugins/modals.js — Plugin de modales dinámicos
 *
 * Carga archivos HTML desde resources/modals/ y los inyecta en el DOM
 * con animación de entrada/salida.
 *
 * Uso desde HTML:
 *   <button onclick="flutcomModals.open('mi-modal')">Abrir</button>
 *
 * Uso desde JS:
 *   flutcomModals.open('mi-modal');
 *   flutcomModals.open('mi-modal').then(({ close }) => { ... });
 *
 * Estructura del archivo HTML del modal (resources/modals/mi-modal.html):
 *   <div data-modal-overlay class="...overlay...">
 *     <div class="modal-container">
 *       <button data-modal-close>✕</button>
 *       <!-- contenido -->
 *     </div>
 *   </div>
 *
 * Activar en routes.js:
 *   { type: "js", file: "plugins/modals.js" }
 */

(function () {
  const BASE = 'resources/modals/';

  async function open(name) {
    try {
      const res = await fetch(`${BASE}${name}.html`);
      if (!res.ok) throw new Error(`Modal no encontrado: ${name}.html`);
      const html = await res.text();
      return inject(html);
    } catch (err) {
      console.error('[flutcomModals]', err);
      return null;
    }
  }

  function inject(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    const el = wrapper.firstElementChild;
    if (!el) return null;

    document.body.appendChild(el);

    // Animación de entrada
    const container = el.querySelector('.modal-container');
    if (container) {
      container.style.cssText = 'opacity:0;transform:translateY(12px) scale(0.97)';
      requestAnimationFrame(() => {
        container.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        container.style.opacity   = '1';
        container.style.transform = 'translateY(0) scale(1)';
      });
    }

    function close() {
      if (container) {
        container.style.opacity   = '0';
        container.style.transform = 'translateY(12px) scale(0.97)';
      }
      setTimeout(() => el.remove(), 180);
    }

    // Cerrar al click en el overlay o en botones data-modal-close
    const overlay = el.querySelector('[data-modal-overlay]') || el;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    el.querySelectorAll('[data-modal-close]').forEach(btn => btn.addEventListener('click', close));

    return { element: el, close };
  }

  window.flutcomModals = { open };
})();
