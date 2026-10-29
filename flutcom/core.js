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
 * ║    · Sistema de Plugins Nativos (.flutcom.js / .fc.js)   ║
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
   * @param {Array}   [options.plugins]           - ['timer', 'animations'] nombres de plugins nativos Flutcom
   */
  constructor({
    site,
    partials,
    routes,
    authRoutes  = {},
    resources   = [],
    plugins     = [],
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

    // ─── Sistema de Plugins Nativos Flutcom ───
    // Lista de nombres de plugins declarados en flutcom.config.js
    this._pluginNames   = plugins;
    // Instancias activas de plugins cargados correctamente
    this._activePlugins = [];
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

    // Cargar plugins nativos ANTES de iniciar el router
    // para que estén listos cuando se cargue la primera vista
    await this._loadFlutcomPlugins();

    this._initRouter();
    this._loadExternal(this._external);
  }

  // ═══════════════════════════════════════════════════════════
  // ROUTER
  // ═══════════════════════════════════════════════════════════

  _initRouter() {
    const resolve = async () => {
      const hash = window.location.hash.slice(1) || this._default;

      if (Object.prototype.hasOwnProperty.call(this._guards, hash)) {
        const { fn, redirectTo } = this._guards[hash];
        const allowed = await Promise.resolve(fn(hash));
        if (!allowed) { window.location.hash = redirectTo; return; }
      }

      const route = this._resolveRoute(hash);
      if (route) { this._currentRoute = route; await this._navigate(route.path, hash); }
      else { await this._show404(); }
    };

    window.addEventListener('hashchange', resolve);
    resolve();
  }

  _assignNavLinks() {
    document.querySelectorAll('a[data-view]').forEach(link => {
      // Evitar duplicar listeners de clicks en el mismo enlace
      if (link.hasAttribute('data-fc-bound')) return;

      const view = link.getAttribute('data-view');
      if (view && Object.prototype.hasOwnProperty.call(this._routes, view)) {
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

  _resolveRoute(hash) {
    if (!hash || !Object.prototype.hasOwnProperty.call(this._routes, hash)) return null;
    const r = this._routes[hash];
    if (!r) return null;
    if (typeof r === 'string') {
      return { path: r, title: hash.charAt(0).toUpperCase() + hash.slice(1), description: this._cfg?.descripcion || '' };
    }
    return {
      path        : r.view || r.path || '',
      title       : r.title       || hash,
      description : r.description || this._cfg?.descripcion || '',
    };
  }

  async _navigate(viewPath, viewName) {
    const content = this._getContainer('content');
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

      // ─── Notificar a los plugins nativos del cambio de vista ─────────
      for (const plugin of this._activePlugins) {
        if (typeof plugin.onNavigate === 'function') {
          try {
            await Promise.resolve(plugin.onNavigate(viewName, content));
          } catch (err) {
            console.warn(`[Flutcom Plugin] Error en onNavigate de "${plugin.name || '?'}":`, err);
          }
        }
      }

      // Emitir evento global para que plugins externos también se enteren
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
    const content = this._getContainer('content');
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
          this._bindDirectives(content);
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

  /**
   * Tags reservados de layout — NO son componentes.
   * Se usan en index.html como shell de la SPA.
   * Cualquier `<flut-*>` que esté en esta lista es ignorado
   * por el pipeline de componentes (_mountComponents).
   */
  static get LAYOUT_TAGS() {
    return new Set(['flut-navbar', 'flut-header', 'flut-main', 'flut-content', 'flut-footer']);
  }

  /**
   * Resuelve contenedores principales del layout soportando:
   * 1. Tags declarativos:  <flut-navbar>, <flut-main>, <flut-content>, <flut-footer>
   * 2. Directivas:         [fc-partial="navbar"], [fc-main], [fc-content]
   * 3. IDs estándar (retrocompat): id="navbar", id="content", id="footer"
   */
  _getContainer(name) {
    if (name === 'content' || name === 'main') {
      return document.querySelector('flut-main, flut-content, [fc-main], [fc-content], #content');
    }
    if (name === 'navbar' || name === 'header') {
      return document.querySelector('flut-navbar, flut-header, [fc-partial="navbar"], [fc-partial="header"], #navbar');
    }
    if (name === 'footer') {
      return document.querySelector('flut-footer, [fc-partial="footer"], #footer');
    }
    return document.getElementById(name) || document.querySelector(`flut-${name}, [fc-partial="${name}"]`);
  }

  async _loadHTML(target, file) {
    const vFile = this._versionUrl(file);
    const res = await fetch(vFile);
    if (!res.ok) throw new Error(`[Flutcom] No se pudo cargar: ${file} (${res.status})`);
    const el = (target instanceof Element) ? target : this._getContainer(target);
    if (el) {
      el.innerHTML = await res.text();
      await this._mountComponents(el);
      this._bindDirectives(el);
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
  // SISTEMA DE PLUGINS NATIVOS FLUTCOM
  // ═══════════════════════════════════════════════════════════
  //
  //  Cada plugin nativo Flutcom requiere OBLIGATORIAMENTE:
  //    · plugins/<nombre>/<nombre>.flutcom.json  (o .fc.json)
  //    · plugins/<nombre>/<nombre>.flutcom.js   (o .fc.js)
  //
  //  El motor:
  //    1. Detecta la variante de extensión disponible (.flutcom / .fc)
  //    2. Lee y valida el archivo JSON de configuración
  //    3. Verifica que "enabled": true
  //    4. Importa dinámicamente el módulo JS
  //    5. Ejecuta plugin.init(app, config)
  //    6. Registra plugin.onNavigate() para cada cambio de ruta SPA
  //
  //  Scripts JS sueltos en plugins/ siguen usando resources[] en config.
  // ═══════════════════════════════════════════════════════════

  /**
   * Carga todos los plugins nativos declarados en `plugins[]` de flutcom.config.js.
   * Valida el binomio de archivos obligatorio antes de activar cada plugin.
   */
  async _loadFlutcomPlugins() {
    if (!this._pluginNames.length) return;

    // Extensiones soportadas en orden de preferencia
    const JS_EXTS   = ['.flutcom.js',   '.fc.js'];
    const JSON_EXTS = ['.flutcom.json', '.fc.json'];

    for (const name of this._pluginNames) {
      const base = `plugins/${name}/${name}`;

      // ─── 1. Detectar extensión JSON disponible ────────────────────
      let configData = null;
      let jsonFound  = false;

      for (const ext of JSON_EXTS) {
        try {
          const res = await fetch(`${base}${ext}`);
          if (res.ok) {
            configData = await res.json();
            jsonFound  = true;
            break;
          }
        } catch { /* probar siguiente extensión */ }
      }

      if (!jsonFound || !configData) {
        console.warn(
          `[Flutcom Plugin] ⚠️ Plugin "${name}" ignorado: no se encontró archivo de configuración.\n` +
          `  Esperado: plugins/${name}/${name}.flutcom.json  o  plugins/${name}/${name}.fc.json`
        );
        continue;
      }

      // ─── 2. Verificar que el plugin está habilitado ───────────────
      if (configData.enabled === false) {
        console.info(`[Flutcom Plugin] ✋ Plugin "${name}" está deshabilitado (enabled: false). Saltando.`);
        continue;
      }

      // ─── 3. Detectar extensión JS disponible ─────────────────────
      let pluginModule = null;
      let jsFound      = false;

      for (const ext of JS_EXTS) {
        try {
          const rawUrl = `${base}${ext}`;
          const moduleUrl = new URL(rawUrl, window.location.origin + window.location.pathname).href;
          pluginModule = await import(/* @vite-ignore */ moduleUrl);
          jsFound = true;
          break;
        } catch { /* probar siguiente extensión */ }
      }

      if (!jsFound || !pluginModule) {
        console.warn(
          `[Flutcom Plugin] ⚠️ Plugin "${name}" ignorado: no se encontró el archivo JS.\n` +
          `  Esperado: plugins/${name}/${name}.flutcom.js  o  plugins/${name}/${name}.fc.js`
        );
        continue;
      }

      // ─── 4. Obtener la instancia exportada por defecto ────────────
      const plugin = pluginModule.default ?? pluginModule;

      if (typeof plugin !== 'object' || plugin === null) {
        console.warn(`[Flutcom Plugin] ⚠️ El módulo "${name}" no exporta un objeto válido como default.`);
        continue;
      }

      // ─── 5. Ejecutar init() con la instancia de la app y la config ─
      if (typeof plugin.init === 'function') {
        try {
          await Promise.resolve(plugin.init(this, configData));
        } catch (err) {
          console.error(`[Flutcom Plugin] ❌ Error en init() del plugin "${name}":`, err);
          continue;
        }
      }

      // ─── 6. Registrar como plugin activo ─────────────────────────
      this._activePlugins.push(plugin);
      console.info(`[Flutcom Plugin] ✅ Plugin "${name}" cargado correctamente.`);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // COMPONENTES v2 — Motor de Renderizado Mejorado
  // ═══════════════════════════════════════════════════════════
  //
  //  Soporta 3 sintaxis (de más simple a más avanzada):
  //
  //  1. Shorthand   → <flut-alert icon="bi bi-check" title="Éxito" />
  //  2. Genérico    → <flut-component name="alert" icon="..." title="..." />
  //  3. Legacy      → <div fc-component="resources/components/alert.html"
  //                        fc-props='{"icon":"...","title":"..."}'>
  //                   </div>
  //
  //  Interpolación disponible en el template del componente:
  //    {{ nombreProp }} → valor del atributo correspondiente
  //    {{ slot }}       → HTML interno del elemento (contenido hijo)
  // ═══════════════════════════════════════════════════════════

  async _mountComponents(rootEl) {

    // ─── Recopilar todos los elementos a procesar ──────────────────────────
    const legacyEls     = [...rootEl.querySelectorAll('[fc-component]')];
    const namedEls      = [...rootEl.querySelectorAll('flut-component[name]')];
    const shorthandEls  = [...rootEl.querySelectorAll('*')].filter(el => {
      const tag = el.tagName.toLowerCase();
      // Excluir tags reservados de layout — no son componentes
      return tag.startsWith('flut-') && tag !== 'flut-component' && !Flutcom.LAYOUT_TAGS.has(tag);
    });

    const allEls = [...legacyEls, ...namedEls, ...shorthandEls];
    if (!allEls.length) return;

    for (const el of allEls) {
      const tag   = el.tagName.toLowerCase();
      let path    = '';
      let props   = {};
      const slot  = el.innerHTML; // contenido hijo → {{ slot }}

      // ─── 1. Shorthand: <flut-alert icon="..." title="..."> ──────────────
      if (tag.startsWith('flut-') && tag !== 'flut-component') {
        const compName = tag.slice(5); // quitar prefijo "flut-"
        path = `resources/components/${compName}.html`;
        for (const { name, value } of el.attributes) {
          props[name] = value;
        }

      // ─── 2. Genérico: <flut-component name="alert" icon="..." title="...">
      } else if (tag === 'flut-component') {
        const compName = el.getAttribute('name');
        if (!compName) continue;
        path = `resources/components/${compName}.html`;
        for (const { name, value } of el.attributes) {
          if (name !== 'name') props[name] = value;
        }

      // ─── 3. Legacy: <div fc-component="..." fc-props='{...}'> ────────────
      } else {
        path = el.getAttribute('fc-component');
        const propsStr = el.getAttribute('fc-props');
        if (propsStr) {
          try { props = JSON.parse(propsStr); }
          catch { console.warn(`[Flutcom] fc-props JSON inválido en: ${path}`); }
        }
      }

      // ─── Cargar template (con caché) ────────────────────────────────────
      if (this._componentCache[path] === undefined) {
        try {
          const vPath = this._versionUrl(path);
          const res   = await fetch(vPath);
          this._componentCache[path] = res.ok ? await res.text() : null;
        } catch {
          this._componentCache[path] = null;
        }
      }

      const template = this._componentCache[path];
      if (!template) {
        console.warn(`[Flutcom] No se pudo cargar el componente: ${path}`);
        el.remove();
        continue;
      }

      // ─── Interpolar: {{ slot }} y {{ propiedades }} ───────────────────────
      let html = template.replace(/\{\{\s*slot\s*\}\}/g, slot);
      for (const [key, value] of Object.entries(props)) {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        html = html.replace(new RegExp(`{{\\s*${escapedKey}\\s*}}`, 'g'), this._escapeHtml(value));
      }

      // ─── Inyectar y recursar ─────────────────────────────────────────────
      if (tag === 'flut-component' || tag.startsWith('flut-')) {
        // Elementos custom: reemplazar el tag por el HTML renderizado
        const temp = document.createElement('div');
        temp.innerHTML = html;
        await this._mountComponents(temp); // procesar sub-componentes primero
        this._executeScripts(temp);
        el.replaceWith(...Array.from(temp.childNodes));
      } else {
        // Legacy: conservar el elemento contenedor, reemplazar su contenido
        el.removeAttribute('fc-component');
        el.removeAttribute('fc-props');
        el.innerHTML = html;
        await this._mountComponents(el);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // DIRECTIVAS REACTIVAS DECLARATIVAS
  // ═══════════════════════════════════════════════════════════
  //
  //  fc-bind="clave"      → Inyecta el valor del store y se actualiza reactivamente.
  //  fc-model="clave"     → Two-way data binding para inputs, textarea, select y checkbox.
  //  fc-show="clave"      → Muestra/oculta según el store (soporta prefijo ! para negar).
  //  fc-go="ruta"         → Navega a una ruta al hacer clic sin JS.
  //  fc-toggle="id"       → Alterna la visibilidad del elemento con ese ID.
  //  fc-click="action"    → Ejecuta código/helpers al hacer clic.
  // ═══════════════════════════════════════════════════════════

  _bindDirectives(rootEl) {
    if (!rootEl) return;

    const getAttr = (el, name) => el.getAttribute(`fc-${name}`) || el.getAttribute(`flut-${name}`);

    // ─── 1. fc-bind: One-way binding al DOM ─────────────────────────────────
    const bindEls = rootEl.querySelectorAll('[fc-bind], [flut-bind]');
    bindEls.forEach(el => {
      const key = getAttr(el, 'bind');
      if (!key) return;

      const update = () => {
        const val = this.store.get(key);
        if (val !== undefined && val !== null) {
          el.textContent = val;
        }
      };

      update();
      this.store.subscribe((changedKey, newVal) => {
        if (!document.contains(el)) return;
        if (changedKey === key) {
          el.textContent = (newVal !== undefined && newVal !== null) ? newVal : '';
        }
      });
    });

    // ─── 2. fc-model: Two-way binding para formularios ──────────────────────
    const modelEls = rootEl.querySelectorAll('[fc-model], [flut-model]');
    modelEls.forEach(el => {
      const key = getAttr(el, 'model');
      if (!key) return;

      const isCheckbox = el.type === 'checkbox';
      const isRadio    = el.type === 'radio';

      // Inicializar valor desde store
      const initialVal = this.store.get(key);
      if (initialVal !== undefined) {
        if (isCheckbox) {
          el.checked = Boolean(initialVal);
        } else if (isRadio) {
          el.checked = (String(initialVal) === String(el.value));
        } else {
          el.value = initialVal ?? '';
        }
      }

      // Input → Store
      const onInput = () => {
        if (isCheckbox) {
          this.store.set(key, el.checked);
        } else if (isRadio) {
          if (el.checked) this.store.set(key, el.value);
        } else {
          this.store.set(key, el.value);
        }
      };

      el.addEventListener(isCheckbox || isRadio || el.tagName === 'SELECT' ? 'change' : 'input', onInput);

      // Store → Input
      this.store.subscribe((changedKey, newVal) => {
        if (!document.contains(el)) return;
        if (changedKey === key) {
          if (isCheckbox) {
            el.checked = Boolean(newVal);
          } else if (isRadio) {
            el.checked = (String(newVal) === String(el.value));
          } else {
            if (el.value !== String(newVal ?? '')) {
              el.value = newVal ?? '';
            }
          }
        }
      });
    });

    // ─── 3. fc-show: Visibilidad condicional ─────────────────────────────────
    const showEls = rootEl.querySelectorAll('[fc-show], [flut-show]');
    showEls.forEach(el => {
      const expr = (getAttr(el, 'show') || '').trim();
      if (!expr) return;

      const isNegated = expr.startsWith('!');
      const key = isNegated ? expr.slice(1).trim() : expr;

      const update = () => {
        const val = this.store.get(key);
        let visible = Boolean(val);
        if (isNegated) visible = !visible;

        if (visible) {
          el.hidden = false;
          if (el.style.display === 'none') el.style.display = '';
        } else {
          el.hidden = true;
          el.style.display = 'none';
        }
      };

      update();
      this.store.subscribe(changedKey => {
        if (!document.contains(el)) return;
        if (changedKey === key) update();
      });
    });

    // ─── 4. fc-go: Navegación declarativa ────────────────────────────────────
    const goEls = rootEl.querySelectorAll('[fc-go], [flut-go]');
    goEls.forEach(el => {
      const route = getAttr(el, 'go');
      if (!route) return;
      el.style.cursor = 'pointer';
      el.addEventListener('click', e => {
        e.preventDefault();
        window.location.hash = route;
      });
    });

    // ─── 5. fc-toggle: Alternar visibilidad de elemento por ID ───────────────
    const toggleEls = rootEl.querySelectorAll('[fc-toggle], [flut-toggle]');
    toggleEls.forEach(el => {
      const targetId = getAttr(el, 'toggle');
      if (!targetId) return;
      el.style.cursor = 'pointer';
      el.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
          const isHidden = target.hidden || window.getComputedStyle(target).display === 'none';
          target.hidden = !isHidden;
          target.style.display = isHidden ? '' : 'none';
        }
      });
    });

    // ─── 6. fc-click: Acción declarativa al hacer clic ───────────────────────
    const clickEls = rootEl.querySelectorAll('[fc-click], [flut-click]');
    clickEls.forEach(el => {
      const action = getAttr(el, 'click');
      if (!action) return;
      el.style.cursor = 'pointer';
      el.addEventListener('click', e => {
        try {
          new Function('e', 'Flut', 'app', action)(e, window.Flut, this);
        } catch (err) {
          console.warn('[Flutcom] Error evaluando fc-click:', action, err);
        }
      });
    });
  }

  /**
   * Método público para procesar directivas en cualquier contenedor DOM.
   * @param {HTMLElement} [container=document.body]
   */
  bind(container = document.body) {
    this._bindDirectives(container);
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

  /** Escapa entidades HTML para mitigar inyecciones de código (XSS) */
  _escapeHtml(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  _wait(ms) { return new Promise(r => setTimeout(r, ms)); }
}
