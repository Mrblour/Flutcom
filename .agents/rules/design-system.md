# 🎭 Sistema de Diseño — Flutcom UI

> Todas las interfaces deben seguir este sistema. El objetivo es un aspecto estilo Apple / Linear / Vercel.

---

## 1. Filosofía Visual

- **Minimalista**: Menos es más. Espacios blancos generosos, sin ruido visual.
- **Moderno**: Bordes redondeados, sombras suaves, glassmorphism donde tenga sentido.
- **Fluido**: Las transiciones deben sentirse naturales. Nada de cambios bruscos.
- **Responsive**: Mobile-first. La UI debe lucir perfecta en móvil antes que en escritorio.

---

## 2. Tipografía

- **Fuente principal**: `Inter` (importada desde Google Fonts — ya incluida en `index.html`).
- Jerarquía de tamaños sugerida (Tailwind):

| Rol | Clase Tailwind | Ejemplo |
| :--- | :--- | :--- |
| Título hero | `text-6xl font-bold tracking-tighter` | Pantalla principal |
| Título de sección | `text-3xl font-semibold` | Encabezado de bloque |
| Subtítulo | `text-xl font-medium text-neutral-500` | Descripción |
| Cuerpo | `text-base font-normal leading-relaxed` | Párrafo normal |
| Etiqueta pequeña | `text-sm font-medium uppercase tracking-widest` | Labels / badges |

---

## 3. Paleta de Colores

### Modo claro (actual)
```
Fondo base   : #f5f5f7  (gris Apple muy claro)
Texto primario: #1d1d1f  (negro Apple)
Texto secundario: #86868b (gris Apple medio)
Blanco cards : #ffffff
Bordes sutiles: rgba(0,0,0,0.05)
```

### Acentos (usar con moderación)
```
Acento púrpura: #d977e8
Acento cálido:  #ffd56b
Acento coral:   #ff8c75
```

---

## 4. Componentes Base

### Cards / Cajas
```html
<div class="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5
            hover:scale-[1.01] transition-transform duration-300">
  ...
</div>
```

### Botón primario
```html
<button class="inline-flex items-center gap-2 px-6 py-3 bg-[#1d1d1f] text-white
               rounded-full text-sm font-semibold hover:opacity-80 transition-opacity">
  Acción
</button>
```

### Badge / Pill
```html
<span class="inline-flex items-center px-3 py-1 rounded-full bg-[#f5f5f7]
             text-xs font-semibold text-[#1d1d1f] border border-black/5">
  Label
</span>
```

---

## 5. Animaciones

- Usar las clases `reveal` y `reveal-up` con `data-delay` para animaciones al hacer scroll (requiere `plugins/animations.js`):
  ```html
  <div class="reveal reveal-up" data-delay="200">
    Contenido animado
  </div>
  ```
- Para animaciones de entrada de vistas, usar clases CSS con `@keyframes` en `flutcom.css`.
- **Duración recomendada**: 200ms–400ms. Nada por encima de 600ms salvo casos especiales.
- **Easing recomendado**: `ease-out` o `cubic-bezier(0.22, 1, 0.36, 1)`.

---

## 6. Iconos

- Usar **Bootstrap Icons** (ya cargado en `index.html` vía CDN):
  ```html
  <i class="bi bi-box-seam"></i>
  <i class="bi bi-arrow-right"></i>
  ```
- Referencia completa: https://icons.getbootstrap.com/
