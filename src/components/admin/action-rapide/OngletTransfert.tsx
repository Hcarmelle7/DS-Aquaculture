"use client";

import React from "react";
import { Bassin } from "@/models";
import { Bouton } from "@/components/ui/Bouton";

interface OngletTransfertProps {
  bassinsDestDisponibles: Bassin[];
  bassinDestId: string;
  setBassinDestId: (id: string) => void;
  quantiteATransferer: number;
  setQuantiteATransferer: (val: number) => void;
  effectifActuel: number;
}

export const OngletTransfert: React.FC<OngletTransfertProps> = ({
  bassinsDestDisponibles,
  bassinDestId,
  setBassinDestId,
  quantiteATransferer,
  setQuantiteATransferer,
  effectifActuel,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Vers quel bac déplacer ?
          </label>
          <select
            value={bassinDestId}
            onChange={(e) => setBassinDestId(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#28a9ed]"
          >
            {bassinsDestDisponibles.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nom} ({b.categorie}) -{" "}
                {b.nombrePoissons ? `${b.nombrePoissons} poissons` : "Bac vide"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Combien de poissons déplacer ?
            </label>
            <span className="text-xs text-slate-500 font-semibold">
              Max : {effectifActuel}
            </span>
          </div>
          <input
            type="number"
            required
            min={1}
            max={effectifActuel}
            value={quantiteATransferer}
            onChange={(e) =>
              setQuantiteATransferer(
                Math.min(effectifActuel, Math.max(1, parseInt(e.target.value) || 0))
              )
            }
            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-lg font-black text-[#28a9ed] outline-none focus:border-[#28a9ed]"
          />

          {/* Boutons d'ajout au pouce */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[50, 100, 200, Math.floor(effectifActuel / 2)].map((nb, idx) => (
              <Bouton
                key={`${nb}-${idx}`}
                type="button"
                variante="neutre"
                taille="xs"
                arrondi="xl"
                onClick={() => setQuantiteATransferer(Math.min(effectifActuel, nb))}
                className="py-2.5 active:scale-95"
              >
                +{nb}
              </Bouton>
            ))}
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl text-xs text-blue-700 dark:text-blue-300">
          Après transfert, il restera{" "}
          <strong>{Math.max(0, effectifActuel - quantiteATransferer)} poissons</strong> dans ce
          bac.
        </div>
      </div>
    </div>
  );
};
