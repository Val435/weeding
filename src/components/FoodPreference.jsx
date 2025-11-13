import { useState, useEffect, useRef } from "react";
import "./Styles/FoodPreference.css";
import { useNavigate } from "react-router-dom";
import { useGuest } from "../GuestContext";
import { animate, createTimeline, stagger } from "animejs";

export default function FoodPreference() {
  const { guest } = useGuest();
  const [preferences, setPreferences] = useState(new Map());
  const [hasAnimated, setHasAnimated] = useState(false);
  const navigate = useNavigate();

  const boxRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const listRef = useRef(null);
  const footerRef = useRef(null);

  const setPreference = (id, food) => {
    setPreferences((prev) => {
      const next = new Map(prev);
      next.set(id, food);
      return next;
    });
  };

  const getPreference = (id) => preferences.get(id);

  const allHaveResponded = () => {
    // Solo los que confirmaron asistencia necesitan seleccionar comida
    const attendingGuests = guest?.filter(g => {
      // Asumimos que tenemos info de attending en el contexto
      return g.attending === true;
    }) || [];

    if (attendingGuests.length === 0) {
      // Si nadie asiste, saltamos este paso
      navigate("/note");
      return false;
    }

    return attendingGuests.every((g) => preferences.has(g.id));
  };

  const handleNext = () => {
    // Guardar las preferencias en el contexto para enviarlas después
    if (window.guestFoodPreferences) {
      window.guestFoodPreferences = preferences;
    } else {
      window.guestFoodPreferences = preferences;
    }
    navigate("/note");
  };

  // Animaciones
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

    // Anima título
    timeline.add(titleRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [-40, 0] : [-30, 0],
      duration: isMobile ? 700 : 600
    }, 400);

    // Anima subtítulo
    timeline.add(subtitleRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [30, 0] : [20, 0],
      duration: isMobile ? 700 : 600
    }, 600);

    // Anima cada fila de la lista con stagger
    timeline.add(listRef.current?.querySelectorAll(".foodRow"), {
      opacity: [0, 1],
      translateY: isMobile ? [60, 0] : [40, 0],
      scale: isMobile ? [0.9, 1] : [0.95, 1],
      duration: isMobile ? 700 : 600,
      delay: stagger(isMobile ? 120 : 100)
    }, 800);

    // Anima el footer
    timeline.add(footerRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [50, 0] : [30, 0],
      duration: isMobile ? 800 : 700
    }, 1000);

    setHasAnimated(true);
  }, [hasAnimated]);

  // Validación de invitados
  if (!guest || guest.length === 0) {
    return (
      <section className="foodPreference">
        <div className="foodBox" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 className="foodBox__title" style={{ marginBottom: '20px' }}>
            NO SE ENCONTRÓ INVITACIÓN
          </h3>
          <p style={{ marginBottom: '30px' }}>
            Por favor, vuelve al inicio y busca tu invitación nuevamente.
          </p>
          <button
            className="foodBtn"
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

  // Filtrar solo los invitados que confirmaron asistencia
  const attendingGuests = guest.filter(g => g.attending === true);

  // Si nadie confirmó asistencia, saltar al siguiente paso
  if (attendingGuests.length === 0) {
    useEffect(() => {
      navigate("/note");
    }, []);
    return null;
  }

  const respondedCount = preferences.size;
  const totalAttending = attendingGuests.length;

  return (
    <section className="foodPreference">
      <div ref={boxRef} className="foodBox" style={{ opacity: 0 }}>
        <h3 ref={titleRef} className="foodBox__title" style={{ opacity: 0 }}>
          SELECCIONA TU PREFERENCIA
        </h3>

        <div className="foodBox__rule"></div>

        <p ref={subtitleRef} className="foodBox__subtitle" style={{ opacity: 0 }}>
          Por favor, elige tu opción de menú para la cena
        </p>

        <div className="foodArea">
          <ul ref={listRef} className="foodList">
            {attendingGuests.map((g) => (
              <li key={g.id} className="foodRow" style={{ opacity: 0 }}>
                <span className="foodRow__name">{g.fullName}</span>
                <div className="foodRow__buttons">
                  <button
                    type="button"
                    className={`foodRow__btn foodRow__btn--pasta ${getPreference(g.id) === "pasta" ? "is-selected" : ""}`}
                    onClick={() => setPreference(g.id, "pasta")}
                    aria-pressed={getPreference(g.id) === "pasta"}
                  >
                    PASTA
                  </button>
                  <button
                    type="button"
                    className={`foodRow__btn foodRow__btn--carne ${getPreference(g.id) === "carne" ? "is-selected" : ""}`}
                    onClick={() => setPreference(g.id, "carne")}
                    aria-pressed={getPreference(g.id) === "carne"}
                  >
                    CARNE
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div ref={footerRef} className="foodFooter" style={{ opacity: 0 }}>
        <span className="foodFooter__count"></span>
        <button
          className="foodBtn"
          type="button"
          onClick={handleNext}
          disabled={!allHaveResponded()}
          title={
            !allHaveResponded()
              ? `Faltan ${totalAttending - respondedCount} persona${totalAttending - respondedCount > 1 ? "s" : ""} por responder`
              : "Continuar"
          }
        >
          CONTINUAR
        </button>
      </div>
    </section>
  );
}
