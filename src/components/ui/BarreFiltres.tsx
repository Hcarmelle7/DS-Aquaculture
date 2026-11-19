import React from "react";
import { cn } from "@/lib/utils";

export interface OptionFiltre<T extends string> {
  valeur: T;
  libelle: string;
  classeActif: string;
}

interface BarreFiltresProps<T extends string> {
  options: OptionFiltre<T>[];
  valeurActive: T;
  auChangement: (valeur: T) => void;
  classeInactif?: string;
  classeBouton?: string;
  className?: string;
}

export function BarreFiltres<T extends string>({
  options,
  valeurActive,
  auChangement,
  classeInactif = "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800",
  classeBouton = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
  className,
}: BarreFiltresProps<T>) {
  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0", className)}>
      {options.map((option) => {
        const actif = valeurActive === option.valeur;
        return (
          <button
            key={option.valeur}
            type="button"
            onClick={() => auChangement(option.valeur)}
            className={cn(classeBouton, actif ? option.classeActif : classeInactif)}
          >
            {option.libelle}
          </button>
        );
      })}
    </div>
  );
}
