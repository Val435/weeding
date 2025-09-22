import "./Styles/SelectPerson.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmGuest } from "../api";
import { useGuest } from "../GuestContext";

import img1 from "../assets/6.png";
import img2 from "../assets/7.png";
import img3 from "../assets/8.png";
import img4 from "../assets/9.png";
import img5 from "../assets/10.png";
import florIzq from "../assets/florIzq2.png";
import florDer from "../assets/florDer2.png";
import calendarioSvg from "../assets/svg/calendario.svg";
import etiquetaSvg from "../assets/svg/etiqueta.svg";

export default function SelectPerson() {
  const { guest } = useGuest();
  const [responses, setResponses] = useState(new Map());
  const navigate = useNavigate();
    const images = [img1, img2, img3, img4, img5];
  const [index, ] = useState(0);

  if (!guest) {
    return <p>No se encontró invitado. Volvé al inicio.</p>;
  }

  const setResponse = (id, willAttend) => {
    setResponses((prev) => {
      const next = new Map(prev);
      next.set(id, willAttend);
      return next;
    });
  };

  const getResponse = (id) => responses.get(id);

  const allHaveResponded = () => {
    return guest.every((g) => responses.has(g.id));
  };

  const respondedCount = responses.size;
  const totalPeople = guest.length;

  const handleNext = async () => {
    for (let [id, attending] of responses.entries()) {
      await confirmGuest(id, attending);
    }
    navigate("/note");
  };

  

  return (
    <section className="select">
      <div className="selectBox">
        <p className="selectBox__line selectBox__line1--es">CONFIRMA TU ASISTENCIA</p>
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

        <div className="selectArea selectArea--perRowBtn">
          <ul className="selectList">
            {guest.map((g) => (
              <li key={g.id} className="selectRow">
                <span className="selectRow__name">{g.fullName}</span>
                <div className="selectRow__buttons">
                  <button
                    type="button"
                    className={`selectRow__btn selectRow__btn--yes ${getResponse(g.id) === true ? "is-selected" : ""}`}
                    onClick={() => setResponse(g.id, true)}
                    aria-pressed={getResponse(g.id) === true}
                  >
                    SÍ ASISTIRÉ
                  </button>
                  <button
                    type="button"
                    className={`selectRow__btn selectRow__btn--no ${getResponse(g.id) === false ? "is-selected" : ""}`}
                    onClick={() => setResponse(g.id, false)}
                    aria-pressed={getResponse(g.id) === false}
                  >
                    NO PODRÉ ASISTIR
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <hr className="selectBox__rule" />
      </div>

      <div className="selectFooter">
        <span className="selectFooter__count"></span>
        <button
          className="nextBtn"
          type="button"
          onClick={handleNext}
          disabled={!allHaveResponded()}
          title={
            !allHaveResponded()
              ? `Faltan ${totalPeople - respondedCount} persona${totalPeople - respondedCount > 1 ? "s" : ""} por responder`
              : "Continuar"
          }
        >
          CONTINUAR
        </button>
      </div>

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
      </div>
    </section>
  );
}
