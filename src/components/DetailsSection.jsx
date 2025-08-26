import "./Styles/DetailsSection.css";

export default function DetailsSection() {
  return (
    <section id="detalle" className="details">
      <div className="details__grid">
        {/* Placeholder gris (reemplazar por imagen luego) */}
        <div className="details__ph" aria-label="Foto del lugar (próximamente)" />

        {/* Contenido derecho */}
        <div className="details__content">
          <h2 className="details__title">DETALLES DE NUESTRA BODA</h2>

          <div className="details__block">
            <div className="details__time">2:00 PM</div>
            <div className="details__place">CEREMONIA RELIGIOSA</div>
            <div className="details__venue">MONTELENA</div>
            <div className="details__address">
              Sur, Urbanización, Bulevar Orden De Malta Final, 1502
            </div>
          </div>

          <div className="details__block">
            <div className="details__time">4:00 PM</div>
            <div className="details__place">RECEPCIÓN</div>
            <div className="details__venue">FORET · COMASAGUA</div>
            <div className="details__address">
              Desvío El Limón, Calle a Comasagua, Santa Tecla 1506
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
