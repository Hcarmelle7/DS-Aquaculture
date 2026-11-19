"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { Bouton } from "@/components/ui/Bouton";

interface OngletMortaliteProps {
  nombreMorts: number;
  setNombreMorts: React.Dispatch<React.SetStateAction<number>>;
  effectifActuel: number;
}

export const OngletMortalite: React.FC<OngletMortaliteProps> = ({
  nombreMorts,
  setNombreMorts,
  effectifActuel,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-red-50/60 dark:bg-red-950/20 p-5 rounded-2xl border border-red-200/80 dark:border-red-900/30 text-center space-y-4">
        <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
          Combien de poissons sont morts ?
        </p>

        {/* Sélecteur tactile géant */}
        <div className="flex items-center justify-center gap-4">
          <Bouton
            type="button"
            variante="contour"
            taille="iconeLg"
            graisse="black"
            onClick={() => setNombreMorts((n) => Math.max(1, n - 1))}
            className="border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-slate-900 active:scale-90"
          >
            <Minus className="w-6 h-6" />
          </Bouton>

          <input
            type="number"
            min={1}
            max={effectifActuel}
            value={nombreMorts}
            onChange={(e) =>
              setNombreMorts(
                Math.min(effectifActuel, Math.max(1, parseInt(e.target.value) || 1))
              )
            }
            className="w-28 text-center text-4xl font-black text-red-600 dark:text-red-400 bg-transparent outline-none"
          />

          <Bouton
            type="button"
            variante="contour"
            taille="iconeLg"
            graisse="black"
            onClick={() => setNombreMorts((n) => Math.min(effectifActuel, n + 1))}
            className="border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-slate-900 active:scale-90"
          >
            <Plus className="w-6 h-6" />
          </Bouton>
        </div>

        {/* Raccourcis +1, +5, +10, +25 */}
        <div className="flex justify-center gap-2 pt-2">
          {[1, 5, 10, 25].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setNombreMorts((n) => Math.min(effectifActuel, n + val))}
              className="px-4 py-2.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-xl text-xs font-bold hover:bg-red-200 active:scale-95 transition-all"
            >
              +{val}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500 font-medium">
          Poissons restants dans le bac :{" "}
          <strong className="text-slate-900 dark:text-white">
            {Math.max(0, effectifActuel - nombreMorts)} poissons
          </strong>
        </p>
      </div>
    </div>
  );
};
