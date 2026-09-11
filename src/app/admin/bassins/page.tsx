"use client";

import React, { useState, useEffect } from "react";
import { NavBar } from "@/components/client/NavBar";
import { useAppStore } from "@/store/useAppStore";
import { BassinCard } from "@/components/admin/BassinCard";
import { ModalGenerique } from "@/components/admin/ModalGenerique";
import { FormulaireBassin } from "@/components/admin/FormulaireBassin";
import { FormulaireLot } from "@/components/admin/FormulaireLot";
import { Bouton } from "@/components/ui/Bouton";
import { Plus, Waves } from "lucide-react";
import { Bassin } from "@/types";

export default function PageBassins() {
  const { bassins, lots, chargerBassins, supprimerBassin } = useAppStore();
  
  const [modalBassinOuvert, setModalBassinOuvert] = useState(false);
  const [bassinAEditer, setBassinAEditer] = useState<Bassin | undefined>(undefined);
  
  const [modalLotOuvert, setModalLotOuvert] = useState(false);
  const [bassinCibleId, setBassinCibleId] = useState<string>("");

  useEffect(() => {
    chargerBassins();
  }, [chargerBassins]);

  const handleOuvrirModalBassin = (bassin?: Bassin) => {
    setBassinAEditer(bassin);
    setModalBassinOuvert(true);
  };

  const handleFermerModalBassin = () => {
    setModalBassinOuvert(false);
    setBassinAEditer(undefined);
  };

  const handleOuvrirModalLot = (bassinId: string) => {
    setBassinCibleId(bassinId);
    setModalLotOuvert(true);
  };

  const handleActionBassin = (bassinId: string) => {
    const lotActif = lots.find(l => l.bassinId === bassinId && l.statut === "en_cours");
    if (!lotActif) {
      handleOuvrirModalLot(bassinId);
    } else {
      handleOuvrirModalBassin(bassins.find(b => b.id === bassinId));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-20 transition-colors duration-300">
      <NavBar />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 flex items-center gap-3">
              <Waves className="w-8 h-8 text-[#00d2ff]" />
              Gestion des Bassins
            </h1>
            <p className="text-[var(--text-muted)]">Créez et gérez vos infrastructures d'élevage.</p>
          </div>
          <Bouton variante="primaire" onClick={() => handleOuvrirModalBassin()}>
            <Plus className="w-5 h-5" />
            Nouveau Bassin
          </Bouton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bassins.map(bassin => {
            const lotActif = lots.find(l => l.bassinId === bassin.id && l.statut === "en_cours");
            return (
              <div key={bassin.id} className="relative group">
                <BassinCard 
                  bassin={bassin} 
                  lotActif={lotActif} 
                  surAction={handleActionBassin} 
                />
                
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOuvrirModalBassin(bassin)}
                    className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white"
                  >
                    ✏️
                  </button>
                  {(!lotActif) && (
                    <button 
                      onClick={() => {
                        if(confirm("Supprimer ce bassin ?")) supprimerBassin(bassin.id);
                      }}
                      className="p-2 bg-red-500/20 rounded-lg text-red-400 hover:text-red-300"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {bassins.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-slate-900/50 rounded-3xl border border-slate-800/50 border-dashed">
              <Waves className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400 mb-4 text-center max-w-md">Vous n'avez pas encore configuré de bassins. Commencez par créer votre première infrastructure d'élevage.</p>
              <Bouton variante="primaire" onClick={() => handleOuvrirModalBassin()}>Créer un bassin</Bouton>
            </div>
          )}
        </div>
      </main>

      <ModalGenerique 
        estOuvert={modalBassinOuvert} 
        fermer={handleFermerModalBassin} 
        titre={bassinAEditer ? "Modifier le Bassin" : "Nouveau Bassin"}
      >
        <FormulaireBassin bassinExistant={bassinAEditer} auTermine={handleFermerModalBassin} />
      </ModalGenerique>

      <ModalGenerique 
        estOuvert={modalLotOuvert} 
        fermer={() => setModalLotOuvert(false)} 
        titre="Ajouter un Lot de Poissons"
      >
        <FormulaireLot bassinId={bassinCibleId} auTermine={() => setModalLotOuvert(false)} />
      </ModalGenerique>
    </div>
  );
}
