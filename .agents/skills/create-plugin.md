# 🔌 Skill: Crear un Plugin en Flutcom

Guía paso a paso para desarrollar extensiones en Flutcom, siguiendo el estándar de plugins nativos o scripts tradicionales.

---

## 🛡️ Regla de Oro: Tipos de Plugins

| Tipo | Ubicación | Archivos Obligatorios | Dónde se declara |
| :--- | :--- | :--- | :--- |
| **Plugin Nativo Flutcom** (Recomendado) | `plugins/<nombre>/` | 1. `<nombre>.flutcom.json` (o `.fc.json`)<br>2. `<nombre>.flutcom.js` (o `.fc.js`) | `plugins: ["nombre"]` en `flutcom.config.js` |
| **Script Tradicional / Open-Source** | `plugins/` o `plugins/opensource/` | Solo archivo `.js` | `resources: [{ type: "js", file: "..." }]` en `flutcom.config.js` |

---

## Opción A — Crear un Plugin Nativo Flutcom (Estándar Oficial)

Los plugins nativos funcionan en un ambiente **cerrado y autocontenido** (no contaminan `window`), pero **no limitado** (tienen acceso completo a `app`, `Flut`, estado y DOM).

### Paso 1: Crear la subcarpeta del plugin
Crea la carpeta dentro de `plugins/`:
```text
plugins/
  └── miplugin/
       ├── miplugin.flutcom.json   (o miplugin.fc.json)
       └── miplugin.flutcom.js     (o miplugin.fc.js)
```

### Paso 2: Crear el archivo de configuración JSON
En `plugins/miplugin/miplugin.flutcom.json`:
```json
{
  "name": "miplugin",
  "version": "1.0.0",
  "author": "Tu Nombre",
  "enabled": true,
  "options": {
    "color": "#000000",
    "autoplay": true
  }
}
```

### Paso 3: Crear la lógica del plugin en JS
En `plugins/miplugin/miplugin.flutcom.js`:
```javascript
export default {
  name: "miplugin",
  version: "1.0.0",

  /**
   * Se ejecuta una sola vez al inicializar el framework.
   * @param {Object} app - Instancia principal de Flutcom.
   * @param {Object} config - Configuración leída del archivo JSON.
   */
  init(app, config) {
    this._app = app;
    this._options = config.options || {};
    console.info(`[Plugin ${this.name}] Listo con opciones:`, this._options);
  },

  /**
   * Se ejecuta automáticamente tras cada navegación SPA.
   * @param {string} viewName - Nombre de la ruta cargada.
   * @param {HTMLElement} container - Contenedor con el HTML inyectado.
   */
  onNavigate(viewName, container) {
    this._scan(container);
  },

  _scan(container) {
    const items = container.querySelectorAll('[data-miplugin]');
    items.forEach(el => {
      // Tu lógica declarativa aquí
    });
  }
};
```

### Paso 4: Registrar en `flutcom.config.js`
Agrega el nombre de la carpeta al array `plugins`:
```javascript
export const plugins = [
  "miplugin",
];
```

---

## Opción B — Crear un Script Tradicional / Open-Source

Si se trata de una librería externa o un script JS simple que no sigue el formato `.flutcom.js` + `.flutcom.json`:

1. Coloca el archivo en `plugins/opensource/mi-libreria.js`.
2. Regístralo en `flutcom.config.js`:
```javascript
export const resources = [
  { type: "js", file: "plugins/opensource/mi-libreria.js" },
];
```

---

## ✅ Checklist de Validación

- [ ] La carpeta se llama igual que los archivos: `plugins/<nombre>/<nombre>.*`
- [ ] Incluye el archivo `.flutcom.json` (o `.fc.json`) con `"enabled": true`
- [ ] Incluye el archivo `.flutcom.js` (o `.fc.js`) con `export default`
- [ ] Implementa `init(app, config)` y opcionalmente `onNavigate(view, container)`
- [ ] Está registrado en `plugins: [...]` de `flutcom.config.js`
- [ ] Si es un script común sin estándar, está en `plugins/opensource/` y registrado en `resources: [...]`
