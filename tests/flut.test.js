import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFlutHelper } from '../flutcom/flut.js';

describe('Flut Global Helper API', () => {
  let mockApp;
  let Flut;

  beforeEach(() => {
    const state = {};
    const listeners = [];

    mockApp = {
      store: {
        _state: state,
        _listeners: listeners,
        get(key) { return state[key]; },
        set(key, val) {
          state[key] = val;
          listeners.forEach(fn => fn(key, val, state));
        },
        subscribe(fn) {
          listeners.push(fn);
          return () => {
            const idx = listeners.indexOf(fn);
            if (idx > -1) listeners.splice(idx, 1);
          };
        }
      }
    };

    Flut = createFlutHelper(mockApp);
  });

  it('guarda y lee datos mediante Flut.set y Flut.get', () => {
    Flut.set('activo', true);
    expect(Flut.get('activo')).toBe(true);
  });

  it('alterna valores booleanos con Flut.toggle', () => {
    Flut.set('modoOscuro', false);
    Flut.toggle('modoOscuro');
    expect(Flut.get('modoOscuro')).toBe(true);
    Flut.toggle('modoOscuro');
    expect(Flut.get('modoOscuro')).toBe(false);
  });

  it('incrementa y decrementa valores numéricos con step configurable', () => {
    Flut.set('contador', 10);
    Flut.increment('contador');
    expect(Flut.get('contador')).toBe(11);

    Flut.increment('contador', 5);
    expect(Flut.get('contador')).toBe(16);

    Flut.decrement('contador', 6);
    expect(Flut.get('contador')).toBe(10);
  });

  it('observa cambios de una clave específica con Flut.watch', () => {
    const callback = vi.fn();
    const unwatch = Flut.watch('mensaje', callback);

    Flut.set('otraCosa', 123);
    expect(callback).not.toHaveBeenCalled();

    Flut.set('mensaje', '¡Hola Mundo!');
    expect(callback).toHaveBeenCalledWith('¡Hola Mundo!');

    unwatch();
    Flut.set('mensaje', 'Nuevo texto');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('limpia valores con Flut.clear', () => {
    Flut.set('sesion', 'token_123');
    Flut.clear('sesion');
    expect(Flut.get('sesion')).toBeUndefined();
  });
});
