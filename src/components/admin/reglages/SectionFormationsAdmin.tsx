"use client";

import React from "react";
import { Clock, GraduationCap, ListOrdered } from "lucide-react";
import { SectionCarteAdmin } from "@/components/admin/SectionCarteAdmin";

interface SectionFormationsAdminProps {
  prixFormation: number;
  setPrixFormation: (val: number) => void;
  dureeFormation: string;
  setDureeFormation: (val: string) => void;
  texteFormation: string;
  setTexteFormation: (val: string) => void;
  programmeFormation: string;
  setProgrammeFormation: (val: string) => void;
}

export const SectionFormationsAdmin: React.FC<SectionFormationsAdminProps> = ({
  prixFormation,
  setPrixFormation,
  dureeFormation,
  setDureeFormation,
  texteFormation,
  setTexteFormation,
  programmeFormation,
  setProgrammeFormation,
}) => {
  return (
    <SectionCarteAdmin
      titre="Formations & Accompagnement"
      sousTitre="Personnalisez le tarif, la durée et le programme complet des modules de formation."
      Icone={GraduationCap}
      iconeContainerClassName="bg-[#28a9ed]/10 text-[#28a9ed] border-[#28a9ed]/20"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Tarif de la Formation (FCFA)
          </label>
          <div className="relative">
            <input
              type="number"
              step={1000}
              min={1000}
              required
              value={prixFormation}
              onChange={(e) => setPrixFormation(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-[#00d2ff] shadow-sm"
            />
            <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
              FCFA
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Durée de la formation</span>
          </label>
          <input
            type="text"
            required
            value={dureeFormation}
            onChange={(e) => setDureeFormation(e.target.value)}
            placeholder="Ex: 5 Jours complets, 3 Jours intensifs..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#00d2ff] shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
          Description générale de l&apos;offre
        </label>
        <textarea
          rows={2}
          required
          value={texteFormation}
          onChange={(e) => setTexteFormation(e.target.value)}
          placeholder="Explication synthétique du bénéfice de la formation..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-[#00d2ff] transition-all resize-none shadow-sm font-medium"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
          <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
          <span>Programme détaillé des modules (1 module par ligne)</span>
        </label>
        <textarea
          rows={5}
          required
          value={programmeFormation}
          onChange={(e) => setProgrammeFormation(e.target.value)}
          placeholder="Module 1 : Dimensionnement des bacs&#10;Module 2 : Qualité de l'eau&#10;Module 3 : Alimentation et calcul des rations..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-[#00d2ff] transition-all resize-none shadow-sm"
        />
        <p className="text-[11px] text-slate-500 mt-1 font-medium">
          💡 Chaque ligne saisie apparaîtra automatiquement comme une étape avec coche verte dans la section &quot;Au programme&quot; de la vitrine.
        </p>
      </div>
    </SectionCarteAdmin>
  );
};
