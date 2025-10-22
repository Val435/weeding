import { useEffect, useRef, useState } from "react";
import { createTimeline, stagger } from "animejs";
// import florIzq from "../assets/florIzq1.png";
// import florDer from "../assets/florDer1.png";
import "../components/Styles/Vestimenta.css";

export default function Vestimenta() {
  const [pinterestReady, setPinterestReady] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [boardDims, setBoardDims] = useState({
    width: 960,
    scaleWidth: 180,
    scaleHeight: 240
  });
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ruleRef = useRef(null);
  const noteRef = useRef(null);
  const leadRef = useRef(null);
  const cardRef = useRef(null);
  // const florLeftRef = useRef(null);
  // const florRightRef = useRef(null);
  const hiddenUntilAnimatedStyle = hasAnimated ? undefined : { opacity: 0 };

  // Cargar el script de Pinterest una sola vez
  useEffect(() => {
    const src = "https://assets.pinterest.com/js/pinit.js";
    if (document.querySelector(`script[src="${src}"]`)) {
      if (window.PinUtils?.build) setPinterestReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => setPinterestReady(true);
    document.body.appendChild(s);
  }, []);

  // Construir widgets cuando esté listo
  useEffect(() => {
    if (pinterestReady && window.PinUtils?.build) window.PinUtils.build();
  }, [pinterestReady]);

  // Calcular dimensiones responsivas del board para mostrar más columnas
  useEffect(() => {
    const calculateBoardDimensions = () => {
      const vw = window.innerWidth || 0;
      const maxWidth = 1800;
      const minWidth = 640;
      const horizontalGutter =
        vw >= 1600 ? 180 :
        vw >= 1366 ? 140 :
        vw >= 1024 ? 120 :
        vw >= 768 ? 100 :
        64;

      const width = Math.round(Math.min(maxWidth, Math.max(minWidth, vw - horizontalGutter)));
      const targetColumns =
        vw >= 1800 ? 8 :
        vw >= 1600 ? 7 :
        vw >= 1200 ? 6 :
        vw >= 900 ? 4 :
        vw >= 640 ? 3 : 2;

      const scaleWidth = Math.max(90, Math.round(width / targetColumns));
      const targetRatio = vw >= 1024 ? 2.5 : 1.8;
      const scaleHeight = Math.round(Math.min(1800, Math.max(400, scaleWidth * targetRatio)));

      setBoardDims((prev) => {
        if (
          prev.width === width &&
          prev.scaleWidth === scaleWidth &&
          prev.scaleHeight === scaleHeight
        ) {
          return prev;
        }
        return {
          width,
          scaleWidth,
          scaleHeight
        };
      });
    };

    calculateBoardDimensions();
    window.addEventListener("resize", calculateBoardDimensions);
    return () => window.removeEventListener("resize", calculateBoardDimensions);
  }, []);

  // Fuerza al embed de Pinterest a ocupar todo el ancho disponible
  useEffect(() => {
    if (!pinterestReady) return;

    const ensureFullWidth = () => {
      const host = cardRef.current;
      if (!host) return;

      const pinterestWrappers = host.querySelectorAll("div, iframe");
      pinterestWrappers.forEach((element) => {
        element.style.width = "100%";
        element.style.maxWidth = "100%";
        element.removeAttribute("width");
      });
    };

    let observer;

    if (typeof MutationObserver !== "undefined" && cardRef.current) {
      observer = new MutationObserver(ensureFullWidth);
      observer.observe(cardRef.current, { childList: true, subtree: true });
    }

    ensureFullWidth();
    window.addEventListener("resize", ensureFullWidth);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", ensureFullWidth);
    };
  }, [pinterestReady]);

  // Reconstruir embed cuando cambian las dimensiones
  useEffect(() => {
    if (!pinterestReady) return;
    const rebuild = () => window.PinUtils?.build?.();

    if (typeof window.requestAnimationFrame === "function") {
      const rafId = window.requestAnimationFrame(rebuild);
      return () => window.cancelAnimationFrame(rafId);
    }

    const timerId = window.setTimeout(rebuild, 0);
    return () => window.clearTimeout(timerId);
  }, [pinterestReady, boardDims]);

  // Animaciones épicas al entrar con Intersection Observer
  useEffect(() => {
    if (hasAnimated) return;

    const isMobile = window.innerWidth < 768;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const timeline = createTimeline({
              defaults: {
                ease: "out(4)"
              }
            });

            // Anima el título con efecto de letras
            if (titleRef.current) {
              const titleChars = titleRef.current.textContent.split('');
              titleRef.current.innerHTML = titleChars.map(char =>
                `<span class="char" style="display:inline-block;opacity:0">${char === ' ' ? '&nbsp;' : char}</span>`
              ).join('');

              timeline.add(titleRef.current.querySelectorAll('.char'), {
                opacity: [0, 1],
                translateY: isMobile ? [-30, 0] : [-50, 0],
                rotateX: [90, 0],
                duration: isMobile ? 600 : 800,
                delay: stagger(isMobile ? 30 : 50),
                ease: "out(3)"
              }, 0);
            }

            // Anima el subtítulo
            timeline.add(subtitleRef.current, {
              opacity: [0, 1],
              translateY: isMobile ? [40, 0] : [30, 0],
              scale: isMobile ? [0.9, 1] : [0.95, 1],
              duration: isMobile ? 700 : 600
            }, isMobile ? 400 : 500);

            // Anima la línea decorativa
            timeline.add(ruleRef.current, {
              opacity: [0, 1],
              scaleX: [0, 1],
              duration: isMobile ? 600 : 500
            }, isMobile ? 600 : 700);

            // Anima la nota
            timeline.add(noteRef.current, {
              opacity: [0, 1],
              translateX: isMobile ? [-50, 0] : [-30, 0],
              duration: isMobile ? 600 : 500
            }, isMobile ? 700 : 800);

            // Anima el lead text
            timeline.add(leadRef.current, {
              opacity: [0, 1],
              translateY: isMobile ? [20, 0] : [15, 0],
              duration: isMobile ? 600 : 500
            }, isMobile ? 800 : 900);

            // Anima la tarjeta del Pinterest board con efecto 3D
            timeline.add(cardRef.current, {
              opacity: [0, 1],
              translateY: isMobile ? [100, 0] : [80, 0],
              rotateX: [45, 0],
              scale: [0.8, 1],
              duration: isMobile ? 1000 : 900,
              ease: "out(4)"
            }, isMobile ? 900 : 1000);

            // Anima las flores laterales si existen
            // if (florLeftRef.current && florRightRef.current) {
            //   timeline.add(florLeftRef.current, {
            //     opacity: [0, 0.6],
            //     translateX: isMobile ? [-200, 0] : [-150, 0],
            //     rotate: isMobile ? [-20, 0] : [-10, 0],
            //     scale: isMobile ? [0.8, 1] : [0.9, 1],
            //     duration: isMobile ? 1200 : 1000,
            //     ease: "out(3)"
            //   }, 0);

            //   timeline.add(florRightRef.current, {
            //     opacity: [0, 0.6],
            //     translateX: isMobile ? [200, 0] : [150, 0],
            //     rotate: isMobile ? [20, 0] : [10, 0],
            //     scale: isMobile ? [0.8, 1] : [0.9, 1],
            //     duration: isMobile ? 1200 : 1000,
            //     ease: "out(3)"
            //   }, 0);
            // }
          }
        });
      },
      { threshold: isMobile ? 0.1 : 0.2 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="vestimenta" className="vst">
      {/* Fondos florales suaves */}
      {/* <img ref={florLeftRef} className="vst__flor vst__flor--left" src={florIzq} alt="" aria-hidden="true" style={{ opacity: 0 }} />
      <img ref={florRightRef} className="vst__flor vst__flor--right" src={florDer} alt="" aria-hidden="true" style={{ opacity: 0 }} /> */}

      <div className="vst__container">
        <header className="v-header">
          <h1 ref={titleRef} className="v-title" style={{ opacity: 1 }}>VESTIMENTA</h1>
          <h2 ref={subtitleRef} className="v-subtitle" style={hiddenUntilAnimatedStyle}>
            Etiqueta <span className="v-subtle">(Black Tie)</span>
          </h2>
          <div ref={ruleRef} className="v-rule" style={hiddenUntilAnimatedStyle} />
        </header>

        <p ref={noteRef} className="v-note" style={hiddenUntilAnimatedStyle}>
          Invitadas:
          <span className="v-chip">Agradecemos evitar vestidos color negro</span>
        </p>
        <p ref={leadRef} className="v-lead" style={hiddenUntilAnimatedStyle}>Para inspirarse, les dejamos algunas ideas:</p>

        <div ref={cardRef} className="vst__pinterestBoard" style={hiddenUntilAnimatedStyle}>
          <a
            key={`${boardDims.width}-${boardDims.scaleWidth}-${boardDims.scaleHeight}`}
            data-pin-do="embedBoard"
            data-pin-board-width={boardDims.width}
            data-pin-scale-height={boardDims.scaleHeight}
            data-pin-scale-width={boardDims.scaleWidth}
            href="https://www.pinterest.com/vportilloc/inspo-de-outfits-de-boda/"
            style={{ display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}
