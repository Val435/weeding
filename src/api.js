const API_URL = "https://wedding-backend-oz4p.onrender.com"; // ⚠️ cámbialo en producción

export async function fetchGuests(query) {
  const res = await fetch(`${API_URL}/guests?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function createGuest(fullName) {
  const res = await fetch(`${API_URL}/guests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName }),
  });
  return res.json();
}

export async function confirmGuest(id, attending) {
  const res = await fetch(`${API_URL}/guests/${id}/confirm`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attending }),
  });
  return res.json();
}

export async function addNote(id, message) {
  const res = await fetch(`${API_URL}/guests/${id}/note`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return res.json();
}

// ========== ADMIN ENDPOINTS ==========

// Obtener todos los invitados (para dashboard admin)
export async function getAllGuests() {
  const res = await fetch(`${API_URL}/guests`);
  return res.json();
}

// Obtener todas las notas
export async function getAllNotes() {
  const res = await fetch(`${API_URL}/guests/notes/all`);
  return res.json();
}
