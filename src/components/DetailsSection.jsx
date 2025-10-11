import { useState, useEffect, useMemo } from "react";

import img1 from "../assets/1.png";
import img2 from "../assets/2.png";
import img3 from "../assets/3.png";
import img4 from "../assets/4.png";
import img5 from "../assets/5.png";

export default function DetailsSection({ countdown }) {
  const images = useMemo(() => [img1, img2, img3, img4, img5], []);

  const [steps, setSteps] = useState(0);
  const theta = 360 / images.length;
  const angle = -(steps * theta);

  useEffect(() => {
    const id = setInterval(() => {
      setSteps((s) => s + 1);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto overflow-x-hidden">
      {/* Countdown */}
      <div className="text-center text-black mt-10">
        <div className="text-lg font-light">YA SOLO FALTAN</div>
        <div className="grid grid-cols-4 justify-center items-start gap-x-4 mt-4">
          <div className="relative px-2">
            <div className="text-2xl md:text-3xl font-light">{countdown.days}</div>
            <div className="text-xs md:text-sm uppercase font-medium">DÍAS</div>
            <span className="absolute right-0 top-0 hidden md:inline">:</span>
          </div>
          <div className="relative px-2">
            <div className="text-2xl md:text-3xl font-light">{countdown.hours}</div>
            <div className="text-xs md:text-sm uppercase font-medium">HORAS</div>
            <span className="absolute right-0 top-0 hidden md:inline">:</span>
          </div>
          <div className="relative px-2">
            <div className="text-2xl md:text-3xl font-light">{countdown.minutes}</div>
            <div className="text-xs md:text-sm uppercase font-medium">MINUTOS</div>
            <span className="absolute right-0 top-0 hidden md:inline">:</span>
          </div>
          <div className="px-2">
            <div className="text-2xl md:text-3xl font-light">{countdown.seconds}</div>
            <div className="text-xs md:text-sm uppercase font-medium">SEGUNDOS</div>
          </div>
        </div>
      </div>

      <section id="detalle" className="mt-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Carrusel con Tailwind */}
          <div className="w-full overflow-visible">
            <div
              className="relative w-full h-[400px] md:h-[522px] perspective-[1000px]"
              style={{
                "--count": images.length,
                "--theta": `${theta}deg`,
                "--rot": `${angle}deg`,
              }}
            >
              <div className="absolute inset-0 transform-style-preserve-3d transition-transform duration-900 ease-[cubic-bezier(.2,.6,.2,1)]"
                   style={{
                     transform: `translateZ(calc(-1 * var(--radius))) rotateY(var(--rot))`,
                     '--radius': 'clamp(250px, 65vw, 420px)'
                   }}
              >
                {images.map((src, i) => (
                  <span
                    key={i}
                    style={{ "--i": i }}
                    className="absolute inset-0 transform-style-preserve-3d
                               transition-none"
                  >
                    <img
                      src={src}
                      alt={`slide ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
                      style={{
                        transform: `rotateY(calc(var(--i) * var(--theta))) translateZ(var(--radius)) scale(0.85)`
                      }}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Contenido derecho */}
          <div className="flex flex-col justify-center text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-pink-600 mb-4">DETALLES DE NUESTRA BODA</h2>

            <div className="mt-6">
              <div className="mb-8">
                <div className="text-lg font-semibold uppercase text-pink-600">Ceremonia religiosa</div>
                <div className="text-xl font-semibold text-pink-700 my-1">2:00 PM</div>
                <div className="uppercase">Parroquia San Benito</div>
                <div className="mt-1 text-base">Iglesia La Capilla, Avenida La Capilla 711, San Salvador</div>
                <a
                  href="https://www.waze.com/live-map/directions/sv/san-salvador/san-salvador/iglesia-la-capilla?to=place.ChIJkVhGdyUwY48RuEP3VmAiOCo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition"
                >
                  WAZE
                </a>
              </div>

              <div>
                <div className="text-lg font-semibold uppercase text-pink-600">Recepción</div>
                <div className="text-xl font-semibold text-pink-700 my-1">4:00 PM</div>
                <div className="uppercase">Il Buongustaio</div>
                <div className="mt-1 text-base">Bulevar Del Hipodromo 605, San Salvador</div>
                <a
                  href="https://www.waze.com/live-map/directions/sv/la-libertad-department/san-salvador/il-buongustaio?to=place.ChIJrXiJ9CgwY48R6YoBn-pWz_0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition"
                >
                  WAZE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
