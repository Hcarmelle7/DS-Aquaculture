// "use client";

// import React from "react";
// import { useAppStore } from "@/store/useAppStore";
// import { TRADUCTIONS } from "@/data/contenu";
// import { Carte } from "@/components/ui/Carte";
// import { ShieldCheck, Droplets, Award, Compass, CheckCircle2 } from "lucide-react";

// export const APropos: React.FC = () => {
//   const { langue, reglages } = useAppStore();
//   const t = TRADUCTIONS[langue];

//   const atouts = [
//     {
//       icone: Droplets,
//       titre: t.pointCle1Titre,
//       desc: t.pointCle1Desc,
//       couleur: "text-cyan-400 bg-cyan-950/50 border-cyan-500/30",
//     },
//     {
//       icone: ShieldCheck,
//       titre: t.pointCle2Titre,
//       desc: t.pointCle2Desc,
//       couleur: "text-emerald-400 bg-emerald-950/50 border-emerald-500/30",
//     },
//     {
//       icone: Award,
//       titre: t.pointCle3Titre,
//       desc: t.pointCle3Desc,
//       couleur: "text-amber-400 bg-amber-950/50 border-amber-500/30",
//     },
//   ];

//   return (
//     <section id="a-propos" className="scroll-mt-20 space-y-6">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
//           <Compass className="w-5 h-5" />
//         </div>
//         <div>
//           <h2 className="text-xl font-black text-white">{t.titreAPropos}</h2>
//           <p className="text-xs text-slate-400 font-medium">{t.sousTitreAPropos}</p>
//         </div>
//       </div>

//       {/* Carte narrative principale */}
//       <Carte className="border-slate-800/90 relative overflow-hidden">
//         <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
//           <p>
//             Fondée avec la volonté de démocratiser l'accès à un poisson d'eau douce frais et vigoureux,{" "}
//             <span className="text-[#00d2ff] font-extrabold">{reglages.nom}</span> s'engage sur un modèle
//             d'élevage hors-sol rigoureux.
//           </p>
//           <p className="text-slate-400">
//             Chaque bassin bénéficie d'un suivi strict de la qualité de l'eau (oxygénation, pH et renouvellement continu)
//             garantissant une chair ferme, sans goût de vase, prête pour toutes vos recettes traditionnelles ou braisées.
//           </p>

//           <div className="grid grid-cols-2 gap-3 pt-2">
//             <div className="flex items-center gap-2 text-xs font-bold text-white bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
//               <CheckCircle2 className="w-4 h-4 text-[#00d2ff] shrink-0" />
//               <span>Fraîcheur vivante garantie</span>
//             </div>
//             <div className="flex items-center gap-2 text-xs font-bold text-white bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
//               <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
//               <span>Élevage 100% responsable</span>
//             </div>
//           </div>
//         </div>
//       </Carte>

//       {/* Cartes d'atouts clés */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
//         {atouts.map((atout, index) => {
//           const Icone = atout.icone;
//           return (
//             <Carte key={index} className="p-4 space-y-2.5 border-slate-800/80">
//               <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${atout.couleur}`}>
//                 <Icone className="w-4 h-4" />
//               </div>
//               <h3 className="font-extrabold text-sm text-white">{atout.titre}</h3>
//               <p className="text-xs text-slate-400 leading-snug">{atout.desc}</p>
//             </Carte>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default APropos;

// "use client";

// import React, { useState } from "react";
// import { useAppStore } from "@/store/useAppStore";
// import { Play, Pause, Volume2, VolumeX, Sparkles } from "lucide-react";

// export const APropos: React.FC = () => {
//   const { reglages, langue } = useAppStore();
//   const [enLecture, setEnLecture] = useState(true);
//   const [enMuet, setEnMuet] = useState(true);

//   const videoRef = React.useRef<HTMLVideoElement>(null);

//   const basculerLecture = () => {
//     if (!videoRef.current) return;
//     if (videoRef.current.paused) {
//       videoRef.current.play();
//       setEnLecture(true);
//     } else {
//       videoRef.current.pause();
//       setEnLecture(false);
//     }
//   };

//   const basculerSon = () => {
//     if (!videoRef.current) return;
//     videoRef.current.muted = !videoRef.current.muted;
//     setEnMuet(videoRef.current.muted);
//   };

//   return (
//     <section className="scroll-mt-24 space-y-4">
//       <div className="flex justify-between items-end">
//         <div>
//           <span className="text-[11px] font-extrabold tracking-widest text-[#00d2ff] uppercase flex items-center gap-1.5">
//             <Sparkles className="w-3.5 h-3.5" />
//             Immersion Exclusive
//           </span>
//           <h2 className="text-xl sm:text-2xl font-black tracking-tight">
//             {langue === "fr" ? "Au Cœur de Nos Bassins" : "Inside Our Breeding Tanks"}
//           </h2>
//         </div>
//       </div>

//       {/* Lecteur Vidéo Card moderne */}
//       <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl group bg-slate-900">
//         <video
//           ref={videoRef}
//           src={reglages.urlVideoHero || "https://assets.mixkit.co/videos/preview/mixkit-clear-water-in-a-lake-1199-large.mp4"}
//           autoPlay
//           loop
//           muted
//           playsInline
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//         />

//         {/* Voile et commandes tactiles */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex items-end justify-between p-4 sm:p-6">
//           <div className="text-white max-w-sm">
//             <span className="px-2.5 py-1 rounded-full bg-[#00d2ff]/20 border border-[#00d2ff]/50 text-[#00d2ff] text-[10px] font-black uppercase tracking-wider">
//               Qualité Garantie @DS
//             </span>
//             <p className="text-xs sm:text-sm font-bold mt-1.5 line-clamp-2">
//               Découvrez la récolte matinale, l'oxygénation continue et le calibrage de nos poissons.
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={basculerSon}
//               className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition active:scale-95"
//               aria-label="Contrôle son"
//             >
//               {enMuet ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
//             </button>
//             <button
//               onClick={basculerLecture}
//               className="w-12 h-12 rounded-2xl bg-[#00d2ff] text-slate-950 flex items-center justify-center font-black shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:scale-105 transition active:scale-95"
//               aria-label="Play/Pause"
//             >
//               {enLecture ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default APropos;


"use client";

import React, { useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Play, Pause, Volume2, VolumeX, Sparkles, ArrowDown, Award, Users, Droplets } from "lucide-react";

export const APropos: React.FC = () => {
  const { reglages, langue } = useAppStore();
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

  return (
    <section className="relative pt-6 pb-12 overflow-hidden">
      {/* 1. Titre éditorial géant & aéré */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1c3f2d]/10 dark:bg-emerald-500/10 border border-[#1c3f2d]/20 dark:border-emerald-500/20 text-[#1c3f2d] dark:text-emerald-400 text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Aquaculture Durable du Cameroun</span>
        </div>

        <h1 className="police-titre text-4xl sm:text-6xl md:text-7xl font-bold text-[#142118] dark:text-white leading-[1.08]">
          {langue === "fr" ? (
            <>Nourrir l'avenir avec du <span className="italic font-normal underline decoration-[#2e7d32] decoration-2 underline-offset-4">silure frais</span> et de qualité.</>
          ) : (
            <>Powering the future with <span className="italic font-normal underline decoration-[#2e7d32] decoration-2 underline-offset-4">fresh local</span> catfish.</>
          )}
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
          {langue === "fr" ? reglages.slogan : reglages.sloganEn}
        </p>
      </div>

      {/* 2. Écran Vidéo Panoramique & Badges flottants */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-[32px] overflow-hidden shadow-2xl border border-[var(--bordure-douce)] bg-black">
          <video
            ref={videoRef}
            src={reglages.urlVideoHero || "https://assets.mixkit.co/videos/preview/mixkit-clear-water-in-a-lake-1199-large.mp4"}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Voile dégradé subtil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

          {/* Badges de stats flottants façon Farmerline */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-extrabold text-[#142118] dark:text-white shadow-lg">
              <Droplets className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>Bacs hors-sol oxygénés</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-extrabold text-[#142118] dark:text-white shadow-lg">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Zéro odeur de vase</span>
            </div>
          </div>

          {/* Contrôles média discrets en bas */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 z-10">
            <button
              onClick={basculerSon}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-black/60 transition"
              aria-label="Son"
            >
              {enMuet ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={basculerLecture}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 transition"
              aria-label="Lecture"
            >
              {enLecture ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bandeau métriques éditoriales */}
      <div className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#152019] border border-[var(--bordure-douce)] shadow-sm">
          <p className="police-titre text-2xl sm:text-3xl font-bold text-[#2e7d32]">100%</p>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
            Silures vivants
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#152019] border border-[var(--bordure-douce)] shadow-sm">
          <p className="police-titre text-2xl sm:text-3xl font-bold text-[#2e7d32]">&lt; 3h</p>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
            Livraison express
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#152019] border border-[var(--bordure-douce)] shadow-sm">
          <p className="police-titre text-2xl sm:text-3xl font-bold text-[#2e7d32]">500+</p>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
            Foyers régalés
          </p>
        </div>
      </div>
    </section>
  );
};

export default APropos;