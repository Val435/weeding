// src/pages/AllSet.jsx
import { useEffect, useState } from "react";
import "../components/Styles/AllSet.css";
import simanImg from "../assets/siman.png";      // opcional: para un CTA a la mesa
import porticoImg from "../assets/portico.png";  // opcional

export default function AllSet() {
  // confetti sutil: se renderiza una sola vez
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const items = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.2 + Math.random() * 1.1,
    }));
    setConfetti(items);
  }, []);

  const SIMAN_URL = "https://simangiftregistry.web.app/table/10016317";
  const PORTICO_URL = "https://www.porticoreal.com.sv/boda-pocasangre-portillo-martin-valeria-te-15-de-noviembre-de-2025";
  const HOME_URL = "/"; // ajusta según tu router


  return (
    <section className="allset">
      <div className="allset__card">
        <div className="allset__confetti">
          {confetti.map((c) => (
            <span
              key={c.id}
              className="confetti"
              style={{
                left: `${c.left}%`,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
              }}
            />
          ))}
        </div>

        <h1 className="allset__title">¡Todo listo!</h1>
        <p className="allset__lead">
          Gracias por confirmar tu asistencia. <br />
          ¡Nos hace mucha ilusión compartir este día contigo! 🫶
        </p>

        <div className="allset__actions">
          <a className="btn btn--primary" href={HOME_URL}>Volver a inicio</a>
          
          
        </div>

        {/* Opcional: mini links a mesas */}
        <div className="allset__gifts">
          <div className="giftLink">
            <img src={simanImg} alt="Siman" />
            <a href={SIMAN_URL} target="_blank" rel="noreferrer">Mesa Siman</a>
          </div>
          <div className="giftLink">
            <img src={porticoImg} alt="Pórtico Real" />
            <a href={PORTICO_URL} target="_blank" rel="noreferrer">Mesa Pórtico</a>
          </div>
        </div>

        <p className="allset__hint">
          Si necesitas modificar tus datos después, podrás volver a enviar tu confirmación.
        </p>
      </div>
    </section>
  );
}
