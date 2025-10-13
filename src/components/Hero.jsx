// src/components/Hero.jsx
import { useEffect, useRef } from "react";
import { animate, createTimeline } from "animejs";
import bg from "../assets/portada.png";
import AnimatedFlowerPNG from "./AnimatedFlowerPNG";
import "./Styles/Hero.css";

export default function Hero() {
  const innerRef = useRef(null);
  const name1Ref = useRef(null);
  const ampRef = useRef(null);
  const name2Ref = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

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
  }, []);

  return (
    <section
      id="inicio"
      className="hero"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Flores animadas - SIN la clase hero__decor */}
      <AnimatedFlowerPNG side="left" />
      <AnimatedFlowerPNG side="right" />

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