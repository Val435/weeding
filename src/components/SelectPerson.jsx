import "./Styles/SelectPerson.css";
import { useState } from "react";
import { useNavigate, } from "react-router-dom";


export default function SelectPerson({ onProceed, query = "" }) {
  const results = ["VALERIA PORTILLO", "MARTÍN POCASANGRE"];
  const [selected, setSelected] = useState(() => new Set());
   const navigate = useNavigate();

  const toggleSelect = (name) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleNext = () => {
    const list = Array.from(selected);
    onProceed?.(list);
    navigate(`/note${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  const isSelected = (name) => selected.has(name);

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
    </section>
  );
}
