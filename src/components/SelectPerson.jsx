import "./Styles/SelectPerson.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 👉 importa tus imágenes (ajusta rutas si cambian)
import img1 from "../assets/1.png";
import img2 from "../assets/2.png";
import img3 from "../assets/3.png";
import img4 from "../assets/4.png";
import img5 from "../assets/5.png";

export default function SelectPerson({ onProceed, query = "" }) {
  const navigate = useNavigate();

  // ---- Lógica de selección ----
  const results = ["VALERIA PORTILLO", "MARTÍN POCASANGRE"];
  const [selected, setSelected] = useState(() => new Set());
  const toggleSelect = (name) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };
  const isSelected = (name) => selected.has(name);
  const handleNext = () => {
    const list = Array.from(selected);
    onProceed?.(list);
    navigate(`/note${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  // ---- Carrusel (debajo) ----
  const images = [img1, img2, img3, img4, img5];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section className="select">
      <div className="selectBox">
        <p className="selectBox__line selectBox__line--es">
          SELECCIONA TU INFORMACIÓN A CONTINUACIÓN O INTENTA BUSCAR DE NUEVO
        </p>

        <hr className="selectBox__rule" />

        {/* Lista con botón por persona */}
        <div className="selectArea selectArea--perRowBtn">
          <ul className="selectList">
            {results.map((name) => (
              <li key={name} className="selectRow">
                <span className="selectRow__name">{name}</span>
                <button
                  type="button"
                  className={`selectRow__btn ${isSelected(name) ? "is-selected" : ""}`}
                  onClick={() => toggleSelect(name)}
                  aria-pressed={isSelected(name)}
                >
                  {isSelected(name) ? "QUITAR" : "SELECCIONAR"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer: contador + Siguiente */}
        <div className="selectFooter">
          <span className="selectFooter__count">
            {selected.size > 0
              ? `${selected.size} seleccionado${selected.size > 1 ? "s" : ""}`
              : "Nadie seleccionado"}
          </span>

          <button
            className="nextBtn"
            type="button"
            onClick={handleNext}
            disabled={selected.size === 0}
            title={selected.size === 0 ? "Selecciona al menos una persona" : "Continuar"}
          >
            SIGUIENTE
          </button>
        </div>

        <hr className="selectBox__rule" />

        <div className="selectHelp">
          <p className="selectHelp__es">
            SI NINGUNO DE ESTOS ES USTED, POR FAVOR COMUNÍQUESE CON LA PAREJA<br />
            PARA VERIFICAR CÓMO INGRESARON SUS DATOS
          </p>
        </div>
      </div>

      {/* === Carrusel debajo === */}
      <div className="select__carousel" role="region" aria-label="Galería">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Foto ${i + 1}`}
            className={`select__img ${i === index ? "is-active" : ""}`}
            draggable={false}
          />
        ))}
        <div className="select__dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`select__dot ${i === index ? "is-active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Ir a foto ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
