import "./Styles/SelectPerson.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 👉 importa tus imágenes (ajusta rutas si cambian)
import img1 from "../assets/6.png";
import img2 from "../assets/7.png";
import img3 from "../assets/8.png";
import img4 from "../assets/9.png";
import img5 from "../assets/10.png";
import florIzq from "../assets/florIzq2.png";
import florDer from "../assets/florDer2.png";
import calendarioSvg from "../assets/svg/calendario.svg";
import etiquetaSvg from "../assets/svg/etiqueta.svg";

export default function SelectPerson({ onProceed, query = "" }) {
  const navigate = useNavigate();

  // ---- Lógica de selección ----
  const results = ["VALERIA PORTILLO", "MARTÍN POCASANGRE"];
  const [responses, setResponses] = useState(() => new Map()); // Map para guardar respuesta de cada persona
  
  const setResponse = (name, willAttend) => {
    setResponses((prev) => {
      const next = new Map(prev);
      next.set(name, willAttend);
      return next;
    });
  };
  
  const getResponse = (name) => responses.get(name); // true = asistirá, false = no asistirá, undefined = no ha respondido
  
  // Verificar si todas las personas han respondido
  const allHaveResponded = () => {
    return results.every(name => responses.has(name));
  };
  
  // Contar cuántas personas han respondido
  const respondedCount = responses.size;
  const totalPeople = results.length;
  
  const handleNext = () => {
    // Solo incluir personas que respondieron "sí"
    const attendees = Array.from(responses.entries())
      .filter(([, willAttend]) => willAttend === true)
      .map(([name]) => name);
    onProceed?.(attendees);
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
        <p className="selectBox__line selectBox__line1--es">
CONFIRMA TU ASISTENCIA        </p>
        <p className="selectBox__line selectBox__line--es">
          <img src={calendarioSvg} alt="Calendario" className="selectBox__icon" />
          VIERNES 9 DE ENERO 2026, A LAS 7:00 P.M.
        </p>
        <p className="selectBox__line selectBox__line--es">
          <img src={etiquetaSvg} alt="Etiqueta" className="selectBox__icon" />
          ETIQUETA (BLACK TIE)
        </p>

        <hr className="selectBox__rule" />

         <img src={florIzq} alt="" aria-hidden="true" className="vestimenta__decor2 vestimenta__decor--left2" />
      <img src={florDer} alt="" aria-hidden="true" className="vestimenta__decor2 vestimenta__decor--right2" />


        {/* Lista con dos botones por persona */}
        <div className="selectArea selectArea--perRowBtn">
          <ul className="selectList">
            {results.map((name) => (
              <li key={name} className="selectRow">
                <span className="selectRow__name">{name}</span>
                <div className="selectRow__buttons">
                  <button
                    type="button"
                    className={`selectRow__btn selectRow__btn--yes ${getResponse(name) === true ? "is-selected" : ""}`}
                    onClick={() => setResponse(name, true)}
                    aria-pressed={getResponse(name) === true}
                  >
                    SÍ ASISTIRÉ
                  </button>
                  <button
                    type="button"
                    className={`selectRow__btn selectRow__btn--no ${getResponse(name) === false ? "is-selected" : ""}`}
                    onClick={() => setResponse(name, false)}
                    aria-pressed={getResponse(name) === false}
                  >
                    NO PODRÉ ASISTIR
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer: contador + Siguiente */}
      

        <hr className="selectBox__rule" />

        
      </div>
        <div className="selectFooter">
          <span className="selectFooter__count">
            
          </span>

          <button
            className="nextBtn"
            type="button"
            onClick={handleNext}
            disabled={!allHaveResponded()}
            title={!allHaveResponded() ? `Faltan ${totalPeople - respondedCount} persona${totalPeople - respondedCount > 1 ? "s" : ""} por responder` : "Continuar"}
          >
            CONTINUAR
          </button>
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
