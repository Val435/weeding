// routes.js
import Hero from "./components/Hero";
import DetailsSection from "./components/DetailsSection";

import RSVPSection from "./components/RSVPSection";
import SelectPersonPage from "./pages/SelectPersonPage";
import MesaRegalo from "./pages/MesaRegalo";
import Vestimenta from "./pages/Vestimenta";
import SendRSVP from "./components/SendRSVP";
import AllSet from "./components/AllSet";
import Note from "./components/Note";
import Board from "./components/Board";

export const appRoutes = (eventDate, countdown, goToRSVP) => [
  {
    path: "/",
    element: (
      <>
        <Hero eventDate={eventDate} countdown={countdown} onOpenRSVP={goToRSVP} />
        <DetailsSection eventDate={eventDate} countdown={countdown} />
        <RSVPSection />
        {/* <GiftsSection /> */}
        {/* <MesaRegalo />
        <Vestimenta /> */}
      </>
    ),
  },
  { path: "/rsvp", element: <RSVPSection /> },
  { path: "/select", element: <SelectPersonPage /> },
  { path: "/gift", element: <MesaRegalo /> },
  { path: "/dress-code", element: <Vestimenta /> },
  { path: "/send-rsvp", element: <SendRSVP /> },
  { path: "/all-set", element: <AllSet /> },
  { path: "/note", element: <Note /> },
  { path: "/board", element: <Board /> },
];
