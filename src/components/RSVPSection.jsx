import "./Styles/RSVP.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function RSVPSection() {
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation(); // <- saber dónde estamos

  const handleFind = () => {
    const q = fullName.trim();
    navigate(`/select${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  const handleCancel = () => {
    setFullName("");      // Limpia el input
    navigate("/");        // Redirige a la página principal
  };

  return (
    <section id="rsvp" className="rsvp">
      <div className="rsvp__card">
        <h3 className="rsvp__title">RSVP</h3>

        <p className="rsvp__desc">
          Por favor, ingresa el nombre y apellido de uno de los miembros de tu grupo a continuación.
          Si estás respondiendo por ti y un acompañante (o tu familia), podrás confirmar la asistencia
          de todo tu grupo en la siguiente página.
        </p>

        <label className="rsvp__label" htmlFor="fullname">Nombre y apellido</label>
        <input
          id="fullname"
          className="rsvp__input"
          type="text"
          placeholder="NOMBRE Y APELLIDO"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <div className="rsvp__actions">
          <button
            type="button"
            className="rsvp__btn rsvp__btn--primary"
            onClick={handleFind}
          >
            ENCUENTRA TUS INVITACIONES
          </button>

          {/* Mostrar Cancelar solo cuando NO estamos en la home */}
          {pathname !== "/" && (
            <button
              type="button"
              className="rsvp__btn rsvp__btn--ghost"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
