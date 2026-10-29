# 📖 Skill: Añadir una Nueva Ruta / Vista

Sigue estos pasos **en orden** para añadir una nueva página al proyecto Flutcom.

---

## Paso 1 — Crear el archivo HTML de la vista

Crea un archivo en `resources/views/public/`:

```
resources/views/public/nombre-vista.html
```

El archivo debe ser un **fragmento HTML** (sin `<html>`, `<head>` ni `<body>`):

```html
<section class="min-h-screen flex flex-col items-center justify-center px-6 py-24">
  <h1 class="text-5xl font-bold text-[#1d1d1f] mb-4">Nombre de la Vista</h1>
  <p class="text-xl text-[#86868b]">Descripción de esta sección.</p>
</section>
```

---

## Paso 2 — Registrar la ruta en `flutcom.config.js`

Abre `flutcom.config.js` y añade la ruta en el objeto `routes`:

```js
export const routes = {
  home    : "resources/views/public/home.html",
  about   : "resources/views/public/about.html",    // ← nueva ruta
  contact : "resources/views/public/contact.html",  // ← otra nueva ruta
};
```

> Ahora la vista estará disponible en `#about` y `#contact`.

---

## Paso 3 — (Opcional) Añadir enlace en el menú

Abre `resources/partials/header.html` y añade el enlace de navegación:

```html
<a href="#about" class="nav-link">Acerca de</a>
```

---

## Paso 4 — Verificar

1. Ejecuta `npm run dev` si no está corriendo.
2. Navega a `http://localhost:3000/#about`.
3. Verifica que la vista se carga correctamente.
4. Comprueba que no hay errores en la consola del navegador.

---

## ✅ Checklist

- [ ] Archivo HTML creado en `resources/views/public/`
- [ ] Ruta registrada en `flutcom.config.js`
- [ ] Enlace añadido en el menú (si corresponde)
- [ ] Vista verificada en el navegador sin errores
