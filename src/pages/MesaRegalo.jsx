// src/sections/GiftsSection.jsx
import { useEffect, useState, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";
import "../components/Styles/Gifts.css";
import simanImg from "../assets/siman.png";
import porticoImg from "../assets/portico.png";
import avionImg from "../assets/avion.png";

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
  const backdropRef = useRef(null);
  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    function onEsc(e) { if (e.key === "Escape") onClose?.(); }
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // Animación de entrada del modal
  useEffect(() => {
    if (open && cardRef.current) {
      const timeline = createTimeline({
        defaults: {
          ease: "out(3)"
        }
      });

      // Anima el backdrop
      timeline.add(backdropRef.current, {
        opacity: [0, 1],
        duration: 300
      }, 0);

      // Anima la card con efecto dramático
      timeline.add(cardRef.current, {
        opacity: [0, 1],
        scale: [0.7, 1],
        rotateX: [90, 0],
        duration: 600,
        ease: "out(4)"
      }, 100);

      // Anima el header
      timeline.add(headerRef.current, {
        opacity: [0, 1],
        translateY: [-30, 0],
        duration: 500
      }, 400);

      // Anima el body
      timeline.add(bodyRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500
      }, 500);

      // Anima el footer si existe
      if (footerRef.current) {
        timeline.add(footerRef.current?.querySelectorAll(".modalX__btn"), {
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 400,
          delay: stagger(100)
        }, 600);
      }
    }
  }, [open]);

  if (!open) return null;
  return (
    <div ref={backdropRef} className="modalX__backdrop" role="dialog" aria-modal="true" onClick={onClose} style={{ opacity: 0 }}>
      <div ref={cardRef} className="modalX__card" role="document" onClick={(e) => e.stopPropagation()} style={{ opacity: 0 }}>
        <div className="modalX__glow" aria-hidden="true" />
        <header ref={headerRef} className="modalX__header" style={{ opacity: 0 }}>
          {logo && <img src={logo} alt="" className="modalX__logo" />}
          <div className="modalX__titles">
            <h3 className="modalX__title">{title}</h3>
            {subtitle && <p className="modalX__subtitle">{subtitle}</p>}
          </div>
          <button className="modalX__close" onClick={onClose} aria-label="Cerrar">×</button>
        </header>
        <div ref={bodyRef} className="modalX__body" style={{ opacity: 0 }}>{children}</div>
        {actions.length > 0 && (
          <footer ref={footerRef} className="modalX__footer">
            {actions.map((a, i) =>
              a.href ? (
                <a
                  key={i}
                  className={`modalX__btn ${a.variant === "ghost" ? "is-ghost" : ""}`}
                  href={a.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ opacity: 0 }}
                >
                  {a.label}
                </a>
              ) : (
                <button
                  key={i}
                  className={`modalX__btn ${a.variant === "ghost" ? "is-ghost" : ""}`}
                  onClick={a.onClick}
                  style={{ opacity: 0 }}
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
  const [hasAnimated, setHasAnimated] = useState(false);

  const titleRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

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

  // Intersection Observer para animaciones épicas optimizadas para móvil
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const timeline = createTimeline({
              defaults: {
                ease: "out(4)"
              }
            });

            // Anima el título con efecto de letras (más rápido en móvil)
            const titleChars = titleRef.current.textContent.split('');
            titleRef.current.innerHTML = titleChars.map(char =>
              `<span class="char" style="display:inline-block;opacity:0">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');

            timeline.add(titleRef.current.querySelectorAll('.char'), {
              opacity: [0, 1],
              translateY: isMobile ? [-30, 0] : [-50, 0],
              rotateX: [90, 0],
              duration: isMobile ? 600 : 800,
              delay: stagger(isMobile ? 30 : 50),
              ease: "out(3)"
            }, 0);

            // Anima las tarjetas con efectos 3D espectaculares (más dramáticas en móvil)
            timeline.add(card1Ref.current, {
              opacity: [0, 1],
              translateY: isMobile ? [150, 0] : [100, 0],
              rotateY: [-90, 0],
              scale: [0.3, 1],
              duration: isMobile ? 900 : 1000,
              ease: "out(4)"
            }, isMobile ? 300 : 400);

            timeline.add(card2Ref.current, {
              opacity: [0, 1],
              translateY: isMobile ? [150, 0] : [100, 0],
              rotateY: [90, 0],
              scale: [0.3, 1],
              duration: isMobile ? 900 : 1000,
              ease: "out(4)"
            }, isMobile ? 450 : 600);

            timeline.add(card3Ref.current, {
              opacity: [0, 1],
              translateY: isMobile ? [150, 0] : [100, 0],
              rotateX: [90, 0],
              scale: [0.3, 1],
              duration: isMobile ? 900 : 1000,
              ease: "out(4)"
            }, isMobile ? 600 : 800);

            // Anima los logos con efecto de fade in
            timeline.add(card1Ref.current.querySelector('.gifts__logo'), {
              opacity: [0, 1],
              scale: [0.8, 1],
              duration: isMobile ? 800 : 700,
              ease: "out(3)"
            }, isMobile ? 800 : 1000);

            timeline.add(card2Ref.current.querySelector('.gifts__logo'), {
              opacity: [0, 1],
              scale: [0.8, 1],
              duration: isMobile ? 800 : 700,
              ease: "out(3)"
            }, isMobile ? 900 : 1100);

            timeline.add(card3Ref.current.querySelector('.gifts__logo'), {
              opacity: [0, 1],
              scale: [0.8, 1],
              duration: isMobile ? 800 : 700,
              ease: "out(3)"
            }, isMobile ? 1000 : 1200);

            // Anima los textos dentro de las tarjetas
            [card1Ref, card2Ref, card3Ref].forEach((cardRef, index) => {
              timeline.add(cardRef.current.querySelectorAll('.gifts__hl'), {
                opacity: [0, 1],
                translateX: isMobile ? [-50, 0] : [-30, 0],
                duration: 500,
                delay: stagger(100)
              }, 1200 + (index * 100));

              timeline.add(cardRef.current.querySelector('.gifts__button'), {
                opacity: [0, 1],
                scale: [0, 1],
                duration: 700,
                ease: "out(4)"
              }, 1400 + (index * 100));
            });

          }
        });
      },
      { threshold: isMobile ? 0.1 : 0.2 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="regalos" className="gifts">
      {/* Título superior */}
      <h2 ref={titleRef} className="gifts__title">MUESTRA DE CARIÑO</h2>

      <div className="gifts__stack">
        {/* SIMAN */}
        <div ref={card1Ref} className="gifts__card" style={{ opacity: 0 }}>
          <img src={simanImg} alt="Siman" className="gifts__logo" style={{ opacity: 0 }} />
          <p className="gifts__hl" style={{ opacity: 0 }}>Pocasangre Portillo</p>
          <p className="gifts__hl" style={{ opacity: 0 }}>10016317</p>
          <button className="gifts__button" onClick={() => setOpenModal("siman")} style={{ opacity: 0 }}>
            VER MESA
          </button>
        </div>

        {/* PÓRTICO REAL */}
        <div ref={card2Ref} className="gifts__card" style={{ opacity: 0 }}>
          <img src={porticoImg} alt="Pórtico Real" className="gifts__logo" style={{ opacity: 0 }} />
          <p className="gifts__hl" style={{ opacity: 0 }}>Boda Pocasangre Portillo</p>
          <button className="gifts__button" onClick={() => setOpenModal("portico")} style={{ opacity: 0 }}>
            VER MESA
          </button>
        </div>

        {/* HONEYMOON FUND */}
        <div ref={card3Ref} className="gifts__card" style={{ opacity: 0 }}>
          <img src={avionImg} alt="Honeymoon Fund" className="gifts__logo" style={{ opacity: 0 }} />
          <p className="gifts__hl" style={{ opacity: 0 }}>Honeymoon Fund</p>
          <p className="gifts__hl" style={{ opacity: 0 }}>0000000000</p>
          <button className="gifts__button" onClick={() => setOpenModal("bank")} style={{ opacity: 0 }}>
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
