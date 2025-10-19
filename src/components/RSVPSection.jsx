import "./Styles/RSVP.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { animate, createTimeline, stagger } from "animejs";
import florIzq from "../assets/florIzq1.png";
import florDer from "../assets/florDer1.png";
import { fetchGuests } from "../api";
import { useGuest } from "../GuestContext";
import Loading from "./Loading";
import ErrorModal from "./ErrorModal";

export default function RSVPSection() {
  const [fullName, setFullName] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const showDecor = pathname !== "/";
  const { setGuest } = useGuest();

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const labelRef = useRef(null);
  const inputRef = useRef(null);
  const actionsRef = useRef(null);
  const leftDecorRef = useRef(null);
  const rightDecorRef = useRef(null);

  const handleFind = async () => {
    if (!fullName.trim()) return;

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const guests = await fetchGuests(fullName);

      console.log("🔍 Búsqueda:", fullName);
      console.log("📦 Invitados encontrados:", guests);
      console.log("👥 Total de invitados:", guests.length);

      // Calcular tiempo transcurrido
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);

      // Esperar el tiempo restante para completar mínimo 2 segundos
      await new Promise(resolve => setTimeout(resolve, remainingTime));

      setIsLoading(false);

      if (guests.length > 0) {
        setGuest(guests);
        navigate("/select");
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error("Error fetching guests:", error);
      setIsLoading(false);
      setShowError(true);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleCancel = () => {
    setFullName("");
    navigate("/");
  };

  // Animación con Intersection Observer (optimizado móvil/desktop)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Timeline de animaciones para el card
            const timeline = createTimeline({
              defaults: {
                ease: "out(3)"
              }
            });

            // Anima el card con efecto de elevación (más dramático en móvil)
            timeline.add(cardRef.current, {
              opacity: [0, 1],
              translateY: isMobile ? [150, 0] : [100, 0],
              scale: isMobile ? [0.7, 1] : [0.9, 1],
              rotate: isMobile ? [5, 0] : [0, 0],
              duration: isMobile ? 1400 : 1200,
              ease: "out(3)"
            }, 0);

            // Anima el título (más movimiento en móvil)
            timeline.add(titleRef.current, {
              opacity: [0, 1],
              translateY: isMobile ? [-50, 0] : [-30, 0],
              scale: isMobile ? [0.8, 1] : [1, 1],
              duration: isMobile ? 700 : 600
            }, 400);

            // Anima la descripción (fade más largo en móvil)
            timeline.add(descRef.current, {
              opacity: [0, 1],
              translateY: isMobile ? [20, 0] : [0, 0],
              duration: isMobile ? 700 : 600
            }, 600);

            // Anima el label y el input (más desplazamiento en móvil)
            timeline.add([labelRef.current, inputRef.current], {
              opacity: [0, 1],
              translateX: isMobile ? [-80, 0] : [-50, 0],
              scale: isMobile ? [0.95, 1] : [1, 1],
              duration: isMobile ? 700 : 600,
              delay: stagger(isMobile ? 120 : 100)
            }, 700);

            // Anima los botones (más bounce en móvil)
            timeline.add(actionsRef.current?.querySelectorAll("button"), {
              opacity: [0, 1],
              scale: isMobile ? [0.5, 1.05, 1] : [0.8, 1],
              translateY: isMobile ? [30, 0] : [0, 0],
              duration: isMobile ? 800 : 600,
              delay: stagger(isMobile ? 120 : 100),
              ease: "out(3)"
            }, 900);

            // Anima las decoraciones si existen (más dramáticas en móvil)
            if (showDecor && leftDecorRef.current && rightDecorRef.current) {
              animate(leftDecorRef.current, {
                opacity: [0, 1],
                translateX: isMobile ? [-250, 0] : [-150, 0],
                rotate: isMobile ? [-45, 0] : [-20, 0],
                scale: isMobile ? [0.5, 1] : [1, 1],
                duration: isMobile ? 1200 : 1000,
                ease: "out(3)"
              });

              animate(rightDecorRef.current, {
                opacity: [0, 1],
                translateX: isMobile ? [250, 0] : [150, 0],
                rotate: isMobile ? [45, 0] : [20, 0],
                scale: isMobile ? [0.5, 1] : [1, 1],
                duration: isMobile ? 1200 : 1000,
                ease: "out(3)"
              });
            }

          }
        });
      },
      { threshold: isMobile ? 0.15 : 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, showDecor]);

  return (
    <>
      {isLoading && <Loading />}
      {showError && <ErrorModal onClose={handleCloseError} />}
      <section
        id="rsvp"
        className={`rsvp ${pathname !== "/" ? "rsvp--center" : ""}`}
      >
      {showDecor && (
        <>
          <img
            ref={leftDecorRef}
            src={florIzq}
            alt=""
            aria-hidden="true"
            className="vestimenta__decor1 vestimenta__decor--left1"
            style={{ opacity: 0 }}
          />
          <img
            ref={rightDecorRef}
            src={florDer}
            alt=""
            aria-hidden="true"
            className="vestimenta__decor1 vestimenta__decor--right1"
            style={{ opacity: 0 }}
          />
        </>
      )}

      <div ref={cardRef} className="rsvp__card" style={{ opacity: 0 }}>
        <h3 ref={titleRef} className="rsvp__title" style={{ opacity: 0 }}>
          RSVP
        </h3>
        <p ref={descRef} className="rsvp__desc" style={{ opacity: 0 }}>
          Por favor ingresa el nombre y apellido de uno de los miembros de tu grupo a continuación.
        </p>

        <label
          ref={labelRef}
          className="rsvp__label"
          htmlFor="fullname"
          style={{ opacity: 0 }}
        >
          Nombre y apellido
        </label>
        <input
          ref={inputRef}
          id="fullname"
          className="rsvp__input"
          type="text"
          placeholder="NOMBRE Y APELLIDO"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ opacity: 0 }}
        />

        <div ref={actionsRef} className="rsvp__actions">
          <button
            type="button"
            className="rsvp__btn rsvp__btn--primary"
            onClick={handleFind}
            style={{ opacity: 0 }}
          >
            ENCUENTRA TUS INVITACIONES
          </button>
       
        </div>
      </div>
    </section>
    </>
  );
}
