import { Clock } from "lucide-react";
import bg from "../assets/portada.png";
import florIzq from "../assets/florIzq.png";   // <-- nueva
import florDer from "../assets/florDer.png";   // <-- nueva
import "./Styles/Hero.css";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="hero"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Decoraciones laterales */}
      <img
        src={florIzq}
        alt=""
        aria-hidden="true"
        className="hero__decor hero__decor--left"
      />
      <img
        src={florDer}
        alt=""
        aria-hidden="true"
        className="hero__decor hero__decor--right"
      />

      <div className="hero__inner">
        <h1 className="hero__names">MARTÍN POCASANGRE</h1>
        <span className="hero__amp">&amp;</span>
        <h1 className="hero__names">VALERIA PORTILLO</h1>

        <p className="hero__date">Viernes 9 de Enero 2026</p>
      </div>
    </section>
  );
}
