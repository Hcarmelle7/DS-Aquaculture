"use client";

import React, { useState, useEffect } from "react";
import { NavBar } from "@/components/client/NavBar";
import { useAppStore } from "@/store/useAppStore";
import { BassinCard } from "@/components/admin/BassinCard";
import { ModalGenerique } from "@/components/admin/ModalGenerique";
import { ModalActionRapide } from "@/components/admin/ModalActionRapide";
import { FormulaireBassin } from "@/components/admin/FormulaireBassin";
import { FormulaireLot } from "@/components/admin/FormulaireLot";
import { StatCard } from "@/components/admin/StatCard";
import { BanniereErreurReseau } from "@/components/admin/BanniereErreurReseau";
import { Bouton } from "@/components/ui/Bouton";
import {
  Plus,
  Waves,
  Scale,
  Fish,
  Activity,
  History,
  Calendar,
  User,
  ArrowRight,
  Droplet,
} from "lucide-react";
import { Bassin, Lot, OperationLog } from "@/types";

export default function PageBassins() {
  const {
    bassins,
    lots,
    operationsLog,
    chargerBassins,
    chargerOperationsLog,
    supprimerBassin,
  } = useAppStore();

  // Modals d'infrastructure
  const [modalBassinOuvert, setModalBassinOuvert] = useState(false);
  const [bassinAEditer, setBassinAEditer] = useState<Bassin | undefined>(undefined);
  const [modalLotOuvert, setModalLotOuvert] = useState(false);
  const [bassinCibleId, setBassinCibleId] = useState<string>("");

  // Modal d'Action Rapide (Calibrage / Tri / Mortalité)
  const [modalActionRapideOuvert, setModalActionRapideOuvert] = useState(false);
  const [bassinPourAction, setBassinPourAction] = useState<Bassin | null>(null);
  const [lotPourAction, setLotPourAction] = useState<Lot | undefined>(undefined);

  // Modal Historique
  const [modalHistoriqueOuvert, setModalHistoriqueOuvert] = useState(false);

  // Filtre d'affichage
  const [filtre, setFiltre] = useState<"tous" | "en_eau" | "vides">("tous");

  useEffect(() => {
    chargerBassins();
    chargerOperationsLog();
  }, [chargerBassins, chargerOperationsLog]);

  // Calcul des statistiques globales du tableau blanc
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

  // Gestion des ouvertures
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

  const handleOuvrirActionRapide = (
    bassin: Bassin,
    lotActif: Lot,
    modeInitial?: "calibrage" | "mortalite"
  ) => {
    setBassinPourAction(bassin);
    setLotPourAction(lotActif);
    setModalActionRapideOuvert(true);
  };

  // Filtrage des bassins
  const bassinsFiltres = bassins.filter((b) => {
    const lotActif = lots.find((l) => l.bassinId === b.id && l.statut === "en_cours");
    const aDesPoissons = lotActif && lotActif.quantiteActuelle > 0;
    if (filtre === "en_eau") return aDesPoissons;
    if (filtre === "vides") return !aDesPoissons;
    return true;
  });

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
                Tableau Blanc Numérique
              </span>
            </div> */}
            <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3">
              <Waves className="w-8 h-8 text-[#00d2ff]" />
              Gestion des Bassins
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Tableau de bord des bacs, pesées rapides et suivi des poissons.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Bouton
              variante="secondaire"
              onClick={() => setModalHistoriqueOuvert(true)}
              className="py-3 px-4 font-bold rounded-2xl flex items-center gap-2 border border-slate-300 dark:border-slate-800"
            >
              <History className="w-4 h-4 text-[#28a9ed]" />
              <span className="hidden sm:inline">Historique des pesées & tris</span>
              <span className="sm:hidden">Historique</span>
            </Bouton>

            <Bouton
              variante="primaire"
              onClick={() => handleOuvrirModalBassin()}
              className="py-3 px-4 font-black rounded-2xl flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau Bac</span>
            </Bouton>
          </div>
        </div>

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
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFiltre("tous")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filtre === "tous"
                  ? "bg-[#00d2ff] text-slate-950 shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
              }`}
            >
              Tous ({bassins.length})
            </button>
            <button
              onClick={() => setFiltre("en_eau")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filtre === "en_eau"
                  ? "bg-[#28a9ed] text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
              }`}
            >
              En Production ({bassinsEnEau.length})
            </button>
            <button
              onClick={() => setFiltre("vides")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filtre === "vides"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
              }`}
            >
              Vides ({bassins.length - bassinsEnEau.length})
            </button>
          </div>
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
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center p-6">
              <Waves className="w-12 h-12 text-slate-400 dark:text-slate-600 mb-3" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                Aucun bassin trouvé
              </h3>
              <p className="text-slate-500 text-sm max-w-md mb-4">
                Aucun bassin ne correspond au filtre sélectionné.
              </p>
              <Bouton variante="primaire" onClick={() => handleOuvrirModalBassin()}>
                Créer un bassin
              </Bouton>
            </div>
          )}
        </div>
      </main>

      {/* Modal d'Action Rapide (Calibrage / Transfert / Mortalité) */}
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

      {/* Modal Création / Édition Bassin */}
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

      {/* Modal Ajout Lot (Empoissonnement) */}
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

      {/* Modal Journal d'Opérations & Traçabilité */}
      <ModalGenerique
        estOuvert={modalHistoriqueOuvert}
        fermer={() => setModalHistoriqueOuvert(false)}
        titre="Journal de Traçabilité des Opérations"
      >
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {operationsLog.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <History className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
              <p className="font-semibold text-sm">
                Aucune opération enregistrée pour le moment.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Les calibrages, transferts et déclarations de mortalité apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {operationsLog.map((log: OperationLog) => {
                const bassinSource = bassins.find((b) => b.id === log.bassinId);
                const bassinDest = bassins.find(
                  (b) => b.id === log.destinationBassinId
                );

                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-full uppercase text-[10px] ${
                          log.typeOperation === "calibrage"
                            ? "bg-[#00d2ff]/15 text-[#28a9ed] dark:text-[#00d2ff]"
                            : log.typeOperation === "transfert"
                            ? "bg-blue-500/15 text-blue-500"
                            : "bg-red-500/15 text-red-500"
                        }`}
                      >
                        {log.typeOperation}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" />
                        {new Date(log.creeLe).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">
                          {bassinSource?.nom || "Bassin source"}
                          {bassinDest && (
                            <span className="inline-flex items-center gap-1 text-slate-500 font-normal ml-1">
                              <ArrowRight className="w-3 h-3" />
                              {bassinDest.nom}
                            </span>
                          )}
                        </p>
                        {log.calibre && (
                          <span className="text-[11px] font-semibold text-slate-500">
                            Calibre : {log.calibre}
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-base font-black ${
                            log.quantiteDelta < 0
                              ? "text-red-500"
                              : "text-emerald-500"
                          }`}
                        >
                          {log.quantiteDelta > 0 ? `+${log.quantiteDelta}` : log.quantiteDelta}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-semibold">
                          poissons
                        </span>
                      </div>
                    </div>

                    {(log.operePar || log.remarques) && (
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                        {log.operePar && (
                          <span className="flex items-center gap-1 font-medium">
                            <User className="w-3 h-3" />
                            {log.operePar}
                          </span>
                        )}
                        {log.remarques && (
                          <span className="italic truncate max-w-[200px]">
                            « {log.remarques} »
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ModalGenerique>
    </div>
  );
}
