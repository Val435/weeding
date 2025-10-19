import { useEffect, useRef, useState } from "react";
import { createTimeline, stagger } from "animejs";
// import florIzq from "../assets/florIzq1.png";
// import florDer from "../assets/florDer1.png";
import "../components/Styles/Vestimenta.css";

export default function Vestimenta() {
  const [pinterestReady, setPinterestReady] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ruleRef = useRef(null);
  const noteRef = useRef(null);
  const leadRef = useRef(null);
  const cardRef = useRef(null);
  // const florLeftRef = useRef(null);
  // const florRightRef = useRef(null);

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
          <h2 ref={subtitleRef} className="v-subtitle" style={{ opacity: 0 }}>
            Etiqueta <span className="v-subtle">(Black Tie)</span>
          </h2>
          <div ref={ruleRef} className="v-rule" style={{ opacity: 0 }} />
        </header>

        <p ref={noteRef} className="v-note" style={{ opacity: 0 }}>
          Invitadas:
          <span className="v-chip">Agradecemos evitar vestidos color negro</span>
        </p>
        <p ref={leadRef} className="v-lead" style={{ opacity: 0 }}>Para inspirarse, les dejamos algunas ideas:</p>

        <div ref={cardRef} className="vst__pinterestBoard" style={{ opacity: 0 }}>
          <a
            data-pin-do="embedBoard"
            data-pin-board-width="1400"
            data-pin-scale-height="500"
            data-pin-scale-width="50"
            href="https://www.pinterest.com/vportilloc/inspo-de-outfits-de-boda/"
          />
        </div>
      </div>
    </section>
  );
}
