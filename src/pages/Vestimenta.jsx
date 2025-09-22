import { useNavigate } from "react-router-dom";
import florIzq from "../assets/florIzq1.png";
import florDer from "../assets/florDer1.png";
import "../components/Styles/Vestimenta.css";

export default function Vestimenta() {
  const navigate = useNavigate();

  return (
    <section id="vestimenta" className="vestimenta">
      <img src={florIzq} alt="" aria-hidden="true" className="vestimenta__decor vestimenta__decor--left" />
      <img src={florDer} alt="" aria-hidden="true" className="vestimenta__decor vestimenta__decor--right" />

      <div className="vestimenta__inner">
        <h2 className="vestimenta__title">VESTIMENTA</h2>
        <p className="vestimenta__subtitle">
          <strong>ETIQUETA (BLACK TIE)</strong><br />
          
        </p>
        <p className="vestimenta__text">
          INVITADAS: AGRADECEMOS EVITAR VESTIDOS<br /> COLOR NEGRO
          <br />
           <br />
          PARA INSPIRARSE, LES DEJAMOS<br />ALGUNAS OPCIONES AQUÍ:
        </p>
        <button className="vestimenta__btn" onClick={() => navigate("/board")}>
          IDEAS DE VESTIMENTA
        </button>
      </div>
    </section>
  );
}
