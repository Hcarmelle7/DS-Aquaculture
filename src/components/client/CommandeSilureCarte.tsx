"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { TRADUCTIONS } from "@/data/contenu";
import { genererLienWhatsAppCommande } from "@/lib/whatsapp";
import { Carte } from "@/components/ui/Carte";
import { Bouton } from "@/components/ui/Bouton";
import { PreparationPoisson } from "@/types";
import {
  Fish,
  Sparkles,
  MessageCircle,
  Users,
  Check,
  Plus,
  Minus,
} from "lucide-react";

export const CommandeSilureCarte: React.FC = () => {
  const { reglages, langue, ajouterCommande } = useAppStore();
  const t = TRADUCTIONS[langue];

  // États du formulaire
  const [preparation, setPreparation] = useState<PreparationPoisson>("vivant");
  const [poidsKg, setPoidsKg] = useState<number>(2.5);
  const [nomClient, setNomClient] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("");
  const [ville, setVille] = useState<string>("Douala");
  const [quartier, setQuartier] = useState<string>("");
  const [remarques, setRemarques] = useState<string>("");
  const [enCoursEnvoi, setEnCoursEnvoi] = useState<boolean>(false);

  // Calculs financiers dynamiques
  const prixAuKg = preparation === "vivant" ? reglages.prixVivant : reglages.prixNettoye;
  const prixTotal = Math.round(poidsKg * prixAuKg);

  // Calcul dynamique des portions recommandées
  const portionsMin = Math.max(1, Math.floor(poidsKg * 2));
  const portionsMax = Math.max(2, Math.ceil(poidsKg * 2.5));

  const soumettreCommande = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomClient.trim() || !telephone.trim() || !quartier.trim()) {
      alert(langue === "fr" ? "Veuillez remplir tous les champs obligatoires." : "Please fill in all required fields.");
      return;
    }

    setEnCoursEnvoi(true);

    try {
      // 1. Enregistrement dans Supabase
      const nouvelleCommande = await ajouterCommande({
        codeCommande: "",
        nomClient,
        telephone,
        preparation,
        poidsKg,
        prixAuKg,
        prixTotal,
        ville,
        quartier,
        remarques,
      });

      const codeGenere = nouvelleCommande ? nouvelleCommande.codeCommande : `CMD-${Date.now().toString().slice(-4)}`;

      // 2. Génération du lien WhatsApp et redirection
      const urlWhatsApp = genererLienWhatsAppCommande({
        telephoneBrut: reglages.telephoneBrut,
        codeCommande: codeGenere,
        nomClient,
        telephoneClient: telephone,
        preparation,
        poidsKg,
        prixTotal,
        ville,
        quartier,
        remarques,
        langueClient: langue,
      });

      window.open(urlWhatsApp, "_blank");
    } catch (err) {
      console.error("Erreur lors de la commande :", err);
    } finally {
      setEnCoursEnvoi(false);
    }
  };

  return (
    <Carte surbrillance className="border-cyan-500/30 overflow-hidden">
      {/* En-tête de la carte */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00d2ff]">
            <Fish className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white transition-colors duration-300">{t.titreCommande}</h2>
            <p className="text-[11px] text-slate-400 font-medium">{t.badgeLivraison}</p>
          </div>
        </div>

        {/* Indicateur de disponibilité */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          En stock
        </span>
      </div>

      <form onSubmit={soumettreCommande} className="space-y-4">
        {/* 1. Choix du type de préparation (Vivant vs Nettoyé) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            1. {langue === "fr" ? "Type de préparation" : "Preparation type"}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setPreparation("vivant")}
              className={`p-3 rounded-2xl border text-left transition-all relative ${
                preparation === "vivant"
                  ? "border-[#00d2ff] bg-cyan-950/40 text-white shadow-[0_0_15px_rgba(0,210,255,0.15)]"
                  : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
              }`}
            >
              {preparation === "vivant" && (
                <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#00d2ff] text-slate-950 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#00d2ff]">
                {t.etiquetteVivant}
              </div>
              <div className="text-sm font-bold text-slate-700 dark:text-white mt-0.5 transition-colors duration-300">{t.poissonVivant}</div>
              <div className="text-xs font-bold text-slate-300 mt-1">
                {reglages.prixVivant.toLocaleString("fr-FR")} FCFA <span className="text-[10px] font-normal text-slate-400">/ Kg</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPreparation("nettoye")}
              className={`p-3 rounded-2xl border text-left transition-all relative ${
                preparation === "nettoye"
                  ? "border-[#00d2ff] bg-cyan-950/40 text-white shadow-[0_0_15px_rgba(0,210,255,0.15)]"
                  : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
              }`}
            >
              {preparation === "nettoye" && (
                <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#00d2ff] text-slate-950 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#00d2ff]">
                {t.etiquetteNettoye}
              </div>
              <div className="text-sm font-bold text-slate-700 dark:text-white mt-0.5 transition-colors duration-300">{t.poissonNettoye}</div>
              <div className="text-xs font-bold text-slate-300 mt-1">
                {reglages.prixNettoye.toLocaleString("fr-FR")} FCFA <span className="text-[10px] font-normal text-slate-400">/ Kg</span>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Ajusteur de quantité tactile */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">2. {t.libelleQuantite}</span>
            <div className="flex items-center gap-1 text-[11px] text-[#00d2ff] bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
              <Users className="w-3 h-3" />
              <span>≈ {portionsMin} à {portionsMax} pers.</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setPoidsKg(Math.max(1, +(poidsKg - 0.5).toFixed(1)))}
              className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all duration-300"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-300">{poidsKg}</span>
              <span className="text-xs font-bold text-slate-400 ml-1">Kg</span>
            </div>

            <button
              type="button"
              onClick={() => setPoidsKg(Math.min(30, +(poidsKg + 0.5).toFixed(1)))}
              className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <input
            type="range"
            min="1"
            max="20"
            step="0.5"
            value={poidsKg}
            onChange={(e) => setPoidsKg(parseFloat(e.target.value))}
            className="w-full accent-[#00d2ff] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* 3. Informations de livraison */}
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold text-slate-300">
            3. {langue === "fr" ? "Coordonnées de livraison" : "Delivery details"}
          </label>

          <input
            type="text"
            required
            placeholder={t.libelleNomClient}
            value={nomClient}
            onChange={(e) => setNomClient(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#00d2ff] outline-none transition-all duration-300"
          />

          <input
            type="tel"
            required
            placeholder={t.libelleTelephoneClient}
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#00d2ff] outline-none transition-all duration-300"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#00d2ff] transition-all duration-300"
            >
              <option value="Douala">Douala</option>
              <option value="Yaoundé">Yaoundé</option>
            </select>

            <input
              type="text"
              required
              placeholder={t.espaceReserveQuartier}
              value={quartier}
              onChange={(e) => setQuartier(e.target.value)}
              className="bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#00d2ff] outline-none transition-all duration-300"
            />
          </div>

          <input
            type="text"
            placeholder={langue === "fr" ? "Remarques (ex: découpe spécifique, heure souhaitée)" : "Special notes (e.g. cutting size, delivery time)"}
            value={remarques}
            onChange={(e) => setRemarques(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#00d2ff] outline-none transition-all duration-300"
          />
        </div>

        {/* Bonus Recettes Offert */}
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <span className="leading-snug">{t.cadeauBonus}</span>
        </div>

        {/* Total & Validation */}
        <div className="border-t border-slate-800 pt-3">
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-xs font-semibold text-slate-400">{t.totalEstime}</span>
            <span className="text-2xl font-black text-[#00d2ff]">
              {prixTotal.toLocaleString("fr-FR")} FCFA
            </span>
          </div>

          <Bouton
            type="submit"
            variante="whatsapp"
            taille="lg"
            chargement={enCoursEnvoi}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t.boutonCommander}</span>
          </Bouton>
        </div>
      </form>
    </Carte>
  );
};