import { useEffect, useRef } from "react";
import { animate, createTimeline } from "animejs";
import bg from "../assets/portada.png";
import florIzq from "../assets/florIzq.png";
import florDer from "../assets/florDer.png";
import "./Styles/Hero.css";

export default function Hero() {
  const leftDecorRef = useRef(null);
  const rightDecorRef = useRef(null);
  const innerRef = useRef(null);
  const name1Ref = useRef(null);
  const ampRef = useRef(null);
  const name2Ref = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    // Animación de las flores laterales entrando (más dramáticas en móvil)
    animate(leftDecorRef.current, {
      translateX: isMobile ? [-300, 0] : [-200, 0],
      opacity: [0, 1],
      rotate: isMobile ? [-45, 0] : [0, 0],
      scale: isMobile ? [0.5, 1] : [1, 1],
      duration: isMobile ? 1400 : 1200,
      ease: "out(3)",
      delay: 300
    });

    animate(rightDecorRef.current, {
      translateX: isMobile ? [300, 0] : [200, 0],
      opacity: [0, 1],
      rotate: isMobile ? [45, 0] : [0, 0],
      scale: isMobile ? [0.5, 1] : [1, 1],
      duration: isMobile ? 1400 : 1200,
      ease: "out(3)",
      delay: 300
    });

    // Animación escalonada de los nombres (más impactante en móvil)
    const timeline = createTimeline({
      defaults: {
        ease: "out(3)"
      }
    });

    timeline
      .add(name1Ref.current, {
        opacity: [0, 1],
        translateY: isMobile ? [100, 0] : [60, 0],
        scale: isMobile ? [0.8, 1] : [1, 1],
        duration: isMobile ? 1100 : 1000
      }, isMobile ? 400 : 500)
      .add(ampRef.current, {
        opacity: [0, 1],
        scale: [0, 1],
        rotate: isMobile ? [360, 0] : [180, 0],
        duration: isMobile ? 1000 : 800
      }, isMobile ? 1000 : 1100)
      .add(name2Ref.current, {
        opacity: [0, 1],
        translateY: isMobile ? [-100, 0] : [-60, 0],
        scale: isMobile ? [0.8, 1] : [1, 1],
        duration: isMobile ? 1100 : 1000
      }, isMobile ? 1000 : 1100)
      .add(dateRef.current, {
        opacity: [0, 1],
        scale: isMobile ? [0.5, 1] : [0.8, 1],
        rotate: isMobile ? [180, 0] : [0, 0],
        duration: isMobile ? 1000 : 800
      }, isMobile ? 1200 : 1300);

    // Efecto de brillo más intenso en móvil
    animate(innerRef.current, {
      boxShadow: isMobile
        ? [
            "0 0 0px rgba(255,255,255,0)",
            "0 0 50px rgba(255,255,255,0.5)",
            "0 0 0px rgba(255,255,255,0)"
          ]
        : [
            "0 0 0px rgba(255,255,255,0)",
            "0 0 30px rgba(255,255,255,0.3)",
            "0 0 0px rgba(255,255,255,0)"
          ],
      duration: isMobile ? 2500 : 3000,
      delay: 2000,
      loop: true,
      ease: "inOut(2)"
    });

    // Efecto de pulse en los nombres (solo móvil)
    if (isMobile) {
      setTimeout(() => {
        animate([name1Ref.current, name2Ref.current], {
          scale: [1, 1.02, 1],
          duration: 3000,
          loop: true,
          ease: "inOut(2)"
        });
      }, 2500);
    }
  }, []);

  return (
    <section
      id="inicio"
      className="hero"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Decoraciones laterales */}
      <img
        ref={leftDecorRef}
        src={florIzq}
        alt=""
        aria-hidden="true"
        className="hero__decor hero__decor--left"
        style={{ opacity: 0 }}
      />
      <img
        ref={rightDecorRef}
        src={florDer}
        alt=""
        aria-hidden="true"
        className="hero__decor hero__decor--right"
        style={{ opacity: 0 }}
      />

      <div ref={innerRef} className="hero__inner">
        <h1 ref={name1Ref} className="hero__names" style={{ opacity: 0 }}>
          MARTÍN POCASANGRE
        </h1>
        <span ref={ampRef} className="hero__amp" style={{ opacity: 0 }}>
          &amp;
        </span>
        <h1 ref={name2Ref} className="hero__names" style={{ opacity: 0 }}>
          VALERIA PORTILLO
        </h1>

        <p ref={dateRef} className="hero__date" style={{ opacity: 0 }}>
          Viernes 9 de Enero 2026
        </p>
      </div>
    </section>
  );
}
