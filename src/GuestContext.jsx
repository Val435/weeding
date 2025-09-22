import { createContext, useContext, useEffect, useState } from "react";

const GuestContext = createContext();

export function GuestProvider({ children }) {
  const [guest, setGuest] = useState(null);

  // cargar invitado desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("guest");
    if (stored) {
      setGuest(JSON.parse(stored));
    }
  }, []);

  // guardar en localStorage cuando cambie
  useEffect(() => {
    if (guest) {
      localStorage.setItem("guest", JSON.stringify(guest));
    } else {
      localStorage.removeItem("guest");
    }
  }, [guest]);

  return (
    <GuestContext.Provider value={{ guest, setGuest }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  return useContext(GuestContext);
}
