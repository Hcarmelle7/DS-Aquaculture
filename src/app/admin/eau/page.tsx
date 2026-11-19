"use client";

import React, { useEffect, useState } from "react";
import { NavBar } from "@/components/client/NavBar";
import { useAppStore } from "@/store/useAppStore";
import { Bouton } from "@/components/ui/Bouton";
import {
  Droplet,
  Plus,
  Thermometer,
  Activity,
  Wind,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Waves,
  Filter,
} from "lucide-react";
import { ModalGenerique } from "@/components/admin/ModalGenerique";
import { FormulaireQualiteEau } from "@/components/admin/FormulaireQualiteEau";
import { BanniereErreurReseau } from "@/components/admin/BanniereErreurReseau";
import { diagnostiquerQualiteEau } from "@/lib/qualiteEau";
import { Bassin, ReleveQualiteEau } from "@/types";

export default function PageQualiteEau() {
  const {
    bassins,
    relevesQualiteEau,
    chargerBassins,
    chargerRelevesQualiteEau,
  } = useAppStore();

  const [modalOuvert, setModalOuvert] = useState<boolean>(false);
  const [bassinCibleId, setBassinCibleId] = useState<string | undefined>(undefined);
  const [filtreBassinId, setFiltreBassinId] = useState<string>("tous");

  useEffect(() => {
    chargerBassins();
    chargerRelevesQualiteEau();
  }, [chargerBassins, chargerRelevesQualiteEau]);

  const ouvrirNouveauReleve = (bassinId?: string) => {
    setBassinCibleId(bassinId);
    setModalOuvert(true);
  };

  // Filtrage de l'historique
  const relevesFiltres = relevesQualiteEau.filter((r) =>
    filtreBassinId === "tous" ? true : r.bassinId === filtreBassinId
  );

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-24 transition-colors duration-300">
      <NavBar />

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <BanniereErreurReseau />

        {/* En-tête de page & Action principale */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#28a9ed] dark:text-[#00d2ff] uppercase tracking-wider bg-[#00d2ff]/10 px-2.5 py-1 rounded-full border border-[#00d2ff]/20">
                Santé & Écosystème
              </span>
            </div> */}
            <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3">
              <Droplet className="w-8 h-8 text-[#00d2ff]" />
              Qualité de l'Eau
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Surveillance du pH, de l'oxygène et de la température pour prévenir la mortalité.
            </p>
          </div>

          <Bouton
            variante="primaire"
            onClick={() => ouvrirNouveauReleve()}
            className="py-3 px-5 font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-[#00d2ff]/20"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau Relevé d'Eau</span>
          </Bouton>
        </div>

        {/* 1. GRILLE DES BASSINS : ÉTAT DE SANTÉ EN DIRECT */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black flex items-center gap-2 text-slate-900 dark:text-white">
              <Waves className="w-5 h-5 text-[#28a9ed]" />
              <span>Diagnostic par bassin</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {bassins.length} bacs suivis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bassins.map((bassin) => {
              // Trouver le relevé le plus récent pour ce bassin
              const dernierReleve = relevesQualiteEau.find(
                (r) => r.bassinId === bassin.id
              );
              const diagnostic = dernierReleve
                ? diagnostiquerQualiteEau(
                    dernierReleve.temperatureC,
                    dernierReleve.ph,
                    dernierReleve.oxygeneMgl
                  )
                : null;

              return (
                <div
                  key={bassin.id}
                  className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Entête Bassin */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-black text-base text-slate-900 dark:text-white">
                          {bassin.nom}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {bassin.nombrePoissons
                            ? `${bassin.nombrePoissons} poissons en bac`
                            : "Bassin vide"}
                        </p>
                      </div>

                      {diagnostic ? (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${diagnostic.classeFond} ${diagnostic.classeTexte} ${diagnostic.classeBordure}`}
                        >
                          {diagnostic.statut === "optimal" ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                          <span>{diagnostic.titre}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Sans relevé
                        </span>
                      )}
                    </div>

                    {/* Données physico-chimiques */}
                    {dernierReleve && diagnostic ? (
                      <div className="space-y-2 mb-4">
                        <div className="grid grid-cols-3 gap-2">
                          {/* Température */}
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">
                              Temp
                            </span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                              {dernierReleve.temperatureC}°C
                            </span>
                          </div>

                          {/* pH */}
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">
                              pH
                            </span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                              {dernierReleve.ph}
                            </span>
                          </div>

                          {/* O2 */}
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">
                              O₂
                            </span>
                            <span className="text-sm font-black text-[#28a9ed] dark:text-[#00d2ff]">
                              {dernierReleve.oxygeneMgl} <span className="text-[9px]">mg/L</span>
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium pt-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            Dernière mesure :{" "}
                            {new Date(dernierReleve.dateReleve).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 text-center mb-4">
                        <p className="text-xs text-slate-500">
                          Aucun test de qualité d'eau enregistré sur ce bac.
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => ouvrirNouveauReleve(bassin.id)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#00d2ff] hover:text-[#00d2ff] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tester ce bac</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. HISTORIQUE DÉTAILLÉ DES MESURES */}
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
                        <td className="px-6 py-4 font-semibold">
                          {releve.temperatureC}°C
                        </td>
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
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                <Droplet className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Aucun relevé physico-chimique enregistré.</p>
              </div>
            )}
          </div>

          {/* Cartes Mobile (Smartphone à 1 main au bord de l'eau) */}
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
              <div className="p-8 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500">
                <Droplet className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Aucun relevé physico-chimique trouvé.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <ModalGenerique
        estOuvert={modalOuvert}
        fermer={() => setModalOuvert(false)}
        titre="Enregistrer un Relevé d'Eau"
      >
        <FormulaireQualiteEau
          bassinIdParDefaut={bassinCibleId}
          auTermine={() => setModalOuvert(false)}
        />
      </ModalGenerique>
    </div>
  );
}
