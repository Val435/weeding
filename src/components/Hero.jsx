import { useEffect, useRef } from "react";
import { animate, svg } from "animejs"; // v4
import { Clock } from "lucide-react";

// Fondo (sigue como PNG)
import bg from "../assets/portada.png";

// ⬇️ Ahora importamos las flores como SVG React Components (SVGR)
import { ReactComponent as FlorIzq } from "../assets/florIzq.svg";
import { ReactComponent as FlorDer } from "../assets/florDer.svg";

import "./Styles/Hero.css";

export default function Hero() {
  const heroRef = useRef(null);
  const florIzqRef = useRef(null);
  const florDerRef = useRef(null);

  useEffect(() => {
    const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (REDUCE) return; // respetar usuarios que piden menos animación

    // Utilidad: dispara cuando un elemento entra al viewport
    const whenInView = (el, cb, options = { threshold: 0.25 }) => {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            cb();
            obs.unobserve(e.target);
          }
        });
      }, options);
      io.observe(el);
      return io;
    };

    // 1) Line-drawing de CADA trazo de las flores (izq/der) con leve desfase
    const drawFlower = (rootEl, baseDelay = 0) => {
      if (!rootEl) return;
      // Seleccionamos elementos "dibujables"
      const segs = rootEl.querySelectorAll(
        "path, line, polyline, polygon, circle, ellipse"
      );
      segs.forEach((seg, i) => {
        try {
          const d = svg.createDrawable(seg);
          animate(d, {
            draw: ["0 0", "0 1"],   // de nada a todo el trazo
            duration: 900,
            delay: baseDelay + i * 120, // pequeño stagger entre segmentos
            ease: "outQuad",
          });
        } catch (e) {
          // Si algún nodo no es dibujable, ignoramos silenciosamente
        }
      });
      // “suavizado” visual: subimos opacidad y quitamos blur mientras se dibuja
      animate(rootEl, {
        opacity: [0, 1],
        filter: ["blur(2px)", "blur(0px)"],
        duration: 500,
        delay: baseDelay + 200,
        ease: "outQuad",
      });
      // Parallax lentísimo muy sutil (desktop)
      if (window.innerWidth >= 1024) {
        animate(rootEl, {
          translateY: [-6, 6],
          direction: "alternate",
          duration: 18000,
          loop: true,
          ease: "inOutSine",
        });
      }
    };

    // Dispara el dibujo cuando el hero entra
    const heroEl = heroRef.current;
    const stopIO = whenInView(heroEl, () => {
      // Flores
      drawFlower(florIzqRef.current, 0);
      drawFlower(florDerRef.current, 150);

      // 2) Reveal de nombres y fecha con ligero stagger
      animate(".hero__names", {
        translateY: [16, 0],
        opacity: [0, 1],
        duration: 550,
        delay: (el, i) => 250 + i * 120,
        ease: "outQuad",
      });
      animate(".hero__amp", {
        translateY: [12, 0],
        opacity: [0, 1],
        duration: 500,
        delay: 400,
        ease: "outQuad",
      });
      animate(".hero__date", {
        translateY: [10, 0],
        opacity: [0, 1],
        duration: 500,
        delay: 550,
        ease: "outQuad",
      });

      // 3) Pista de scroll (latido lento)
      animate("#scrollHint", {
        translateY: [0, 6, 0],
        duration: 1600,
        loop: true,
        ease: "inOutSine",
      });
    });

    return () => {
      stopIO?.disconnect?.();
    };
  }, []);

  return (
    <section
      id="inicio"
      className="hero"
      ref={heroRef}
      style={{ backgroundImage: `url(${bg})` }}
      aria-label="Portada"
    >
      {/* Decoraciones laterales (SVG inline) */}
      <div
        className="hero__decor hero__decor--left"
        ref={florIzqRef}
        aria-hidden="true"
      >
        <FlorIzq />
      </div>
      <div
        className="hero__decor hero__decor--right"
        ref={florDerRef}
        aria-hidden="true"
      >
        <FlorDer />
      </div>

      <div className="hero__inner" data-reveal>
        <h1 className="hero__names">MARTÍN POCASANGRE</h1>
        <span className="hero__amp">&amp;</span>
        <h1 className="hero__names">VALERIA PORTILLO</h1>

        <p className="hero__date">Viernes 9 de Enero 2026</p>

        {/* Ejemplo de cintillo countdown (opcional) */}
        {/* <div className="hero__belt">
          <Clock size={16} />
          <span>Faltan 87 días</span>
        </div> */}

        {/* Hint de scroll */}
        <div id="scrollHint" aria-hidden="true" className="scroll-hint">
          ⌄
        </div>
      </div>
    </section>
  );
}
