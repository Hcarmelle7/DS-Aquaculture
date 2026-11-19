"use client";

import React, { useEffect, useState } from "react";
import { Droplet, Plus, Waves } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Bouton } from "@/components/ui/Bouton";
import { ModalGenerique } from "@/components/admin/ModalGenerique";
import { FormulaireQualiteEau } from "@/components/admin/FormulaireQualiteEau";
import { CarteDiagnosticEauBassin } from "@/components/admin/CarteDiagnosticEauBassin";
import { HistoriqueQualiteEau } from "@/components/admin/HistoriqueQualiteEau";

export default function PageQualiteEau() {
  const { bassins, relevesQualiteEau, chargerBassins, chargerRelevesQualiteEau } =
    useAppStore();

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

  const relevesFiltres = relevesQualiteEau.filter((r) =>
    filtreBassinId === "tous" ? true : r.bassinId === filtreBassinId
  );

  return (
    <AdminPageLayout
      titre="Qualité de l'Eau"
      sousTitre="Surveillance du pH, de l'oxygène et de la température pour prévenir la mortalité."
      Icone={Droplet}
      actions={
        <Bouton
          variante="primaire"
          onClick={() => ouvrirNouveauReleve()}
          iconeGauche={<Plus className="w-5 h-5" />}
          className="py-3 px-5 shadow-lg shadow-[#00d2ff]/20"
        >
          <span>Nouveau Relevé d&apos;Eau</span>
        </Bouton>
      }
      modals={
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
      }
    >
      {/* 1. Grille des bassins : état de santé en direct */}
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
            const dernierReleve = relevesQualiteEau.find((r) => r.bassinId === bassin.id);
            return (
              <CarteDiagnosticEauBassin
                key={bassin.id}
                bassin={bassin}
                dernierReleve={dernierReleve}
                auTester={ouvrirNouveauReleve}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Historique détaillé des mesures */}
      <HistoriqueQualiteEau
        bassins={bassins}
        relevesFiltres={relevesFiltres}
        filtreBassinId={filtreBassinId}
        setFiltreBassinId={setFiltreBassinId}
      />
    </AdminPageLayout>
  );
}
