"use client";

import React from "react";
import { AlertTriangle, Calendar, CheckCircle2, Plus } from "lucide-react";
import { Bassin, ReleveQualiteEau } from "@/models";
import { diagnostiquerQualiteEau } from "@/services/qualiteEau.service";
import { Bouton } from "@/components/ui/Bouton";

interface CarteDiagnosticEauBassinProps {
  bassin: Bassin;
  dernierReleve?: ReleveQualiteEau;
  auTester: (bassinId: string) => void;
}

export const CarteDiagnosticEauBassin: React.FC<CarteDiagnosticEauBassinProps> = ({
  bassin,
  dernierReleve,
  auTester,
}) => {
  const diagnostic = dernierReleve
    ? diagnostiquerQualiteEau(
        dernierReleve.temperatureC,
        dernierReleve.ph,
        dernierReleve.oxygeneMgl
      )
    : null;

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Entête Bassin */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">
              {bassin.nom}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {bassin.nombrePoissons ? `${bassin.nombrePoissons} poissons en bac` : "Bassin vide"}
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
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Temp
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {dernierReleve.temperatureC}°C
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  pH
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {dernierReleve.ph}
                </span>
              </div>

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
                {new Date(dernierReleve.dateReleve).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 text-center mb-4">
            <p className="text-xs text-slate-500">
              Aucun test de qualité d&apos;eau enregistré sur ce bac.
            </p>
          </div>
        )}
      </div>

      <Bouton
        type="button"
        variante="discret"
        taille="xs"
        bordure="fine"
        arrondi="xl"
        pleineLargeur
        iconeGauche={<Plus className="w-3.5 h-3.5" />}
        onClick={() => auTester(bassin.id)}
        className="py-2.5 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-transparent hover:border-[#00d2ff] hover:text-[#00d2ff]"
      >
        <span>Tester ce bac</span>
      </Bouton>
    </div>
  );
};
