<div align="center">
  <img src="assets/img/flutcom.svg" alt="Flutcom Logo" width="120">
  <h1>Flutcom</h1>
  <p><strong>The Lightweight SPA Framework for Static Environments</strong></p>

  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
    <img src="https://img.shields.io/badge/Built%20with-Vanilla%20JS-yellow.svg" alt="Vanilla JS">
  </p>
</div>

---

## 🚀 ¿Qué es Flutcom?

**Flutcom** es un micro-framework de alto rendimiento diseñado para transformar sitios web estáticos en **Single Page Applications (SPA)** fluidas, sin la complejidad de los frameworks pesados tradicionales. 

Es la solución ideal para desarrolladores que buscan la velocidad de un sitio estático con la experiencia de usuario de una aplicación moderna.

## ✨ Características Principales

- ⚡ **Zero Latency Navigation:** Sistema de rutas basado en hash para transiciones instantáneas entre páginas.
- 🛠️ **Centralized Configuration:** Gestiona todo tu sitio (rutas, metadatos, plugins) desde un único archivo `flutcom.config.js`.
- 🧩 **Plugin Architecture:** Extiende las capacidades del core con plugins modulares (Modals, Menu, Liquid Glass, etc.).
- 📦 **Partial Rendering:** Inyecta componentes reutilizables como navbars y footers automáticamente.
- 🎨 **Premium Aesthetics:** Integración nativa con Tailwind CSS y sistemas de animación modernos.
- 📁 **SEO Optimized:** Estructura preparada para ser indexada correctamente a pesar de ser una SPA.

## 📂 Estructura del Proyecto

```text
├── flutcom/            # Núcleo del framework (Core engine)
├── plugins/            # Funcionalidades modulares
├── resources/
│   ├── partials/      # Fragmentos HTML reutilizables (Header, Footer)
│   ├── views/         # Páginas/Vistas de la aplicación
│   └── components/    # Componentes de UI
├── assets/             # Estilos, imágenes y recursos estáticos
├── flutcom.config.js   # El cerebro de tu proyecto
└── index.html          # Punto de entrada único
```

## 🛠️ Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/yBlour/flutcom.git
```

### 2. Configurar tus rutas
Edita `flutcom.config.js` para añadir tus páginas:

```javascript
export const routes = {
  home: "resources/views/public/home.html",
  docs: "resources/views/public/docs.html",
  // Añade tus rutas aquí
};
```

### 3. ¡Listo para despegar!
No necesitas compilación compleja. Simplemente abre `index.html` en un servidor local (Live Server) y empieza a construir.

## ⚙️ Personalización

Flutcom se basa en la simplicidad. El archivo `flutcom.config.js` te permite controlar:
- El nombre y versión del sitio.
- La vista por defecto y la página 404.
- La activación/desactivación de plugins dinámicos.

## 🤝 Contribuciones

¡Las contribuciones son lo que hacen a la comunidad de código abierto un lugar increíble para aprender e inspirar! Cualquier contribución que hagas será **muy apreciada**.

1. Haz un Fork del proyecto.
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Haz un Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Haz un Push a la Branch (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más información.

---

<div align="center">
  Hecho con ❤️ por <strong>yBlour</strong>
</div>
