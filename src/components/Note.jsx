import { useState, useEffect, useRef } from "react";
import "./Styles/Note.css";
import { useNavigate } from "react-router-dom";
import { addNote } from "../api";
import { useGuest } from "../GuestContext";
import { animate, createTimeline, stagger } from "animejs";

export default function Note({ maxLength = 280 }) {
  const [note, setNote] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);
  const { guest } = useGuest();
  const navigate = useNavigate();

  const noteBoxRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const labelRef = useRef(null);
  const textareaRef = useRef(null);
  const footerRef = useRef(null);

  const handleNext = async () => {
    if (!note.trim()) return;
    if (guest && guest.length > 0) {
      await addNote(guest[0].id, note.trim());
    }
    navigate("/all-set");
  };

  const handleSkip = () => {
    navigate("/all-set");
  };

  const remaining = maxLength - note.length;

  useEffect(() => {
    if (hasAnimated) return;

    const isMobile = window.innerWidth < 768;

    const timeline = createTimeline();

    // Animate noteBox entrance
    timeline.add(noteBoxRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [120, 0] : [80, 0],
      scale: isMobile ? [0.85, 1] : [0.92, 1],
      rotate: isMobile ? [8, 0] : [3, 0],
      duration: isMobile ? 1100 : 900,
      ease: "out(3)"
    }, 0);

    // Animate title with letter-by-letter effect
    if (titleRef.current) {
      const titleText = titleRef.current.textContent;
      const titleChars = titleText.split('');
      titleRef.current.innerHTML = titleChars.map(char =>
        `<span class="char" style="display:inline-block;opacity:0">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');

      timeline.add(titleRef.current.querySelectorAll('.char'), {
        opacity: [0, 1],
        translateY: isMobile ? [-30, 0] : [-20, 0],
        scale: isMobile ? [0.5, 1] : [0.7, 1],
        duration: isMobile ? 600 : 500,
        delay: stagger(isMobile ? 40 : 30),
        ease: "out(2)"
      }, isMobile ? 400 : 300);
    }

    // Animate description
    timeline.add(descRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [40, 0] : [30, 0],
      duration: isMobile ? 700 : 600,
      ease: "out(2)"
    }, isMobile ? 700 : 600);

    // Animate label
    timeline.add(labelRef.current, {
      opacity: [0, 1],
      translateX: isMobile ? [-60, 0] : [-40, 0],
      duration: isMobile ? 600 : 500,
      ease: "out(2)"
    }, isMobile ? 900 : 800);

    // Animate textarea with typing effect
    timeline.add(textareaRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [50, 0] : [40, 0],
      scale: isMobile ? [0.95, 1] : [0.97, 1],
      duration: isMobile ? 800 : 700,
      ease: "out(2)"
    }, isMobile ? 1000 : 900);

    // Animate footer elements with stagger
    timeline.add(footerRef.current?.querySelectorAll('.note__counter, .note__actions'), {
      opacity: [0, 1],
      translateY: isMobile ? [40, 0] : [30, 0],
      scale: isMobile ? [0.9, 1] : [0.95, 1],
      duration: isMobile ? 700 : 600,
      delay: stagger(isMobile ? 150 : 120),
      ease: "out(2)"
    }, isMobile ? 1200 : 1100);

    setHasAnimated(true);
  }, [hasAnimated]);

  return (
    <section className="note">
      <div className="noteBox" ref={noteBoxRef} style={{ opacity: 0 }}>
        <h3 className="note__title" ref={titleRef}>DEJA UNA NOTA PARA LOS NOVIOS</h3>
        <p className="note__desc" ref={descRef} style={{ opacity: 0 }}>Puedes escribir un mensaje corto con tus buenos deseos. ❤️</p>

        <label htmlFor="wedding-note" className="note__label" ref={labelRef} style={{ opacity: 0 }}>Tu mensaje</label>
        <textarea
          id="wedding-note"
          className="note__textarea"
          placeholder="Escribe aquí tu mensaje (máx. 280 caracteres)…"
          value={note}
          onChange={(e) => {
            const v = e.target.value;
            if (v.length <= maxLength) setNote(v);
          }}
          rows={6}
          ref={textareaRef}
          style={{ opacity: 0 }}
        />

        <div className="note__footer" ref={footerRef}>
          <span className={`note__counter ${remaining <= 20 ? "note__counter--warn" : ""}`} aria-live="polite">
            {remaining} caracteres restantes
          </span>
          <div className="note__actions">
            <button type="button" className="noteBtn noteBtn--ghost" onClick={handleSkip}>
              Saltar
            </button>
            <button type="button" className="noteBtn" onClick={handleNext} disabled={!note.trim()}>
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
