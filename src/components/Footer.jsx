import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { animate } from "animejs";
import "./Styles/Footer.css";

export default function Footer() {
  const { pathname } = useLocation();
  const footerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    if (hasAnimated) return;

    const isMobile = window.innerWidth < 768;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Animación de entrada
            animate(footerRef.current, {
              opacity: [0, 1],
              translateY: isMobile ? [80, 0] : [60, 0],
              scale: isMobile ? [0.95, 1] : [0.98, 1],
              duration: isMobile ? 1000 : 800,
              ease: "out(3)"
            });
          }
        });
      },
      { threshold: isMobile ? 0.3 : 0.5 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, pathname]);

  // Solo mostrar en la página de inicio
  if (pathname !== "/") return null;

  return (
    <footer ref={footerRef} className="footer" style={{ opacity: 0 }}>
      <div className="footer__content">
        <p className="footer__label">CREADO POR</p>
        <h3 className="footer__name">VALENTINA POCASANGRE</h3>
        <a
          href="mailto:VALENTINAPOCASANGRE@GMAIL.COM"
          className="footer__email"
          target="_blank"
          rel="noopener noreferrer"
        >
          VALENTINAPOCASANGRE@GMAIL.COM
        </a>
      </div>
    </footer>
  );
}
