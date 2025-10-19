import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll instantáneo al tope en cada cambio de ruta
    // Compatible con todos los navegadores y dispositivos

    // Método 1: scroll nativo del navegador
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Método 2: asegurar scroll en diferentes elementos (iOS Safari fix)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Método 3: forzar scroll en el elemento raíz (Android fix)
    const root = document.getElementById('root');
    if (root) {
      root.scrollTop = 0;
    }

    // Método 4: asegurar que cualquier contenedor con scroll también vuelva arriba
    const scrollableElements = document.querySelectorAll('*');
    scrollableElements.forEach(el => {
      if (el.scrollTop > 0) {
        el.scrollTop = 0;
      }
    });

  }, [pathname]);

  return null;
}
