import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { animate, createTimeline } from "animejs";
import "../components/Styles/Board.css";

function usePinterestScript() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const src = "https://assets.pinterest.com/js/pinit.js";
    if (document.querySelector(`script[src="${src}"]`)) {
      if (window.PinUtils?.build) setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => setReady(true);
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    if (ready) window.PinUtils?.build?.();
  }, [ready]);

  return ready;
}

export default function Board() {
  const navigate = useNavigate();
  usePinterestScript();

  const headerRef = useRef(null);
  const btnRef = useRef(null);
  const titleRef = useRef(null);
  const mainRef = useRef(null);

  const BOARD_URL = "https://www.pinterest.com/vportilloc/inspo-de-outfits-de-boda/";

  // Animaciones al montar el componente
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const timeline = createTimeline({
      defaults: {
        ease: "out(3)"
      }
    });

    // Anima el header bajando
    timeline.add(headerRef.current, {
      opacity: [0, 1],
      translateY: [-60, 0],
      duration: isMobile ? 700 : 600
    }, 0);

    // Anima el botón
    timeline.add(btnRef.current, {
      opacity: [0, 1],
      translateX: isMobile ? [-80, 0] : [-50, 0],
      scale: isMobile ? [0.8, 1] : [1, 1],
      duration: isMobile ? 600 : 500
    }, 200);

    // Anima el título
    timeline.add(titleRef.current, {
      opacity: [0, 1],
      scale: isMobile ? [0.8, 1] : [0.9, 1],
      duration: isMobile ? 600 : 500
    }, 300);

    // Anima el contenido principal
    timeline.add(mainRef.current, {
      opacity: [0, 1],
      translateY: isMobile ? [80, 0] : [50, 0],
      scale: isMobile ? [0.9, 1] : [0.95, 1],
      duration: isMobile ? 900 : 800
    }, 400);

    // Efecto de hover continuo en el botón (solo móvil)
    if (isMobile) {
      setTimeout(() => {
        animate(btnRef.current, {
          scale: [1, 1.05, 1],
          duration: 2000,
          loop: true,
          ease: "inOut(2)"
        });
      }, 1500);
    }
  }, []);

  return (
    <div className="boardPage">
      <header ref={headerRef} className="boardHeader" style={{ opacity: 0 }}>
        <button
          ref={btnRef}
          className="boardBackBtn"
          onClick={() => navigate(-1)}
          style={{ opacity: 0 }}
        >
          ← Volver
        </button>
        <h1 ref={titleRef} style={{ opacity: 0 }}>Ideas de vestimenta</h1>
      </header>

      <main ref={mainRef} className="boardMain" style={{ opacity: 0 }}>
        <a
          data-pin-do="embedBoard"
          href={BOARD_URL}
          data-pin-board-width="1200"
          data-pin-scale-height="700"
          data-pin-scale-width="140"
        ></a>
        <noscript>
          Ver en Pinterest: <a href={BOARD_URL}>inspo-de-outfits-de-boda</a>
        </noscript>
      </main>
    </div>
  );
}
