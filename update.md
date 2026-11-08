# 🚀 Flutcom Update Log — v1.3.0

> **Fecha de actualización:** Noviembre 2026  
> **Versión anterior:** `v1.2.0`  
> **Nueva versión:** `v1.3.0`

---

## 📌 Resumen de Cambios

En esta versión se incorporan dos grandes mejoras arquitectónicas sin perder la filosofía fundamental de Flutcom (**cero dependencias en tiempo de ejecución y cero sobrecarga para sitios estáticos**):

1. **Soporte Completo de TypeScript (TS)**: Autocompletado inteligente (IntelliSense) y verificación de tipos estática opcional (`npm run check`) sin requerir compiladores pesados para el navegador.
2. **Motor Avanzado de SEO para Google y Redes Sociales**: Soporte dinámico para motores de búsqueda (Googlebot), etiquetas canónicas, Open Graph, Twitter Cards, Schema.org (JSON-LD), `robots.txt` y `sitemap.xml`.

---

## 📁 Archivos Nuevos

| Archivo | Propósito |
| :--- | :--- |
| `types/flutcom.d.ts` | Definiciones de tipos para configuración, rutas, plugins, store y helpers globales (`Flut`). |
| `flutcom/config.js` | Funciones auxiliares tipadas `defineConfig()` y `definePlugin()` para autocompletado en IDEs. |
| `tsconfig.json` | Configuración estricta de TypeScript para chequeo de tipos con `allowJs: true` y `noEmit: true`. |
| `robots.txt` | Directivas estándar para rastreadores web (Googlebot, Bingbot) con enlace al sitemap. |
| `sitemap.xml` | Mapa del sitio con las URLs canónicas y prioridades de rastreo de la SPA. |
| `README.update.md` | Este registro oficial de actualización. |

---

## 🛠️ Archivos Modificados

### 1. `flutcom.config.js`
- Tipado estático con JSDoc apuntando a `types/flutcom.d.ts`.
- Campo `url` agregado a la configuración del sitio (`site`).
- Soporte para metadatos avanzados por ruta (`keywords`, `robots`, `image`, `canonical`, `jsonLd`).
- Versión actualizada a `1.3.0`.

### 2. `flutcom/main.js`
- El hook `afterEnter` ahora actualiza dinámicamente en el DOM:
  - `<title>` por vista.
  - `meta[name="description"]` y `meta[name="keywords"]`.
  - `meta[name="robots"]` (`index, follow` o `noindex`).
  - `<link rel="canonical">` por cada ruta para evitar penalizaciones por contenido duplicado.
  - Metas sociales completos (Open Graph y Twitter Cards).
  - Bloque `<script type="application/ld+json">` dinámico para Google Rich Snippets.

### 3. `index.html`
- Inclusión de etiquetas base Open Graph y Twitter Cards.
- Enlace canónico inicial.
- Metadatos estructurados Schema.org (`SoftwareApplication` / `WebSite`).

### 4. `run/build.js`
- Se agregaron `robots.txt` y `sitemap.xml` a la lista de copia de producción hacia la carpeta `dist/`.

### 5. `flutcom/flut.js`
- Anotaciones de tipos JSDoc conectadas a `FlutHelper` y `FlutcomApp`.

### 6. `package.json`
- Versión actualizada a `1.3.0`.
- Nuevo script: `"check": "tsc --noEmit"` para validar tipos en 0.5s.
- `typescript` agregado como dependencia de desarrollo (`devDependencies`).

---

## 💡 Cómo Usar las Nuevas Funcionalidades

### 1. Validación de Tipos (TypeScript)
Para comprobar que no existan errores de tipos o sintaxis en todo el proyecto:
```bash
npm run check
```

### 2. Configurar SEO en una Ruta
En `flutcom.config.js`:
```javascript
export const routes = {
  catalogo: {
    view: "resources/views/public/catalogo.html",
    title: "Catálogo de Productos",
    description: "Explora nuestra selección completa de artículos.",
    keywords: ["productos", "tienda", "catalogo"],
    robots: "index, follow",
    image: "https://misitio.com/assets/img/portada-catalogo.jpg",
    // Datos estructurados Schema.org opcionales
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Catálogo de Productos"
    }
  }
};
```

### 3. Compilación de Producción
Al ejecutar el build:
```bash
npm run build
```
La carpeta `dist/` incluirá automáticamente `robots.txt` y `sitemap.xml` listos para ser indexados por Google Search Console al desplegar en GitHub Pages, Vercel o Netlify.
