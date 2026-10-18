"use client";

import React, { useEffect, useState } from "react";
import { NavBar } from "@/components/client/NavBar";
import { useAppStore } from "@/store/useAppStore";
import { Bouton } from "@/components/ui/Bouton";
import { Plus, Utensils, Calendar } from "lucide-react";
import { ModalGenerique } from "@/components/admin/ModalGenerique";
import { FormulaireNourrissage } from "@/components/admin/FormulaireNourrissage";

export default function PageNourriture() {
  const { relevesNourrissage, chargerRelevesNourrissage, lots, bassins } = useAppStore();
  const [modalOuvert, setModalOuvert] = useState(false);

  useEffect(() => {
    chargerRelevesNourrissage();
  }, [chargerRelevesNourrissage]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-20 transition-colors duration-300">
      <NavBar />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 flex items-center gap-3">
              <Utensils className="w-8 h-8 text-[#00d2ff]" />
              Historique de Nourrissage
            </h1>
            <p className="text-[var(--text-muted)]">Suivi de la distribution d'aliments par bassin.</p>
          </div>
          <Bouton variante="primaire" onClick={() => setModalOuvert(true)}>
            <Plus className="w-5 h-5" />
            Nouveau Relevé
          </Bouton>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 uppercase font-bold text-xs border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Bassin & Lot</th>
                  <th className="px-6 py-4">Aliment</th>
                  <th className="px-6 py-4">Quantité</th>
                  <th className="px-6 py-4">Observations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {relevesNourrissage.map(releve => {
                  const lot = lots.find(l => l.id === releve.lotId);
                  const bassin = bassins.find(b => b.id === lot?.bassinId);
                  
                  return (
                    <tr key={releve.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        {/* <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" /> */}
                        {new Date(releve.dateNourrissage).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 dark:text-white">{bassin?.nom || '?'}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">{lot?.souche || '?'}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">{releve.typeAliment}</td>
                      <td className="px-6 py-4 font-black text-[#28a9ed] dark:text-[#00d2ff]">{releve.quantiteKg} kg</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{releve.observations || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {relevesNourrissage.length === 0 && (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <Utensils className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Aucun relevé de nourrissage enregistré.</p>
            </div>
          )}
        </div>
      </main>

      <ModalGenerique 
        estOuvert={modalOuvert} 
        fermer={() => setModalOuvert(false)} 
        titre="Enregistrer un Nourrissage"
      >
        <FormulaireNourrissage auTermine={() => setModalOuvert(false)} />
      </ModalGenerique>
    </div>
  );
}
