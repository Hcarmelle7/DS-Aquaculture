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
  AlertCircle,
  ShoppingBag,
  MapPin,
} from "lucide-react";

export const CommandeSilureCarte: React.FC = () => {
  const { reglages, langue, ajouterCommande } = useAppStore();
  const t = TRADUCTIONS[langue];

  // États du formulaire
  const [preparation, setPreparation] = useState<"vivant" | "nettoye">("vivant");
  const [poidsKg, setPoidsKg] = useState<number>(3);
  const [nomClient, setNomClient] = useState<string>("");
  const [telephone, setTelephone] = useState<string>("");
  const [ville, setVille] = useState<string>("Douala");
  const [quartier, setQuartier] = useState<string>("");
  const [enCoursEnvoi, setEnCoursEnvoi] = useState<boolean>(false);
  const [commandeReussie, setCommandeReussie] = useState<boolean>(false);
  const [erreurCommande, setErreurCommande] = useState<string>("");
  const [codeCommandeFinal, setCodeCommandeFinal] = useState<string>("");

  // Calculs financiers dynamiques
  const prixAuKg = preparation === "vivant" ? reglages.prixVivant : reglages.prixNettoye;
  const prixTotal = Math.round(poidsKg * prixAuKg);

  // Calcul dynamique des portions recommandées
  const portionsMin = Math.max(1, Math.floor(poidsKg * 2));
  const portionsMax = Math.max(2, Math.ceil(poidsKg * 2.5));

  const soumettreCommande = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnCoursEnvoi(true);
    setErreurCommande("");

    try {
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
        remarques: "",
      });

      if (!nouvelleCommande) {
        setErreurCommande("Impossible d'enregistrer la commande. Veuillez vérifier votre connexion ou réessayer plus tard.");
        return;
      }

      setCodeCommandeFinal(nouvelleCommande.codeCommande);
      setCommandeReussie(true);
      
      setTimeout(() => {
        setCommandeReussie(false);
        setNomClient("");
        setTelephone("");
        setPoidsKg(3);
        setQuartier("");
      }, 6000);
    } catch (err) {
      setErreurCommande("Une erreur est survenue.");
      console.error("Erreur lors de la commande :", err);
    } finally {
      setEnCoursEnvoi(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -inset-0.5 bg-gradient-to-br from-[#00d2ff]/20 to-[#3a7bd5]/20 blur-xl opacity-50 rounded-[2rem] -z-10"></div>
      <Carte className="border-slate-800 bg-slate-950/60 backdrop-blur-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* En-tête de la carte */}
        <div className="flex items-center justify-between border-b border-slate-800/50 pb-4 mb-3">
          <div className="flex items-center gap-3">
            {/* <div className="w-12 h-12 rounded-2xl bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center text-[#00d2ff]">
              <Fish className="w-6 h-6" />
            </div> */}
            <div>
              <h2 className="text-lg font-black text-white">{t.titreCommande}</h2>
              {/* <p className="text-xs text-[#00d2ff] font-medium tracking-wide uppercase">{t.badgeLivraison}</p> */}
            </div>
          </div>
        </div>

        <form onSubmit={soumettreCommande} className="space-y-4">
          {commandeReussie && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-sm font-bold flex items-start gap-3">
              <Check className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p>Commande {codeCommandeFinal} confirmée !</p>
                <p className="text-xs text-green-500/80 mt-1 font-medium">Nous vous contacterons très vite pour la livraison.</p>
              </div>
            </div>
          )}

            {erreurCommande && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {erreurCommande}
              </div>
            )}

            {/* 1. Quantité et Préparation (Compact) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-300">Préparation</label>
                <div className="flex bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreparation("vivant")}
                    className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${preparation === "vivant" ? "bg-[#00d2ff] text-slate-950 shadow-md" : "text-slate-400 hover:text-white"}`}
                  >
                    Vivant
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreparation("nettoye")}
                    className={`px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${preparation === "nettoye" ? "bg-[#00d2ff] text-slate-950 shadow-md" : "text-slate-400 hover:text-white"}`}
                  >
                    Nettoyé
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                <label className="text-sm font-bold text-slate-300">Quantité (kg)</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setPoidsKg(Math.max(1, +(poidsKg - 0.5).toFixed(1)))} className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-all"><Minus className="w-4 h-4" /></button>
                  <span className="text-xl font-black text-white w-10 text-center">{poidsKg}</span>
                  <button type="button" onClick={() => setPoidsKg(Math.min(30, +(poidsKg + 0.5).toFixed(1)))} className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-all"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
            </div>



        {/* 2. Informations de livraison */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-[#00d2ff]" />
            <span className="text-sm font-bold text-slate-300">Livraison</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input type="text" required placeholder={t.libelleNomClient} value={nomClient} onChange={(e) => setNomClient(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-[#00d2ff] outline-none transition-all" />
            <input type="tel" required placeholder={t.libelleTelephoneClient} value={telephone} onChange={(e) => setTelephone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-[#00d2ff] outline-none transition-all" />
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-3">
            <select value={ville} onChange={(e) => setVille(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-[#00d2ff] outline-none transition-all">
              <option value="Douala">Douala</option>
              <option value="Yaoundé">Yaoundé</option>
            </select>
            <input type="text" required placeholder={t.espaceReserveQuartier} value={quartier} onChange={(e) => setQuartier(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-[#00d2ff] outline-none transition-all" />
          </div>
        </div>

        {/* Bonus Recettes Offert */}
        {/* <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <Sparkles className="w-5 h-5 shrink-0 text-amber-400" />
          <span className="leading-snug">{t.cadeauBonus}</span>
        </div> */}

        {/* Total & Validation */}
        <div className="border-t border-slate-800/50 pt-4">
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-sm font-semibold text-slate-400">{t.totalEstime}</span>
            <span className="text-2xl font-black text-[#00d2ff]">
              {prixTotal.toLocaleString("fr-FR")} FCFA
            </span>
          </div>

          <Bouton
            type="submit"
            variante="primaire"
            className="w-full text-xl py-2 shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] transition-shadow"
            chargement={enCoursEnvoi}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{t.boutonCommander}</span>
          </Bouton>
        </div>
      </form>
    </Carte>
  </div>
  );
};