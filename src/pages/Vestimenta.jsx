import { useEffect, useRef, useState } from "react";
import { createTimeline, stagger } from "animejs";
import "../components/Styles/Vestimenta.css";

export default function Vestimenta() {
  const [pinterestReady, setPinterestReady] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Dimensiones + recuento exacto de columnas/filas
  const [boardDims, setBoardDims] = useState({
    width: 960,
    scaleWidth: 180,
    scaleHeight: 240,
    cols: 3,
    rows: 4,
  });

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ruleRef = useRef(null);
  const noteRef = useRef(null);
  const leadRef = useRef(null);
  const cardRef = useRef(null);

  const hiddenUntilAnimatedStyle = hasAnimated ? undefined : { opacity: 0 };

  // 1) Cargar Pinterest una sola vez
  useEffect(() => {
    const src = "https://assets.pinterest.com/js/pinit.js";
    if (document.querySelector(`script[src="${src}"]`)) {
      if (window.PinUtils?.build) setPinterestReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => setPinterestReady(true);
    document.body.appendChild(s);
  }, []);

  // 2) Cálculo responsivo CONTINUO: columnas y filas “reales”
  useEffect(() => {
    let t;

    const computeDims = () => {
      const vw = window.innerWidth || 0;
      const vh = window.innerHeight || 0;

      // Gutter para no pegarse a los bordes
      const horizontalGutter =
        vw >= 1920 ? 220 :
        vw >= 1600 ? 180 :
        vw >= 1366 ? 140 :
        vw >= 1024 ? 120 :
        vw >=  768 ? 100 : 64;

      // Ancho máximo del board (suficiente para ultrawide)
      const maxWidth = 2800;
      const minWidth = 520;
      const width = Math.round(Math.min(maxWidth, Math.max(minWidth, vw - horizontalGutter)));

      // Target de tamaño de “celda” (pin) para derivar columnas
      const cellTarget =
        vw >= 3000 ? 140 :
        vw >= 2560 ? 150 :
        vw >= 1920 ? 170 :
        vw >= 1440 ? 190 :
        vw >= 1280 ? 210 : 220;

      // COLS: aprox. anchoBoard / anchoCelda
      const cols = Math.max(2, Math.min(16, Math.floor(width / cellTarget)));

      // scaleWidth que enviamos al embed = anchoBoard / cols (con límites de seguridad)
      const SCALE_MIN = 64;
      const SCALE_MAX = 360;
      const scaleWidth = Math.max(SCALE_MIN, Math.min(SCALE_MAX, Math.round(width / cols)));

      // Relación de alto de un “tile” (Pinterest hace masonry, esto es una guía sólida)
      const ratio = vw >= 1024 ? 2.5 : 1.8; // alto ≈ scaleWidth * ratio

      // Alto “deseado” del board:
      const baseBoardH = Math.round(vh * (vw >= 1024 ? 0.95 : 0.9));
      const boost = Math.round((Math.max(cols - 4, 0) * 0.35 + 1) * scaleWidth * ratio);

      const targetBoardH = Math.max(520, Math.min(3600, Math.max(baseBoardH, boost)));
      const cellHeight = scaleWidth * ratio;
      const rows = Math.max(3, Math.min(14, Math.floor(targetBoardH / cellHeight)));

      // scaleHeight final que enviamos al embed (ligero margen para no cortar)
      const scaleHeight = Math.round(Math.min(4000, rows * cellHeight * 1.02));

      setBoardDims(prev => {
        if (
          prev.width === width &&
          prev.scaleWidth === scaleWidth &&
          prev.scaleHeight === scaleHeight &&
          prev.cols === cols &&
          prev.rows === rows
        ) return prev;
        return { width, scaleWidth, scaleHeight, cols, rows };
      });
    };

    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(computeDims, 120); // debounce
    };

    computeDims();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // 3) Build inicial del embed (si no hay iframe aún)
  useEffect(() => {
    if (!pinterestReady || !cardRef.current) return;
    const hasIframe = !!cardRef.current.querySelector("iframe");
    if (!hasIframe) window.PinUtils?.build?.();
  }, [pinterestReady]);

  // 4) Rebuild cuando cambian cols o rows (sin necesidad de recargar)
  useEffect(() => {
    if (!pinterestReady || !cardRef.current) return;

    const container = cardRef.current;
    const lastCols = container.dataset.cols;
    const lastRows = container.dataset.rows;

    const colsChanged = String(boardDims.cols) !== lastCols;
    const rowsChanged = String(boardDims.rows) !== lastRows;

    if (colsChanged || rowsChanged) {
      container.dataset.cols = String(boardDims.cols);
      container.dataset.rows = String(boardDims.rows);

      let t;
      const safeRebuild = () => {
        container.querySelectorAll("iframe").forEach((ifr) => ifr.remove());
        window.PinUtils?.build?.();
      };
      clearTimeout(t);
      t = setTimeout(safeRebuild, 80);
      return () => clearTimeout(t);
    }
  }, [pinterestReady, boardDims.cols, boardDims.rows]);

  // 5) Forzar ancho 100% del iframe sin reconstruir
  useEffect(() => {
    if (!pinterestReady) return;

    const ensureFullWidth = () => {
      const host = cardRef.current;
      if (!host) return;
      const nodes = host.querySelectorAll("div, iframe");
      nodes.forEach((el) => {
        el.style.width = "100%";
        el.style.maxWidth = "100%";
        el.removeAttribute("width");
      });
    };

    let observer;
    if (typeof MutationObserver !== "undefined" && cardRef.current) {
      observer = new MutationObserver(ensureFullWidth);
      observer.observe(cardRef.current, { childList: true, subtree: true });
    }

    ensureFullWidth();
    window.addEventListener("resize", ensureFullWidth);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", ensureFullWidth);
    };
  }, [pinterestReady]);

  // 6) Animaciones
  useEffect(() => {
    if (hasAnimated) return;

    const isMobile = window.innerWidth < 768;
    const target = document.getElementById("vestimenta");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const timeline = createTimeline({ defaults: { ease: "out(4)" } });

            // Anima el título con efecto de letras (igual que MesaRegalo)
            if (titleRef.current) {
              const titleChars = titleRef.current.textContent.split("");
              titleRef.current.innerHTML = titleChars
                .map(
                  (c) =>
                    `<span class="char" style="display:inline-block;opacity:0">${
                      c === " " ? "&nbsp;" : c
                    }</span>`
                )
                .join("");

              timeline.add(
                titleRef.current.querySelectorAll(".char"),
                {
                  opacity: [0, 1],
                  translateY: isMobile ? [-30, 0] : [-50, 0],
                  rotateX: [90, 0],
                  duration: isMobile ? 600 : 800,
                  delay: stagger(isMobile ? 30 : 50),
                  ease: "out(3)",
                },
                0
              );
            }

            timeline.add(
              subtitleRef.current,
              {
                opacity: [0, 1],
                translateY: isMobile ? [40, 0] : [30, 0],
                scale: isMobile ? [0.9, 1] : [0.95, 1],
                duration: isMobile ? 700 : 600,
              },
              isMobile ? 400 : 500
            );

            // Anima la línea decorativa (igual que en MesaRegalo)
            if (ruleRef.current) {
              timeline.add(
                ruleRef.current,
                { opacity: [0, 1], scaleX: [0, 1], duration: isMobile ? 600 : 500 },
                isMobile ? 600 : 700
              );
            }

            timeline.add(
              noteRef.current,
              {
                opacity: [0, 1],
                translateX: isMobile ? [-50, 0] : [-30, 0],
                duration: isMobile ? 600 : 500,
              },
              isMobile ? 700 : 800
            );

            timeline.add(
              leadRef.current,
              {
                opacity: [0, 1],
                translateY: isMobile ? [20, 0] : [15, 0],
                duration: isMobile ? 600 : 500,
              },
              isMobile ? 800 : 900
            );

            timeline.add(
              cardRef.current,
              {
                opacity: [0, 1],
                translateY: isMobile ? [100, 0] : [80, 0],
                rotateX: [45, 0],
                scale: [0.8, 1],
                duration: isMobile ? 1000 : 900,
                ease: "out(4)",
              },
              isMobile ? 900 : 1000
            );
          }
        });
      },
      { threshold: isMobile ? 0.1 : 0.2, rootMargin: "0px 0px -20% 0px" }
    );

    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="vestimenta" className="vst">
      <div className="vst__container">
        <header className="v-header">
          <h1 ref={titleRef} className="v-title">
            VESTIMENTA
          </h1>
          <h2 ref={subtitleRef} className="v-subtitle" style={{ opacity: 0 }}>
            Etiqueta <span className="v-subtle">(Black Tie)</span>
          </h2>
          <div ref={ruleRef} className="v-rule" style={{ opacity: 0 }} />
        </header>

        <p ref={noteRef} className="v-note" style={{ opacity: 0 }}>
          Invitadas:
          <span className="v-chip">Agradecemos evitar vestidos color negro</span>
        </p>
        <p ref={leadRef} className="v-lead" style={{ opacity: 0 }}>
          Para inspirarse, les dejamos algunas ideas:
        </p>

        <div
          ref={cardRef}
          className="vst__pinterestBoard"
          data-cols={boardDims.cols}
          data-rows={boardDims.rows}
          style={{ opacity: 0 }}
        >
          <a
            data-pin-do="embedBoard"
            data-pin-board-width={boardDims.width}
            data-pin-scale-height={boardDims.scaleHeight}
            data-pin-scale-width={boardDims.scaleWidth}
            href="https://www.pinterest.com/vportilloc/inspo-de-outfits-de-boda/"
            style={{ display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}
