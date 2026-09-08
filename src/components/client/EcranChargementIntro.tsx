"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

interface ProprietesIntro {
  auTermine: () => void;
}

export const EcranChargementIntro: React.FC<ProprietesIntro> = ({ auTermine }) => {
  const { reglages } = useAppStore();
  const [etatAnimation, setEtatAnimation] = useState<"attente" | "zoom" | "disparition">("attente");

  const sourceVideo =
    reglages.urlVideoHero ||
    "https://assets.mixkit.co/videos/preview/mixkit-clear-water-in-a-lake-1199-large.mp4";

  useEffect(() => {
    // 1. Début du zoom après 0,3 seconde
    const delaiZoom = setTimeout(() => {
      setEtatAnimation("zoom");
    }, 300);

    // 2. Fondu de sortie
    const delaiFondu = setTimeout(() => {
      setEtatAnimation("disparition");
    }, 3200);

    // 3. Fin complète
    const delaiFin = setTimeout(() => {
      auTermine();
    }, 1600);

    return () => {
      clearTimeout(delaiZoom);
      clearTimeout(delaiFondu);
      clearTimeout(delaiFin);
    };
  }, [auTermine]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050811] overflow-hidden transition-opacity duration-700 ease-out ${
        etatAnimation === "disparition" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div
        className={`relative w-full h-full flex items-center justify-center transition-transform duration-[2600ms] cubic-bezier(0.7, 0, 0.2, 1) ${
          etatAnimation === "zoom" ? "scale-[28] sm:scale-[38]" : "scale-100"
        }`}
        style={{ transformOrigin: "50% 50%" }}
      >
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <clipPath id="masque-logo-ds" clipPathUnits="objectBoundingBox">
              {/* Logo */}
              <text
                x="0.5"
                y="0.6"
                textAnchor="middle"
                fontSize="0.45"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="-0.04em"
              >
                {reglages.nom || "@DS"}
              </text>
            </clipPath>
          </defs>
        </svg>

 
        <div
          className="w-[280px] h-[260px] sm:w-[380px] sm:h-[420px] relative flex items-center justify-center"
          style={{
            clipPath: "url(#masque-logo-ds)",
            WebkitClipPath: "url(#masque-logo-ds)",
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-125"
          >
            <source src={sourceVideo} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Slogan */}
      <div
        className={`absolute bottom-16 sm:bottom-30 flex flex-col items-center gap-2 transition-all duration-500 ${
          etatAnimation === "attente" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="text-[14px] font-black uppercase tracking-[0.3em] ">
          {reglages.slogan}
        </span>
        <div className="w-12 h-0.5 bg-slate-300 rounded-full overflow-hidden">
          <div className="w-full h-full bg-[#00d2ff] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default EcranChargementIntro;