"use client";

import React from "react";
import { Carte } from "@/components/ui/Carte";
import { Bassin, Lot } from "@/types";
import {
  Droplet,
  Plus,
  Fish,
  Scale,
  Skull,
  MoreVertical,
  Activity,
  Layers,
  Edit2,
  Trash2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

interface BassinCardProps {
  bassin: Bassin;
  lotActif?: Lot;
  surAction: (bassinId: string) => void;
  surOuvrirActionRapide?: (
    bassin: Bassin,
    lotActif: Lot,
    modeInitial?: "calibrage" | "mortalite"
  ) => void;
  surEditerBassin?: (bassin: Bassin) => void;
  surSupprimerBassin?: (bassinId: string) => void;
}

export const BassinCard: React.FC<BassinCardProps> = ({
  bassin,
  lotActif,
  surAction,
  surOuvrirActionRapide,
  surEditerBassin,
  surSupprimerBassin,
}) => {
  const { relevesQualiteEau } = useAppStore();
  const dernierReleveEau = relevesQualiteEau.find((r) => r.bassinId === bassin.id);

  const estVide = !lotActif || lotActif.statut !== "en_cours";
  const capaciteMax = bassin.capaciteMaxPoissons || 1500;
  const effectif = lotActif?.quantiteActuelle || 0;
  const poidsMoyen = lotActif?.poidsMoyenInitialG || 0;
  const biomasseKg = Number(((effectif * poidsMoyen) / 1000).toFixed(1));

  // Taux de charge en %
  const tauxCharge = Math.min(100, Math.round((effectif / capaciteMax) * 100));

  return (
    <Carte
      surbrillance={!estVide}
      className={`flex flex-col h-full justify-between relative overflow-hidden transition-all duration-300 ${
        !estVide
          ? "border-[#00d2ff]/30 shadow-[0_4px_25px_rgba(0,210,255,0.08)]"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      {/* 1. En-tête de la carte */}
      <div>
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00d2ff]/15 to-[#28a9ed]/10 text-[#28a9ed] dark:text-[#00d2ff] flex items-center justify-center border border-[#00d2ff]/25 shrink-0 shadow-sm">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                {bassin.nom}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                  {bassin.categorie}
                </span>
                {bassin.statut && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      bassin.statut === "actif"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {bassin.statut}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions d'édition discrètes */}
          <div className="flex items-center gap-1">
            {surEditerBassin && (
              <button
                type="button"
                onClick={() => surEditerBassin(bassin)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                title="Modifier le bassin"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {surSupprimerBassin && estVide && (
              <button
                type="button"
                onClick={() => surSupprimerBassin(bassin.id)}
                className="w-8 h-8 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                title="Supprimer le bassin vide"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Contenu central - Données du Tableau Blanc */}
        {estVide ? (
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-6 mb-4 border border-slate-200/80 dark:border-slate-800/60 text-center flex flex-col items-center justify-center gap-2 min-h-[160px]">
            <div className="w-12 h-12 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <Fish className="w-6 h-6" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-bold text-sm">
              Bassin vide / Assec
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Capacité : {capaciteMax} poissons
            </p>
          </div>
        ) : (
          <div className="bg-slate-50/90 dark:bg-slate-900/50 rounded-2xl p-4 mb-4 border border-slate-200/80 dark:border-slate-800/60 space-y-3.5">
            {/* Souche & Poids total estimé */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-slate-800/60">
              {/* <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Fish className="w-3.5 h-3.5 text-[#28a9ed]" />
                {lotActif.souche}
              </span> */}
              <div className="text-right">
                <span className="text-xs text-start font-bold text-slate-500 dark:text-slate-400 block text-[10px] uppercase tracking-wider">
                  Type
                </span>
                <span className=" font-black text-[#28a9ed] dark:text-[#00d2ff]">
                  {lotActif.souche} 
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block text-[10px] uppercase tracking-wider">
                  Poids total estimé
                </span>
                <span className="text-lg font-black text-[#28a9ed] dark:text-[#00d2ff]">
                  {biomasseKg} <span className="text-xs font-bold">Kg</span>
                </span>
              </div>
            </div>

            {/* Poissons et Poids moyen en 2 grandes tuiles tactiles */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                  Poissons dans le bac
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {effectif.toLocaleString("fr-FR")}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">poissons</span>
              </div>

              <div className="bg-white dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                  Poids moyen (1 poisson)
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {poidsMoyen}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">grammes</span>
              </div>
            </div>

            {/* Relevé d'eau récent */}
            {dernierReleveEau && (
              <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-[11px]">
                  <Droplet className="w-3.5 h-3.5 text-[#00d2ff]" />
                  Eau :
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  {dernierReleveEau.temperatureC}°C • pH {dernierReleveEau.ph} • {dernierReleveEau.oxygeneMgl} mg/L
                </span>
              </div>
            )}

            {/* Jauge de taux de remplissage */}
            <div>
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                <span>Remplissage : {tauxCharge}%</span>
                <span>Max : {capaciteMax} poissons</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    tauxCharge > 95
                      ? "bg-red-500"
                      : tauxCharge > 80
                      ? "bg-amber-500"
                      : "bg-[#00d2ff]"
                  }`}
                  style={{ width: `${tauxCharge}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Boutons d'Action Rapide Mobile (Très larges pour usage à 1 main près de l'eau) */}
      <div className="pt-1">
        {estVide ? (
          <button
            type="button"
            onClick={() => surAction(bassin.id)}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#00d2ff] hover:bg-[#00b4db] text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00d2ff]/20 active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Mettre des poissons dans ce bac</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {/* Bouton PESER / TRIER */}
            <button
              type="button"
              onClick={() =>
                surOuvrirActionRapide
                  ? surOuvrirActionRapide(bassin, lotActif, "calibrage")
                  : surAction(bassin.id)
              }
              className="py-3.5 px-3 rounded-2xl bg-gradient-to-r from-[#28a9ed] to-[#00d2ff] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#00d2ff]/20 active:scale-[0.97] transition-all hover:brightness-105"
            >
              <Scale className="w-4 h-4 shrink-0" />
              <span>Peser / Trier</span>
            </button>

            {/* Bouton DÉCLARER MORTALITÉ */}
            <button
              type="button"
              onClick={() =>
                surOuvrirActionRapide
                  ? surOuvrirActionRapide(bassin, lotActif, "mortalite")
                  : surAction(bassin.id)
              }
              className="py-3.5 px-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 font-black text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
            >
              <Skull className="w-4 h-4 shrink-0 text-red-500" />
              <span>Mortalité</span>
            </button>
          </div>
        )}
      </div>
    </Carte>
  );
};
