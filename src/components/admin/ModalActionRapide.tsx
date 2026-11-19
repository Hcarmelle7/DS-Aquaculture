"use client";

import React, { useState } from "react";
import { Bassin, Lot } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import {
  Scale,
  ArrowRightLeft,
  Skull,
  X,
  Check,
  AlertCircle,
  Fish,
  Waves,
  User,
  Plus,
  Minus,
  Calculator,
} from "lucide-react";

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
  const {
    bassins,
    enregistrerCalibrage,
    transfererPoissons,
    enregistrerMortalite,
  } = useAppStore();

  // Onglet sélectionné : 'calibrage' | 'transfert' | 'mortalite'
  const [onglet, setOnglet] = useState<"calibrage" | "transfert" | "mortalite">("calibrage");

  // Responsable & Remarques (Vocabulaire simplifié)
  const [operePar, setOperePar] = useState<string>("Équipe Piscicole");
  const [remarques, setRemarques] = useState<string>("");
  const [enCours, setEnCours] = useState<boolean>(false);
  const [messageSucces, setMessageSucces] = useState<string>("");
  const [messageErreur, setMessageErreur] = useState<string>("");

  // ====================================================================
  // CALIBRAGE : CALCUL AUTOMATIQUE DU POIDS MOYEN
  // Workflow terrain : On met un échantillon dans la cuvette,
  // on compte les poissons et on pèse la cuvette en Kg.
  // ====================================================================
  const [poissonsComptes, setPoissonsComptes] = useState<number | "">(40);
  const [poidsBalanceKg, setPoidsBalanceKg] = useState<number | "">(8);
  const [totalPoissonsBac, setTotalPoissonsBac] = useState<number>(
    lotActif?.quantiteActuelle || 0
  );
  const [taillePoissons, setTaillePoissons] = useState<string>("Moyens (50-200g)");

  // Calcul automatique du poids moyen (en grammes)
  const nbPoissonsPesee = typeof poissonsComptes === "number" && poissonsComptes > 0 ? poissonsComptes : 1;
  const kgPesee = typeof poidsBalanceKg === "number" && poidsBalanceKg > 0 ? poidsBalanceKg : 0;
  
  // Formule : (Kg pesés * 1000) / Nombre de poissons
  const poidsMoyenCalculeG = kgPesee > 0 
    ? Math.round((kgPesee * 1000) / nbPoissonsPesee)
    : lotActif?.poidsMoyenInitialG || 200;

  // Poids total estimé du bac entier
  const poidsTotalEstimeBacKg = Number(
    ((totalPoissonsBac * poidsMoyenCalculeG) / 1000).toFixed(1)
  );

  // Nombre de poissons par kilo
  const poissonsParKilo = poidsMoyenCalculeG > 0 ? (1000 / poidsMoyenCalculeG).toFixed(1) : "0";

  // ====================================================================
  // TRANSFERT INTER-BACS
  // ====================================================================
  const bassinsDestDisponibles = bassins.filter((b) => b.id !== bassin.id);
  const [bassinDestId, setBassinDestId] = useState<string>(
    bassinsDestDisponibles[0]?.id || ""
  );
  const [quantiteATransferer, setQuantiteATransferer] = useState<number>(
    Math.min(100, lotActif?.quantiteActuelle || 0)
  );

  // ====================================================================
  // MORTALITÉ
  // ====================================================================
  const [nombreMorts, setNombreMorts] = useState<number>(1);

  if (!estOuvert || !lotActif) return null;

  const effectifActuel = lotActif.quantiteActuelle;

  // Validation et soumission
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
                Actuellement dans le bac : <strong className="text-slate-900 dark:text-white">{effectifActuel} poissons</strong> 
              </p>
            </div>
          </div>

          <button
            onClick={fermer}
            className="w-10 h-10 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Grands Boutons d'Action (Accessibles à une main près de l'eau) */}
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
        <form onSubmit={gererSoumission} className="p-5 sm:p-6 space-y-5 overflow-y-auto overscroll-contain flex-1 min-h-0">
          {messageSucces && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in">
              <Check className="w-5 h-5 shrink-0" />
              <span>{messageSucces}</span>
            </div>
          )}

          {messageErreur && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{messageErreur}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* ONGLET 1 : PESÉE & CALCUL AUTOMATIQUE (L'APP FAIT LES MATHS) */}
          {/* ======================================================== */}
          {onglet === "calibrage" && (
            <div className="space-y-4">
              {/* Cadre de pesée cuvette */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#28a9ed] dark:text-[#00d2ff]">
                  <Calculator className="w-4 h-4" />
                  <span>Pesée sur la balance</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Combien de poissons comptés ?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={1}
                        placeholder="Ex: 40"
                        value={poissonsComptes}
                        onChange={(e) =>
                          setPoissonsComptes(e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value) || 0))
                        }
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-[#00d2ff]"
                      />
                      <span className="absolute right-3 top-3.5 text-xs font-bold text-slate-400">
                        poissons
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Poids pesé sur la balance (en Kg) ?
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.05"
                        required
                        min={0.1}
                        placeholder="Ex: 8"
                        value={poidsBalanceKg}
                        onChange={(e) =>
                          setPoidsBalanceKg(e.target.value === "" ? "" : parseFloat(e.target.value) || 0)
                        }
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-lg font-black text-[#28a9ed] dark:text-[#00d2ff] outline-none focus:border-[#00d2ff]"
                      />
                      <span className="absolute right-3 top-3.5 text-xs font-bold text-slate-400">
                        Kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* RÉSULTAT AUTOMATIQUE CALCULÉ EN TEMPS RÉEL */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00d2ff]/10 to-[#28a9ed]/10 border border-[#00d2ff]/30 text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Poids moyen calculé :
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-[#28a9ed] dark:text-[#00d2ff]">
                    {poidsMoyenCalculeG} <span className="text-lg font-bold">g</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Soit environ <strong>{poissonsParKilo} poissons</strong> pour faire 1 Kg.
                  </p>
                </div>
              </div>

              {/* Nombre total de poissons dans le bac */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Poissons dans le bac (après tri)
                  </label>
                  <span className="text-xs text-slate-500">
                    Actuel : {effectifActuel}
                  </span>
                </div>
                <input
                  type="number"
                  min={0}
                  value={totalPoissonsBac}
                  onChange={(e) => setTotalPoissonsBac(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-[#00d2ff]"
                />

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-500">Poids total estimé du bac :</span>
                  <span className="text-sm font-black text-[#28a9ed] dark:text-[#00d2ff]">
                    {poidsTotalEstimeBacKg} Kg
                  </span>
                </div>
              </div>

              {/* Taille des poissons (Vocabulaire terrain) */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                  Taille des poissons
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Petits (<50g)",
                    "Moyens (50-200g)",
                    "Gros (250-400g)",
                    "Prêts à vendre (>500g)",
                  ].map((taille) => (
                    <button
                      key={taille}
                      type="button"
                      onClick={() => setTaillePoissons(taille)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        taillePoissons === taille
                          ? "bg-[#00d2ff]/15 border-[#00d2ff] text-[#28a9ed] dark:text-[#00d2ff] shadow-sm"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {taille}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ONGLET 2 : DÉPLACEMENT VERS UN AUTRE BAC                */}
          {/* ======================================================== */}
          {onglet === "transfert" && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Vers quel bac déplacer ?
                  </label>
                  <select
                    value={bassinDestId}
                    onChange={(e) => setBassinDestId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#28a9ed]"
                  >
                    {bassinsDestDisponibles.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nom} ({b.categorie}) - {b.nombrePoissons ? `${b.nombrePoissons} poissons` : "Bac vide"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Combien de poissons déplacer ?
                    </label>
                    <span className="text-xs text-slate-500 font-semibold">
                      Max : {effectifActuel}
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    min={1}
                    max={effectifActuel}
                    value={quantiteATransferer}
                    onChange={(e) =>
                      setQuantiteATransferer(
                        Math.min(effectifActuel, Math.max(1, parseInt(e.target.value) || 0))
                      )
                    }
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-lg font-black text-[#28a9ed] outline-none focus:border-[#28a9ed]"
                  />

                  {/* Boutons d'ajout au pouce */}
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {[50, 100, 200, Math.floor(effectifActuel / 2)].map((nb) => (
                      <button
                        key={nb}
                        type="button"
                        onClick={() => setQuantiteATransferer(Math.min(effectifActuel, nb))}
                        className="py-2.5 bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-300 active:scale-95 transition-all"
                      >
                        +{nb}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                  Après transfert, il restera <strong>{Math.max(0, effectifActuel - quantiteATransferer)} poissons</strong> dans ce bac.
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ONGLET 3 : MORTALITÉ (DÉCLARATION EN 1 TAP)             */}
          {/* ======================================================== */}
          {onglet === "mortalite" && (
            <div className="space-y-4">
              <div className="bg-red-50/60 dark:bg-red-950/20 p-5 rounded-2xl border border-red-200/80 dark:border-red-900/30 text-center space-y-4">
                <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                  Combien de poissons sont morts ?
                </p>

                {/* Sélecteur tactile géant */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setNombreMorts((n) => Math.max(1, n - 1))}
                    className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center font-black active:scale-90 transition-transform shadow-sm"
                  >
                    <Minus className="w-6 h-6" />
                  </button>

                  <input
                    type="number"
                    min={1}
                    max={effectifActuel}
                    value={nombreMorts}
                    onChange={(e) =>
                      setNombreMorts(Math.min(effectifActuel, Math.max(1, parseInt(e.target.value) || 1)))
                    }
                    className="w-28 text-center text-4xl font-black text-red-600 dark:text-red-400 bg-transparent outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setNombreMorts((n) => Math.min(effectifActuel, n + 1))}
                    className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center font-black active:scale-90 transition-transform shadow-sm"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                {/* Raccourcis +1, +5, +10 */}
                <div className="flex justify-center gap-2 pt-2">
                  {[1, 5, 10, 25].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNombreMorts((n) => Math.min(effectifActuel, n + val))}
                      className="px-4 py-2.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-xl text-xs font-bold hover:bg-red-200 active:scale-95 transition-all"
                    >
                      +{val}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  Poissons restants dans le bac :{" "}
                  <strong className="text-slate-900 dark:text-white">
                    {Math.max(0, effectifActuel - nombreMorts)} poissons
                  </strong>
                </p>
              </div>
            </div>
          )}

          {/* Opéré par & Remarques (Vocabulaire simplifié) */}
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
            <button
              type="submit"
              disabled={enCours}
              className={`w-full py-4 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 ${
                onglet === "mortalite"
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/25"
                  : "bg-gradient-to-r from-[#28a9ed] to-[#00d2ff] text-slate-950 hover:brightness-105 shadow-[#00d2ff]/25"
              }`}
            >
              {enCours ? (
                <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>
                    {onglet === "calibrage"
                      ? `Valider la Pesée (${poidsMoyenCalculeG}g / poisson)`
                      : onglet === "transfert"
                      ? `Déplacer ${quantiteATransferer} Poissons`
                      : `Enregistrer la Perte (-${nombreMorts})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
