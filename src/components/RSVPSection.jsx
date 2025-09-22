import "./Styles/RSVP.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import florIzq from "../assets/florIzq1.png";
import florDer from "../assets/florDer1.png";
import { fetchGuests } from "../api";
import { useGuest } from "../GuestContext";

export default function RSVPSection() {
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const showDecor = pathname !== "/";
  const { setGuest } = useGuest();

  const handleFind = async () => {
    if (!fullName.trim()) return;
    const guests = await fetchGuests(fullName);

    if (guests.length > 0) {
      setGuest(guests); // 👈 guardamos el array completo en contexto
      navigate("/select");
    } else {
      alert("No se encontraron invitados con ese nombre.");
    }
  };

  const handleCancel = () => {
    setFullName("");
    navigate("/");
  };

  return (
    <section
      id="rsvp"
      className={`rsvp ${pathname !== "/" ? "rsvp--center" : ""}`}
    >
      {showDecor && (
        <>
          <img src={florIzq} alt="" aria-hidden="true" className="vestimenta__decor1 vestimenta__decor--left1" />
          <img src={florDer} alt="" aria-hidden="true" className="vestimenta__decor1 vestimenta__decor--right1" />
        </>
      )}

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
          {showDecor && (
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
