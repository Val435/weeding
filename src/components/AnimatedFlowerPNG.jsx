// src/components/AnimatedFlowerPNG.jsx
import { useEffect, useRef } from 'react';
import florIzq from "../assets/florIzq.png";
import florDer from "../assets/florDer.png";
import './Styles/AnimatedFlowerPNG.css';

export default function AnimatedFlowerPNG({ side = 'left', className = '' }) {
  const flowerRef = useRef(null);

  useEffect(() => {
    if (flowerRef.current) {
      // Inicia la animación después de un pequeño delay
      const timer = setTimeout(() => {
        flowerRef.current.classList.add('animated');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const imgSrc = side === 'left' ? florIzq : florDer;
  const positionClass = side === 'left' ? 'animated-flower-png--left' : 'animated-flower-png--right';

  return (
    <div 
      ref={flowerRef}
      className={`animated-flower-png ${positionClass} ${className}`}
      style={{ 
        position: 'absolute',
        top: 0,
        [side]: side === 'left' ? 0 : 0,
        height: '100%',
        width: 'auto',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      {/* Capa 1: Aparece de abajo hacia arriba */}
      <img 
        src={imgSrc} 
        alt="" 
        className="flower-layer flower-layer-1"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'top'
        }}
      />
      
      {/* Capa 2: Aparece con fade desde el centro */}
      <img 
        src={imgSrc} 
        alt="" 
        className="flower-layer flower-layer-2"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'top'
        }}
      />
      
      {/* Capa 3: Aparece de arriba hacia abajo */}
      <img 
        src={imgSrc} 
        alt="" 
        className="flower-layer flower-layer-3"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'top'
        }}
      />
    </div>
  );
}