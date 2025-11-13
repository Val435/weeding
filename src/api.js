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

export async function confirmGuest(id, attending, foodPreference = null) {
  const body = { attending };
  if (foodPreference) {
    body.foodPreference = foodPreference;
  }

  const res = await fetch(`${API_URL}/guests/${id}/confirm`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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

// ========== GALLERY ENDPOINTS ==========

// Subir fotos/videos a la galería
export async function uploadPhotos(formData) {
  const res = await fetch(`${API_URL}/gallery/upload`, {
    method: "POST",
    body: formData, // No agregar Content-Type, fetch lo hace automáticamente con FormData
  });
  if (!res.ok) {
    throw new Error("Error al subir archivos");
  }
  return res.json();
}

// Obtener todas las fotos de la galería
export async function getGalleryPhotos() {
  const res = await fetch(`${API_URL}/gallery/photos`);
  if (!res.ok) {
    throw new Error("Error al cargar galería");
  }
  return res.json();
}
