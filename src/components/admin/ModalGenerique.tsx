"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalGeneriqueProps {
  estOuvert: boolean;
  fermer: () => void;
  titre: string;
  children: React.ReactNode;
}

export const ModalGenerique: React.FC<ModalGeneriqueProps> = ({
  estOuvert,
  fermer,
  titre,
  children,
}) => {
  useEffect(() => {
    if (estOuvert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [estOuvert]);

  if (!estOuvert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Fond obscurci */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={fermer}
      />

      {/* Conteneur Modal (Bottom sheet sur mobile, centré sur desktop, avec scroll garanti) */}
      <div className="relative w-full sm:max-w-lg bg-white dark:bg-[#050811] border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-[2rem] sm:rounded-3xl shadow-2xl flex flex-col max-h-[90dvh] sm:max-h-[85vh] min-h-0 animate-in slide-in-from-bottom-6 sm:fade-in sm:zoom-in duration-200 overflow-hidden">
        {/* Poignée tactile pour mobile */}
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-2.5 -mb-1 sm:hidden shrink-0" />

        {/* En-tête fixe : toujours visible avec le bouton de fermeture */}
        <div className="flex items-center justify-between px-5 py-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white/95 dark:bg-[#050811]/95 backdrop-blur-sm z-10">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate pr-2">
            {titre}
          </h2>
          <button
            type="button"
            onClick={fermer}
            aria-label="Fermer la boîte de dialogue"
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corps scrollable : min-h-0 + flex-1 garantit le scrolling et empêche le débordement */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
};
