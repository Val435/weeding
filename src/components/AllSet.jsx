// src/pages/AllSet.jsx
import { useEffect, useState, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";
import { useGuest } from "../GuestContext";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import "../components/Styles/AllSet.css";
import simanImg from "../assets/siman.png";
import porticoImg from "../assets/portico.png";
import avionImg from "../assets/avion.png";

export default function AllSet() {
  const { clearGuest } = useGuest();
  const [confetti, setConfetti] = useState([]);

  // Hook para activar animaciones solo cuando la sección es visible
  const { ref: sectionScrollRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true
  });

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const leadRef = useRef(null);
  const actionsRef = useRef(null);
  const giftsRef = useRef(null);
  const hintRef = useRef(null);

  useEffect(() => {
    // Limpiar los datos del guest cuando llegue a la página de confirmación final
    clearGuest();

    const items = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.2 + Math.random() * 1.1,
    }));
    setConfetti(items);

    // Animaciones épicas
    const isMobile = window.innerWidth < 768;

    const timeline = createTimeline({
      defaults: {
        ease: "out(4)"
      }
    });

    // Card entra con efecto espectacular
    timeline.add(cardRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [150, 0] : [100, 0],
      scale: isMobile ? [0.7, 1] : [0.8, 1],
      rotate: isMobile ? [10, 0] : [5, 0],
      duration: isMobile ? 1200 : 1000
    }, 0);

    // Título con efecto de letras
    const titleChars = titleRef.current.textContent.split('');
    titleRef.current.innerHTML = titleChars.map(char =>
      `<span class="char" style="display:inline-block;opacity:0">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');

    timeline.add(titleRef.current.querySelectorAll('.char'), {
      opacity: [0, 1],
      translateY: isMobile ? [-50, 0] : [-30, 0],
      scale: [0, 1],
      duration: isMobile ? 700 : 600,
      delay: stagger(isMobile ? 60 : 50)
    }, 400);

    // Lead text
    timeline.add(leadRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [40, 0] : [30, 0],
      duration: isMobile ? 700 : 600
    }, 800);

    // Botones
    timeline.add(actionsRef.current?.querySelectorAll('.btn'), {
      opacity: [0, 1],
      scale: isMobile ? [0, 1.1, 1] : [0, 1],
      rotate: isMobile ? [180, 0] : [0, 0],
      duration: isMobile ? 800 : 700,
      delay: stagger(150)
    }, 1000);

    // Gift links
    timeline.add(giftsRef.current?.querySelectorAll('.giftLink'), {
      opacity: [0, 1],
      translateY: isMobile ? [50, 0] : [30, 0],
      scale: [0.8, 1],
      duration: isMobile ? 700 : 600,
      delay: stagger(100)
    }, 1200);

    // Hint
    timeline.add(hintRef.current, {
      opacity: [0, 1],
      duration: 800
    }, 1400);
  }, []);

  const SIMAN_URL = "https://simangiftregistry.web.app/table/10016317";
  const PORTICO_URL = "https://www.porticoreal.com.sv/boda-pocasangre-portillo-martin-valeria-te-15-de-noviembre-de-2025"; // mismo enlace que en MesaRegalo.jsx
  const HOME_URL = "/"; // ajusta según tu router


  return (
    <section
      ref={sectionScrollRef}
      className={`allset ${sectionVisible ? 'is-visible' : ''}`}
    >
      <div ref={cardRef} className="allset__card" style={{ opacity: 0 }}>
        <div className="allset__confetti">
          {confetti.map((c) => (
            <span
              key={c.id}
              className="confetti"
              style={{
                left: `${c.left}%`,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
              }}
            />
          ))}
        </div>

        <h1 ref={titleRef} className="allset__title">¡Todo listo!</h1>
        <p ref={leadRef} className="allset__lead" style={{ opacity: 0 }}>
          Gracias por confirmar tu asistencia. <br />
          ¡Nos hace mucha ilusión compartir este día contigo! 🫶
        </p>

        <div ref={actionsRef} className="allset__actions">
          <a className="btn btn--primary" href={HOME_URL} style={{ opacity: 0 }}>
            Volver a inicio
          </a>
        </div>

        {/* Opcional: mini links a mesas */}
        <div ref={giftsRef} className="allset__gifts">
          <div className="giftLink" style={{ opacity: 0 }}>
            <img src={simanImg} alt="Siman" />
            <a href={SIMAN_URL} target="_blank" rel="noreferrer">Mesa Siman</a>
          </div>
          <div className="giftLink" style={{ opacity: 0 }}>
            <img src={porticoImg} alt="Pórtico Real" />
            <a href={PORTICO_URL} target="_blank" rel="noreferrer">Mesa P<span className="no-bold">ó</span>rtico</a>
          </div>
          <div className="giftLink" style={{ opacity: 0 }}>
            <img src={avionImg} alt="Honeymoon Fund" />
            <span className="giftLink__disabled">Honeymoon Fund</span>
          </div>
        </div>

        <p ref={hintRef} className="allset__hint" style={{ opacity: 0 }}>
          Si necesitas modificar tus datos después, podrás volver a enviar tu confirmación.
        </p>
      </div>
    </section>
  );
}
