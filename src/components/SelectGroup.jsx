import "./Styles/SelectGroup.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { animate, createTimeline, stagger } from "animejs";
import { useGuest } from "../GuestContext";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import florIzq from "../assets/florIzq1.png";
import florDer from "../assets/florDer1.png";

export default function SelectGroup() {
  const { guest, setGuest, allGroups } = useGuest();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const navigate = useNavigate();

  // Hook para activar animaciones solo cuando la sección es visible
  const { ref: sectionScrollRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true
  });

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const listRef = useRef(null);
  const leftDecorRef = useRef(null);
  const rightDecorRef = useRef(null);

  // Usar allGroups si existe, sino usar guest
  const guestsToShow = allGroups || guest;

  console.log("🔍 SelectGroup - allGroups:", allGroups);
  console.log("🔍 SelectGroup - guest:", guest);
  console.log("🔍 SelectGroup - guestsToShow:", guestsToShow);

  // Agrupar invitados por groupId
  const groupedGuests = guestsToShow?.reduce((acc, g) => {
    const groupId = g.groupId || `individual-${g.id}`;
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(g);
    return acc;
  }, {}) || {};

  const groups = Object.entries(groupedGuests);

  console.log("👥 Grupos encontrados:", groups.length);
  console.log("📦 Datos de grupos:", groups);

  const handleSelectGroup = (groupId, groupGuests) => {
    console.log("✅ Grupo seleccionado temporalmente:", groupId, groupGuests);
    setSelectedGroupId(groupId);
  };

  const handleConfirm = () => {
    if (selectedGroupId) {
      // Encontrar el grupo seleccionado
      const selectedGuests = groupedGuests[selectedGroupId];
      console.log("✅ Confirmando grupo:", selectedGuests);
      setGuest(selectedGuests);
      navigate("/select");
    }
  };

  const handleSearchAgain = () => {
    navigate("/rsvp");
  };

  // Animaciones al montar
  useEffect(() => {
    if (hasAnimated) return;

    const isMobile = window.innerWidth < 768;

    const timeline = createTimeline({
      defaults: {
        ease: "out(3)"
      }
    });

    // Anima el card principal
    timeline.add(cardRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [100, 0] : [80, 0],
      scale: isMobile ? [0.9, 1] : [0.95, 1],
      duration: isMobile ? 1000 : 900
    }, 0);

    // Anima el título
    timeline.add(titleRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [-30, 0] : [-20, 0],
      duration: isMobile ? 700 : 600
    }, 400);

    // Anima la descripción
    timeline.add(descRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [20, 0] : [10, 0],
      duration: isMobile ? 700 : 600
    }, 600);

    // Anima las opciones con stagger
    timeline.add(listRef.current?.querySelectorAll(".selectGroup__option"), {
      opacity: [0, 1],
      translateX: isMobile ? [-40, 0] : [-30, 0],
      scale: isMobile ? [0.95, 1] : [0.98, 1],
      duration: isMobile ? 700 : 600,
      delay: stagger(isMobile ? 120 : 100)
    }, 700);

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

    setHasAnimated(true);
  }, [hasAnimated]);

  // Validación de invitados (después de todos los hooks)
  if (!guestsToShow || guestsToShow.length === 0) {
    return (
      <section className="selectGroup">
        <div className="selectGroup__card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 className="selectGroup__title" style={{ marginBottom: '20px' }}>
            NO SE ENCONTRÓ INVITACIÓN
          </h3>
          <p className="selectGroup__desc" style={{ marginBottom: '30px' }}>
            Por favor, vuelve al inicio y busca tu invitación nuevamente.
          </p>
          <button
            className="selectGroup__btn selectGroup__btn--primary"
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

  return (
    <section
      ref={sectionScrollRef}
      className={`selectGroup ${sectionVisible ? 'is-visible' : ''}`}
    >
      <img
        ref={leftDecorRef}
        src={florIzq}
        alt=""
        aria-hidden="true"
        className="selectGroup__decor selectGroup__decor--left"
        style={{ opacity: 0 }}
      />
      <img
        ref={rightDecorRef}
        src={florDer}
        alt=""
        aria-hidden="true"
        className="selectGroup__decor selectGroup__decor--right"
        style={{ opacity: 0 }}
      />

      <div ref={cardRef} className="selectGroup__card" style={{ opacity: 0 }}>
        <h3 ref={titleRef} className="selectGroup__title" style={{ opacity: 0 }}>
          Hay más de un nombre similar en la lista de invitados.
        </h3>
        <p ref={descRef} className="selectGroup__desc" style={{ opacity: 0 }}>
          Selecciona tu nombre de la lista.
        </p>

        <div ref={listRef} className="selectGroup__options">
          {groups.map(([groupId, groupGuests], index) => {
            // Crear etiqueta de nombres del grupo
            const names = groupGuests.map(g => g.fullName).join(", ");
            const isSelected = selectedGroupId === groupId;

            return (
              <div key={groupId} className="selectGroup__option" style={{ opacity: 0 }}>
                <label
                  className="selectGroup__radio-wrapper"
                  onClick={(e) => {
                    // Prevenir navegación inmediata en móvil
                    e.preventDefault();
                    handleSelectGroup(groupId, groupGuests);
                  }}
                >
                  <input
                    type="radio"
                    name="group-selection"
                    value={groupId}
                    className="selectGroup__radio-input"
                    checked={isSelected}
                    onChange={() => {}} // Manejado por el onClick del label
                    onClick={(e) => e.stopPropagation()} // Prevenir doble disparo
                  />
                  <span className="selectGroup__radio-custom"></span>
                  <span className="selectGroup__option-text">
                    {names}
                  </span>
                </label>
              </div>
            );
          })}
        </div>

        <div className="selectGroup__actions">
          <button
            type="button"
            className="selectGroup__btn selectGroup__btn--primary"
            onClick={handleConfirm}
            disabled={!selectedGroupId}
          >
            CONTINUAR
          </button>
          <button
            type="button"
            className="selectGroup__btn selectGroup__btn--secondary"
            onClick={handleSearchAgain}
          >
            BUSCAR NUEVAMENTE
          </button>
        </div>
      </div>
    </section>
  );
}
