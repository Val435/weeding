import { Routes, Route, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import NavBar from "./components/NavBar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import { useCountdown } from "./utils/useCountdown";
import { appRoutes } from "./routes";


export default function App() {
  const navigate = useNavigate();
  const eventDate = useMemo(() => new Date("2026-01-09T19:00:00-06:00"), []);
  const countdown = useCountdown(eventDate.toISOString());

  const goToRSVP = () => navigate("/rsvp");

  return (
    <>
      <ScrollToTop />
      <NavBar />
      <Routes>
        {appRoutes(eventDate, countdown, goToRSVP).map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
      <Footer />
    </>
  );
}
