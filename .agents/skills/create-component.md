# 🧩 Skill: Crear un Componente Reutilizable

Un componente en Flutcom v2 es un archivo HTML modular en `resources/components/` que se utiliza en cualquier vista como una **etiqueta HTML directa sin necesidad de JavaScript**.

---

## Paso 1 — Crear el archivo del componente

Crea un archivo en `resources/components/` con el nombre de tu componente:

```
resources/components/nombre.html
```

Ejemplo — `resources/components/card.html`:
```html
<div class="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
  <div class="flex items-center gap-2 mb-2">
    <i class="{{ icon }} text-indigo-600"></i>
    <h3 class="font-bold text-lg text-zinc-900">{{ title }}</h3>
  </div>
  <p class="text-zinc-600 text-sm mb-3">{{ description }}</p>
  <div class="mt-2">{{ slot }}</div>
</div>
```

> **Variables disponibles en el template:**
> - `{{ nombreProp }}`: Se reemplaza por el valor del atributo que le pases en el HTML.
> - `{{ slot }}`: Se reemplaza por cualquier contenido HTML hijo colocado dentro de la etiqueta.

---

## Paso 2 — Usarlo en cualquier vista

### 1. Sintaxis Shorthand Directa (Recomendada)
Sin imports ni scripts, Flutcom lo detecta automáticamente:

```html
<flut-card 
  icon="bi bi-shield-check" 
  title="Seguridad" 
  description="Tu cuenta está activa y protegida.">
</flut-card>
```

### 2. Con Slot (Contenido hijo personalizado)
```html
<flut-card icon="bi bi-bell" title="Notificaciones" description="Tienes avisos pendientes.">
  <button fc-go="ajustes" class="px-3 py-1 bg-zinc-900 text-white rounded-lg text-xs">
    Configurar
  </button>
</flut-card>
```

### 3. Sintaxis Genérica Dinámica
```html
<flut-component name="card" title="Mi Tarjeta" description="..."></flut-component>
```

---

## Directivas útiles dentro de componentes

Puedes combinar componentes con las directivas reactivas de Flutcom:
- `fc-bind="clave"`: Actualiza texto reactivamente desde el store.
- `fc-model="clave"`: Two-way binding en inputs del componente.
- `fc-show="clave"`: Muestra/oculta partes del componente según el estado.
- `fc-go="ruta"`: Navega al hacer clic sin código JS.
