import { useState } from "react";
import "./Styles/Note.css"; // ⬅️ estilos debajo
import { useNavigate, } from "react-router-dom";
export default function Note({ onNext, onSkip, maxLength = 280 }) {
  const [note, setNote] = useState("");
 const navigate = useNavigate();
  const handleNext = () => {
    if (!note.trim()) return;
    onNext?.(note.trim());
    navigate(`/all-set`);
  };

  const handleSkip = () => {
    onSkip?.();
    navigate(`/all-set`);
  };

  const remaining = maxLength - note.length;

  return (
    <section className="note">
      <div className="noteBox">
        <h3 className="note__title">DEJA UNA NOTA PARA LOS NOVIOS</h3>
        <p className="note__desc">
          Puedes escribir un mensaje corto con tus buenos deseos. ❤️
        </p>

        <label htmlFor="wedding-note" className="note__label">
          Tu mensaje
        </label>
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
        />

        <div className="note__footer">
          <span
            className={`note__counter ${
              remaining <= 20 ? "note__counter--warn" : ""
            }`}
            aria-live="polite"
          >
            {remaining} caracteres restantes
          </span>

          <div className="note__actions">
            <button
              type="button"
              className="noteBtn noteBtn--ghost"
              onClick={handleSkip}
              title="Omitir este paso"
            >
              Saltar
            </button>

            <button
              type="button"
              className="noteBtn"
              onClick={handleNext}
              disabled={!note.trim()}
              title={note.trim() ? "Continuar" : "Escribe un mensaje para continuar"}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
