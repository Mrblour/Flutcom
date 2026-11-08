import { describe, it, expect, vi } from 'vitest';

describe('Flutcom Reactive Store', () => {
  function createStore() {
    return {
      _state: {},
      _listeners: [],
      get(key) { return this._state[key]; },
      set(key, val) { 
        this._state[key] = val; 
        this._listeners.forEach(fn => fn(key, val, this._state)); 
      },
      subscribe(fn) { 
        this._listeners.push(fn); 
        return () => this.unsubscribe(fn); 
      },
      unsubscribe(fn) {
        this._listeners = this._listeners.filter(listener => listener !== fn);
      }
    };
  }

  it('guarda y lee valores primitivos correctamente', () => {
    const store = createStore();
    store.set('usuario', 'Carlos');
    expect(store.get('usuario')).toBe('Carlos');

    store.set('contador', 42);
    expect(store.get('contador')).toBe(42);
  });

  it('notifica a los suscriptores cuando un valor cambia', () => {
    const store = createStore();
    const listener = vi.fn();

    store.subscribe(listener);
    store.set('tema', 'dark');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('tema', 'dark', { tema: 'dark' });
  });

  it('permite desuscribirse con la función retornada', () => {
    const store = createStore();
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);
    store.set('notificaciones', 1);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.set('notificaciones', 2);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('maneja estructuras de datos anidadas y objetos', () => {
    const store = createStore();
    const perfil = { id: 101, roles: ['admin', 'editor'] };

    store.set('perfil', perfil);
    expect(store.get('perfil')).toEqual(perfil);
    expect(store.get('perfil').roles).toContain('admin');
  });
});
