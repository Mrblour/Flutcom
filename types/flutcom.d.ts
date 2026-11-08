/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║              FLUTCOM FRAMEWORK DEFINITIONS               ║
 * ║  TypeScript definitions for Flutcom SPA Framework         ║
 * ╚══════════════════════════════════════════════════════════╝
 */

/**
 * Site metadata and global routing defaults.
 */
export interface SiteConfig {
  /** Nombre del sitio web o aplicación */
  nombre: string;
  /** Autor o creador del proyecto */
  autor?: string;
  /** Versión del proyecto */
  version?: string;
  /** Descripción general utilizada para SEO y fallback de Open Graph */
  descripcion?: string;
  /** URL pública de despliegue (ej. https://mrblour.github.io/Flutcom/) necesaria para SEO Canónico */
  url?: string;
  /** Vista por defecto que se carga al entrar a la raíz (#home) */
  defaultView: string;
  /** Ruta al archivo HTML de error 404 */
  notFoundView: string;
  /** Idioma principal de la web (ej. "es", "en") */
  lang?: string;
  /** Imagen global para Open Graph y Twitter Cards (ruta absoluta o relativa) */
  image?: string;
}

/**
 * Metadata SEO enriquecida para cada ruta o página individual.
 */
export interface RouteSEO {
  /** Título de la pestaña (<title>) */
  title?: string;
  /** Descripción para meta description y og:description */
  description?: string;
  /** Palabras clave separadas por comas o en array para meta keywords */
  keywords?: string | string[];
  /** Imagen específica para compartir esta página en redes (og:image) */
  image?: string;
  /** Directivas para motores de búsqueda (ej. 'index, follow' o 'noindex, nofollow') */
  robots?: 'index, follow' | 'noindex, nofollow' | 'noindex, follow' | string;
  /** URL canónica para evitar duplicidad de contenido en Google */
  canonical?: string;
  /** Objeto de datos estructurados Schema.org para Google Rich Snippets */
  jsonLd?: Record<string, any>;
}

/**
 * Configuración detallada de una ruta.
 */
export interface RouteConfig extends RouteSEO {
  /** Ruta al archivo HTML de la vista (ej. "resources/views/public/home.html") */
  view: string;
  [key: string]: any;
}

/**
 * Definición de ruta: puede ser una ruta simple con string o un objeto con SEO.
 */
export type RouteDefinition = string | RouteConfig;

/**
 * Parciales persistentes del cascarón (navbar, footer, etc.)
 */
export type PartialsConfig = Record<string, string>;

/**
 * Recursos externos a inyectar (JS o CSS)
 */
export interface ResourceItem {
  type: 'js' | 'css';
  file: string;
}

/**
 * Configuración completa de la aplicación Flutcom.
 */
export interface FlutcomConfig {
  site: SiteConfig;
  partials?: PartialsConfig;
  routes: Record<string, RouteDefinition>;
  authRoutes?: Record<string, RouteDefinition>;
  plugins?: string[];
  resources?: ResourceItem[];
}

/**
 * Estructura de un Plugin Nativo de Flutcom.
 */
export interface FlutcomPlugin {
  name: string;
  version?: string;
  author?: string;
  description?: string;
  /** Inicialización del plugin al arrancar Flutcom */
  init(app: FlutcomApp, config?: { options?: Record<string, any> }): void | Promise<void>;
  /** Ejecutado en cada navegación SPA al cambiar de vista */
  onNavigate?(viewName: string, container: HTMLElement | Document): void;
  /** Limpieza al descargar el plugin */
  destroy?(): void;
  [key: string]: any;
}

/**
 * Helper global de utilidades Flut (`window.Flut`).
 */
export interface FlutHelper {
  /** Navega a una ruta registrada por hash */
  go(route: string): void;
  /** Guarda un dato en el store reactivo */
  set<T = any>(key: string, value: T): void;
  /** Lee un dato del store reactivo */
  get<T = any>(key: string): T;
  /** Observa cambios en una clave específica del store */
  watch<T = any>(key: string, fn: (newValue: T) => void): () => void;
  /** Invierte el valor booleano de una clave en el store */
  toggle(key: string): void;
  /** Incrementa un número en el store */
  increment(key: string, step?: number): void;
  /** Decrementa un número en el store */
  decrement(key: string, step?: number): void;
  /** Resetea una clave en el store */
  clear(key: string): void;
  /** Controla un modal registrado por ID */
  modal(id: string): {
    open(): void;
    close(): void;
  };
  /** Muestra una notificación toast */
  toast(message: string, type?: 'info' | 'success' | 'error' | 'warning', duration?: number): void;
}

/**
 * Store reactivo interno de Flutcom.
 */
export interface FlutcomStore {
  _state: Record<string, any>;
  _listeners: Array<(key: string, value: any, state: Record<string, any>) => void>;
  get<T = any>(key: string): T;
  set<T = any>(key: string, value: T): void;
  subscribe(fn: (key: string, value: any, state: Record<string, any>) => void): () => void;
  unsubscribe(fn: Function): void;
}

/**
 * Instancia del motor principal de Flutcom.
 */
export interface FlutcomApp {
  store: FlutcomStore;
  _currentRoute?: RouteConfig;
  on(event: 'beforeLeave' | 'beforeEnter' | 'afterEnter', fn: (viewName: string, contentEl?: HTMLElement) => void): FlutcomApp;
  guard(route: string, checkFn: () => boolean, fallbackRoute?: string): void;
  on404(fn: (contentEl: HTMLElement) => void): void;
  init(): void;
}

declare global {
  interface Window {
    Flut: FlutHelper;
    flutcomApp: FlutcomApp;
    FlutcomAnimations?: { refresh(): void };
    PremiumEffects?: { refresh(): void };
  }
}
