"use client";

import React, { useState } from "react";
import { Bassin, Lot } from "@/models";
import { useAppStore } from "@/store/useAppStore";
import { Bouton } from "@/components/ui/Bouton";
import { AlerteFeedback } from "@/components/ui/AlerteFeedback";
import { OngletCalibrage } from "@/components/admin/action-rapide/OngletCalibrage";
import { OngletTransfert } from "@/components/admin/action-rapide/OngletTransfert";
import { OngletMortalite } from "@/components/admin/action-rapide/OngletMortalite";
import { Scale, ArrowRightLeft, Skull, X, Check, Waves, User } from "lucide-react";

interface ModalActionRapideProps {
  estOuvert: boolean;
  fermer: () => void;
  bassin: Bassin;
  lotActif?: Lot;
}

export const ModalActionRapide: React.FC<ModalActionRapideProps> = ({
  estOuvert,
  fermer,
  bassin,
  lotActif,
}) => {
  const { bassins, enregistrerCalibrage, transfererPoissons, enregistrerMortalite } =
    useAppStore();

  const [onglet, setOnglet] = useState<"calibrage" | "transfert" | "mortalite">("calibrage");
  const [operePar, setOperePar] = useState<string>("Équipe Piscicole");
  const [remarques, setRemarques] = useState<string>("");
  const [enCours, setEnCours] = useState<boolean>(false);
  const [messageSucces, setMessageSucces] = useState<string>("");
  const [messageErreur, setMessageErreur] = useState<string>("");

  // Calibrage
  const [poissonsComptes, setPoissonsComptes] = useState<number | "">(40);
  const [poidsBalanceKg, setPoidsBalanceKg] = useState<number | "">(8);
  const [totalPoissonsBac, setTotalPoissonsBac] = useState<number>(
    lotActif?.quantiteActuelle || 0
  );
  const [taillePoissons, setTaillePoissons] = useState<string>("Moyens (50-200g)");

  const nbPoissonsPesee =
    typeof poissonsComptes === "number" && poissonsComptes > 0 ? poissonsComptes : 1;
  const kgPesee = typeof poidsBalanceKg === "number" && poidsBalanceKg > 0 ? poidsBalanceKg : 0;

  const poidsMoyenCalculeG =
    kgPesee > 0
      ? Math.round((kgPesee * 1000) / nbPoissonsPesee)
      : lotActif?.poidsMoyenInitialG || 200;

  const poidsTotalEstimeBacKg = Number(
    ((totalPoissonsBac * poidsMoyenCalculeG) / 1000).toFixed(1)
  );
  const poissonsParKilo =
    poidsMoyenCalculeG > 0 ? (1000 / poidsMoyenCalculeG).toFixed(1) : "0";

  // Transfert
  const bassinsDestDisponibles = bassins.filter((b) => b.id !== bassin.id);
  const [bassinDestId, setBassinDestId] = useState<string>(
    bassinsDestDisponibles[0]?.id || ""
  );
  const [quantiteATransferer, setQuantiteATransferer] = useState<number>(
    Math.min(100, lotActif?.quantiteActuelle || 0)
  );

  // Mortalité
  const [nombreMorts, setNombreMorts] = useState<number>(1);

  if (!estOuvert || !lotActif) return null;

  const effectifActuel = lotActif.quantiteActuelle;

  const gererSoumission = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    setMessageErreur("");
    setMessageSucces("");

    try {
      if (onglet === "calibrage") {
        if (!poidsBalanceKg || Number(poidsBalanceKg) <= 0) {
          setMessageErreur("Veuillez indiquer le poids pesé sur la balance.");
          setEnCours(false);
          return;
        }

        const ok = await enregistrerCalibrage({
          bassinId: bassin.id,
          lotId: lotActif.id,
          typeOperation: "calibrage",
          quantiteApres: totalPoissonsBac,
          nouveauPoidsMoyenG: poidsMoyenCalculeG,
          calibre: taillePoissons,
          operePar,
          remarques,
        });

        if (ok) {
          setMessageSucces(`Pesée validée ! Poids moyen : ${poidsMoyenCalculeG}g.`);
          setTimeout(() => {
            fermer();
            setMessageSucces("");
          }, 1200);
        } else {
          setMessageErreur("Impossible d'enregistrer la pesée.");
        }
      } else if (onglet === "transfert") {
        if (!bassinDestId) {
          setMessageErreur("Veuillez choisir le bac qui va recevoir les poissons.");
          setEnCours(false);
          return;
        }

        if (quantiteATransferer <= 0 || quantiteATransferer > effectifActuel) {
          setMessageErreur(`Nombre de poissons invalide (max : ${effectifActuel}).`);
          setEnCours(false);
          return;
        }

        const ok = await transfererPoissons({
          sourceBassinId: bassin.id,
          sourceLotId: lotActif.id,
          destinationBassinId: bassinDestId,
          quantite: quantiteATransferer,
          poidsMoyenG: poidsMoyenCalculeG,
          calibre: taillePoissons,
          operePar,
          remarques,
        });

        if (ok) {
          setMessageSucces(`${quantiteATransferer} poissons déplacés avec succès !`);
          setTimeout(() => {
            fermer();
            setMessageSucces("");
          }, 1200);
        } else {
          setMessageErreur("Erreur lors du déplacement.");
        }
      } else if (onglet === "mortalite") {
        if (nombreMorts <= 0 || nombreMorts > effectifActuel) {
          setMessageErreur(`Nombre invalide (max : ${effectifActuel}).`);
          setEnCours(false);
          return;
        }

        const ok = await enregistrerMortalite({
          bassinId: bassin.id,
          lotId: lotActif.id,
          quantiteMorts: nombreMorts,
          operePar,
          remarques,
        });

        if (ok) {
          setMessageSucces(`${nombreMorts} poissons morts retirés du bac.`);
          setTimeout(() => {
            fermer();
            setMessageSucces("");
          }, 1200);
        } else {
          setMessageErreur("Erreur lors de l'enregistrement.");
        }
      }
    } catch (err: unknown) {
      setMessageErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Fond obscurci */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={fermer}
      />

      {/* Conteneur Bottom Sheet mobile / Modal centré desktop */}
      <div className="relative w-full sm:max-w-xl bg-white dark:bg-[#060c1c] border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90dvh] sm:max-h-[85vh] min-h-0 flex flex-col animate-in slide-in-from-bottom-6 sm:fade-in sm:zoom-in-95 duration-200">
        {/* En-tête simple et direct */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00d2ff]/10 text-[#28a9ed] dark:text-[#00d2ff] flex items-center justify-center border border-[#00d2ff]/30 shrink-0 shadow-sm">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {bassin.nom}
                </h2>
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {bassin.categorie}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Actuellement dans le bac :{" "}
                <strong className="text-slate-900 dark:text-white">
                  {effectifActuel} poissons
                </strong>
              </p>
            </div>
          </div>

          <Bouton
            type="button"
            variante="neutre"
            taille="icone"
            arrondi="full"
            onClick={fermer}
            className="bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 active:scale-95"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </Bouton>
        </div>

        {/* 3 Grands Boutons d'Action */}
        <div className="p-3 bg-slate-100/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setOnglet("calibrage")}
            className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
              onglet === "calibrage"
                ? "bg-[#00d2ff] text-slate-950 shadow-md shadow-[#00d2ff]/20 font-black"
                : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Scale className="w-4 h-4 shrink-0" />
            <span>Peser / Trier</span>
          </button>

          <button
            type="button"
            onClick={() => setOnglet("transfert")}
            className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
              onglet === "transfert"
                ? "bg-[#28a9ed] text-white shadow-md shadow-[#28a9ed]/30 font-black"
                : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 shrink-0" />
            <span>Déplacer</span>
          </button>

          <button
            type="button"
            onClick={() => setOnglet("mortalite")}
            className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
              onglet === "mortalite"
                ? "bg-red-500 text-white shadow-md shadow-red-500/30 font-black"
                : "bg-white/80 dark:bg-slate-900/80 text-red-500/80 hover:text-red-500 dark:text-red-400"
            }`}
          >
            <Skull className="w-4 h-4 shrink-0" />
            <span>Mortalité</span>
          </button>
        </div>

        {/* Formulaire ergonomique */}
        <form
          onSubmit={gererSoumission}
          className="p-5 sm:p-6 space-y-5 overflow-y-auto overscroll-contain flex-1 min-h-0"
        >
          {messageSucces && <AlerteFeedback type="succes" message={messageSucces} />}
          {messageErreur && <AlerteFeedback type="erreur" message={messageErreur} />}

          {onglet === "calibrage" && (
            <OngletCalibrage
              poissonsComptes={poissonsComptes}
              setPoissonsComptes={setPoissonsComptes}
              poidsBalanceKg={poidsBalanceKg}
              setPoidsBalanceKg={setPoidsBalanceKg}
              poidsMoyenCalculeG={poidsMoyenCalculeG}
              poissonsParKilo={poissonsParKilo}
              totalPoissonsBac={totalPoissonsBac}
              setTotalPoissonsBac={setTotalPoissonsBac}
              effectifActuel={effectifActuel}
              poidsTotalEstimeBacKg={poidsTotalEstimeBacKg}
              taillePoissons={taillePoissons}
              setTaillePoissons={setTaillePoissons}
            />
          )}

          {onglet === "transfert" && (
            <OngletTransfert
              bassinsDestDisponibles={bassinsDestDisponibles}
              bassinDestId={bassinDestId}
              setBassinDestId={setBassinDestId}
              quantiteATransferer={quantiteATransferer}
              setQuantiteATransferer={setQuantiteATransferer}
              effectifActuel={effectifActuel}
            />
          )}

          {onglet === "mortalite" && (
            <OngletMortalite
              nombreMorts={nombreMorts}
              setNombreMorts={setNombreMorts}
              effectifActuel={effectifActuel}
            />
          )}

          {/* Opéré par & Remarques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Qui a fait le travail ?
              </label>
              <input
                type="text"
                required
                value={operePar}
                onChange={(e) => setOperePar(e.target.value)}
                placeholder="Ex: Paul"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#00d2ff]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Remarques (optionnel)
              </label>
              <input
                type="text"
                value={remarques}
                onChange={(e) => setRemarques(e.target.value)}
                placeholder="Ex: Belle croissance, tri rapide"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#00d2ff]"
              />
            </div>
          </div>

          {/* Bouton de confirmation ultra-large pour pouce */}
          <div className="pt-2">
            <Bouton
              type="submit"
              variante={onglet === "mortalite" ? "rougePlein" : "degrade"}
              graisse="black"
              pleineLargeur
              chargement={enCours}
              iconeGauche={<Check className="w-5 h-5" />}
              className="py-4 text-base sm:text-lg gap-2.5"
            >
              <span>
                {onglet === "calibrage"
                  ? `Valider la Pesée (${poidsMoyenCalculeG}g / poisson)`
                  : onglet === "transfert"
                    ? `Déplacer ${quantiteATransferer} Poissons`
                    : `Enregistrer la Perte (-${nombreMorts})`}
              </span>
            </Bouton>
          </div>
        </form>
      </div>
    </div>
  );
};
