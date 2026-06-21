/**
 * animations.js — Plugin Flutcom
 * Sistema de animaciones de entrada premium basado en Intersection Observer.
 * 
 * Uso:
 *   Añadir clase 'reveal' a los elementos.
 *   Opcionalmente añadir modificadores: 'reveal-up', 'reveal-down', 'reveal-left', 'reveal-right', 'reveal-scale'.
 *   Se puede controlar el delay con data-delay="200" (en ms).
 */

(function () {
    const animationStyles = `
        .reveal {
            opacity: 0;
            transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
            will-change: transform, opacity;
        }

        .reveal-up { transform: translateY(40px); }
        .reveal-down { transform: translateY(-40px); }
        .reveal-left { transform: translateX(40px); }
        .reveal-right { transform: translateX(-40px); }
        .reveal-scale { transform: scale(0.94); }

        .reveal.active {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }

        /* Stagger para grupos */
        .reveal-group > * {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .reveal-group.active > * {
            opacity: 1;
            transform: translateY(0);
        }
    `;

    // Inyectar estilos básicos
    const styleSheet = document.createElement("style");
    styleSheet.innerText = animationStyles;
    document.head.appendChild(styleSheet);

    function initAnimations() {
        const observerOptions = {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.getAttribute('data-delay') || 0;
                    
                    setTimeout(() => {
                        el.classList.add('active');
                        
                        // Si es un grupo, animamos los hijos con stagger
                        if (el.classList.contains('reveal-group')) {
                            const children = el.children;
                            for (let i = 0; i < children.length; i++) {
                                children[i].style.transitionDelay = (i * 100) + 'ms';
                            }
                        }
                    }, delay);

                    // Dejar de observar si solo queremos que pase una vez
                    // observer.unobserve(el); 
                }
            });
        }, observerOptions);

        // Buscar elementos para observar
        const elements = document.querySelectorAll('.reveal, .reveal-group');
        elements.forEach(el => observer.observe(el));
    }

    // Exportar al sistema Flutcom
    window.FlutcomAnimations = {
        init: initAnimations,
        refresh: function() {
            // Re-escanea el DOM para nuevos elementos (útil tras navegación SPA)
            initAnimations();
        }
    };

    // Auto-iniciar al cargar el DOM inicial
    document.addEventListener('DOMContentLoaded', initAnimations);

    // Integración con el router de Flutcom (si detectamos el evento de cambio de vista)
    document.addEventListener('fc-view-loaded', function() {
        setTimeout(initAnimations, 100);
    });

})();
