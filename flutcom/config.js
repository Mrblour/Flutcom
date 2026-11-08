// @ts-check
/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║              FLUTCOM CONFIGURATION HELPERS               ║
 * ║  Typed helpers for Flutcom config and plugins             ║
 * ╚══════════════════════════════════════════════════════════╝
 */

/**
 * @typedef {import('../types/flutcom').FlutcomConfig} FlutcomConfig
 * @typedef {import('../types/flutcom').FlutcomPlugin} FlutcomPlugin
 * @typedef {import('../types/flutcom').SiteConfig} SiteConfig
 * @typedef {import('../types/flutcom').RouteConfig} RouteConfig
 * @typedef {import('../types/flutcom').RouteDefinition} RouteDefinition
 */

/**
 * Provee autocompletado e IntelliSense completo de TypeScript para la configuración de Flutcom.
 * @param {FlutcomConfig} config
 * @returns {FlutcomConfig}
 */
export function defineConfig(config) {
  if (typeof window !== 'undefined' && (!config.site?.url || config.site.url.includes('example.com'))) {
    console.warn('[Flutcom] ⚠️ site.url no está configurado o es el predeterminado. El SEO canónico y Open Graph pueden no funcionar con URLs absolutas.');
  }
  return config;
}

/**
 * Provee autocompletado y validación de tipos para la creación de plugins nativos de Flutcom.
 * @param {FlutcomPlugin} plugin
 * @returns {FlutcomPlugin}
 */
export function definePlugin(plugin) {
  return plugin;
}
