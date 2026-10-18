import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalGeneriqueProps {
  estOuvert: boolean;
  fermer: () => void;
  titre: string;
  children: React.ReactNode;
}

export const ModalGenerique: React.FC<ModalGeneriqueProps> = ({ estOuvert, fermer, titre, children }) => {
  useEffect(() => {
    if (estOuvert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [estOuvert]);

  if (!estOuvert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={fermer}
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-[#050811] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">{titre}</h2>
          <button 
            onClick={fermer}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
