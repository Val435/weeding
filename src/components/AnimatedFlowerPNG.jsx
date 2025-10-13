// src/components/AnimatedFlowerPNG.jsx
import { useEffect, useRef } from 'react';
import florIzq from "../assets/florIzq.png";
import florDer from "../assets/florDer.png";
import './Styles/AnimatedFlowerPNG.css';

export default function AnimatedFlowerPNG({ side = 'left' }) {
  const flowerRef = useRef(null);

  useEffect(() => {
    console.log(`🌸 Flor ${side} montada`);
    
    if (flowerRef.current) {
      setTimeout(() => {
        flowerRef.current.classList.add('animated');
        console.log(`✨ Animación iniciada en flor ${side}`);
      }, 500);
    }
  }, [side]);

  const imgSrc = side === 'left' ? florIzq : florDer;

  return (
    <div 
      ref={flowerRef}
      className={`animated-flower-png animated-flower-png--${side}`}
      style={{
        position: 'absolute',
        top: 0,
        [side]: 0,
        height: '100%',
        width: 'auto',
        maxWidth: '450px',
        zIndex: 2, // 👈 AUMENTADO: por encima del overlay (0) pero debajo del texto (2)
        pointerEvents: 'none',
        mixBlendMode: 'screen' // 👈 NUEVO: hace que se vea sobre el fondo verde
      }}
    >
      <img 
        src={imgSrc} 
        alt="" 
        className="flower-layer flower-layer-1"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'top'
        }}
      />
    </div>
  );
}