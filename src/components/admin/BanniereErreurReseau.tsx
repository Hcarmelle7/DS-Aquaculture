"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { WifiOff, RefreshCw, X } from "lucide-react";

export const BanniereErreurReseau: React.FC = () => {
  const { erreurChargement, effacerErreur, reessayerChargement } = useAppStore();
  const [enReessai, setEnReessai] = useState(false);

  if (!erreurChargement) return null;

  const handleReessayer = async () => {
    setEnReessai(true);
    try {
      await reessayerChargement();
    } finally {
      setEnReessai(false);
    }
  };

  return (
    <div className="mb-6 p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm transition-all animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
            Connexion réseau instable (mode hors-ligne)
          </p>
          <p className="text-[11px] text-amber-700 dark:text-amber-300/80 font-medium">
            Vos données en mémoire restent préservées. {erreurChargement}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          type="button"
          onClick={handleReessayer}
          disabled={enReessai}
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${enReessai ? "animate-spin" : ""}`} />
          <span>{enReessai ? "Synchronisation..." : "Réessayer"}</span>
        </button>
        <button
          type="button"
          onClick={effacerErreur}
          aria-label="Fermer la notification"
          className="p-1.5 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
