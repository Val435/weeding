import "./Styles/DetailsSection.css";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

// importa tus imágenes desde src/assets
import img1 from "../assets/1.png";
import img2 from "../assets/2.png";
import img3 from "../assets/3.png";
import img4 from "../assets/4.png";
import img5 from "../assets/5.png";

export default function DetailsSection({ countdown }) {
  const images = [img1, img2, img3, img4, img5];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // cambia cada 3s
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <>
      {/* Countdown (opcional) */}
      <div className="hero__countdown" role="timer" aria-live="polite">
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
          {/* Carrusel */}
          <div className="details__carousel">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Foto ${i + 1}`}
                className={`details__img ${i === index ? "is-active" : ""}`}
              />
            ))}
            <div className="details__dots">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`details__dot ${i === index ? "is-active" : ""}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>

          {/* Contenido derecho */}
          <div className="details__content">
            <h2 className="details__title">DETALLES DE NUESTRA BODA</h2>

            <div className="details__block">
              <div className="details__place">CEREMONIA RELIGIOSA</div>
              <div className="details__time">2:00 PM</div>
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

            <div className="details__block">
              <div className="details__place">RECEPCIÓN</div>
              <div className="details__time">4:00 PM</div>
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
