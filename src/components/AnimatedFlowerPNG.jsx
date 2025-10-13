// src/components/AnimatedFlowerPNG.jsx
// VERSIÓN DEBUG SIMPLIFICADA
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
        maxWidth: '400px', // Limita el ancho para que no sea gigante
        zIndex: 1,
        pointerEvents: 'none',
        border: '2px solid red' // 🔴 TEMPORAL: borde rojo para ver dónde está
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
      
      {/* Indicador visual que está funcionando */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(255, 0, 0, 0.8)',
        color: 'white',
        padding: '5px 10px',
        fontSize: '12px',
        borderRadius: '4px',
        zIndex: 1000
      }}>
        Flor {side}
      </div>
    </div>
  );
}