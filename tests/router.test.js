import { describe, it, expect } from 'vitest';

describe('Flutcom Routing Logic', () => {
  const routes = {
    home: {
      view: 'resources/views/public/home.html',
      title: 'Home',
      description: 'Página de inicio',
    },
    ejemplos: 'resources/views/public/ejemplos.html',
  };

  const defaultView = 'home';
  const notFoundView = 'resources/views/public/404.html';

  function resolveRoute(hash, configRoutes, fallback = defaultView) {
    const targetHash = hash || fallback;
    const r = configRoutes[targetHash];
    if (!r) return null;
    if (typeof r === 'string') {
      return {
        path: r,
        title: targetHash.charAt(0).toUpperCase() + targetHash.slice(1),
        description: '',
      };
    }
    // Preservar todos los metadatos SEO en rutas ricas (v1.3.0)
    return {
      ...r,
      path: r.view || r.path || '',
      title: r.title || targetHash,
      description: r.description || '',
    };
  }

  it('resuelve correctamente una ruta configurada en formato rico preservando metadatos SEO', () => {
    const richRoutes = {
      catalogo: {
        view: 'resources/views/public/catalogo.html',
        title: 'Catálogo de Productos',
        description: 'Explora nuestra selección completa.',
        keywords: ['productos', 'tienda'],
        robots: 'index, follow',
        image: 'https://ejemplo.com/portada.jpg',
        canonical: 'https://ejemplo.com/#catalogo',
        jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage' },
      },
    };

    const route = resolveRoute('catalogo', richRoutes);
    expect(route).not.toBeNull();
    expect(route.path).toBe('resources/views/public/catalogo.html');
    expect(route.title).toBe('Catálogo de Productos');
    expect(route.keywords).toEqual(['productos', 'tienda']);
    expect(route.robots).toBe('index, follow');
    expect(route.image).toBe('https://ejemplo.com/portada.jpg');
    expect(route.canonical).toBe('https://ejemplo.com/#catalogo');
    expect(route.jsonLd).toBeDefined();
    expect(route.jsonLd['@type']).toBe('CollectionPage');
  });

  it('resuelve correctamente una ruta configurada en formato rico', () => {
    const route = resolveRoute('home', routes);
    expect(route).not.toBeNull();
    expect(route.path).toBe('resources/views/public/home.html');
    expect(route.title).toBe('Home');
  });

  it('resuelve correctamente una ruta simple en formato string', () => {
    const route = resolveRoute('ejemplos', routes);
    expect(route).not.toBeNull();
    expect(route.path).toBe('resources/views/public/ejemplos.html');
    expect(route.title).toBe('Ejemplos');
  });

  it('aplica la ruta por defecto cuando el hash está vacío', () => {
    const route = resolveRoute('', routes);
    expect(route).not.toBeNull();
    expect(route.path).toBe('resources/views/public/home.html');
  });

  it('retorna null para rutas inexistentes (manejado por el 404 handler)', () => {
    const route = resolveRoute('ruta-fantasma-no-existe', routes);
    expect(route).toBeNull();
  });
});
