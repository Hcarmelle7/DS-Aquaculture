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
  const [remarques, setRemarques] = useState<string>("");

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
        remarques,
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
        setRemarques("");
      }, 6000);
    } catch (err) {
      setErreurCommande("Une erreur est survenue.");
      console.error("Erreur lors de la commande :", err);
    } finally {
      setEnCoursEnvoi(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">

      {/* Colonne des Prix (1/4 ou 1/3) */}
      <div className="md:col-span-4 lg:col-span-3 xl:col-span-3 space-y-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#28a9ed]/10 flex items-center justify-center text-[#28a9ed]">
              <Fish className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-white">Nos Tarifs</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden group hover:border-[#28a9ed]/50 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#28a9ed]/5 rounded-full blur-xl group-hover:bg-[#28a9ed]/10 transition-colors"></div>
              <p className="text-sm font-bold text-slate-400 mb-1">Silure Vivant</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-black text-white">{reglages.prixVivant.toLocaleString("fr-FR")}</p>
                <span className="text-sm font-bold text-[#28a9ed]">FCFA / kg</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden group hover:border-[#28a9ed]/50 transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#28a9ed]/5 rounded-full blur-xl group-hover:bg-[#28a9ed]/10 transition-colors"></div>
              <p className="text-sm font-bold text-slate-400 mb-1">Silure Nettoyé</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-black text-white">{reglages.prixNettoye.toLocaleString("fr-FR")}</p>
                <span className="text-sm font-bold text-[#28a9ed]">FCFA / kg</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-2 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#28a9ed]" />
                Prêt à cuire, sans écailles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de Commande (reste de l'espace) */}
      <div className="relative md:col-span-8 lg:col-span-9 xl:col-span-9">
        <div className="absolute -inset-0.5 bg-gradient-to-br from-[#28a9ed]/20 to-[#0f4360]/20 blur-xl opacity-50 rounded-[2rem] -z-10"></div>
        <Carte className="border-slate-800 bg-slate-950/80 backdrop-blur-2xl shadow-2xl p-4 md:p-6 relative overflow-hidden">
          {/* En-tête de la carte */}
          <div className="flex items-center justify-between border-b border-slate-800/50 pb-2 mb-2">
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
                  <p>{t.commandeConfirmee} (N° {codeCommandeFinal})</p>
                  <p className="text-xs text-green-500/80 mt-1 font-medium">{t.messageLivraison}</p>
                </div>
              </div>
            )}

            {erreurCommande && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {t.commandeErreur}
              </div>
            )}

            {/* 1. Quantité et Préparation (Compact) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-300">Préparation</label>
                <div className="flex bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreparation("vivant")}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${preparation === "vivant" ? "bg-[#28a9ed] text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                  >
                    Vivant
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreparation("nettoye")}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${preparation === "nettoye" ? "bg-[#28a9ed] text-white shadow-md" : "text-slate-400 hover:text-white"}`}
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
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-[#28a9ed]" />
                <span className="text-sm font-bold text-slate-300">Livraison & Coordonnées</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" required placeholder={t.libelleNomClient} value={nomClient} onChange={(e) => setNomClient(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#28a9ed] outline-none transition-all" />
                <input type="tel" required placeholder={t.libelleTelephoneClient} value={telephone} onChange={(e) => setTelephone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#28a9ed] outline-none transition-all" />
              </div>

              <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[130px_1fr] gap-3 pt-1">
                <select value={ville} onChange={(e) => setVille(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-[#28a9ed] outline-none transition-all">
                  <option value="Douala">Douala</option>
                  <option value="Yaoundé">Yaoundé</option>
                  <option value="Edea">Edea</option>
                  <option value="Kribi">Kribi</option>
                  <option value="Limbe">Limbe</option>
                  <option value="Tiko">Tiko</option>
                  <option value="Buea">Buea</option>
                  <option value="Bafoussam">Bafoussam</option>
                  <option value="Foumban">Foumban</option>
                  <option value="Foumbot">Foumbot</option>

                </select>
                <input type="text" required placeholder={t.espaceReserveQuartier} value={quartier} onChange={(e) => setQuartier(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#28a9ed] outline-none transition-all" />
              </div>

              <div>
                <textarea
                  placeholder={t.placeholderPrecisions}
                  value={remarques}
                  onChange={(e) => setRemarques(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-600 focus:border-[#28a9ed] outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Bonus Recettes Offert */}
            {/* <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <Sparkles className="w-5 h-5 shrink-0 text-amber-400" />
          <span className="leading-snug">{t.cadeauBonus}</span>
        </div> */}

            {/* Total & Validation */}
            <div className="">
              <div className="flex justify-between items-baseline mb-4">
                <span className="text-sm font-semibold text-slate-400">{t.totalEstime}</span>
                <span className="text-3xl font-black text-[#28a9ed]">
                  {prixTotal.toLocaleString("fr-FR")} <span className="text-lg">FCFA</span>
                </span>
              </div>

              <Bouton
                type="submit"
                className="w-full text-lg py-3 bg-[#28a9ed] hover:bg-[#208bc4] text-white shadow-[0_0_20px_rgba(40,169,237,0.3)] hover:shadow-[0_0_30px_rgba(40,169,237,0.5)] transition-all font-black flex items-center justify-center gap-2 rounded-xl"
                chargement={enCoursEnvoi}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{t.boutonCommander}</span>
              </Bouton>
            </div>
          </form>
        </Carte>
      </div>
    </div>
  );
};

export default CommandeSilureCarte;