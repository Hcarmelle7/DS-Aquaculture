"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Bouton } from "@/components/ui/Bouton";
import { Droplet, Thermometer, Activity, Wind, AlertCircle, CheckCircle2 } from "lucide-react";
import { evaluerTemperature, evaluerPh, evaluerOxygene } from "@/lib/qualiteEau";

interface FormulaireQualiteEauProps {
  bassinIdParDefaut?: string;
  auTermine: () => void;
}

export const FormulaireQualiteEau: React.FC<FormulaireQualiteEauProps> = ({
  bassinIdParDefaut,
  auTermine,
}) => {
  const { bassins, ajouterReleveQualiteEau } = useAppStore();

  const [bassinId, setBassinId] = useState<string>(
    bassinIdParDefaut || bassins[0]?.id || ""
  );
  const [temperature, setTemperature] = useState<string>("28");
  const [ph, setPh] = useState<string>("7.2");
  const [oxygene, setOxygene] = useState<string>("5.5");
  const [remarques, setRemarques] = useState<string>("");
  const [enCours, setEnCours] = useState<boolean>(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const numTemp = parseFloat(temperature) || 0;
  const numPh = parseFloat(ph) || 0;
  const numOxy = parseFloat(oxygene) || 0;

  const diagTemp = temperature ? evaluerTemperature(numTemp) : null;
  const diagPh = ph ? evaluerPh(numPh) : null;
  const diagOxy = oxygene ? evaluerOxygene(numOxy) : null;

  const handleSoumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bassinId) {
      setErreur("Veuillez sélectionner un bassin.");
      return;
    }
    if (isNaN(numTemp) || isNaN(numPh) || isNaN(numOxy)) {
      setErreur("Veuillez saisir des valeurs numériques valides.");
      return;
    }

    setEnCours(true);
    setErreur(null);
    try {
      const res = await ajouterReleveQualiteEau({
        bassinId,
        temperatureC: numTemp,
        ph: numPh,
        oxygeneMgl: numOxy,
        remarques: remarques.trim() || undefined,
      });

      if (res) {
        auTermine();
      } else {
        setErreur("Échec de l'enregistrement du relevé.");
      }
    } catch {
      setErreur("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <form onSubmit={handleSoumettre} className="space-y-5">
      {erreur && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{erreur}</span>
        </div>
      )}

      {/* Sélection du Bassin */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Bassin à analyser
        </label>
        <select
          value={bassinId}
          onChange={(e) => setBassinId(e.target.value)}
          required
          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all shadow-sm cursor-pointer"
        >
          {bassins.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nom} {b.nombrePoissons ? `(${b.nombrePoissons} poissons)` : "(Bac vide)"}
            </option>
          ))}
        </select>
      </div>

      {/* 3 Paramètres Clés */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Température */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-orange-500" />
              Température
            </span>
            <span className="text-[10px] text-slate-400 font-bold">°C</span>
          </div>
          <input
            type="number"
            step="0.1"
            min="10"
            max="45"
            required
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-lg font-black text-slate-900 dark:text-white focus:border-[#00d2ff] outline-none shadow-sm"
          />
          {diagTemp && (
            <p className={`text-[11px] font-bold p-1.5 rounded-lg border leading-tight ${diagTemp.badgeClasse}`}>
              {diagTemp.message}
            </p>
          )}
        </div>

        {/* pH */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              Potentiel pH
            </span>
            <span className="text-[10px] text-slate-400 font-bold">pH</span>
          </div>
          <input
            type="number"
            step="0.1"
            min="0"
            max="14"
            required
            value={ph}
            onChange={(e) => setPh(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-lg font-black text-slate-900 dark:text-white focus:border-[#00d2ff] outline-none shadow-sm"
          />
          {diagPh && (
            <p className={`text-[11px] font-bold p-1.5 rounded-lg border leading-tight ${diagPh.badgeClasse}`}>
              {diagPh.message}
            </p>
          )}
        </div>

        {/* Oxygène dissous */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-[#00d2ff]" />
              Oxygène (O₂)
            </span>
            <span className="text-[10px] text-slate-400 font-bold">mg/L</span>
          </div>
          <input
            type="number"
            step="0.1"
            min="0"
            max="20"
            required
            value={oxygene}
            onChange={(e) => setOxygene(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-lg font-black text-slate-900 dark:text-white focus:border-[#00d2ff] outline-none shadow-sm"
          />
          {diagOxy && (
            <p className={`text-[11px] font-bold p-1.5 rounded-lg border leading-tight ${diagOxy.badgeClasse}`}>
              {diagOxy.message}
            </p>
          )}
        </div>
      </div>

      {/* Observations / Remarques */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Remarques ou interventions (optionnel)
        </label>
        <textarea
          rows={2}
          value={remarques}
          onChange={(e) => setRemarques(e.target.value)}
          placeholder="Ex: Renouvellement d'un tiers de l'eau effectué, eau limpide."
          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:border-[#00d2ff] outline-none transition-all resize-none shadow-sm"
        />
      </div>

      {/* Boutons d'action épinglés en bas (Sticky) pour rester TOUJOURS visibles sur smartphone */}
      <div className="sticky bottom-0 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-3.5 sm:p-5 bg-white/95 dark:bg-[#050811]/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5 z-10 shadow-lg mt-4">
        <button
          type="button"
          onClick={auTermine}
          className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95"
        >
          Annuler
        </button>
        <Bouton
          type="submit"
          variante="primaire"
          chargement={enCours}
          className="py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 flex-1 sm:flex-initial shadow-md shadow-[#00d2ff]/20 active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Enregistrer le relevé</span>
        </Bouton>
      </div>
    </form>
  );
};
