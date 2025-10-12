import "./Styles/DetailsSection.css";
import { useState, useEffect, useMemo, useRef } from "react";
import { createTimeline, stagger } from "animejs";

// Imágenes del carrusel
import img1 from "../assets/1.png";
import img2 from "../assets/2.png";
import img3 from "../assets/3.png";
import img4 from "../assets/4.png";
import img5 from "../assets/5.png";

export default function DetailsSection({ countdown }) {
  const images = useMemo(() => [img1, img2, img3, img4, img5], []);
  const [steps, setSteps] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const countdownRef = useRef(null);
  const carouselRef = useRef(null);
  const titleRef = useRef(null);
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setSteps((s) => s + 1);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Intersection Observer para animaciones al hacer scroll (optimizado móvil/desktop)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Timeline de animaciones
            const timeline = createTimeline({
              defaults: {
                ease: "out(3)"
              }
            });

            // Anima el countdown con efecto flip (más dramático en móvil)
            timeline.add(countdownRef.current, {
              opacity: [0, 1],
              translateY: isMobile ? [-80, 0] : [-50, 0],
              scale: isMobile ? [0.8, 1] : [1, 1],
              duration: isMobile ? 1100 : 1000
            }, 0);

            // Anima cada número del countdown (más grande en móvil)
            timeline.add(countdownRef.current?.querySelectorAll(".cd-value"), {
              scale: isMobile ? [0, 1.1, 1] : [0, 1],
              opacity: [0, 1],
              rotate: isMobile ? [180, 0] : [0, 0],
              duration: isMobile ? 700 : 600,
              delay: stagger(isMobile ? 80 : 100),
              ease: "out(3)"
            }, 200);

            // Anima el carousel con zoom dramático en móvil
            timeline.add(carouselRef.current, {
              opacity: [0, 1],
              scale: isMobile ? [0.5, 1] : [0.8, 1],
              rotate: isMobile ? [10, 0] : [0, 0],
              duration: isMobile ? 1200 : 1000,
              ease: "out(3)"
            }, isMobile ? 500 : 600);

            // Anima el título (más movimiento en móvil)
            timeline.add(titleRef.current, {
              opacity: [0, 1],
              translateX: isMobile ? [-150, 0] : [-100, 0],
              scale: isMobile ? [0.9, 1] : [1, 1],
              duration: isMobile ? 900 : 800
            }, 400);

            // Anima los bloques de detalles (más separados en móvil)
            timeline.add([block1Ref.current, block2Ref.current], {
              opacity: [0, 1],
              translateY: isMobile ? [80, 0] : [50, 0],
              scale: isMobile ? [0.9, 1] : [1, 1],
              duration: isMobile ? 900 : 800,
              delay: stagger(isMobile ? 250 : 200)
            }, 600);
          }
        });
      },
      { threshold: isMobile ? 0.1 : 0.2 }
    );

    if (countdownRef.current) {
      observer.observe(countdownRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const theta = 360 / images.length;
  const angle = -(steps * theta);

  return (
    <>
      <div
        ref={countdownRef}
        className="hero__countdown"
        role="timer"
        aria-live="polite"
        style={{ opacity: 0 }}
      >
        <div className="hero__countdown-title">YA SOLO FALTAN</div>

        <div className="hero__countdown-grid">
          <div className="cd-group">
            <div className="cd-value">{countdown.days}</div>
            <div className="cd-label">DÍAS</div>
          </div>
          <div className="cd-group">
            <div className="cd-value">{countdown.hours}</div>
            <div className="cd-label">HORAS</div>
          </div>
          <div className="cd-group">
            <div className="cd-value">{countdown.minutes}</div>
            <div className="cd-label">MINUTOS</div>
          </div>
          <div className="cd-group">
            <div className="cd-value">{countdown.seconds}</div>
            <div className="cd-label">SEGUNDOS</div>
          </div>
        </div>
      </div>

      <section id="detalle" className="details">
        <div className="details__grid">
          <div className="details__carousel-mask">
            <div
              ref={carouselRef}
              className="details__carousel"
              style={{
                "--count": images.length,
                "--theta": `${theta}deg`,
                "--rot": `${angle}deg`,
                opacity: 0
              }}
            >
              <div className="box">
                {images.map((src, i) => (
                  <span key={i} style={{ "--i": i }}>
                    <img src={src} alt={`slide ${i + 1}`} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="details__content">
            <h2 ref={titleRef} className="details__title" style={{ opacity: 0 }}>
              DETALLES DE NUESTRA BODA
            </h2>

            <div ref={block1Ref} className="details__block" style={{ opacity: 0 }}>
              <div className="details__place">CEREMONIA RELIGIOSA</div>
              <div className="details__time">7:00 PM</div>
              <div className="details__venue">PARROQUIA SAN BENITO</div>
              <div className="details__address">
                Iglesia La Capilla, Avenida La Capilla 711, San Salvador
              </div>
              <div className="map-button">
                <a
                  href="https://www.waze.com/live-map/directions/sv/san-salvador/san-salvador/iglesia-la-capilla?to=place.ChIJkVhGdyUwY48RuEP3VmAiOCo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  WAZE
                </a>
              </div>
            </div>

            <div ref={block2Ref} className="details__block" style={{ opacity: 0 }}>
              <div className="details__place">RECEPCIÓN</div>
              <div className="details__time">8:00 PM</div>
              <div className="details__venue">IL BUONGUSTAIO</div>
              <div className="details__address">
                Bulevar Del Hipodromo 605, San Salvador
              </div>
              <div className="map-button">
                <a
                  href="https://www.waze.com/live-map/directions/sv/la-libertad-department/san-salvador/il-buongustaio?to=place.ChIJrXiJ9CgwY48R6YoBn-pWz_0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link"
                >
                  WAZE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
