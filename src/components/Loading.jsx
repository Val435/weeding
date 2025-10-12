import { useEffect } from "react";
import "./Styles/Loading.css";

export default function Loading() {
  useEffect(() => {
    // Prevenir scroll mientras carga
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="loading">
      <div className="loading__content">
        <div className="loading__rings">
          <div className="loading__ring"></div>
          <div className="loading__ring"></div>
          <div className="loading__ring"></div>
        </div>
        <h2 className="loading__text">Buscando invitación...</h2>
        <div className="loading__dots">
          <span className="loading__dot"></span>
          <span className="loading__dot"></span>
          <span className="loading__dot"></span>
        </div>
      </div>
    </div>
  );
}
