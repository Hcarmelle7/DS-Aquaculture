"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { EcranChargementIntro } from "@/components/client/EcranChargementIntro";
import { CommandeSilureCarte } from "@/components/client/CommandeSilureCarte";
import { Formations } from "@/components/client/Formations";
import { Recettes } from "@/components/client/Recettes";

import { NavBar } from "@/components/client/NavBar";
import { APropos } from "@/components/client/APropos";
import { Fish, Waves } from "lucide-react";

export default function PageVitrine() {
  const { chargerReglages, chargerBassins } = useAppStore();
  const [introAffichee, setIntroAffichee] = useState(true);
  const { reglages } = useAppStore();
  // Chargement des données depuis Supabase
  useEffect(() => {
    chargerReglages();
    chargerBassins();
  }, [chargerReglages, chargerBassins]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      {introAffichee && (
        <EcranChargementIntro auTermine={() => setIntroAffichee(false)} />
      )}

      <NavBar />



      <main className="w-full">
        {/* Hero Section */}
        <section className="relative w-full bg-[#28a9ed] pt-28 pb-32 overflow-hidden flex flex-col items-center text-center px-4">
          {/* Poissons animés en arrière-plan */}
          <div className="absolute top-10 left-10 opacity-20 animate-[pulse_4s_ease-in-out_infinite]"><Fish className="w-16 h-16 text-white" /></div>
          <div className="absolute top-20 right-20 opacity-20 animate-[bounce_5s_ease-in-out_infinite]"><Fish className="w-12 h-12 text-white" /></div>
          <div className="absolute bottom-10 left-1/4 opacity-10 animate-[pulse_6s_ease-in-out_infinite]"><Fish className="w-24 h-24 text-white" /></div>
          
          <div className="z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg mb-6">
              ÉLEVER AVEC SOIN, <br className="hidden sm:block" /> DISTRIBUER AVEC PASSION
            </h1>
            <p className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto font-medium mb-10 drop-shadow-md">
              Découvrez la meilleure qualité de silures élevés localement dans un environnement sain et contrôlé.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#commander" className="px-8 py-4 bg-white text-[#28a9ed] rounded-full font-black text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300">
                Passer Commande
              </a>
              <a href="#a-propos" className="px-8 py-4 bg-[#28a9ed] border-2 border-white text-white rounded-full font-black text-lg hover:bg-white hover:text-[#28a9ed] transition-all duration-300">
                Découvrir DS
              </a>
            </div>
          </div>
          
          {/* Vague SVG de séparation (bottom) */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-[1px]">
            <svg className="relative block w-full h-[60px] sm:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.3,191.9,101.4,236.4,88.4,281.4,70.9,321.39,56.44Z" className="fill-white dark:fill-slate-950"></path>
            </svg>
          </div>
        </section>

        {/* Contenu principal (resté quasiment intact) */}
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-20 pb-28">

          {/* Bannière Promotionnelle Vive */}
          {reglages.texteBannierePromo && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-sky-500/10 to-emerald-500/20 border border-cyan-500/30 text-center font-bold text-xs sm:text-sm text-cyan-600 dark:text-cyan-300 shadow-sm animate-in fade-in zoom-in duration-700">
              ✨ {reglages.texteBannierePromo}
            </div>
          )}
          
          <section id="a-propos" className="scroll-mt-24">
            <APropos />
          </section>
          <section id="commander" className="scroll-mt-24">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Notre Boutique</h2>
              <p className="text-slate-500 dark:text-slate-400">Passez votre commande en quelques clics</p>
            </div>
            <CommandeSilureCarte />
          </section>
          <section id="formations" className="scroll-mt-24">
            <Formations />
          </section>
          <section id="recettes" className="scroll-mt-24">
            <Recettes />
          </section>
        </div>
      </main>

    </div>
  );
}