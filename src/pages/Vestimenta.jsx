import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animate, createTimeline, stagger } from "animejs";
import florIzq from "../assets/florIzq1.png";
import florDer from "../assets/florDer1.png";
import "../components/Styles/Vestimenta.css";

export default function Vestimenta() {
  const navigate = useNavigate();
  const [hasAnimated, setHasAnimated] = useState(false);

  const leftDecorRef = useRef(null);
  const rightDecorRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const textRef = useRef(null);
  const btnRef = useRef(null);

  // Intersection Observer para animaciones épicas optimizadas móvil/desktop
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const timeline = createTimeline({
              defaults: {
                ease: "out(3)"
              }
            });

            // Anima las flores laterales con rotación dramática
            animate(leftDecorRef.current, {
              opacity: [0, 1],
              translateX: isMobile ? [-300, 0] : [-200, 0],
              rotate: isMobile ? [-45, 0] : [-20, 0],
              scale: isMobile ? [0.5, 1] : [0.8, 1],
              duration: isMobile ? 1400 : 1200,
              ease: "out(3)"
            });

            animate(rightDecorRef.current, {
              opacity: [0, 1],
              translateX: isMobile ? [300, 0] : [200, 0],
              rotate: isMobile ? [45, 0] : [20, 0],
              scale: isMobile ? [0.5, 1] : [0.8, 1],
              duration: isMobile ? 1400 : 1200,
              ease: "out(3)"
            });

            // Anima el título con efecto de letras
            const titleChars = titleRef.current.textContent.split('');
            titleRef.current.innerHTML = titleChars.map(char =>
              `<span class="char" style="display:inline-block;opacity:0">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');

            timeline.add(titleRef.current.querySelectorAll('.char'), {
              opacity: [0, 1],
              translateY: isMobile ? [-40, 0] : [-30, 0],
              rotateX: [90, 0],
              duration: isMobile ? 700 : 600,
              delay: stagger(isMobile ? 40 : 50),
              ease: "out(3)"
            }, 300);

            // Anima el subtítulo
            timeline.add(subtitleRef.current, {
              opacity: [0, 1],
              translateY: isMobile ? [60, 0] : [40, 0],
              scale: isMobile ? [0.8, 1] : [0.9, 1],
              duration: isMobile ? 900 : 800
            }, isMobile ? 600 : 700);

            // Anima el texto
            timeline.add(textRef.current, {
              opacity: [0, 1],
              translateY: isMobile ? [50, 0] : [30, 0],
              duration: isMobile ? 800 : 700
            }, isMobile ? 800 : 900);

            // Anima el botón con efecto dramático
            timeline.add(btnRef.current, {
              opacity: [0, 1],
              scale: isMobile ? [0, 1.1, 1] : [0, 1],
              rotate: isMobile ? [180, 0] : [0, 0],
              duration: isMobile ? 1000 : 800,
              ease: "out(4)"
            }, isMobile ? 1000 : 1100);

            // Efecto de pulse continuo en el botón (más visible en móvil)
            setTimeout(() => {
              animate(btnRef.current, {
                scale: isMobile ? [1, 1.08, 1] : [1, 1.05, 1],
                boxShadow: isMobile
                  ? [
                      '0 6px 16px rgba(199, 0, 123, .3)',
                      '0 12px 32px rgba(199, 0, 123, .5)',
                      '0 6px 16px rgba(199, 0, 123, .3)'
                    ]
                  : [
                      '0 6px 16px rgba(199, 0, 123, .3)',
                      '0 10px 24px rgba(199, 0, 123, .4)',
                      '0 6px 16px rgba(199, 0, 123, .3)'
                    ],
                duration: 2000,
                loop: true,
                ease: "inOut(2)"
              });
            }, 2000);
          }
        });
      },
      { threshold: isMobile ? 0.2 : 0.3 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="vestimenta" className="vestimenta">
      <img
        ref={leftDecorRef}
        src={florIzq}
        alt=""
        aria-hidden="true"
        className="vestimenta__decor vestimenta__decor--left"
        style={{ opacity: 0 }}
      />
      <img
        ref={rightDecorRef}
        src={florDer}
        alt=""
        aria-hidden="true"
        className="vestimenta__decor vestimenta__decor--right"
        style={{ opacity: 0 }}
      />

      <div className="vestimenta__inner">
        <h2 ref={titleRef} className="vestimenta__title" style={{ opacity: 0 }}>
          VESTIMENTA
        </h2>
        <p ref={subtitleRef} className="vestimenta__subtitle" style={{ opacity: 0 }}>
          <strong>ETIQUETA (BLACK TIE)</strong><br />

        </p>
        <p ref={textRef} className="vestimenta__text" style={{ opacity: 0 }}>
          INVITADAS: AGRADECEMOS EVITAR VESTIDOS<br /> COLOR NEGRO
          <br />
           <br />
          PARA INSPIRARSE, LES DEJAMOS<br />ALGUNAS OPCIONES AQUÍ:
        </p>
        <button
          ref={btnRef}
          className="vestimenta__btn"
          onClick={() => navigate("/board")}
          style={{ opacity: 0 }}
        >
          IDEAS DE VESTIMENTA
        </button>
      </div>
    </section>
  );
}
