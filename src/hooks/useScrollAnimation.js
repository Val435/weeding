import { useEffect, useRef, useState } from 'react';

/**
 * Hook personalizado para activar animaciones cuando el elemento entra en el viewport
 * @param {Object} options - Opciones para el Intersection Observer
 * @param {number} options.threshold - Porcentaje del elemento visible para activar (0-1)
 * @param {string} options.rootMargin - Margen alrededor del viewport
 * @param {boolean} options.triggerOnce - Si true, la animación solo se activa una vez
 * @returns {Object} - { ref, isVisible }
 */
export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Si triggerOnce está activado, desconectar el observer después de la primera activación
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}
