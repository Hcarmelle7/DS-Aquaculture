"use client";

import React, { useEffect, useState } from "react";
import { NavBar } from "@/components/client/NavBar";
import { useAppStore } from "@/store/useAppStore";
import { Bouton } from "@/components/ui/Bouton";
import { Plus, Utensils, Calendar } from "lucide-react";
import { ModalGenerique } from "@/components/admin/ModalGenerique";
import { FormulaireNourrissage } from "@/components/admin/FormulaireNourrissage";
import { BanniereErreurReseau } from "@/components/admin/BanniereErreurReseau";

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
        <BanniereErreurReseau />

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

        {/* Vue Desktop : Tableau structuré */}
        <div className="hidden md:block bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
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
                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {new Date(releve.dateNourrissage).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 dark:text-white">{bassin?.nom || '?'}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">{lot?.souche || '?'}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">{releve.typeAliment}</td>
                      <td className="px-6 py-4 font-black text-[#28a9ed] dark:text-[#00d2ff] whitespace-nowrap">{releve.quantiteKg} kg</td>
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

        {/* Vue Mobile : Cartes empilées pour usage à une main au bord des bassins */}
        <div className="md:hidden space-y-3">
          {relevesNourrissage.map(releve => {
            const lot = lots.find(l => l.id === releve.lotId);
            const bassin = bassins.find(b => b.id === lot?.bassinId);
            
            return (
              <div 
                key={releve.id} 
                className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(releve.dateNourrissage).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <span className="font-black text-[#28a9ed] dark:text-[#00d2ff] text-base">
                    {releve.quantiteKg} kg
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      {bassin?.nom || 'Bassin inconnu'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {lot?.souche || 'Lot non précisé'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20">
                    {releve.typeAliment}
                  </span>
                </div>

                {releve.observations && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                    {releve.observations}
                  </p>
                )}
              </div>
            );
          })}

          {relevesNourrissage.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400">
              <Utensils className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Aucun relevé de nourrissage enregistré.</p>
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
