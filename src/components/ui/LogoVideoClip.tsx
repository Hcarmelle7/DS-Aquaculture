"use client";

import React, { useId } from "react";
import { useAppStore } from "@/store/useAppStore";

interface ProprietesLogoVideo {
  largeur?: string; 
  hauteur?: string; 
  taillePolice?: number;
  className?: string;
}

export const LogoVideoClip: React.FC<ProprietesLogoVideo> = ({
  largeur,
  hauteur,
  taillePolice = 0.45,
  className = " ",
}) => {
  const { reglages } = useAppStore();
  const identifiantUnique = useId().replace(/:/g, "");
  const idMasque = `clip-logo-${identifiantUnique}`;

  const sourceVideo =
    reglages.urlVideoHero ||
    "https://assets.mixkit.co/videos/preview/mixkit-clear-water-in-a-lake-1199-large.mp4";

  return (
    <div className={`relative flex items-center justify-center select-none ${largeur} ${hauteur} ${className}`}>
      {/* SVG du masque */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <clipPath id={idMasque} clipPathUnits="objectBoundingBox">
            <text
              x="0.5"
              y="0.62"
              textAnchor="middle"
              fontSize={taillePolice}
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="-0.04em"
            >
              {reglages.nom || "@DS"}
            </text>
          </clipPath>
        </defs>
      </svg>

      {/* Cadre découpé contenant la vidéo */}
      <div
        className="w-full h-full relative flex items-center justify-center overflow-hidden"
        style={{
          clipPath: `url(#${idMasque})`,
          WebkitClipPath: `url(#${idMasque})`,
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-100 pointer-events-none"
        >
          <source src={sourceVideo} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default LogoVideoClip;