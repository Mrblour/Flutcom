/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║              FLUTCOM CORE  v2.0                          ║
 * ║  Framework SPA ligero para archivos estáticos            ║
 * ║                                                          ║
 * ║  ⚠️  NO MODIFICAR ESTE ARCHIVO                           ║
 * ║  Toda la configuración va en flutcom.config.js (raíz)    ║
 * ║                                                          ║
 * ║  Responsabilidades:                                      ║
 * ║    · Routing por hash                                    ║
 * ║    · Carga de HTML parciales / vistas                    ║
 * ║    · Ciclo de vida: beforeEnter, afterEnter, beforeLeave ║
 * ║    · Guards de ruta (basados en funciones)               ║
 * ║    · Carga de recursos externos (CSS/JS)                 ║
 * ║    · Barra de progreso de navegación                     ║
 * ╚══════════════════════════════════════════════════════════╝
 */

export class Flutcom {

  /**
   * @param {object} options
   * @param {object}   options.site              - { nombre, version, descripcion, defaultView }
   * @param {object}   options.partials           - { navbar, footer, links?, meta? }
   * @param {object}   options.routes             - { clave: 'ruta/a/vista.html' }
   * @param {object}  [options.authRoutes]        - Igual que routes (opcional)
   * @param {Array}   [options.resources]         - [{ type:'css'|'js', file:'...' }]
   * @param {string}  [options.layoutPath]        - Ruta al layout base HTML
   */
  constructor({
    site,
    partials,
    routes,
    authRoutes  = {},
    resources   = [],
  }) {
    this._cfg      = site;
    this._partials = partials;
    this._routes   = { ...routes, ...authRoutes };
    this._external = resources;
    this._default  = site.defaultView || 'home';

    this._hooks = {
      beforeLeave : [],
      beforeEnter : [],
      afterEnter  : [],
    };

    // ─── Estado Global Reactivo (Store) ───
    this.store = {
      _state: {},
      _listeners: [],
      get(key) { return this._state[key]; },
      set(key, val) { 
        this._state[key] = val; 
        this._listeners.forEach(fn => fn(key, val, this._state)); 
      },
      subscribe(fn) { 
        this._listeners.push(fn); 
        // Retornamos una función para desuscribirse fácilmente
        return () => this.unsubscribe(fn); 
      },
      unsubscribe(fn) {
        this._listeners = this._listeners.filter(listener => listener !== fn);
      }
    };

    this._guards = {};
    this._404fn  = this._default404.bind(this);
    
    // Caché global de componentes cargados
    this._componentCache = {};
  }

  // ═══════════════════════════════════════════════════════════
  // API PÚBLICA
  // ═══════════════════════════════════════════════════════════

  /**
   * Registrar un hook de ciclo de vida.
   * @param {'beforeLeave'|'beforeEnter'|'afterEnter'} event
   * @param {function} fn  fn(viewName, contentEl)
   */
  on(event, fn) {
    if (!this._hooks[event]) {
      console.warn(`[Flutcom] Evento desconocido: "${event}". Usa: beforeLeave, beforeEnter, afterEnter`);
      return this;
    }
    this._hooks[event].push(fn);
    return this; // chainable
  }

  /**
   * Proteger rutas con una función guard.
   * Si fn() devuelve false → redirige a redirectTo.
   * @param {string|string[]} route
   * @param {function} fn   () => boolean | Promise<boolean>
   * @param {string} [redirectTo]
   */
  guard(route, fn, redirectTo = this._default) {
    const list = Array.isArray(route) ? route : [route];
    list.forEach(r => { this._guards[r] = { fn, redirectTo }; });
    return this;
  }

  /**
   * Sobrescribir la página 404 por defecto.
   * @param {function} fn  fn(contentEl)
   */
  on404(fn) {
    this._404fn = fn;
    return this;
  }

  /**
   * Arrancar el framework.
   * Llamar siempre al final, tras registrar hooks y guards.
   */
  async init() {
    this._injectLoadingBar();

    if (this._cfg) {
      document.title = `${this._cfg.nombre} | ${this._cfg.descripcion ?? ''}`;
    }

    if (this._partials.navbar) await this._loadHTML('navbar', this._partials.navbar);
    if (this._partials.footer) await this._loadHTML('footer', this._partials.footer);

    this._fillConfigSlots();
    this._assignNavLinks();
    this._initRouter();
    this._loadExternal(this._external);
  }

  // ═══════════════════════════════════════════════════════════
  // ROUTER
  // ═══════════════════════════════════════════════════════════

  _initRouter() {
    const resolve = async () => {
      const hash = window.location.hash.slice(1) || this._default;

      if (this._guards[hash]) {
        const { fn, redirectTo } = this._guards[hash];
        const allowed = await Promise.resolve(fn(hash));
        if (!allowed) { window.location.hash = redirectTo; return; }
      }

      const viewPath = this._routes[hash];
      viewPath ? await this._navigate(viewPath, hash) : await this._show404();
    };

    window.addEventListener('hashchange', resolve);
    resolve();
  }

  _assignNavLinks() {
    document.querySelectorAll('a[data-view]').forEach(link => {
      // Evitar duplicar listeners de clicks en el mismo enlace
      if (link.hasAttribute('data-fc-bound')) return;

      const view = link.getAttribute('data-view');
      if (this._routes[view]) {
        link.addEventListener('click', e => {
          e.preventDefault();
          window.location.hash = view;
        });
        link.setAttribute('data-fc-bound', 'true');
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // NAVEGACIÓN + CICLO DE VIDA
  // ═══════════════════════════════════════════════════════════

  async _navigate(viewPath, viewName) {
    const content = document.getElementById('content');
    if (!content) return;

    await this._runHooks('beforeLeave', viewName, content);

    this._progressStart();
    content.classList.add('fc-fade-out');
    await this._wait(180);

    await this._runHooks('beforeEnter', viewName, content);

    try {
      await this._loadHTML('content', viewPath);

      content.classList.remove('fc-fade-out');
      content.classList.add('fc-fade-in');
      setTimeout(() => content.classList.remove('fc-fade-in'), 400);

      window.scrollTo({ top: 0, behavior: 'smooth' });
      this._assignNavLinks();

      await this._runHooks('afterEnter', viewName, content);
      
      // Emitir evento global para que los plugins se enteren del cambio de vista
      document.dispatchEvent(new CustomEvent('fc-view-loaded', { detail: { view: viewName } }));
    } catch (err) {
      console.error('[Flutcom] Error cargando vista:', err);
      await this._show404();
    } finally {
      this._progressEnd();
    }
  }

  async _runHooks(event, viewName, el) {
    for (const fn of this._hooks[event]) {
      await Promise.resolve(fn(viewName, el));
    }
  }

  // ═══════════════════════════════════════════════════════════
  // 404
  // ═══════════════════════════════════════════════════════════

  async _show404() {
    const content = document.getElementById('content');
    if (!content) return;
    this._progressEnd();

    // 1. Intentar cargar vista 404 personalizada del usuario
    if (this._cfg?.notFoundView) {
      try {
        const vFile = this._versionUrl(this._cfg.notFoundView);
        const res = await fetch(vFile);
        if (res.ok) {
          content.innerHTML = await res.text();
          await this._mountComponents(content);
          this._executeScripts(content);
          return;
        }
      } catch (e) { /* Fallback al default si falla */ }
    }

    // 2. Fallback al 404 predeterminado del framework
    await Promise.resolve(this._404fn(content));
  }

  _default404(content) {
    const home = this._default;
    const name = this._cfg?.nombre ?? 'Flutcom';
    content.innerHTML = `
      <main style="min-height:60vh;display:flex;flex-direction:column;align-items:center;
                   justify-content:center;text-align:center;padding:2rem;gap:1rem;">
        <p style="font-size:5rem;font-weight:800;margin:0;line-height:1;">404</p>
        <p style="opacity:.5;margin:0;">Página no encontrada · ${name}</p>
        <a href="#${home}"
           style="margin-top:1rem;padding:.65rem 1.5rem;background:#fff;color:#000;
                  border-radius:9999px;text-decoration:none;font-weight:500;">
          ← Volver al inicio
        </a>
      </main>
    `;
  }

  // ═══════════════════════════════════════════════════════════
  // LOADERS INTERNOS
  // ═══════════════════════════════════════════════════════════

  async _loadHTML(id, file) {
    const vFile = this._versionUrl(file);
    const res = await fetch(vFile);
    if (!res.ok) throw new Error(`[Flutcom] No se pudo cargar: ${file} (${res.status})`);
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = await res.text();
      await this._mountComponents(el);
      this._executeScripts(el);
    }
  }

  _loadExternal(resources) {
    for (const r of resources) {
      const vFile = this._versionUrl(r.file);
      if (r.type === 'css') {
        document.head.appendChild(
          Object.assign(document.createElement('link'), { rel: 'stylesheet', href: vFile })
        );
      } else if (r.type === 'js') {
        document.body.appendChild(
          Object.assign(document.createElement('script'), { src: vFile, defer: true })
        );
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // COMPONENTES (Nuevo Motor de Renderizado)
  // ═══════════════════════════════════════════════════════════

  async _mountComponents(rootEl) {
    const components = rootEl.querySelectorAll('[fc-component]');
    if (!components.length) return;

    for (const el of components) {
      const path = el.getAttribute('fc-component');
      const propsString = el.getAttribute('fc-props');
      let props = {};
      
      try {
        if (propsString) props = JSON.parse(propsString);
      } catch (e) {
        console.warn(`[Flutcom] Error parseando JSON en fc-props de: ${path}`);
      }

      // Descargar HTML (o usar caché de la instancia)
      if (this._componentCache[path] === undefined) {
        try {
          const vPath = this._versionUrl(path);
          const res = await fetch(vPath);
          this._componentCache[path] = res.ok ? await res.text() : '';
        } catch {
          this._componentCache[path] = '';
        }
      }

      let html = this._componentCache[path];

      // Reemplazar {{ variables }}
      if (html) {
        for (const [key, value] of Object.entries(props)) {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
          html = html.replace(regex, value);
        }
      }

      el.innerHTML = html;
      el.removeAttribute('fc-component'); // evitar reprocesamiento

      // Recursividad: procesar si el componente inyectado tiene sub-componentes
      await this._mountComponents(el);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // EJECUCIÓN DE SCRIPTS
  // ═══════════════════════════════════════════════════════════

  _executeScripts(element) {
    // Los scripts inyectados vía innerHTML no se ejecutan por seguridad.
    // Esta función los extrae, los recrea y los vuelve a insertar para forzar su ejecución.
    const scripts = element.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // BARRA DE PROGRESO
  // ═══════════════════════════════════════════════════════════

  _injectLoadingBar() {
    if (document.getElementById('fc-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'fc-bar';
    document.body.prepend(bar);
  }

  _progressStart() {
    const bar = document.getElementById('fc-bar');
    if (!bar) return;
    bar.style.transition = 'none';
    bar.style.width      = '0%';
    bar.style.opacity    = '1';
    bar.getBoundingClientRect(); // force reflow
    bar.style.transition = 'width 0.4s ease';
    bar.style.width      = '70%';
  }

  _progressEnd() {
    const bar = document.getElementById('fc-bar');
    if (!bar) return;
    bar.style.width = '100%';
    setTimeout(() => { bar.style.opacity = '0'; }, 250);
    setTimeout(() => { bar.style.width   = '0%'; }, 600);
  }

  // ═══════════════════════════════════════════════════════════
  // UTILIDADES
  // ═══════════════════════════════════════════════════════════

  /** Añade la versión del framework a la URL para evitar caché del navegador */
  _versionUrl(url) {
    if (!url || url.includes('?') || url.startsWith('http')) return url;
    const v = this._cfg?.version || Date.now();
    return `${url}?v=${v}`;
  }

  /** Rellena elementos con data-fc-slot="clave" usando valores del config */
  _fillConfigSlots() {
    if (!this._cfg) return;
    document.querySelectorAll('[data-fc-slot]').forEach(el => {
      const key = el.getAttribute('data-fc-slot');
      if (this._cfg[key] !== undefined) el.textContent = this._cfg[key];
    });
    // Compatibilidad con IDs legacy
    const sitio = document.getElementById('sitio');
    if (sitio && this._cfg.nombre)  sitio.textContent = this._cfg.nombre;
    const pill = document.getElementById('app-version-pill');
    if (pill  && this._cfg.version) pill.textContent  = `v${this._cfg.version}`;
  }

  _wait(ms) { return new Promise(r => setTimeout(r, ms)); }
}
