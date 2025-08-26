// routes.js
import Hero from "./components/Hero";
import DetailsSection from "./components/DetailsSection";
import GiftsSection from "./components/GiftsSection";
import RSVPSection from "./components/RSVPSection";
import SelectPersonPage from "./pages/SelectPersonPage";
import MesaRegalo from "./pages/MesaRegalo";
import Vestimenta from "./pages/Vestimenta";
import SendRSVP from "./components/SendRSVP";
import AllSet from "./components/AllSet";
import Note from "./components/Note";

export const appRoutes = (eventDate, countdown, goToRSVP) => [
  {
    path: "/",
    element: (
      <>
        <Hero eventDate={eventDate} countdown={countdown} onOpenRSVP={goToRSVP} />
        <DetailsSection eventDate={eventDate} />
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
];
