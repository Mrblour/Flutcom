# 🏗️ Reglas Arquitectónicas — Flutcom

> ⚠️ Estas reglas son OBLIGATORIAS. No las ignores bajo ninguna circunstancia.

---

## 1. Principios Fundamentales

| Principio | Descripción |
| :--- | :--- |
| **Zero-runtime dependencies** | El framework NO usa librerías externas en producción. Solo Vanilla JS (ES Modules) puro. |
| **Hash-based routing** | La navegación se hace exclusivamente por hash (`#home`, `#docs`). No usar `pushState`. |
| **Ficheros estáticos** | Todas las vistas son archivos `.html` estáticos. No se genera HTML en el servidor. |
| **Separación clara** | Config → `flutcom.config.js`. Motor → `flutcom/core.js`. Vistas → `resources/views/`. |

---

## 2. Archivos que NO debes modificar sin permiso explícito

```
flutcom/core.js     ❌  Motor del framework. Cambios aquí rompen TODO.
flutcom/main.js     ❌  Bootstrap. Mantener mínimo y limpio.
```

---

## 3. Archivos de configuración central

- **`flutcom.config.js`** → La única fuente de verdad para rutas, plugins y metadata.
- Al añadir una nueva vista, SIEMPRE regístrala aquí:
  ```js
  export const routes = {
    home   : "resources/views/public/home.html",
    about  : "resources/views/public/about.html",  // ← nueva vista
  };
  ```

---

## 4. Flujo de una vista

```
index.html (#content)
  └── flutcom/main.js  (bootstrap)
       └── flutcom/core.js  (router)
            └── resources/views/public/[ruta].html  (inyectado dinámicamente)
```

---

## 5. Plugins

Existen dos tipos de extensiones en Flutcom:

### A) Plugins Nativos de Flutcom (Estándar Oficial)
- Viven en su propia subcarpeta: `plugins/<nombre>/`.
- **REQUISITO ESTRICTO**: Deben contener obligatoriamente el par de archivos:
  - `plugins/<nombre>/<nombre>.flutcom.json` (o `.fc.json`) — Configuración Zero-Code.
  - `plugins/<nombre>/<nombre>.flutcom.js` (o `.fc.js`) — Lógica modular (`init`, `onNavigate`).
- Se registran en `flutcom.config.js` en el array `plugins: ['<nombre>']`.
- Ambiente: **Cerrado y autocontenido** (no contamina el scope global), pero **no limitado** (acceso total al ciclo de vida, DOM y store).

### B) Scripts Tradicionales y Open-Source
- Archivos `.js` sueltos en `plugins/` o dentro de `plugins/opensource/`.
- No requieren archivo `.json`.
- Se registran manualmente en `flutcom.config.js` en el array `resources: [{ type: 'js', file: '...' }]`.

---

## 6. Estado global

Para compartir datos entre vistas, usar **exclusivamente** el store integrado:

```js
// Escribir
window.flutcomApp.store.set('usuario', { nombre: 'Alex' });

// Leer
const user = window.flutcomApp.store.get('usuario');

// Suscribirse a cambios
window.flutcomApp.store.subscribe((key, val) => {
  console.log(`[store] ${key} actualizado:`, val);
});
```

**No uses** `window.miVariable` ni variables globales sueltas.
