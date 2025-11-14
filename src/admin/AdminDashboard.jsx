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
  const [downloadModal, setDownloadModal] = useState({ show: false, downloading: false, progress: 0, total: 0 });
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
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

  const downloadGuestsPDF = () => {
    const filterName = filter === "all" ? "Todos los invitados"
      : filter === "confirmed" ? "Invitados confirmados"
      : filter === "declined" ? "No asistirán"
      : filter === "pending" ? "Sin respuesta"
      : filter === "pasta" ? "Preferencia: Pasta"
      : filter === "carne" ? "Preferencia: Carne"
      : "Invitados";

    // Crear contenido HTML para el PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Lista de Invitados - ${filterName}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            padding: 40px;
            color: #2d3748;
          }
          h1 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 24px;
          }
          .subtitle {
            color: #718096;
            margin-bottom: 30px;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background: #667eea;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
          }
          tr:hover {
            background: #f7fafc;
          }
          .status-confirmed { color: #10b981; font-weight: 600; }
          .status-declined { color: #ef4444; font-weight: 600; }
          .status-pending { color: #f59e0b; font-weight: 600; }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <h1>Boda Valeria & Martín - 9 de Enero, 2026</h1>
        <div class="subtitle">${filterName} (${filteredGuests.length} ${filteredGuests.length === 1 ? 'persona' : 'personas'})</div>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Preferencia</th>
              <th>Grupo</th>
              <th>Mensaje</th>
            </tr>
          </thead>
          <tbody>
            ${filteredGuests.map(guest => {
              const estado = guest.attending === true
                ? "Confirmado"
                : guest.attending === false
                ? "No asistirá"
                : "Sin respuesta";

              const statusClass = guest.attending === true
                ? "status-confirmed"
                : guest.attending === false
                ? "status-declined"
                : "status-pending";

              const preferencia = guest.attending === true
                ? (guest.foodPreference === "pasta" ? "Pasta" : guest.foodPreference === "carne" ? "Carne" : "Sin especificar")
                : "-";

              const mensaje = notes.find(n => n.guestId === guest.id)?.message || "Sin mensaje";

              return `
                <tr>
                  <td><strong>${guest.fullName}</strong></td>
                  <td class="${statusClass}">${estado}</td>
                  <td>${preferencia}</td>
                  <td>Grupo #${guest.groupId || "-"}</td>
                  <td>${mensaje}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        <div class="footer">
          Generado el ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })} a las ${new Date().toLocaleTimeString('es-ES')}
        </div>
      </body>
      </html>
    `;

    // Crear ventana temporal para imprimir
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Esperar a que se cargue y luego imprimir
    printWindow.onload = () => {
      printWindow.print();
    };
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
    if (gallery.length === 0) return;

    // Mostrar modal de confirmación
    setDownloadModal({ show: true, downloading: false, progress: 0, total: gallery.length });
  };

  const startDownloadAll = async () => {
    const total = gallery.length;
    setDownloadModal({ show: true, downloading: true, progress: 0, total });

    let downloaded = 0;
    for (const photo of gallery) {
      try {
        await handleDownload(photo);
        downloaded++;
        setDownloadModal({ show: true, downloading: true, progress: downloaded, total });
        // Pequeña pausa entre descargas para no saturar el navegador
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error descargando foto ${photo.id}:`, error);
      }
    }

    // Mostrar completado
    setDownloadModal({ show: true, downloading: false, progress: downloaded, total, completed: true });
  };

  const closeDownloadModal = () => {
    setDownloadModal({ show: false, downloading: false, progress: 0, total: 0 });
  };

  const downloadNotesPDF = () => {
    const filteredNotes = notes.filter(note => {
      const guest = guests.find(g => g.id === note.guestId);
      return guest; // Solo incluir notas de invitados existentes
    });

    // Crear contenido HTML para el PDF de mensajes
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Mensajes de los Invitados</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            padding: 40px;
            color: #2d3748;
          }
          h1 {
            color: #805ad5;
            margin-bottom: 10px;
            font-size: 24px;
          }
          .subtitle {
            color: #718096;
            margin-bottom: 30px;
            font-size: 14px;
          }
          .message-card {
            background: #f7fafc;
            border-left: 4px solid #805ad5;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            page-break-inside: avoid;
          }
          .message-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
          }
          .message-author {
            font-weight: 600;
            color: #2d3748;
            font-size: 15px;
          }
          .message-group {
            color: #805ad5;
            font-size: 12px;
            font-weight: 500;
          }
          .message-date {
            color: #a0aec0;
            font-size: 12px;
          }
          .message-content {
            color: #4a5568;
            font-size: 14px;
            line-height: 1.6;
            font-style: italic;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <h1>Boda Valeria & Martín - 9 de Enero, 2026</h1>
        <div class="subtitle">Mensajes de los Invitados (${filteredNotes.length} ${filteredNotes.length === 1 ? 'mensaje' : 'mensajes'})</div>
        ${filteredNotes.map(note => {
          const guest = guests.find(g => g.id === note.guestId);
          const dateObj = note.createdAt ? new Date(note.createdAt) : new Date();
          const formattedDate = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

          return `
            <div class="message-card">
              <div class="message-header">
                <div>
                  <div class="message-author">${guest?.fullName || 'Invitado'}</div>
                  <div class="message-group">Grupo #${guest?.groupId || '-'}</div>
                </div>
                <div class="message-date">${formattedDate}</div>
              </div>
              <div class="message-content">${note.message}</div>
            </div>
          `;
        }).join('')}
        <div class="footer">
          Generado el ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })} a las ${new Date().toLocaleTimeString('es-ES')}
        </div>
      </body>
      </html>
    `;

    // Crear ventana temporal para imprimir
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Esperar a que se cargue y luego imprimir
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      // Si salimos del modo selección, limpiamos las seleccionadas
      setSelectedPhotos(new Set());
    }
  };

  const togglePhotoSelection = (photoId) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId);
    } else {
      newSelection.add(photoId);
    }
    setSelectedPhotos(newSelection);
  };

  const selectAllPhotos = () => {
    const allIds = new Set(gallery.map(p => p.id));
    setSelectedPhotos(allIds);
  };

  const deselectAllPhotos = () => {
    setSelectedPhotos(new Set());
  };

  const handleDownloadSelected = async () => {
    if (selectedPhotos.size === 0) return;

    const photosToDownload = gallery.filter(p => selectedPhotos.has(p.id));
    setDownloadModal({ show: true, downloading: false, progress: 0, total: photosToDownload.length });
  };

  const startDownloadSelected = async () => {
    const photosToDownload = gallery.filter(p => selectedPhotos.has(p.id));
    const total = photosToDownload.length;
    setDownloadModal({ show: true, downloading: true, progress: 0, total });

    let downloaded = 0;
    for (const photo of photosToDownload) {
      try {
        await handleDownload(photo);
        downloaded++;
        setDownloadModal({ show: true, downloading: true, progress: downloaded, total });
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error descargando foto ${photo.id}:`, error);
      }
    }

    setDownloadModal({ show: true, downloading: false, progress: downloaded, total, completed: true });
    setSelectedPhotos(new Set());
    setSelectionMode(false);
  };

  const filteredGuests = guests.filter((g) => {
    if (filter === "all") return true;
    if (filter === "confirmed") return g.attending === true;
    if (filter === "declined") return g.attending === false;
    if (filter === "pending") return g.attending === null;
    if (filter === "pasta") return g.attending === true && g.foodPreference === "pasta";
    if (filter === "carne") return g.attending === true && g.foodPreference === "carne";
    if (filter === "no-preference") return g.attending === true && !g.foodPreference;
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

  // Estadísticas de preferencias de comida (solo para filtros internos)
  const pastaCount = guests.filter((g) => g.attending === true && g.foodPreference === "pasta").length;
  const carneCount = guests.filter((g) => g.attending === true && g.foodPreference === "carne").length;

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
          <div className="admin-filters__row">
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
          <button
            className={`filter-btn filter-btn--pasta ${filter === "pasta" ? "filter-btn--active" : ""}`}
            onClick={() => setFilter("pasta")}
          >
            Pasta ({pastaCount})
          </button>
          <button
            className={`filter-btn filter-btn--carne ${filter === "carne" ? "filter-btn--active" : ""}`}
            onClick={() => setFilter("carne")}
          >
            Carne ({carneCount})
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
          {filter !== "gallery" && ((filter === "notes" && notes.length > 0) || (filter !== "notes" && filteredGuests.length > 0)) && (
            <button
              className="admin-download-btn"
              onClick={filter === "notes" ? downloadNotesPDF : downloadGuestsPDF}
              title={filter === "notes" ? "Descargar mensajes en PDF" : "Descargar lista en PDF"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Descargar PDF
            </button>
          )}
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
                    {selectionMode && selectedPhotos.size > 0 && (
                      <span className="admin-gallery-header__selected">
                        {selectedPhotos.size} seleccionadas
                      </span>
                    )}
                  </h3>
                  <div className="admin-gallery-header__actions">
                    {!selectionMode ? (
                      <>
                        <button
                          className="admin-gallery-header__btn admin-gallery-header__btn--select"
                          onClick={toggleSelectionMode}
                          title="Seleccionar fotos"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Seleccionar
                        </button>
                        <button
                          className="admin-gallery-header__btn admin-gallery-header__btn--download"
                          onClick={handleDownloadAll}
                          title="Descargar todas las fotos y videos"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Todas
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="admin-gallery-header__btn admin-gallery-header__btn--secondary"
                          onClick={selectedPhotos.size === gallery.length ? deselectAllPhotos : selectAllPhotos}
                          title={selectedPhotos.size === gallery.length ? "Deseleccionar todas" : "Seleccionar todas"}
                        >
                          {selectedPhotos.size === gallery.length ? "Deseleccionar todas" : "Seleccionar todas"}
                        </button>
                        <button
                          className="admin-gallery-header__btn admin-gallery-header__btn--download"
                          onClick={handleDownloadSelected}
                          disabled={selectedPhotos.size === 0}
                          title="Descargar seleccionadas"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Descargar ({selectedPhotos.size})
                        </button>
                        <button
                          className="admin-gallery-header__btn admin-gallery-header__btn--cancel"
                          onClick={toggleSelectionMode}
                          title="Cancelar selección"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="admin-gallery-grid">
                {gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className={`gallery-photo-card ${selectionMode ? 'gallery-photo-card--selectable' : ''} ${selectedPhotos.has(photo.id) ? 'gallery-photo-card--selected' : ''}`}
                    onClick={() => selectionMode ? togglePhotoSelection(photo.id) : setSelectedPhoto(photo)}
                  >
                    {selectionMode && (
                      <div className="gallery-photo-card__checkbox">
                        <input
                          type="checkbox"
                          checked={selectedPhotos.has(photo.id)}
                          onChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="gallery-photo-card__checkbox-custom">
                          {selectedPhotos.has(photo.id) && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>
                    )}
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
                  <th>Preferencia</th>
                  <th>Grupo</th>
                  <th>Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-table__empty">
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
                      <td className="admin-table__food">
                        {guest.attending === true ? (
                          guest.foodPreference ? (
                            <span className={`food-badge food-badge--${guest.foodPreference}`}>
                              {guest.foodPreference === "pasta" ? "Pasta" : "Carne"}
                            </span>
                          ) : (
                            <span className="text-muted">Sin especificar</span>
                          )
                        ) : (
                          <span className="text-muted">-</span>
                        )}
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

      {/* Download All Modal */}
      {downloadModal.show && (
        <div className="download-modal" onClick={downloadModal.downloading ? null : closeDownloadModal}>
          <div className="download-modal__content" onClick={(e) => e.stopPropagation()}>
            {!downloadModal.downloading && !downloadModal.completed ? (
              /* Confirmación */
              <>
                <div className="download-modal__icon">📥</div>
                <h3 className="download-modal__title">
                  {selectedPhotos.size > 0 && selectionMode ? 'Descargar Fotos Seleccionadas' : 'Descargar Todas las Fotos'}
                </h3>
                <p className="download-modal__message">
                  ¿Deseas descargar {selectedPhotos.size > 0 && selectionMode ? `las ${downloadModal.total} fotos seleccionadas` : `todas las ${downloadModal.total} fotos y videos`}?
                  <br />
                  Esto puede tomar algunos minutos.
                </p>
                <div className="download-modal__actions">
                  <button className="download-modal__btn download-modal__btn--cancel" onClick={closeDownloadModal}>
                    Cancelar
                  </button>
                  <button
                    className="download-modal__btn download-modal__btn--confirm"
                    onClick={selectedPhotos.size > 0 && selectionMode ? startDownloadSelected : startDownloadAll}
                  >
                    Descargar
                  </button>
                </div>
              </>
            ) : downloadModal.downloading ? (
              /* Descargando */
              <>
                <div className="download-modal__spinner"></div>
                <h3 className="download-modal__title">Descargando...</h3>
                <p className="download-modal__message">
                  {downloadModal.progress} de {downloadModal.total} archivos descargados
                </p>
                <div className="download-modal__progress">
                  <div
                    className="download-modal__progress-bar"
                    style={{ width: `${(downloadModal.progress / downloadModal.total) * 100}%` }}
                  ></div>
                </div>
                <p className="download-modal__note">Por favor no cierres esta ventana</p>
              </>
            ) : (
              /* Completado */
              <>
                <div className="download-modal__icon download-modal__icon--success">✓</div>
                <h3 className="download-modal__title">Descarga Completada</h3>
                <p className="download-modal__message">
                  Se han descargado {downloadModal.progress} de {downloadModal.total} archivos exitosamente.
                </p>
                <div className="download-modal__actions">
                  <button className="download-modal__btn download-modal__btn--confirm" onClick={closeDownloadModal}>
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
