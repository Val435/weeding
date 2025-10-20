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

// Función para cargar todos los grupos originales
const loadAllGroupsFromStorage = () => {
  try {
    const stored = localStorage.getItem("allGroups");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading allGroups from localStorage:", error);
    return null;
  }
};

export function GuestProvider({ children }) {
  // Inicializar con el valor de localStorage directamente
  const [guest, setGuest] = useState(loadGuestFromStorage);
  // Guardar todos los grupos encontrados originalmente
  const [allGroups, setAllGroups] = useState(loadAllGroupsFromStorage);

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

  // Guardar allGroups en localStorage
  useEffect(() => {
    if (allGroups) {
      try {
        localStorage.setItem("allGroups", JSON.stringify(allGroups));
      } catch (error) {
        console.error("Error saving allGroups to localStorage:", error);
      }
    } else {
      localStorage.removeItem("allGroups");
    }
  }, [allGroups]);

  // Función para limpiar el guest del contexto y localStorage
  const clearGuest = () => {
    setGuest(null);
    setAllGroups(null);
    localStorage.removeItem("guest");
    localStorage.removeItem("allGroups");
  };

  return (
    <GuestContext.Provider value={{ guest, setGuest, allGroups, setAllGroups, clearGuest }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  return useContext(GuestContext);
}
