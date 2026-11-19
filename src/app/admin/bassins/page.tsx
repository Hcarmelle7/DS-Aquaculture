"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { BassinCard } from "@/components/admin/BassinCard";
import { ModalGenerique } from "@/components/admin/ModalGenerique";
import { ModalActionRapide } from "@/components/admin/ModalActionRapide";
import { JournalOperationsModal } from "@/components/admin/JournalOperationsModal";
import { FormulaireBassin } from "@/components/admin/FormulaireBassin";
import { FormulaireLot } from "@/components/admin/FormulaireLot";
import { StatCard } from "@/components/admin/StatCard";
import { Bouton } from "@/components/ui/Bouton";
import { BarreFiltres, OptionFiltre } from "@/components/ui/BarreFiltres";
import { EtatVide } from "@/components/ui/EtatVide";
import { Plus, Waves, Scale, Fish, Activity, History, Droplet } from "lucide-react";
import { Bassin, Lot } from "@/models";

type FiltreBassin = "tous" | "en_eau" | "vides";

export default function PageBassins() {
  const {
    bassins,
    lots,
    operationsLog,
    chargerBassins,
    chargerOperationsLog,
    chargerRelevesQualiteEau,
    supprimerBassin,
  } = useAppStore();

  const [modalBassinOuvert, setModalBassinOuvert] = useState(false);
  const [bassinAEditer, setBassinAEditer] = useState<Bassin | undefined>(undefined);
  const [modalLotOuvert, setModalLotOuvert] = useState(false);
  const [bassinCibleId, setBassinCibleId] = useState<string>("");

  const [modalActionRapideOuvert, setModalActionRapideOuvert] = useState(false);
  const [bassinPourAction, setBassinPourAction] = useState<Bassin | null>(null);
  const [lotPourAction, setLotPourAction] = useState<Lot | undefined>(undefined);

  const [modalHistoriqueOuvert, setModalHistoriqueOuvert] = useState(false);
  const [filtre, setFiltre] = useState<FiltreBassin>("tous");

  useEffect(() => {
    chargerBassins();
    chargerOperationsLog();
    chargerRelevesQualiteEau();
  }, [chargerBassins, chargerOperationsLog, chargerRelevesQualiteEau]);

  const bassinsEnEau = bassins.filter((b) => {
    const lot = lots.find((l) => l.bassinId === b.id && l.statut === "en_cours");
    return lot && lot.quantiteActuelle > 0;
  });

  const totalPoissons = lots
    .filter((l) => l.statut === "en_cours")
    .reduce((acc, l) => acc + (l.quantiteActuelle || 0), 0);

  const totalBiomasseKg = Number(
    lots
      .filter((l) => l.statut === "en_cours")
      .reduce(
        (acc, l) =>
          acc + ((l.quantiteActuelle || 0) * (l.poidsMoyenInitialG || 0)) / 1000,
        0
      )
      .toFixed(1)
  );

  const handleOuvrirModalBassin = (bassin?: Bassin) => {
    setBassinAEditer(bassin);
    setModalBassinOuvert(true);
  };

  const handleFermerModalBassin = () => {
    setModalBassinOuvert(false);
    setBassinAEditer(undefined);
  };

  const handleOuvrirModalLot = (bassinId: string) => {
    setBassinCibleId(bassinId);
    setModalLotOuvert(true);
  };

  const handleOuvrirActionRapide = (bassin: Bassin, lotActif: Lot) => {
    setBassinPourAction(bassin);
    setLotPourAction(lotActif);
    setModalActionRapideOuvert(true);
  };

  const handleActionBassin = (bassinId: string) => {
    const lotActif = lots.find((l) => l.bassinId === bassinId && l.statut === "en_cours");
    if (!lotActif) {
      handleOuvrirModalLot(bassinId);
    } else {
      const bassinTrouve = bassins.find((b) => b.id === bassinId);
      if (bassinTrouve) {
        handleOuvrirActionRapide(bassinTrouve, lotActif);
      }
    }
  };

  const bassinsFiltres = bassins.filter((b) => {
    const lotActif = lots.find((l) => l.bassinId === b.id && l.statut === "en_cours");
    const aDesPoissons = lotActif && lotActif.quantiteActuelle > 0;
    if (filtre === "en_eau") return aDesPoissons;
    if (filtre === "vides") return !aDesPoissons;
    return true;
  });

  const optionsFiltres: OptionFiltre<FiltreBassin>[] = [
    {
      valeur: "tous",
      libelle: `Tous (${bassins.length})`,
      classeActif: "bg-[#00d2ff] text-slate-950 shadow-sm",
    },
    {
      valeur: "en_eau",
      libelle: `En Production (${bassinsEnEau.length})`,
      classeActif: "bg-[#28a9ed] text-white shadow-sm",
    },
    {
      valeur: "vides",
      libelle: `Vides (${bassins.length - bassinsEnEau.length})`,
      classeActif: "bg-slate-800 text-white shadow-sm",
    },
  ];

  return (
    <AdminPageLayout
      titre="Gestion des Bassins"
      sousTitre="Tableau de bord des bacs, pesées rapides et suivi des poissons."
      Icone={Waves}
      actions={
        <div className="flex items-center gap-2.5">
          <Bouton
            variante="secondaire"
            onClick={() => setModalHistoriqueOuvert(true)}
            iconeGauche={<History className="w-4 h-4 text-[#28a9ed]" />}
            className="py-3 px-4 border-slate-300 dark:border-slate-800"
          >
            <span className="hidden sm:inline">Historique des pesées & tris</span>
            <span className="sm:hidden">Historique</span>
          </Bouton>

          <Bouton
            variante="primaire"
            graisse="black"
            onClick={() => handleOuvrirModalBassin()}
            iconeGauche={<Plus className="w-5 h-5" />}
            className="py-3 px-4"
          >
            <span>Nouveau Bac</span>
          </Bouton>
        </div>
      }
      modals={
        <>
          {bassinPourAction && lotPourAction && (
            <ModalActionRapide
              estOuvert={modalActionRapideOuvert}
              fermer={() => {
                setModalActionRapideOuvert(false);
                setBassinPourAction(null);
                setLotPourAction(undefined);
              }}
              bassin={bassinPourAction}
              lotActif={lotPourAction}
            />
          )}

          <ModalGenerique
            estOuvert={modalBassinOuvert}
            fermer={handleFermerModalBassin}
            titre={bassinAEditer ? "Modifier le Bassin" : "Nouveau Bassin"}
          >
            <FormulaireBassin
              bassinExistant={bassinAEditer}
              auTermine={handleFermerModalBassin}
            />
          </ModalGenerique>

          <ModalGenerique
            estOuvert={modalLotOuvert}
            fermer={() => setModalLotOuvert(false)}
            titre="Ajouter un Lot (Empoissonnement)"
          >
            <FormulaireLot
              bassinId={bassinCibleId}
              auTermine={() => setModalLotOuvert(false)}
            />
          </ModalGenerique>

          <JournalOperationsModal
            estOuvert={modalHistoriqueOuvert}
            fermer={() => setModalHistoriqueOuvert(false)}
            operationsLog={operationsLog}
            bassins={bassins}
          />
        </>
      }
    >
      {/* Synthèse du Tableau Blanc (KPIs en direct) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          titre="Poids Total de Tous les Poissons"
          valeur={`${totalBiomasseKg.toLocaleString("fr-FR")} Kg`}
          Icone={Scale}
          description="Estimation totale de la ferme"
        />
        <StatCard
          titre="Total Poissons Vivants"
          valeur={`${totalPoissons.toLocaleString("fr-FR")} poissons`}
          Icone={Fish}
          description="Total des poissons dans tous les bacs"
        />
        <StatCard
          titre="Bacs avec Poissons"
          valeur={`${bassinsEnEau.length} / ${bassins.length}`}
          Icone={Droplet}
          description={`${bassins.length - bassinsEnEau.length} bacs vides actuellement`}
        />
        <StatCard
          titre="Pesées & Tris Enregistrés"
          valeur={`${operationsLog.length}`}
          Icone={Activity}
          description="Historique des actions de l'équipe"
        />
      </div>

      {/* Barre de filtres rapides */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <BarreFiltres
          options={optionsFiltres}
          valeurActive={filtre}
          auChangement={setFiltre}
        />
      </div>

      {/* Grille des Bassins */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bassinsFiltres.map((bassin) => {
          const lotActif = lots.find(
            (l) => l.bassinId === bassin.id && l.statut === "en_cours"
          );
          return (
            <div key={bassin.id} className="relative">
              <BassinCard
                bassin={bassin}
                lotActif={lotActif}
                surAction={handleActionBassin}
                surOuvrirActionRapide={handleOuvrirActionRapide}
                surEditerBassin={handleOuvrirModalBassin}
                surSupprimerBassin={(id) => {
                  if (confirm("Supprimer ce bassin vide ?")) {
                    supprimerBassin(id);
                  }
                }}
              />
            </div>
          );
        })}

        {bassinsFiltres.length === 0 && (
          <EtatVide
            Icone={Waves}
            titre="Aucun bassin trouvé"
            message="Aucun bassin ne correspond au filtre sélectionné."
            variante="carteDashed"
            action={
              <Bouton variante="primaire" onClick={() => handleOuvrirModalBassin()}>
                Créer un bassin
              </Bouton>
            }
          />
        )}
      </div>
    </AdminPageLayout>
  );
}
