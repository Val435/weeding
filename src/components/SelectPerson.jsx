import "./Styles/SelectPerson.css";

export default function SelectPerson({ onProceed, query = "" }) {
  const results = ["VALERIA PORTILLO", "MARTÍN POCASANGRE"];

  return (
    <section className="select">
      <div className="selectBox">
        {/* Encabezado: EN + ES */}
      
        <p className="selectBox__line selectBox__line--es">
          SELECCIONA TU INFORMACIÓN A CONTINUACIÓN O INTENTA BUSCAR DE NUEVO
        </p>

        <hr className="selectBox__rule" />

        {/* Lista (solo informativa) + botón único a la derecha */}
        <div className="selectArea">
          <ul className="selectList">
            {results.map((name) => (
              <li key={name} className="selectRow">
                <span className="selectRow__name">{name}</span>
              </li>
            ))}
          </ul>

          <div className="selectSide">
            <button className="selectBtn" type="button" onClick={() => onProceed?.()}>
             SELECCIONAR
            </button>
          </div>
        </div>

        <hr className="selectBox__rule" />

        {/* Mensajes de ayuda: EN + ES + EN */}
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
