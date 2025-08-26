// src/components/NavBar.jsx
import "./Styles/NavBar.css";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();

  return (
    <header className="nav">
      <nav className="nav__inner">
        <ul className="nav__menu">
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
