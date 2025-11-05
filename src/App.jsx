import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import NavBar from "./components/NavBar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import { useCountdown } from "./utils/useCountdown";
import { appRoutes } from "./routes";


export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventDate = useMemo(() => new Date("2026-01-09T19:00:00-06:00"), []);
  const countdown = useCountdown(eventDate.toISOString());

  const goToRSVP = () => navigate("/rsvp");

  // Ocultar navbar y footer en la página de galería
  const isGalleryPage = location.pathname === "/galeria";

  // Quitar padding del body en la página de galería
  React.useEffect(() => {
    if (isGalleryPage) {
      document.body.style.paddingTop = '0';
    } else {
      document.body.style.paddingTop = '';
    }

    return () => {
      document.body.style.paddingTop = '';
    };
  }, [isGalleryPage]);

  return (
    <>
      <ScrollToTop />
      {!isGalleryPage && <NavBar />}
      <Routes>
        {appRoutes(eventDate, countdown, goToRSVP).map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
      {!isGalleryPage && <Footer />}
    </>
  );
}
