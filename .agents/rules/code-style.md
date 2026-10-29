# 🎨 Estilo de Código — Flutcom

> Todos los archivos JavaScript generados deben seguir estas convenciones sin excepción.

---

## 1. JavaScript

### Sintaxis moderna (ES6+)
```js
// ✅ Correcto
const saludar = (nombre) => `Hola, ${nombre}`;
const { dato, otro } = objeto;
const resultado = await fetch(url).then(r => r.json());

// ❌ Incorrecto
function saludar(nombre) { return 'Hola, ' + nombre; }
var dato = objeto.dato;
```

### Módulos
- Usar siempre `import` / `export` (ES Modules). **No usar `require()`**.
- Los plugins se auto-registran o exportan una función de inicialización:
  ```js
  // plugins/mi-plugin.js
  export function initMiPlugin() { /* ... */ }
  // o simplemente ejecutar al cargar:
  (() => { /* IIFE auto-ejecutado */ })();
  ```

### Nombrado
| Tipo | Convención | Ejemplo |
| :--- | :--- | :--- |
| Variables / funciones | `camelCase` | `getUserData`, `isVisible` |
| Clases | `PascalCase` | `Flutcom`, `ModalManager` |
| Constantes | `UPPER_SNAKE_CASE` | `DEFAULT_TIMEOUT` |
| Archivos JS | `kebab-case` | `my-plugin.js` |
| Archivos HTML | `kebab-case` | `about-us.html` |

### Comentarios
- Documentar funciones públicas con JSDoc:
  ```js
  /**
   * Navega a una vista por su clave de hash.
   * @param {string} routeKey - Clave de ruta definida en flutcom.config.js
   */
  navigateTo(routeKey) { /* ... */ }
  ```

---

## 2. HTML (Vistas y Parciales)

- Las vistas son **fragmentos HTML** (sin `<!DOCTYPE>`, `<html>`, `<head>`, `<body>`).
- Siempre incluir un contenedor raíz semántico:
  ```html
  <!-- ✅ Correcto -->
  <section class="vista-home">
    ...
  </section>

  <!-- ❌ Incorrecto: múltiples raíces sin contenedor -->
  <div>...</div>
  <div>...</div>
  ```
- Usar **etiquetas semánticas**: `<section>`, `<article>`, `<header>`, `<nav>`, `<aside>`, `<footer>`.

---

## 3. CSS / Tailwind

- **Tailwind v4** es el sistema de utilidades principal.
- Los estilos base del framework van en `assets/css/flutcom.css`.
- Los estilos personalizados del proyecto van en `assets/css/style.css`.
- **Evitar** estilos en línea (`style="..."`) salvo para valores dinámicos.
- **No duplicar** clases de Tailwind con CSS manual equivalente.

---

## 4. Formato General

- **Indentación**: 2 espacios.
- **Punto y coma**: Siempre al final de cada sentencia JS.
- **Comillas**: Simples `'` en JS. Dobles `"` en HTML.
- **Longitud máxima de línea**: 100 caracteres.
