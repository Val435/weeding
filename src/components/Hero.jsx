import { Clock } from "lucide-react";
import bg from "../assets/portada.png"; 
import "./Styles/Hero.css";

export default function Hero({  countdown, }) {
  return (
    <section
      id="inicio"
      className="hero"
      style={{ backgroundImage: `url(${bg})` }} // fondo desde assets
    >
      <div className="hero__inner">
         <h1 className="hero__names">MARTÍN POCASANGRE</h1>
        <span className="hero__amp">&amp;</span>
       <h1 className="hero__names">VALERIA PORTILLO</h1>

        {/* Fecha fija debajo (como pediste) */}
        <p className="hero__date">Viernes 9 de Enero 2026</p>

        {/* Countdown (opcional) */}
        <div className="hero__belt">
          <Clock size={16} />
          <span>
            Faltan {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
          </span>
        </div>

        {/* Botones */}
       
      </div>
    </section>
  );
}