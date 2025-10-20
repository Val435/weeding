import { createContext, useContext, useEffect, useState } from "react";

const GuestContext = createContext();

// Función para cargar desde localStorage
const loadGuestFromStorage = () => {
  try {
    const stored = localStorage.getItem("guest");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading guest from localStorage:", error);
    return null;
  }
};

export function GuestProvider({ children }) {
  // Inicializar con el valor de localStorage directamente
  const [guest, setGuest] = useState(loadGuestFromStorage);

  // guardar en localStorage cuando cambie
  useEffect(() => {
    if (guest) {
      try {
        localStorage.setItem("guest", JSON.stringify(guest));
      } catch (error) {
        console.error("Error saving guest to localStorage:", error);
      }
    } else {
      localStorage.removeItem("guest");
    }
  }, [guest]);

  // Función para limpiar el guest del contexto y localStorage
  const clearGuest = () => {
    setGuest(null);
    localStorage.removeItem("guest");
  };

  return (
    <GuestContext.Provider value={{ guest, setGuest, clearGuest }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  return useContext(GuestContext);
}
