import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const BOARD_URL = "https://www.pinterest.com/vportilloc/inspo-de-outfits-de-boda/";

  return (
    <div className="boardPage">
      <header className="boardHeader">
        <button className="boardBackBtn" onClick={() => navigate(-1)}>← Volver</button>
        <h1>Ideas de vestimenta</h1>
      </header>

      <main className="boardMain">
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
