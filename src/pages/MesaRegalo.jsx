// src/sections/GiftsSection.jsx
import { useEffect, useState } from "react";
import "../components/Styles/Gifts.css";
import simanImg from "../assets/siman.png";
import porticoImg from "../assets/portico.png";

/* ========= Modal elegante ========= */
function Modal({
  open,
  onClose,
  title,
  subtitle,
  logo,            // opcional: imagen del logo
  children,
  actions = [],    // [{label, onClick, variant:'primary'|'ghost', href}]
}) {
  useEffect(() => {
    function onEsc(e) { if (e.key === "Escape") onClose?.(); }
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modalX__backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modalX__card" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modalX__glow" aria-hidden="true" />
        <header className="modalX__header">
          {logo && <img src={logo} alt="" className="modalX__logo" />}
          <div className="modalX__titles">
            <h3 className="modalX__title">{title}</h3>
            {subtitle && <p className="modalX__subtitle">{subtitle}</p>}
          </div>
          <button className="modalX__close" onClick={onClose} aria-label="Cerrar">×</button>
        </header>
        <div className="modalX__body">{children}</div>
        {actions.length > 0 && (
          <footer className="modalX__footer">
            {actions.map((a, i) =>
              a.href ? (
                <a
                  key={i}
                  className={`modalX__btn ${a.variant === "ghost" ? "is-ghost" : ""}`}
                  href={a.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {a.label}
                </a>
              ) : (
                <button
                  key={i}
                  className={`modalX__btn ${a.variant === "ghost" ? "is-ghost" : ""}`}
                  onClick={a.onClick}
                >
                  {a.label}
                </button>
              )
            )}
          </footer>
        )}
      </div>
    </div>
  );
}

/* Copiar con feedback */
function CopyRow({ value, label }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  return (
    <div className="copyRow">
      {label && <span className="copyRow__label">{label}</span>}
      <b className="mono">{value}</b>
      <button className={`chip ${copied ? "is-ok" : ""}`} onClick={copy}>
        {copied ? "Copiado ✓" : "Copiar"}
      </button>
    </div>
  );
}

export default function GiftsSection() {
  const [openModal, setOpenModal] = useState(null);

  // Links reales / placeholders
  const SIMAN_URL = "https://simangiftregistry.web.app/table/10016317";
  // Por ahora, usar el mismo enlace para Pórtico (lo cambiarás cuando lo tengas).
  const PORTICO_URL = "https://www.porticoreal.com.sv/boda-pocasangre-portillo-martin-valeria-te-15-de-noviembre-de-2025";

  const BANK = {
    name: "Banco Agrícola",
    holder: "Pocasangre Portillo",
    account: "000-123456-7",
    type: "Ahorros",
    reference: "Boda Pocasangre Portillo",
  };

  return (
    <section id="regalos" className="gifts">
      {/* Título superior */}
      <h2 className="gifts__title">MUESTRA DE CARIÑO</h2>

      <div className="gifts__stack">
        {/* SIMAN */}
        <div className="gifts__card">
          <img src={simanImg} alt="Siman" className="gifts__logo" />
          <p className="gifts__hl">Pocasangre Portillo</p>
          <p className="gifts__hl">10016317</p>
          <button className="gifts__button" onClick={() => setOpenModal("siman")}>
            VER MESA
          </button>
        </div>

        {/* PÓRTICO REAL */}
        <div className="gifts__card">
          <img src={porticoImg} alt="Pórtico Real" className="gifts__logo" />
          <p className="gifts__hl">Boda Pocasangre Portillo</p>
          <button className="gifts__button" onClick={() => setOpenModal("portico")}>
            VER MESA
          </button>
        </div>

        {/* BANCO AGRÍCOLA */}
        <div className="gifts__card gifts__card--bank">
          <p className="gifts__hl">Banco Agrícola</p>
          <p className="gifts__hl">n° de cuenta</p>
          <button className="gifts__button" onClick={() => setOpenModal("bank")}>
            Ver detalles
          </button>
        </div>
      </div>

      {/* MODALES */}
      <Modal
        open={openModal === "siman"}
        onClose={() => setOpenModal(null)}
        title="Mesa SIMAN"
        subtitle="Código de mesa 10016317"
        logo={simanImg}
        actions={[
          { label: "Abrir en Siman", href: SIMAN_URL },
          { label: "Cerrar", onClick: () => setOpenModal(null), variant: "ghost" },
        ]}
      >
        <p className="modalX__text">
          Puedes seleccionar nuestro obsequio directamente en la mesa de Siman.
       
        </p>
        <div className="modalX__group">
          <CopyRow label="Código" value="10016317" />
          <CopyRow label="Enlace" value={SIMAN_URL} />
        </div>
      </Modal>

      <Modal
        open={openModal === "portico"}
        onClose={() => setOpenModal(null)}
        title="PÓRTICO REAL"
        subtitle="Boda Pocasangre Portillo"
        logo={porticoImg}
        actions={[
          { label: "Abrir en Pórtico", href: PORTICO_URL },
          { label: "Cerrar", onClick: () => setOpenModal(null), variant: "ghost" },
        ]}
      >
        <p className="modalX__text">
          Puedes seleccionar nuestro obsequio directamente en la mesa de Pórtico Real.
          
        </p>
        <div className="modalX__group">
          <CopyRow label="Enlace" value={PORTICO_URL} />
        </div>
      </Modal>

      <Modal
        open={openModal === "bank"}
        onClose={() => setOpenModal(null)}
        title={BANK.name}
        subtitle="Datos para transferencia"
        actions={[
          { label: "Cerrar", onClick: () => setOpenModal(null), variant: "ghost" },
        ]}
      >
        <ul className="bank__list">
          <li><span>Titular</span><b>{BANK.holder}</b></li>
          <li><span>Tipo</span><b>{BANK.type}</b></li>
          <li>
            <span>N° de cuenta</span>
            <CopyRow value={BANK.account} />
          </li>
          <li><span>Referencia</span><b>{BANK.reference}</b></li>
        </ul>
      </Modal>
    </section>
  );
}
