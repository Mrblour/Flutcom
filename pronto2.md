# 🧱 Flutcom — Próximamente Parte 2 (Componentes HTML v2)

Especificación de arquitectura, sintaxis declarativa y estándar para el motor de componentes en `resources/components/`.

---

## 🎯 Visión General
Transformar los componentes de Flutcom en una experiencia modular, limpia y sin código JavaScript en las vistas, combinando la facilidad de **Astro** y **Web Components** con la filosofía **Zero-Runtime** de Flutcom.

---

## 1. 🏷️ Sintaxis de Invocación en las Vistas

### A) Etiqueta Directa Nativa (Shorthand)
Cualquier archivo creado en `resources/components/<nombre>.html` se invoca de manera natural usando la etiqueta `<flut-<nombre>>`:

```html
<!-- Componente simple autocerrado con atributos (props) -->
<flut-alert type="success" icon="bi bi-check-circle" title="Operación Exitosa" description="Los cambios se guardaron correctamente." />

<!-- Componente con contenido hijo (Slot) -->
<flut-card title="Métricas de Usuario" icon="bi bi-graph-up">
  <p class="text-sm text-zinc-600">Este contenido se inyecta directamente dentro del componente.</p>
  <button fc-click="Flut.toast('success', 'Actualizado')" class="btn">Refrescar</button>
</flut-card>
```

### B) Props Booleanas (Flags automáticas)
Los atributos sin valor asignado se reconocen automáticamente como booleanos verdaderos (`true`):

```html
<!-- rounded y outline se envían como props con valor true -->
<flut-badge text="En Producción" rounded outline />
<flut-button text="Guardar" loading disabled />
```

### C) Slots Nombrados (Named Slots)
Para componentes modulares con múltiples áreas (cabecera, cuerpo y pie):

```html
<flut-modal title="Confirmar Eliminación">
  <!-- Slot principal / default -->
  <p>¿Estás seguro de que deseas eliminar este registro permanentemente?</p>

  <!-- Slot nombrado para acciones del pie -->
  <div slot="footer" class="flex justify-end gap-2">
    <button fc-click="Flut.modal('confirm').close()" class="btn-secondary">Cancelar</button>
    <button fc-click="eliminarRegistro()" class="btn-danger">Confirmar</button>
  </div>
</flut-modal>
```

---

## 2. 📝 Sintaxis dentro del Template (`resources/components/<nombre>.html`)

### A) Interpolación y Limpieza Inteligente de Props
```html
<!-- resources/components/alert.html -->
<div class="alert-box alert-{{ type ?? 'info' }}">
  <i class="{{ icon ?? 'bi bi-info-circle' }}"></i>
  <div class="alert-content">
    <h4 class="title">{{ title }}</h4>
    <p class="desc">{{ description }}</p>
    <div class="body-slot">{{ slot }}</div>
  </div>
</div>
```

> **🛡️ Regla de Oro de Limpieza:**
> Si el usuario no pasa una prop (por ejemplo, omite `description`), el motor de Flutcom la limpia automáticamente (cadena vacía) para que **nunca aparezca el texto crudo `{{ description }}` en pantalla**.

### B) Valores por Defecto (Fallbacks con `??`)
Permite definir textos o clases predeterminadas en caso de que la prop no venga:

```html
<h3>{{ title ?? 'Sin título' }}</h3>
<span class="badge">{{ variant ?? 'default' }}</span>
```

### C) Inyección de Slots Nombrados
```html
<!-- resources/components/modal.html -->
<div class="modal-dialog">
  <div class="modal-header">
    <h3>{{ title }}</h3>
    <button data-modal-close>✕</button>
  </div>
  <div class="modal-body">
    {{ slot }}
  </div>
  <div class="modal-footer">
    {{ slot:footer }}
  </div>
</div>
```

---

## 3. 📁 Estructura de Carpetas

```text
resources/components/
  ├── alert.html                # <flut-alert ... />
  ├── badge.html                # <flut-badge ... />
  ├── card.html                 # <flut-card ... />
  ├── button.html               # <flut-button ... />
  ├── modal.html                # <flut-modal ... />
  ├── input.html                # <flut-input ... />
  └── ui/                       # Organización en subcarpetas (opcional)
       ├── avatar.html          # <flut-ui-avatar ... />
       └── dropdown.html        # <flut-ui-dropdown ... />
```

---

## 4. 📋 Roadmap de Componentes Planificados

- [x] **`<flut-alert>`**: Notificaciones con icono, título, descripción y slot.
- [x] **`<flut-badge>`**: Chips/pills de estado con variantes de color.
- [x] **`<flut-card>`**: Tarjetas Bento minimalistas con soporte de slot hijo.
- [ ] **`<flut-button>`**: Botones con variantes (`primary`, `secondary`, `outline`), iconos y estados `loading`.
- [ ] **`<flut-modal>`**: Ventanas modales accesibles con soporte de slots nombrados (`slot:footer`).
- [ ] **`<flut-input>`**: Campos de formulario estilizados con etiqueta y validación visual.
- [ ] **`<flut-accordion>`**: Acordeones colapsables para FAQs o paneles desplegables.
- [ ] **`<flut-tabs>`**: Pestañas de navegación de contenido Zero-JS.
