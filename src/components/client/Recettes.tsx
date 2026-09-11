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
    <section id="recettes" className="space-y-4 pt-2">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
          <Utensils className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white transition-colors duration-300">{t.titreRecettes}</h2>
          <p className="text-xs text-slate-400">{t.sousTitreRecettes}</p>
        </div>
      </div>

      {/* Accordéon de recettes */}
      <div className="space-y-3">
        {recettes.map((r) => {
          const estOuvert = recetteOuverte === r.id;
          return (
            <Carte
              key={r.id}
              className="p-4 border-slate-800 transition-all cursor-pointer select-none"
              onClick={() => basculerRecette(r.id)}
            >
              <div className="flex justify-between items-center gap-2">
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mb-1">
                    <span className="flex items-center gap-1 text-[#00d2ff]">
                      <Clock className="w-3 h-3" />
                      {r.tempsPreparation}
                    </span>
                    <span>•</span>
                    <span>{r.difficulte}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-300">{r.titre}</h3>
                </div>

                <button
                  type="button"
                  aria-label="Dérouler la recette"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400"
                >
                  {estOuvert ? <ChevronUp className="w-4 h-4 text-[#00d2ff]" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Contenu détaillé déroulant */}
              {estOuvert && (
                <div
                  className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Ingrédients */}
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 block mb-1.5">
                      Ingrédients requis :
                    </span>
                    <ul className="grid grid-cols-1 gap-1 text-xs text-slate-400">
                      {r.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff]" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Étapes */}
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 block mb-1.5">
                      Préparation :
                    </span>
                    <ol className="space-y-2 text-xs text-slate-300">
                      {r.instructions.map((ins, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-lg bg-slate-800 border border-slate-700 text-[#00d2ff] font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {i + 1}
                          </span>
                          <span className="leading-snug pt-0.5">{ins}</span>
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