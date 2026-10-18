"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { EcranChargementIntro } from "@/components/client/EcranChargementIntro";
import { CommandeSilureCarte } from "@/components/client/CommandeSilureCarte";
import { Formations } from "@/components/client/Formations";
import { Recettes } from "@/components/client/Recettes";
import { SectionTemoignages } from "@/components/client/Temoignages";
import { Footer } from "@/components/client/Footer";

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
        <section className="relative w-full bg-[#28a9ed] pt-23 pb-32 overflow-hidden flex flex-col items-center text-center px-4">
          {/* Animation en arrière-plan */}
          <div className="absolute top-10 left-10 opacity-20 animate-swim"><Fish className="w-16 h-16 text-white" /></div>
          <div className="absolute top-20 right-20 opacity-20 animate-swim-diag"><Fish className="w-12 h-12 text-white" /></div>
          <div className="absolute bottom-10 left-1/4 opacity-10 animate-swim-slow"><Fish className="w-24 h-24 text-white" /></div>
          <div className="absolute top-[40%] right-[30%] opacity-15 animate-swim" style={{ animationDelay: '3s' }}><Fish className="w-10 h-10 text-white" /></div>
          <div className="absolute bottom-20 left-[10%] opacity-20 animate-swim-diag" style={{ animationDelay: '6s' }}><Fish className="w-14 h-14 text-white" /></div>
          
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
              <a href="#a-propos" className="px-12 py-4 bg-[#28a9ed] border-2 border-white text-white rounded-full font-black text-lg hover:bg-white hover:text-[#28a9ed] transition-all duration-300">
                Découvrir @DS
              </a>
            </div>
          </div>
          
          {/* Vagues de séparation animées */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-[1px] h-[70px] sm:h-[120px] z-20">
            {/* Vague unique animée */}
            <div className="absolute bottom-0 left-0 w-[200%] flex h-full animate-wave">
              <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full flex-1">
                <path d="M0,160 Q180,32 360,160 T720,160 T1080,160 T1440,160 V320 H0 Z" className="fill-slate-200 dark:fill-slate-950"></path>
              </svg>
              <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full flex-1">
                <path d="M0,160 Q180,32 360,160 T720,160 T1080,160 T1440,160 V320 H0 Z" className="fill-slate-200 dark:fill-slate-950"></path>
              </svg>
            </div>
          </div>
        </section>

        {/* A Propos Section */}
        <section id="a-propos" className="scroll-mt-4 w-full bg-slate-200 dark:bg-slate-900/40 py-8">
          <div className="max-w-6xl mx-auto px-4 space-y-6">
           
            <APropos />
          </div>
        </section>

        {/* Commande Section */}
        <section id="commander" className="scroll-mt-10 w-full bg-slate-900 dark:bg-slate-950 py-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="mb-10 text-center">
              <h2 className="text-3xl md:text-3xl font-black text-white mb-4">Notre Boutique</h2>
              <p className="text-slate-400 text-lg">Passez votre commande de silures frais en quelques clics</p>
            </div>
            <CommandeSilureCarte />
          </div>
        </section>

        {/* Temoignages Section */}
        <section id="temoignages" className="scroll-mt-24 w-full bg-slate-200 dark:bg-slate-900 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <SectionTemoignages />
          </div>
        </section>

        {/* Formations Section - Fond Blanc cassé */}
        <section id="formations" className="scroll-mt-4 w-full bg-slate-100 dark:bg-slate-900 py-20 border-y border-slate-300 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4">
            <Formations />
          </div>
        </section>

        {/* Recettes Section - Fond Chaleureux */}
        <section id="recettes" className="scroll-mt-4 w-full bg-orange-50 dark:bg-orange-950/20 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <Recettes />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}