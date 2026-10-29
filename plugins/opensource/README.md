# 🌐 Plugins OpenSource & Scripts Tradicionales

Esta carpeta está destinada a scripts JavaScript estándar, librerías de terceros o utilidades abiertas que **no siguen el estándar de plugins nativos de Flutcom**.

## Diferencia con los Plugins Nativos de Flutcom

| Característica | 🧩 Plugin Nativo Flutcom | 🌐 Script OpenSource / Tradicional |
| :--- | :--- | :--- |
| **Ubicación** | `plugins/<nombre>/` | `plugins/opensource/<script>.js` (o en `plugins/`) |
| **Archivos Requeridos** | OBLIGATORIO `.flutcom.js` (o `.fc.js`) + `.flutcom.json` (o `.fc.json`) | Solo archivo `.js` |
| **Registro** | En `plugins: [...]` dentro de `flutcom.config.js` | En `resources: [...]` dentro de `flutcom.config.js` |
| **Configuración** | Zero-Code mediante su propio `.json` | Manual en el código o variables globales |
| **Ciclo de vida** | Auto-inyección `init(app, config)` y `onNavigate(view, container)` | Manual mediante eventos del DOM o `resources[]` |

## Cómo registrar un script aquí

En `flutcom.config.js`:

```javascript
export const resources = [
  { type: "js", file: "plugins/opensource/mi-libreria.js" },
];
```
