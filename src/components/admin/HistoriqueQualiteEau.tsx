"use client";

import React from "react";
import { Activity, Calendar, Droplet, Filter } from "lucide-react";
import { Bassin, ReleveQualiteEau } from "@/models";
import { diagnostiquerQualiteEau } from "@/services/qualiteEau.service";
import { EtatVide } from "@/components/ui/EtatVide";

interface HistoriqueQualiteEauProps {
  bassins: Bassin[];
  relevesFiltres: ReleveQualiteEau[];
  filtreBassinId: string;
  setFiltreBassinId: (id: string) => void;
}

export const HistoriqueQualiteEau: React.FC<HistoriqueQualiteEauProps> = ({
  bassins,
  relevesFiltres,
  filtreBassinId,
  setFiltreBassinId,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
          <Activity className="w-5 h-5 text-[#00d2ff]" />
          <span>Historique des analyses physico-chimiques</span>
        </h2>

        {/* Filtre par bassin */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filtreBassinId}
            onChange={(e) => setFiltreBassinId(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#00d2ff] cursor-pointer"
          >
            <option value="tous">Tous les bassins</option>
            {bassins.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau Desktop */}
      <div className="hidden md:block bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 uppercase font-bold text-xs border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Date & Heure</th>
                <th className="px-6 py-4">Bassin</th>
                <th className="px-6 py-4">Température</th>
                <th className="px-6 py-4">pH</th>
                <th className="px-6 py-4">Oxygène (O₂)</th>
                <th className="px-6 py-4">Diagnostic</th>
                <th className="px-6 py-4">Observations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {relevesFiltres.map((releve) => {
                const bassin = bassins.find((b) => b.id === releve.bassinId);
                const diagnostic = diagnostiquerQualiteEau(
                  releve.temperatureC,
                  releve.ph,
                  releve.oxygeneMgl
                );

                return (
                  <tr
                    key={releve.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {new Date(releve.dateReleve).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {bassin?.nom || "Bassin inconnu"}
                    </td>
                    <td className="px-6 py-4 font-semibold">{releve.temperatureC}°C</td>
                    <td className="px-6 py-4 font-semibold">{releve.ph}</td>
                    <td className="px-6 py-4 font-black text-[#28a9ed] dark:text-[#00d2ff]">
                      {releve.oxygeneMgl} mg/L
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${diagnostic.classeFond} ${diagnostic.classeTexte} ${diagnostic.classeBordure}`}
                      >
                        <span>{diagnostic.titre}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {releve.remarques || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {relevesFiltres.length === 0 && (
          <EtatVide
            Icone={Droplet}
            message="Aucun relevé physico-chimique enregistré."
            variante="tableau"
          />
        )}
      </div>

      {/* Cartes Mobile */}
      <div className="md:hidden space-y-3">
        {relevesFiltres.map((releve) => {
          const bassin = bassins.find((b) => b.id === releve.bassinId);
          const diagnostic = diagnostiquerQualiteEau(
            releve.temperatureC,
            releve.ph,
            releve.oxygeneMgl
          );

          return (
            <div
              key={releve.id}
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {bassin?.nom || "Bassin inconnu"}
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(releve.dateReleve).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border ${diagnostic.classeFond} ${diagnostic.classeTexte} ${diagnostic.classeBordure}`}
                >
                  {diagnostic.titre}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Temp
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {releve.temperatureC}°C
                  </span>
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    pH
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {releve.ph}
                  </span>
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    O₂
                  </span>
                  <span className="text-xs font-black text-[#28a9ed] dark:text-[#00d2ff]">
                    {releve.oxygeneMgl} mg/L
                  </span>
                </div>
              </div>

              {releve.remarques && (
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {releve.remarques}
                </p>
              )}
            </div>
          );
        })}

        {relevesFiltres.length === 0 && (
          <EtatVide
            Icone={Droplet}
            message="Aucun relevé physico-chimique trouvé."
            variante="mobile"
          />
        )}
      </div>
    </div>
  );
};
