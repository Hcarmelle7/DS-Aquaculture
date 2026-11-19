"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { Bouton } from "@/components/ui/Bouton";
import { cn } from "@/lib/utils";

interface CarteTarifStepperProps {
  libelle: string;
  badgeTexte: string;
  badgeClassName: string;
  valeur: number;
  auChangement: (nouvelleValeur: number) => void;
  min?: number;
  pasBouton?: number;
  pasInput?: number;
  uniteTexte?: string;
}

export const CarteTarifStepper: React.FC<CarteTarifStepperProps> = ({
  libelle,
  badgeTexte,
  badgeClassName,
  valeur,
  auChangement,
  min = 500,
  pasBouton = 100,
  pasInput = 50,
  uniteTexte = "FCFA / Kilogramme",
}) => {
  return (
    <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {libelle}
        </label>
        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", badgeClassName)}>
          {badgeTexte}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Bouton
          type="button"
          variante="contour"
          taille="icone"
          arrondi="xl"
          onClick={() => auChangement(Math.max(min, valeur - pasBouton))}
          className="active:scale-95"
        >
          <Minus className="w-4 h-4" />
        </Bouton>

        <div className="relative flex-1">
          <input
            type="number"
            step={pasInput}
            min={min}
            required
            value={valeur}
            onChange={(e) => auChangement(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xl font-black text-slate-900 dark:text-white text-center outline-none focus:border-[#00d2ff] shadow-sm"
          />
        </div>

        <Bouton
          type="button"
          variante="contour"
          taille="icone"
          arrondi="xl"
          onClick={() => auChangement(valeur + pasBouton)}
          className="active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </Bouton>
      </div>
      <p className="text-[11px] text-center font-bold text-slate-500">{uniteTexte}</p>
    </div>
  );
};
