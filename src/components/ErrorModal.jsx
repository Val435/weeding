import { useEffect } from "react";
import "./Styles/ErrorModal.css";

export default function ErrorModal({ onClose }) {
  useEffect(() => {
    // Prevenir scroll mientras el modal está abierto
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="errorModal__backdrop" onClick={onClose}>
      <div className="errorModal__card" onClick={(e) => e.stopPropagation()}>
        <div className="errorModal__icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#D33800" strokeWidth="3" fill="none" />
            <path d="M32 20V36" stroke="#D33800" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="44" r="2" fill="#D33800" />
          </svg>
        </div>

        <h2 className="errorModal__title">Invitación no encontrada</h2>

        <p className="errorModal__message">
          No pudimos encontrar tu nombre en nuestra lista de invitados.
        </p>

        <div className="errorModal__suggestions">
          <h3 className="errorModal__subtitle">Por favor, intenta lo siguiente:</h3>
          <ul className="errorModal__list">
            <li>Verifica que hayas escrito tu nombre completo correctamente</li>
            <li>Intenta con una variación de tu nombre (con o sin apellido materno)</li>
            <li>Si fuiste invitado como parte de una familia, intenta con el nombre de otro miembro</li>
          </ul>
        </div>

        <div className="errorModal__contact">
          <p>
            Si continúas teniendo problemas, por favor consulta directamente con
            <strong> Martín y Valeria</strong> para confirmar tu invitación.
          </p>
        </div>

        <button className="errorModal__btn" onClick={onClose}>
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
