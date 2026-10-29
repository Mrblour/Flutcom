# 🚀 Flutcom — Próximamente (Roadmap)

Ideas, especificaciones de arquitectura y características planificadas para las próximas versiones de Flutcom.

---

## 🧩 Nuevo Sistema de Plugins Comunitarios (Estilo Minecraft & WordPress)

### Visión General
El objetivo es transformar el sistema de plugins en una experiencia **100% modular y Zero-Code**, inspirada en la arquitectura de plugins de **Minecraft (Spigot/Bukkit)** y **WordPress**:

1. **Cero programación para el usuario final**: Quien arme su web con Flutcom no necesita escribir código JavaScript.
2. **Carpetas autocontenidas**: Cada plugin se instala simplemente soltando su carpeta dentro de `plugins/`.
3. **Configuración sin código (`config.json`)**: Cada plugin tiene su propio archivo de opciones donde el usuario cambia ajustes de texto, tiempos o activa/desactiva funciones sin tocar lógica.
4. **Comunidad activa**: Cualquier desarrollador puede crear y compartir plugins para que otros los usen inmediatamente.

---

### 📁 Estructura de Carpetas y Nombres de Archivo

Cada plugin comunitario vive en su propia subcarpeta dentro de `plugins/` (ej: `plugins/miplugin/`). 
Para darle una identidad propia y estandarizada al ecosistema Flutcom, los archivos utilizan las extensiones dedicadas **`.flutcom.js`** (o su alias corto **`.fc.js`**) y **`.flutcom.json`** (o **`.fc.json`**):

```text
plugins/
  ├── miplugin/                             # [Plugin Flutcom Nativo]
  │    ├── miplugin.flutcom.json            # Configuración obligatoria (o miplugin.fc.json)
  │    └── miplugin.flutcom.js              # Lógica obligatoria (o miplugin.fc.js)
  │
  ├── timer/                                # [Plugin Flutcom Nativo]
  │    ├── timer.flutcom.json               # (o timer.fc.json)
  │    └── timer.flutcom.js                 # (o timer.fc.js)
  │
  ├── animations/                           # [Plugin Flutcom Nativo]
  │    ├── animations.flutcom.json          # (o animations.fc.json)
  │    └── animations.flutcom.js            # (o animations.fc.js)
  │
  ├── menu.js                               # [Script Tradicional / Standalone]
  ├── modals.js                             # [Script Tradicional / Standalone]
  └── opensource/                           # [Librerías externas / Scripts abiertos]
       └── analytics.js                     # Script JS común sin estándar de plugin
```

---

### 🛡️ Regla de Oro: Entorno Estricto pero No Limitado

Para que el ecosistema sea ordenado y seguro sin restringir el poder de desarrollo, se define la siguiente regla arquitectónica:

| Característica | 🧩 Plugin Nativo Flutcom | 📄 Script Tradicional / Open-Source |
| :--- | :--- | :--- |
| **Ubicación** | Carpeta dedicada: `plugins/<nombre>/` | Archivo suelto en `plugins/` o `plugins/opensource/` |
| **Archivos Requeridos** | **OBLIGATORIO** el par:<br>1. `<nombre>.flutcom.js` (o `.fc.js`)<br>2. `<nombre>.flutcom.json` (o `.fc.json`) | Solo archivo `.js` regular |
| **Configuración** | Zero-Code mediante su archivo `.json` | Hardcodeada en código o variables manuales |
| **Ciclo de Vida** | Auto-inyección de `init(app, config)` y `onNavigate()` | Manual (requiere registrarse en `resources[]`) |
| **Uso en HTML** | Atributos declarativos `data-*` | Llamadas directas en JavaScript |
| **Ambiente** | **Cerrado y autocontenido** (no contamina el scope global), pero **no limitado** (acceso a `Flut`, Store y DOM). | Abierto / estándar de JavaScript |

> ⚠️ **Validación del Motor de Plugins:**
> - Si una carpeta en `plugins/` **no cuenta con ambos archivos obligatorios** (`.flutcom.js` + `.flutcom.json`), el motor **no la reconocerá como plugin oficial Flutcom**.
> - En caso de requerir librerías abiertas de terceros o scripts JS comunes que no sigan este estándar, deben colocarse como archivos `.js` sueltos en `plugins/` o dentro de una subcarpeta como `plugins/opensource/` (o `plugins/vendor/`), registrándolos manualmente en `flutcom.config.js`.

---

### ⚙️ 1. Archivo de Configuración del Plugin (`<nombre>.flutcom.json` / `<nombre>.fc.json`)

Al estilo `config.yml` de Minecraft, cada plugin incluye su archivo JSON donde el usuario gestiona el comportamiento sin tocar código:

```json
{
  "name": "timer",
  "version": "1.0.0",
  "enabled": true,
  "options": {
    "defaultDuration": 60,
    "showWarningAt": 10,
    "soundOnFinish": false,
    "endMessage": "¡Tiempo finalizado!"
  }
}
```

---

### 🏷️ 2. Uso en HTML (Filosofía Zero-Code)

El creador de la web solo utiliza atributos HTML declarativos. El plugin escanea el DOM y gestiona los eventos tras bambalinas:

```html
<!-- Ejemplo 1: Temporizador o cuenta regresiva -->
<div data-timer="120" data-format="mm:ss" class="text-xl font-bold"></div>

<!-- Ejemplo 2: Animación al entrar en pantalla -->
<div data-animate="fade-up" data-delay="150" class="p-6 bg-white border border-[#eaeaea]">
  Tarjeta animada
</div>

<!-- Ejemplo 3: Eventos y disparadores sin JS -->
<button data-event="click:alert" data-message="¡Operación exitosa!" class="btn">
  Guardar
</button>

<!-- Ejemplo 4: Copiar texto al portapapeles -->
<button data-copy="npm run dev" data-feedback="Copiado">
  Copiar comando
</button>
```

---

### 💻 3. Estándar para Desarrolladores de la Comunidad (`<nombre>.flutcom.js` / `<nombre>.fc.js`)

Quien programa un plugin para la comunidad solo implementa un contrato simple con ganchos de ciclo de vida:

```javascript
export default {
  name: "timer",
  version: "1.0.0",
  author: "Comunidad Flutcom",

  // Se ejecuta al inicializar Flutcom y recibe la configuración del JSON
  init(app, config) {
    if (!config.enabled) return;
    this._setup(config.options);
  },

  // Se ejecuta automáticamente al navegar entre páginas SPA
  onNavigate(viewName, container) {
    this._scanElements(container);
  },

  _setup(options) {
    // Escucha eventos globales o registra directivas
  },

  _scanElements(container) {
    // Activa los elementos que contengan [data-timer] en la nueva vista
  }
};
```

---

### 📋 Roadmap de Plugins Iniciales para la Comunidad

- [x] **`plugins/menu/`**: Navegación SPA por hash, enlace activo y toggle de menú móvil.
- [x] **`plugins/timer/`**: Cuentas regresivas, cronómetros y temporizadores automáticos.
- [ ] **`plugins/events/`**: Manejo de eventos de clic, hover, toggle de visibilidad y retrasos sin JS.
- [x] **`plugins/animations/`**: Animaciones de entrada al hacer scroll basadas en Intersection Observer.
- [ ] **`plugins/toast/`**: Alertas flotantes automáticas y notificaciones no intrusivas.
- [ ] **`plugins/copy/`**: Copiado rápido al portapapeles con feedback visual en el botón.

---

## 🧱 Nuevo Sistema y Estándar de Componentes HTML v2 (Próximamente)

### Visión General
Elevar el motor de componentes en `resources/components/` para ofrecer una experiencia declarativa, elegante y sin librerías pesadas, inspirada en los componentes de **Astro** y **Web Components nativos**, pero manteniendo **Zero Runtime JS**.

---

### 1. 🏷️ Sintaxis de Invocación en las Vistas

#### A) Etiqueta Directa Nativa (Shorthand)
Cualquier archivo `resources/components/<nombre>.html` se utiliza directamente como `<flut-<nombre>>`:

```html
<!-- Componente simple autocerrado con props -->
<flut-alert type="success" icon="bi bi-check-circle" title="Operación Exitosa" description="Los cambios se guardaron correctamente." />

<!-- Componente con contenido hijo proyectado (Slot) -->
<flut-card title="Métricas de Usuario" icon="bi bi-graph-up">
  <p class="text-sm text-zinc-600">Este contenido se inyecta directamente dentro del componente.</p>
  <button fc-click="Flut.toast('success', 'Actualizado')" class="btn">Refrescar</button>
</flut-card>
```

#### B) Props Booleanas (Flags sin valor)
Atributos declarados sin valor se interpretan automáticamente como booleanos verdaderos (`true`):
```html
<!-- outline y rounded se pasan como flags activas al componente -->
<flut-badge text="En Producción" rounded outline />
<flut-button text="Guardar" loading disabled />
```

#### C) Slots Nombrados (Named Slots)
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

### 2. 📝 Sintaxis dentro del Template (`resources/components/<nombre>.html`)

#### A) Interpolación y Limpieza Inteligente de Props
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

> **🛡️ Regla de Limpieza:**
> Si una prop no es enviada por el usuario (ej: `description`), el motor la reemplaza por una cadena vacía en lugar de dejar el feo `{{ description }}` literal en pantalla.

#### B) Valores por Defecto (Fallbacks)
Soporte para operador de coalescencia nula en templates:
```html
<h3>{{ title ?? 'Sin título' }}</h3>
<span class="badge">{{ variant ?? 'default' }}</span>
```

#### C) Inyección de Slots Nombrados
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

### 3. 📁 Estructura de Carpetas Organizada

```text
resources/components/
  ├── alert.html                # <flut-alert ... />
  ├── badge.html                # <flut-badge ... />
  ├── card.html                 # <flut-card ... />
  ├── button.html               # <flut-button ... />
  ├── modal.html                # <flut-modal ... />
  ├── input.html                # <flut-input ... />
  └── ui/                       # Subcarpetas organizadas (opcional)
       ├── avatar.html          # <flut-ui-avatar ... />
       └── dropdown.html        # <flut-ui-dropdown ... />
```

---

### 4. 📋 Roadmap de Componentes Base para la Comunidad

- [x] **`<flut-alert>`**: Notificaciones de advertencia, éxito e información con icono y slot.
- [x] **`<flut-badge>`**: Pills/chips de estado con variantes de color.
- [x] **`<flut-card>`**: Tarjetas Bento minimalistas con soporte de slot hijo.
- [ ] **`<flut-button>`**: Botones con variantes (`primary`, `secondary`, `outline`), iconos y estados `loading`.
- [ ] **`<flut-modal>`**: Ventanas modales accesibles con soporte de slots nombrados (`slot:footer`).
- [ ] **`<flut-input>`**: Campos de formulario estilizados con etiqueta, validación visual y slot para iconos.
- [ ] **`<flut-accordion>`**: Acordeones colapsables para preguntas frecuentes o menús desplegables.
- [ ] **`<flut-tabs>`**: Pestañas de navegación de contenido sin JavaScript.

