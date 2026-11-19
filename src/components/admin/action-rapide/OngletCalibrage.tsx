"use client";

import React from "react";
import { Calculator } from "lucide-react";

const TAILLES_POISSONS = [
  "Petits (<50g)",
  "Moyens (50-200g)",
  "Gros (250-400g)",
  "Prêts à vendre (>500g)",
] as const;

interface OngletCalibrageProps {
  poissonsComptes: number | "";
  setPoissonsComptes: (val: number | "") => void;
  poidsBalanceKg: number | "";
  setPoidsBalanceKg: (val: number | "") => void;
  poidsMoyenCalculeG: number;
  poissonsParKilo: string;
  totalPoissonsBac: number;
  setTotalPoissonsBac: (val: number) => void;
  effectifActuel: number;
  poidsTotalEstimeBacKg: number;
  taillePoissons: string;
  setTaillePoissons: (val: string) => void;
}

export const OngletCalibrage: React.FC<OngletCalibrageProps> = ({
  poissonsComptes,
  setPoissonsComptes,
  poidsBalanceKg,
  setPoidsBalanceKg,
  poidsMoyenCalculeG,
  poissonsParKilo,
  totalPoissonsBac,
  setTotalPoissonsBac,
  effectifActuel,
  poidsTotalEstimeBacKg,
  taillePoissons,
  setTaillePoissons,
}) => {
  return (
    <div className="space-y-4">
      {/* Cadre de pesée cuvette */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-[#28a9ed] dark:text-[#00d2ff]">
          <Calculator className="w-4 h-4" />
          <span>Pesée sur la balance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Combien de poissons comptés ?
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min={1}
                placeholder="Ex: 40"
                value={poissonsComptes}
                onChange={(e) =>
                  setPoissonsComptes(
                    e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value) || 0)
                  )
                }
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-[#00d2ff]"
              />
              <span className="absolute right-3 top-3.5 text-xs font-bold text-slate-400">
                poissons
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Poids pesé sur la balance (en Kg) ?
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                required
                min={0.1}
                placeholder="Ex: 8"
                value={poidsBalanceKg}
                onChange={(e) =>
                  setPoidsBalanceKg(
                    e.target.value === "" ? "" : parseFloat(e.target.value) || 0
                  )
                }
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-lg font-black text-[#28a9ed] dark:text-[#00d2ff] outline-none focus:border-[#00d2ff]"
              />
              <span className="absolute right-3 top-3.5 text-xs font-bold text-slate-400">
                Kg
              </span>
            </div>
          </div>
        </div>

        {/* Résultat automatique calculé en temps réel */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00d2ff]/10 to-[#28a9ed]/10 border border-[#00d2ff]/30 text-center space-y-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Poids moyen calculé :
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#28a9ed] dark:text-[#00d2ff]">
            {poidsMoyenCalculeG} <span className="text-lg font-bold">g</span>
          </div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Soit environ <strong>{poissonsParKilo} poissons</strong> pour faire 1 Kg.
          </p>
        </div>
      </div>

      {/* Nombre total de poissons dans le bac */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Poissons dans le bac (après tri)
          </label>
          <span className="text-xs text-slate-500">Actuel : {effectifActuel}</span>
        </div>
        <input
          type="number"
          min={0}
          value={totalPoissonsBac}
          onChange={(e) => setTotalPoissonsBac(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-[#00d2ff]"
        />

        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-bold">
          <span className="text-slate-500">Poids total estimé du bac :</span>
          <span className="text-sm font-black text-[#28a9ed] dark:text-[#00d2ff]">
            {poidsTotalEstimeBacKg} Kg
          </span>
        </div>
      </div>

      {/* Taille des poissons */}
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
          Taille des poissons
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TAILLES_POISSONS.map((taille) => (
            <button
              key={taille}
              type="button"
              onClick={() => setTaillePoissons(taille)}
              className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                taillePoissons === taille
                  ? "bg-[#00d2ff]/15 border-[#00d2ff] text-[#28a9ed] dark:text-[#00d2ff] shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {taille}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
