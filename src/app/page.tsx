"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { EcranChargementIntro } from "@/components/client/EcranChargementIntro";
import { CommandeSilureCarte } from "@/components/client/CommandeSilureCarte";
import { Formations } from "@/components/client/Formations";
import { Recettes } from "@/components/client/Recettes";

import { NavBar } from "@/components/client/NavBar";
import { APropos } from "@/components/client/APropos";


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



      <main className="max-w-4xl mx-auto px-4 pt-4 pb-28 space-y-6">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-14 pb-28">

          {/* Bannière Promotionnelle Vive */}
          {reglages.texteBannierePromo && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-sky-500/10 to-emerald-500/20 border border-cyan-500/30 text-center font-bold text-xs sm:text-sm text-cyan-600 dark:text-cyan-300 shadow-sm">
              ✨ {reglages.texteBannierePromo}
            </div>
          )}
          <section id="a-propos">
            <APropos />
          </section>
          <section id="commander">
            <CommandeSilureCarte />
          </section>
          <section id="formations">
            <Formations />
          </section>
          <section id="recettes">
            <Recettes />
          </section>
        </div>
      </main>

    </div>
  );
}