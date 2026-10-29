# ⚡ Skill: Directivas Reactivas en HTML (Zero JS)

Flutcom incluye un motor de directivas declarativas en HTML que permite conectar vistas y componentes directamente al estado global (`store`) sin escribir JavaScript manual.

---

## Directivas disponibles

### 1. `fc-model="clave"` — Enlace bidireccional (Two-Way Binding)
Conecta `<input>`, `<textarea>`, `<select>` y checkboxes directamente con el store:

```html
<!-- Input de texto -->
<input fc-model="nombreUsuario" placeholder="Escribe tu nombre..." />

<!-- Checkbox booleano -->
<input type="checkbox" fc-model="aceptaTerminos" />

<!-- Select -->
<select fc-model="idioma">
  <option value="es">Español</option>
  <option value="en">Inglés</option>
</select>
```

### 2. `fc-bind="clave"` — Mostrar datos reactivamente
Inyecta el valor del store en el elemento y lo actualiza en tiempo real cada vez que cambia:

```html
<p>Bienvenido, <span fc-bind="nombreUsuario">invitado</span>!</p>
```

### 3. `fc-show="clave"` — Visibilidad condicional
Muestra u oculta el elemento según si la clave en el store es verdadera o falsa. Soporta el prefijo `!` para invertir la condición:

```html
<!-- Se muestra cuando aceptaTerminos es true -->
<div fc-show="aceptaTerminos">
  <p>Términos aceptados correctamente.</p>
</div>

<!-- Se muestra cuando usuario NO está definido o es falso -->
<div fc-show="!nombreUsuario">
  <p>Por favor escribe tu nombre arriba.</p>
</div>
```

### 4. `fc-go="ruta"` — Navegación SPA sin JS
Cambia la vista activa por su hash sin necesitar un script:

```html
<button fc-go="home">Volver al Inicio</button>
<button fc-go="ejemplos">Ver Ejemplos</button>
```

### 5. `fc-toggle="elementoId"` — Alternar visibilidad por ID
Abre o cierra menús, dropdowns o paneles alternando el atributo `hidden`:

```html
<button fc-toggle="menu-desplegable">Abrir / Cerrar Menú</button>

<div id="menu-desplegable" hidden>
  <a href="#perfil">Mi Perfil</a>
  <a href="#ajustes">Ajustes</a>
</div>
```

### 6. `fc-click="expresion"` — Disparar acciones al clic
Ejecuta acciones del helper global `Flut` sin crear listeners:

```html
<button fc-click="Flut.toast('success', '¡Guardado!')">Guardar</button>
<button fc-click="Flut.toggle('modoOscuro')">Cambiar Tema</button>
```
