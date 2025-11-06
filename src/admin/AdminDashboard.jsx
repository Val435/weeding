import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllGuests, getAllNotes, getGalleryPhotos } from "../api";
import "./Styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [guests, setGuests] = useState([]);
  const [notes, setNotes] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, confirmed, pending, declined, notes, gallery
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      navigate("/admin");
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [guestsData, notesData] = await Promise.all([
        getAllGuests(),
        getAllNotes()
      ]);
      console.log("📊 Datos recibidos:");
      console.log("Guests:", guestsData);
      console.log("Notes:", notesData);
      setGuests(guestsData);
      setNotes(notesData);

      // Cargar galería de forma opcional (no romper si falla)
      try {
        const galleryData = await getGalleryPhotos();
        console.log("Gallery:", galleryData);
        setGallery(galleryData.photos || []);
      } catch (galleryError) {
        console.log("Galería no disponible aún:", galleryError);
        setGallery([]);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  const handleDownload = async (photo) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Nombre del archivo con fecha y usuario
      const date = new Date(photo.uploadedAt).toISOString().split('T')[0];
      const userName = photo.userName ? photo.userName.replace(/\s+/g, '_') : 'invitado';
      const extension = photo.type === 'image' ? 'jpg' : 'mp4';
      link.download = `boda_${date}_${userName}_${photo.id}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('Error al descargar el archivo. Por favor intenta de nuevo.');
    }
  };

  const handleDownloadAll = async () => {
    if (gallery.length === 0) {
      alert('No hay fotos para descargar');
      return;
    }

    const confirmed = window.confirm(
      `¿Deseas descargar todas las ${gallery.length} fotos/videos? Esto puede tomar algunos minutos.`
    );

    if (!confirmed) return;

    alert(`Iniciando descarga de ${gallery.length} archivos. Por favor espera...`);

    let downloaded = 0;
    for (const photo of gallery) {
      try {
        await handleDownload(photo);
        downloaded++;
        // Pequeña pausa entre descargas para no saturar el navegador
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error descargando foto ${photo.id}:`, error);
      }
    }

    alert(`Descarga completada: ${downloaded} de ${gallery.length} archivos descargados.`);
  };

  const filteredGuests = guests.filter((g) => {
    if (filter === "all") return true;
    if (filter === "confirmed") return g.attending === true;
    if (filter === "declined") return g.attending === false;
    if (filter === "pending") return g.attending === null;
    return true;
  });

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__loading">Cargando datos...</div>
      </div>
    );
  }

  const totalGuests = guests.length;
  const confirmedCount = guests.filter((g) => g.attending === true).length;
  const declinedCount = guests.filter((g) => g.attending === false).length;
  const pendingCount = guests.filter((g) => g.attending === null).length;
  const notesCount = notes.length;
  const galleryCount = gallery.length;

  const confirmationRate = totalGuests > 0
    ? Math.round((confirmedCount / totalGuests) * 100)
    : 0;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header__content">
          <div>
            <h1 className="admin-header__title">PANEL DE ADMINISTRACIÓN</h1>
            <p className="admin-header__subtitle">Boda Valeria & Martín - 9 de Enero, 2026</p>
          </div>
          <button className="admin-header__logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Stats Cards */}
        <div className="admin-stats-wrapper">
          <button
            className="admin-stats__toggle"
            onClick={() => setStatsExpanded(!statsExpanded)}
          >
            <div className="admin-stats__toggle-content">
              <div className="admin-stats__toggle-icon">📊</div>
              <div className="admin-stats__toggle-info">
                <span className="admin-stats__toggle-title">Estadísticas</span>
                <span className="admin-stats__toggle-subtitle">
                  {totalGuests} invitados · {confirmedCount} confirmados
                </span>
              </div>
            </div>
            <svg
              className={`admin-stats__toggle-arrow ${statsExpanded ? 'expanded' : ''}`}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className={`admin-stats ${statsExpanded ? 'expanded' : ''}`}>
          <div className="stat-card stat-card--total">
            <div className="stat-card__icon">👥</div>
            <div className="stat-card__content">
              <div className="stat-card__value">{totalGuests}</div>
              <div className="stat-card__label">Total Invitados</div>
            </div>
          </div>

          <div className="stat-card stat-card--confirmed">
            <div className="stat-card__icon">✓</div>
            <div className="stat-card__content">
              <div className="stat-card__value">{confirmedCount}</div>
              <div className="stat-card__label">Confirmados</div>
            </div>
          </div>

          <div className="stat-card stat-card--declined">
            <div className="stat-card__icon">✗</div>
            <div className="stat-card__content">
              <div className="stat-card__value">{declinedCount}</div>
              <div className="stat-card__label">No Asistirán</div>
            </div>
          </div>

          <div className="stat-card stat-card--pending">
            <div className="stat-card__icon">⏳</div>
            <div className="stat-card__content">
              <div className="stat-card__value">{pendingCount}</div>
              <div className="stat-card__label">Sin Respuesta</div>
            </div>
          </div>

          <div className="stat-card stat-card--notes">
            <div className="stat-card__icon">💌</div>
            <div className="stat-card__content">
              <div className="stat-card__value">{notesCount}</div>
              <div className="stat-card__label">Mensajes Recibidos</div>
            </div>
          </div>

          <div className="stat-card stat-card--rate">
            <div className="stat-card__icon">📊</div>
            <div className="stat-card__content">
              <div className="stat-card__value">{confirmationRate}%</div>
              <div className="stat-card__label">Tasa de Confirmación</div>
            </div>
          </div>

          <div className="stat-card stat-card--gallery">
            <div className="stat-card__icon">📸</div>
            <div className="stat-card__content">
              <div className="stat-card__value">{galleryCount}</div>
              <div className="stat-card__label">Fotos & Videos</div>
            </div>
          </div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <button
            className={`filter-btn ${filter === "all" ? "filter-btn--active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos ({totalGuests})
          </button>
          <button
            className={`filter-btn ${filter === "confirmed" ? "filter-btn--active" : ""}`}
            onClick={() => setFilter("confirmed")}
          >
            Confirmados ({confirmedCount})
          </button>
          <button
            className={`filter-btn ${filter === "declined" ? "filter-btn--active" : ""}`}
            onClick={() => setFilter("declined")}
          >
            No Asistirán ({declinedCount})
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "filter-btn--active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Sin Respuesta ({pendingCount})
          </button>
          {notes.length > 0 && (
            <button
              className={`filter-btn filter-btn--notes ${filter === "notes" ? "filter-btn--active" : ""}`}
              onClick={() => setFilter("notes")}
            >
              💌 Mensajes ({notesCount})
            </button>
          )}
          <button
            className={`filter-btn filter-btn--gallery ${filter === "gallery" ? "filter-btn--active" : ""}`}
            onClick={() => setFilter("gallery")}
          >
            📸 Galería ({galleryCount})
          </button>
        </div>

        {/* Content Area - Table, Notes, or Gallery */}
        {filter === "gallery" ? (
          /* Gallery Section */
          <div className="admin-gallery-section">
            {gallery.length === 0 ? (
              <div className="admin-gallery-empty">
                <div className="admin-gallery-empty__icon">📸</div>
                <h3 className="admin-gallery-empty__title">Aún no hay fotos o videos</h3>
                <p className="admin-gallery-empty__message">
                  Cuando los invitados empiecen a subir sus fotos y videos, aparecerán aquí.
                </p>
              </div>
            ) : (
              <>
                <div className="admin-gallery-header">
                  <h3 className="admin-gallery-header__title">
                    Galería de Fotos y Videos ({gallery.length})
                  </h3>
                  <button
                    className="admin-gallery-header__download-all"
                    onClick={handleDownloadAll}
                    title="Descargar todas las fotos y videos"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Descargar Todas
                  </button>
                </div>
                <div className="admin-gallery-grid">
                {gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="gallery-photo-card"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="gallery-photo-card__media">
                      {photo.type === "image" ? (
                        <img
                          src={photo.thumbnailUrl || photo.url}
                          alt={photo.message || "Foto de la boda"}
                          loading="lazy"
                        />
                      ) : (
                        <video
                          src={photo.url}
                          preload="metadata"
                        />
                      )}
                      {photo.type === "video" && (
                        <div className="gallery-photo-card__play-icon">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    {(photo.userName || photo.message) && (
                      <div className="gallery-photo-card__info">
                        {photo.userName && (
                          <p className="gallery-photo-card__user">{photo.userName}</p>
                        )}
                        {photo.message && (
                          <p className="gallery-photo-card__message">{photo.message}</p>
                        )}
                        <p className="gallery-photo-card__date">
                          {new Date(photo.uploadedAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              </>
            )}
          </div>
        ) : filter === "notes" ? (
          /* Notes Section */
          <div className="admin-notes-section">
            <div className="admin-notes-grid">
              {notes.map((note) => {
                // El endpoint devuelve note.guest con { id, fullName }
                // Buscamos el guest completo en la lista para obtener el groupId
                const noteGuest = note.guest;
                const fullGuest = noteGuest ? guests.find(g => g.id === noteGuest.id) : null;

                return (
                  <div key={note.id} className="note-card">
                    <div className="note-card__header">
                      <div className="note-card__author-info">
                        <span className="note-card__author">
                          {noteGuest?.fullName || "Invitado Anónimo"}
                        </span>
                        {fullGuest?.groupId && (
                          <span className="note-card__group">Grupo #{fullGuest.groupId}</span>
                        )}
                      </div>
                      <span className="note-card__date">
                        {new Date(note.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="note-card__message">
                      {note.message}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Guests Table */
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Grupo</th>
                  <th>Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="admin-table__empty">
                      No hay invitados en esta categoría
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => (
                    <tr key={guest.id}>
                      <td className="admin-table__name">{guest.fullName}</td>
                      <td>
                        <span
                          className={`status-badge status-badge--${
                            guest.attending === true
                              ? "confirmed"
                              : guest.attending === false
                              ? "declined"
                              : "pending"
                          }`}
                        >
                          {guest.attending === true
                            ? "✓ Confirmado"
                            : guest.attending === false
                            ? "✗ No asistirá"
                            : "⏳ Sin respuesta"}
                        </span>
                      </td>
                      <td className="admin-table__group">
                        Grupo #{guest.groupId || "-"}
                      </td>
                      <td className="admin-table__note">
                        {notes.find(n => n.guestId === guest.id) ? (
                          <div className="note-preview" title={notes.find(n => n.guestId === guest.id)?.message}>
                            💌 Ver mensaje
                          </div>
                        ) : (
                          <span className="text-muted">Sin mensaje</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-modal__content" onClick={(e) => e.stopPropagation()}>
            <button
              className="photo-modal__close"
              onClick={() => setSelectedPhoto(null)}
            >
              ×
            </button>
            <button
              className="photo-modal__download"
              onClick={() => handleDownload(selectedPhoto)}
              title="Descargar en HD"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="photo-modal__media">
              {selectedPhoto.type === "image" ? (
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.message || "Foto de la boda"}
                />
              ) : (
                <video
                  src={selectedPhoto.url}
                  controls
                  autoPlay
                />
              )}
            </div>
            {(selectedPhoto.userName || selectedPhoto.message) && (
              <div className="photo-modal__info">
                {selectedPhoto.userName && (
                  <p className="photo-modal__user">
                    <strong>Subido por:</strong> {selectedPhoto.userName}
                  </p>
                )}
                {selectedPhoto.message && (
                  <p className="photo-modal__message">
                    <strong>Mensaje:</strong> {selectedPhoto.message}
                  </p>
                )}
                <p className="photo-modal__date">
                  <strong>Fecha:</strong>{" "}
                  {new Date(selectedPhoto.uploadedAt).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {selectedPhoto.width && selectedPhoto.height && (
                  <p className="photo-modal__dimensions">
                    <strong>Dimensiones:</strong> {selectedPhoto.width} × {selectedPhoto.height}px
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
