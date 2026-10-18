"use client";

import React, { useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Play, Pause, Volume2, VolumeX, ShieldCheck, Droplets, Award, Compass, CheckCircle2 } from "lucide-react";
import { TRADUCTIONS } from "@/data/contenu";

export const APropos: React.FC = () => {
  const { reglages, langue } = useAppStore();
  const t = TRADUCTIONS[langue];

  const videoRef = useRef<HTMLVideoElement>(null);
  const [enLecture, setEnLecture] = useState(true);
  const [enMuet, setEnMuet] = useState(true);

  const basculerLecture = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setEnLecture(true);
    } else {
      videoRef.current.pause();
      setEnLecture(false);
    }
  };

  const basculerSon = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setEnMuet(videoRef.current.muted);
  };

  const atouts = [
    {
      icone: Droplets,
      titre: t.pointCle1Titre,
      desc: t.pointCle1Desc,
    },
    {
      icone: ShieldCheck,
      titre: t.pointCle2Titre,
      desc: t.pointCle2Desc,
    },
    {
      icone: Award,
      titre: t.pointCle3Titre,
      desc: t.pointCle3Desc,
    },
  ];

  return (
    <section className="py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

        {/* Colonne de Gauche  */}
        <div className="space-y-8 lg:col-span-2">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-[#28a9ed] text-xs font-black uppercase tracking-widest">
              <Compass className="w-4 h-4" />
              <span>Notre Histoire</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              L'excellence d'une <span className="text-[#28a9ed]">aquaculture raisonnée</span>.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Fondée avec la volonté de démocratiser l'accès à un poisson d'eau douce frais et vigoureux,
              <span className="text-[#28a9ed] font-extrabold mx-1">{reglages.nom}</span>
              s'engage sur un modèle d'élevage hors-sol rigoureux au Cameroun.
            </p>

            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Chaque bassin bénéficie d'un suivi strict de la qualité de l'eau (oxygénation, pH et renouvellement continu)
              garantissant une chair ferme, sans goût de vase, prête pour toutes vos recettes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#28a9ed]" />
              </div>
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Fraîcheur vivante garantie</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#28a9ed]" />
              </div>
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Élevage 100% responsable</span>
            </div>
          </div>
        </div>

        {/* Colonne de Droite  */}
        <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white dark:border-slate-800 bg-slate-900 group lg:col-span-1">
          <video
            ref={videoRef}
            src={reglages.urlVideoHero || "https://assets.mixkit.co/videos/preview/mixkit-clear-water-in-a-lake-1199-large.mp4"}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Contrôles Média */}
          {/* <div className="absolute bottom-6 right-6 flex items-center gap-3 z-10">
            <button
              onClick={basculerSon}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
              aria-label="Contrôle du son"
            >
              {enMuet ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={basculerLecture}
              className="w-12 h-12 rounded-full bg-[#28a9ed] text-white flex items-center justify-center shadow-[0_0_20px_rgba(40,169,237,0.5)] hover:scale-110 transition-transform"
              aria-label="Lecture / Pause"
            >
              {enLecture ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
          </div> */}
        </div>

      </div>

      {/* Cartes d'atouts clés en dessous */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {atouts.map((atout, index) => {
          const Icone = atout.icone;
          return (
            <div key={index} className="p-3 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex gap-3 items-center ">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center mb-5 border border-cyan-100 dark:border-cyan-800/50">
                  <Icone className="w-6 h-6 text-[#28a9ed]" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{atout.titre}</h3>

              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{atout.desc}</p>
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default APropos;