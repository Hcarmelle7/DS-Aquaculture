"use client";

import React, { useEffect, useState } from "react";
import { Plus, Utensils, Calendar } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Bouton } from "@/components/ui/Bouton";
import { EtatVide } from "@/components/ui/EtatVide";
import { ModalGenerique } from "@/components/admin/ModalGenerique";
import { FormulaireNourrissage } from "@/components/admin/FormulaireNourrissage";

export default function PageNourriture() {
  const { relevesNourrissage, chargerRelevesNourrissage, lots, bassins } = useAppStore();
  const [modalOuvert, setModalOuvert] = useState(false);

  useEffect(() => {
    chargerRelevesNourrissage();
  }, [chargerRelevesNourrissage]);

  return (
    <AdminPageLayout
      titre="Historique de Nourrissage"
      sousTitre="Suivi de la distribution d'aliments par bassin."
      Icone={Utensils}
      paddingBottomClass="pb-20"
      titreClassName="mb-2"
      sousTitreClassName="mt-0 text-base"
      actions={
        <Bouton
          variante="primaire"
          onClick={() => setModalOuvert(true)}
          iconeGauche={<Plus className="w-5 h-5" />}
        >
          Nouveau Relevé
        </Bouton>
      }
      modals={
        <ModalGenerique
          estOuvert={modalOuvert}
          fermer={() => setModalOuvert(false)}
          titre="Enregistrer un Nourrissage"
        >
          <FormulaireNourrissage auTermine={() => setModalOuvert(false)} />
        </ModalGenerique>
      }
    >
      {/* Vue Desktop : Tableau structuré */}
      <div className="hidden md:block bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 uppercase font-bold text-xs border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Bassin & Lot</th>
                <th className="px-6 py-4">Aliment</th>
                <th className="px-6 py-4">Quantité</th>
                <th className="px-6 py-4">Observations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {relevesNourrissage.map((releve) => {
                const lot = lots.find((l) => l.id === releve.lotId);
                const bassin = bassins.find((b) => b.id === lot?.bassinId);

                return (
                  <tr
                    key={releve.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {new Date(releve.dateNourrissage).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {bassin?.nom || "?"}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                        {lot?.souche || "?"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                      {releve.typeAliment}
                    </td>
                    <td className="px-6 py-4 font-black text-[#28a9ed] dark:text-[#00d2ff] whitespace-nowrap">
                      {releve.quantiteKg} kg
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {releve.observations || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {relevesNourrissage.length === 0 && (
          <EtatVide
            Icone={Utensils}
            message="Aucun relevé de nourrissage enregistré."
            variante="tableau"
          />
        )}
      </div>

      {/* Vue Mobile : Cartes empilées */}
      <div className="md:hidden space-y-3">
        {relevesNourrissage.map((releve) => {
          const lot = lots.find((l) => l.id === releve.lotId);
          const bassin = bassins.find((b) => b.id === lot?.bassinId);

          return (
            <div
              key={releve.id}
              className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {new Date(releve.dateNourrissage).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <span className="font-black text-[#28a9ed] dark:text-[#00d2ff] text-base">
                  {releve.quantiteKg} kg
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {bassin?.nom || "Bassin inconnu"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {lot?.souche || "Lot non précisé"}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20">
                  {releve.typeAliment}
                </span>
              </div>

              {releve.observations && (
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                  {releve.observations}
                </p>
              )}
            </div>
          );
        })}

        {relevesNourrissage.length === 0 && (
          <EtatVide
            Icone={Utensils}
            message="Aucun relevé de nourrissage enregistré."
            variante="mobile"
          />
        )}
      </div>
    </AdminPageLayout>
  );
}
