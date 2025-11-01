import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllGuests, getAllNotes } from "../api";
import "./Styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [guests, setGuests] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, confirmed, pending, declined, notes
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
      console.log("Primera nota:", notesData[0]);
      setGuests(guestsData);
      setNotes(notesData);
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
        <div className="admin-stats">
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
        </div>

        {/* Content Area - Table or Notes */}
        {filter === "notes" ? (
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
    </div>
  );
}
