"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { LogoVideoClip } from "@/components/ui/LogoVideoClip";

export const EcranChargementIntro: React.FC<{ auTermine: () => void }> = ({ auTermine }) => {
  const { reglages, langue } = useAppStore();
  const [etatAnimation, setEtatAnimation] = useState<"attente" | "zoom" | "disparition">("attente");

  useEffect(() => {
    // 1. Délai augmenté à 400ms pour laisser le temps au navigateur d'afficher la vidéo dans le logo
    const delaiZoom = setTimeout(() => {
      setEtatAnimation("zoom");
    }, 400);

    // 2. Début du fondu de sortie décalé en conséquence
    const delaiFondu = setTimeout(() => {
      setEtatAnimation("disparition");
    }, 1600);

    // 3. Fin complète à 2 secondes
    const delaiFin = setTimeout(() => {
      auTermine();
    }, 2000);

    return () => {
      clearTimeout(delaiZoom);
      clearTimeout(delaiFondu);
      clearTimeout(delaiFin);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050811] overflow-hidden transition-opacity duration-500 ease-out ${
        etatAnimation === "disparition" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Conteneur de zoom avec durée à 1200ms */}
      <div
        className={`relative w-full h-full flex items-center justify-center transition-transform duration-[1200ms] cubic-bezier(0.7, 0, 0.2, 1) ${
          etatAnimation === "zoom" ? "scale-[28] sm:scale-[38]" : "scale-100"
        }`}
        style={{ transformOrigin: "50% 50%" }}
      >
        <LogoVideoClip 
          className="w-[280px] h-[260px] sm:w-[380px] sm:h-[420px]" 
        />
      </div>

      {/* Slogan */}
      <div
        className={`absolute bottom-16 sm:bottom-32 left-0 right-0 w-full px-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
          etatAnimation === "attente" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="text-[12px] sm:text-[14px] text-center font-black uppercase tracking-[0.3em] text-white leading-relaxed max-w-xs sm:max-w-md mx-auto">
          {langue === "en" ? reglages.sloganEn : reglages.slogan}
        </span>
        <div className="w-12 h-0.5 bg-slate-300 rounded-full overflow-hidden mt-1">
          <div className="w-full h-full bg-[#00d2ff] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default EcranChargementIntro;