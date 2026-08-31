"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

interface ProprietesIntro {
  auTermine: () => void;
}

export const EcranChargementIntro: React.FC<ProprietesIntro> = ({ auTermine }) => {
  const { reglages } = useAppStore();
  const [phase, setPhase] = useState<"centre" | "zoom" | "disparition">("centre");

  const sourceVideo =
    reglages.urlVideoHero ||
    "https://assets.mixkit.co/videos/preview/mixkit-clear-water-in-a-lake-1199-large.mp4";

  useEffect(() => {
    // Déclenchement automatique du zoom après 1.4s
    const minuteurZoom = setTimeout(() => {
      setPhase("zoom");
    }, 1400);

    // 2. fondu de sortie à 2.6s
    const minuteurSortie = setTimeout(() => {
      setPhase("disparition");
    }, 2600);

    // 3. Fin de l'animation à 3.1s
    const minuteurFin = setTimeout(() => {
      auTermine();
    }, 3100);

    return () => {
      clearTimeout(minuteurZoom);
      clearTimeout(minuteurSortie);
      clearTimeout(minuteurFin);
    };
  }, [auTermine]);

  if (phase === "disparition") {
    // Phase de fondu final
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050811] overflow-hidden transition-opacity duration-500 ease-out ${
        phase === "disparition" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
          phase === "zoom" ? "opacity-100 scale-100" : "opacity-0 scale-110"
        }`}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={sourceVideo} type="video/mp4" />
        </video>
        {/* Voile de transition vers le site */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050811]/60 via-transparent to-[#050811]" />
      </div>

      <div
        className={`relative z-20 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
          phase === "zoom"
            ? "scale-[18] sm:scale-[25] opacity-0"
            : "scale-100 opacity-100"
        }`}
      >
        <div className="relative overflow-hidden px-4">
          <h1
            className="text-8xl sm:text-9xl font-black tracking-tighter uppercase leading-none select-none text-transparent bg-clip-text bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&fit=crop')`,
              WebkitBackgroundClip: "text",
            }}
          >
            {reglages.nom}
          </h1>

          <div className="text-8xl sm:text-9xl font-black tracking-tighter uppercase leading-none absolute inset-0 text-cyan-400/20 pointer-events-none -z-10 blur-[1px]">
            {reglages.nom}
          </div>
        </div>

        <p
          className={`mt-3 text-[11px] font-extrabold tracking-[0.3em] uppercase text-cyan-400/80 transition-opacity duration-300 ${
            phase === "zoom" ? "opacity-0" : "opacity-100"
          }`}
        >
         Elevés avec Soins, Distribués avec Passion
        </p>

        <div
          className={`mt-6 w-16 h-1 bg-slate-800 rounded-full overflow-hidden transition-opacity duration-300 ${
            phase === "zoom" ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-full h-full bg-[#00d2ff] animate-[pulse_1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default EcranChargementIntro;