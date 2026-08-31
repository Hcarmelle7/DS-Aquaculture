"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { EcranChargementIntro } from "@/components/client/EcranChargementIntro";
import { CommandeSilureCarte } from "@/components/client/CommandeSilureCarte";

export default function PageVitrine() {
  const { chargerReglages, chargerBassins } = useAppStore();
  const [introAffichee, setIntroAffichee] = useState(true);

  // Chargement des données depuis Supabase
  useEffect(() => {
    chargerReglages();
    chargerBassins();
  }, [chargerReglages, chargerBassins]);

  return (
    <div className="min-h-screen bg-[#050811] text-white">
      {introAffichee && (
        <EcranChargementIntro auTermine={() => setIntroAffichee(false)} />
      )}

      

      <main className="max-w-xl mx-auto px-4 pt-4 pb-28 space-y-6">
        <section id="commander">
          <CommandeSilureCarte />
        </section>
      </main>

    </div>
  );
}