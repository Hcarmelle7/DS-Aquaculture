"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { RECETTES_CUISINE, TRADUCTIONS } from "@/data/contenu";
import { Carte } from "@/components/ui/Carte";
import { Utensils, Clock, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

export const Recettes: React.FC = () => {
  const { langue } = useAppStore();
  const t = TRADUCTIONS[langue];
  const recettes = RECETTES_CUISINE[langue];
  const [recetteOuverte, setRecetteOuverte] = useState<string | null>(recettes[0]?.id || null);

  const basculerRecette = (id: string) => {
    setRecetteOuverte(recetteOuverte === id ? null : id);
  };

  return (
    <section id="recettes" className="space-y-10">
      {/* En-tête */}
      <div className="text-center space-y-4">
        {/* <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest mx-auto">
          <Utensils className="w-3.5 h-3.5" />
          <span>Saveurs DS</span>
        </div> */}
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white transition-colors duration-300">
          {t.titreRecettes}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
          {t.sousTitreRecettes}
        </p>
      </div>

      {/* Accordéon de recettes avec look "Livre de recettes" */}
      <div className="max-w-3xl mx-auto space-y-4">
        {recettes.map((r) => {
          const estOuvert = recetteOuverte === r.id;
          return (
            <Carte
              key={r.id}
              className={`p-6 transition-all duration-300 cursor-pointer select-none overflow-hidden ${estOuvert ? 'bg-white dark:bg-slate-900 shadow-2xl border-orange-200 dark:border-orange-900/50 scale-[1.02]' : 'bg-orange-50/50 dark:bg-slate-900/50 border-orange-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:shadow-lg'}`}
              onClick={() => basculerRecette(r.id)}
            >
              <div className="flex justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                      <Clock className="w-3.5 h-3.5" />
                      {r.tempsPreparation}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {r.difficulte}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white transition-colors duration-300">{r.titre}</h3>
                </div>

                <button
                  type="button"
                  aria-label="Dérouler la recette"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${estOuvert ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}
                >
                  {estOuvert ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Contenu détaillé déroulant */}
              {estOuvert && (
                <div
                  className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6 cursor-default animate-in fade-in slide-in-from-top-4 duration-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Ingrédients */}
                  <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-2xl p-5 border border-orange-100/50 dark:border-orange-900/20">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                      Ingrédients requis
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {r.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Étapes */}
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 block mb-4">
                      Préparation pas à pas
                    </span>
                    <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      {r.instructions.map((ins, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black flex items-center justify-center shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed pt-1.5 font-medium">{ins}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </Carte>
          );
        })}
      </div>
    </section>
  );
};

export default Recettes;