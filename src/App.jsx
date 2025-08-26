import { Routes, Route, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import NavBar from "./components/NavBar";
import { useCountdown } from "./utils/useCountdown";
import { appRoutes } from "./routes";


export default function App() {
  const navigate = useNavigate();
  const eventDate = useMemo(() => new Date("2026-01-09T16:00:00-06:00"), []);
  const countdown = useCountdown(eventDate.toISOString());

  const goToRSVP = () => navigate("/rsvp");

  return (
    <>
      <NavBar />
      <Routes>
        {appRoutes(eventDate, countdown, goToRSVP).map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </>
  );
}
