import { useOrientationLock } from "../utils/useOrientationLock";
import "../styles/orientation-lock.css";

export default function OrientationLock({ children, maxDimension }) {
  const isOrientationBlocked = useOrientationLock({ maxDimension });

  return (
    <>
      <div
        className="orientation-lock__content"
        aria-hidden={isOrientationBlocked || undefined}
      >
        {children}
      </div>
      {isOrientationBlocked && (
        <div
          className="orientation-lock__overlay"
          role="alert"
          aria-live="assertive"
        >
          <div className="orientation-lock__inner">
            <p className="orientation-lock__title">Gira tu dispositivo</p>
            <p className="orientation-lock__text">Esta experiencia solo esta disponible en orientacion vertical.</p>
          </div>
        </div>
      )}
    </>
  );
}
