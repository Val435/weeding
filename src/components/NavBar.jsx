// src/components/NavBar.jsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Styles/NavBar.css";

export default function NavBar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) setIsOpen(false);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header className="nav">
      <nav className="nav__inner">
        <button
          type="button"
          className={`nav__toggle${isOpen ? " nav__toggle--open" : ""}`}
          aria-expanded={isOpen}
          aria-controls="nav-menu"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul id="nav-menu" className={`nav__menu${isOpen ? " nav__menu--open" : ""}`}>
          {/* Mostrar "Inicio" solo si NO estamos en "/" */}
          {pathname !== "/" && (
            <li>
              <Link className="nav__link" to="/">
                INICIO
              </Link>
            </li>
          )}

          {/* Lleva a la página /rsvp */}
          <li>
            <Link className="nav__link" to="/rsvp">
              RSVP
            </Link>
          </li>

          {/* Estos siguen como anclas dentro de la página principal */}
          <li>
            <Link className="nav__link" to="/gift">
              MESA DE REGALOS
            </Link>
          </li>
          <li>
            <Link className="nav__link" to="/dress-code">
              VESTIMENTA
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
