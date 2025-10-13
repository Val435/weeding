import "./Styles/SelectPerson.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { animate, createTimeline, stagger } from "animejs";
import { confirmGuest } from "../api";
import { useGuest } from "../GuestContext";

import img1 from "../assets/6.png";
import img2 from "../assets/7.png";
import img3 from "../assets/8.png";
import img4 from "../assets/9.png";
import img5 from "../assets/10.png";
import florIzq from "../assets/florIzq2.png";
import florDer from "../assets/florDer2.png";
import calendarioSvg from "../assets/svg/calendario.svg";
import etiquetaSvg from "../assets/svg/etiqueta.svg";

export default function SelectPerson() {
  const { guest } = useGuest();
  const [responses, setResponses] = useState(new Map());
  const [hasAnimated, setHasAnimated] = useState(false);
  const navigate = useNavigate();
  const images = [img1, img2, img3, img4, img5];
  const [index, setIndex] = useState(0);

  const boxRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const leftDecorRef = useRef(null);
  const rightDecorRef = useRef(null);
  const listRef = useRef(null);
  const footerRef = useRef(null);
  const carouselRef = useRef(null);

  if (!guest || guest.length === 0) {
    return (
      <section className="select">
        <div className="selectBox" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 className="selectBox__line1--es" style={{ marginBottom: '20px' }}>
            NO SE ENCONTRÓ INVITACIÓN
          </h3>
          <p className="selectBox__line--es" style={{ marginBottom: '30px' }}>
            Por favor, vuelve al inicio y busca tu invitación nuevamente.
          </p>
          <button
            className="nextBtn"
            type="button"
            onClick={() => navigate("/")}
            style={{ margin: '0 auto' }}
          >
            VOLVER AL INICIO
          </button>
        </div>
      </section>
    );
  }

  const setResponse = (id, willAttend) => {
    setResponses((prev) => {
      const next = new Map(prev);
      next.set(id, willAttend);
      return next;
    });
  };

  const getResponse = (id) => responses.get(id);

  const allHaveResponded = () => {
    return guest.every((g) => responses.has(g.id));
  };

  const respondedCount = responses.size;
  const totalPeople = guest.length;

  const handleNext = async () => {
    for (let [id, attending] of responses.entries()) {
      await confirmGuest(id, attending);
    }
    navigate("/note");
  };

  // Animaciones épicas al montar
  useEffect(() => {
    if (hasAnimated) return;

    const isMobile = window.innerWidth < 768;

    const timeline = createTimeline({
      defaults: {
        ease: "out(3)"
      }
    });

    // Anima el box principal
    timeline.add(boxRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [100, 0] : [80, 0],
      scale: isMobile ? [0.9, 1] : [0.95, 1],
      duration: isMobile ? 1000 : 900
    }, 0);

    // Anima las líneas de texto con stagger
    timeline.add([line1Ref.current, line2Ref.current, line3Ref.current], {
      opacity: [0, 1],
      translateX: isMobile ? [-60, 0] : [-40, 0],
      duration: isMobile ? 700 : 600,
      delay: stagger(isMobile ? 150 : 100)
    }, 400);

    // Anima las flores laterales
    animate(leftDecorRef.current, {
      opacity: [0, 1],
      translateX: isMobile ? [-200, 0] : [-150, 0],
      rotate: isMobile ? [-30, 0] : [-15, 0],
      scale: isMobile ? [0.7, 1] : [0.8, 1],
      duration: isMobile ? 1200 : 1000,
      ease: "out(3)"
    });

    animate(rightDecorRef.current, {
      opacity: [0, 1],
      translateX: isMobile ? [200, 0] : [150, 0],
      rotate: isMobile ? [30, 0] : [15, 0],
      scale: isMobile ? [0.7, 1] : [0.8, 1],
      duration: isMobile ? 1200 : 1000,
      ease: "out(3)"
    });

    // Anima cada fila de la lista con stagger espectacular
    timeline.add(listRef.current?.querySelectorAll(".selectRow"), {
      opacity: [0, 1],
      translateY: isMobile ? [60, 0] : [40, 0],
      scale: isMobile ? [0.9, 1] : [0.95, 1],
      duration: isMobile ? 700 : 600,
      delay: stagger(isMobile ? 120 : 100)
    }, 600);

    // Anima el footer
    timeline.add(footerRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [50, 0] : [30, 0],
      duration: isMobile ? 800 : 700
    }, 900);

    // Anima el carousel de fotos
    timeline.add(carouselRef.current, {
      opacity: [0, 1],
      scale: isMobile ? [0.8, 1] : [0.9, 1],
      duration: isMobile ? 1000 : 800
    }, 700);

    setHasAnimated(true);
  }, [hasAnimated]);

  // Carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="select">
      <img
        ref={leftDecorRef}
        src={florIzq}
        alt=""
        aria-hidden="true"
        className="vestimenta__decor2 vestimenta__decor--left2"
        style={{ opacity: 0 }}
      />
      <img
        ref={rightDecorRef}
        src={florDer}
        alt=""
        aria-hidden="true"
        className="vestimenta__decor2 vestimenta__decor--right2"
        style={{ opacity: 0 }}
      />

      <div ref={boxRef} className="selectBox" style={{ opacity: 0 }}>
        <p ref={line1Ref} className="selectBox__line selectBox__line1--es" style={{ opacity: 0 }}>
          CONFIRMA TU ASISTENCIA
        </p>
        <p ref={line2Ref} className="selectBox__line selectBox__line--es" style={{ opacity: 0 }}>
          <img src={calendarioSvg} alt="Calendario" className="selectBox__icon" />
          VIERNES 9 DE ENERO 2026, A LAS 7:00 P.M.
        </p>
        <p ref={line3Ref} className="selectBox__line selectBox__line--es" style={{ opacity: 0 }}>
          <img src={etiquetaSvg} alt="Etiqueta" className="selectBox__icon" />
          ETIQUETA (BLACK TIE)
        </p>

        <hr className="selectBox__rule" />

        <div className="selectArea selectArea--perRowBtn">
          <ul ref={listRef} className="selectList">
            {guest.map((g) => (
              <li key={g.id} className="selectRow">
                <span className="selectRow__name">{g.fullName}</span>
                <div className="selectRow__buttons">
                  <button
                    type="button"
                    className={`selectRow__btn selectRow__btn--yes ${getResponse(g.id) === true ? "is-selected" : ""}`}
                    onClick={() => setResponse(g.id, true)}
                    aria-pressed={getResponse(g.id) === true}
                  >
                    SÍ ASISTIRÉ
                  </button>
                  <button
                    type="button"
                    className={`selectRow__btn selectRow__btn--no ${getResponse(g.id) === false ? "is-selected" : ""}`}
                    onClick={() => setResponse(g.id, false)}
                    aria-pressed={getResponse(g.id) === false}
                  >
                    NO PODRÉ ASISTIR
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <hr className="selectBox__rule" />
      </div>

      <div ref={footerRef} className="selectFooter" style={{ opacity: 0 }}>
        <span className="selectFooter__count"></span>
        <button
          className="nextBtn"
          type="button"
          onClick={handleNext}
          disabled={!allHaveResponded()}
          title={
            !allHaveResponded()
              ? `Faltan ${totalPeople - respondedCount} persona${totalPeople - respondedCount > 1 ? "s" : ""} por responder`
              : "Continuar"
          }
        >
          CONTINUAR
        </button>
      </div>

      <div ref={carouselRef} className="select__carousel" role="region" aria-label="Galería" style={{ opacity: 0 }}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Foto ${i + 1}`}
            className={`select__img ${i === index ? "is-active" : ""}`}
            draggable={false}
          />
        ))}
      </div>
    </section>
  );
}
