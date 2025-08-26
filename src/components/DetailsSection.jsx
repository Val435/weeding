import "./Styles/DetailsSection.css";
import { useState, useEffect } from "react";

// importa tus imágenes desde src/assets
import img1 from "../assets/1.png";
import img2 from "../assets/2.png";
import img3 from "../assets/3.png";
import img4 from "../assets/4.png";
import img5 from "../assets/5.png";

export default function DetailsSection() {
  const images = [img1, img2, img3, img4, img5];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // cambia cada 3s
    return () => clearInterval(id);
  }, [images.length]);

  return (
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
            <div className="details__time">2:00 PM</div>
            <div className="details__place">CEREMONIA RELIGIOSA</div>
            <div className="details__venue">MONTELENA</div>
            <div className="details__address">
              Sur, Urbanización, Bulevar Orden De Malta Final, 1502
            </div>
          </div>

          <div className="details__block">
            <div className="details__time">4:00 PM</div>
            <div className="details__place">RECEPCIÓN</div>
            <div className="details__venue">FORET · COMASAGUA</div>
            <div className="details__address">
              Desvío El Limón, Calle a Comasagua, Santa Tecla 1506
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
