"use client";

import React, { useState } from "react";
import { CommandePoisson, StatutCommande } from "@/types";
import {
  MapPin,
  Phone,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  Loader2,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

interface CommandeCardProps {
  commande: CommandePoisson;
}

export const CommandeCard: React.FC<CommandeCardProps> = ({ commande }) => {
  const { mettreAJourStatutCommande } = useAppStore();
  const [enMiseAJour, setEnMiseAJour] = useState(false);
  const [erreurAction, setErreurAction] = useState<string | null>(null);

  const handleStatut = async (nouveauStatut: StatutCommande) => {
    if (enMiseAJour || commande.statut === nouveauStatut) return;
    setEnMiseAJour(true);
    setErreurAction(null);
    try {
      const ok = await mettreAJourStatutCommande(commande.id, nouveauStatut);
      if (!ok) {
        setErreurAction("Échec de synchronisation. Réseau instable.");
        setTimeout(() => setErreurAction(null), 5000);
      }
    } catch {
      setErreurAction("Erreur réseau. Veuillez réessayer.");
      setTimeout(() => setErreurAction(null), 5000);
    } finally {
      setEnMiseAJour(false);
    }
  };

  const getStatutBadge = () => {
    switch (commande.statut) {
      case "en_attente":
        return (
          <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5" /> En attente
          </span>
        );
      case "en_livraison":
        return (
          <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Truck className="w-3.5 h-3.5" /> En livraison
          </span>
        );
      case "livree":
        return (
          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" /> Livrée
          </span>
        );
      case "annulee":
        return (
          <span className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <XCircle className="w-3.5 h-3.5" /> Annulée
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold">
            {commande.statut}
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-[#00d2ff]/40 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* En-tête de carte */}
        <div className="flex justify-between items-start mb-4 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                {commande.codeCommande}
              </h3>
              {enMiseAJour && (
                <Loader2 className="w-4 h-4 animate-spin text-[#00d2ff]" />
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(commande.creeLe).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {getStatutBadge()}
        </div>

        {/* Détails du client */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-900 dark:text-white font-bold text-sm truncate">
                {commande.nomClient}
              </p>
              <a
                href={`tel:${commande.telephone}`}
                className="text-slate-500 dark:text-slate-400 hover:text-[#28a9ed] dark:hover:text-[#00d2ff] text-xs flex items-center gap-1 font-medium transition-colors"
              >
                <Phone className="w-3 h-3 shrink-0" /> {commande.telephone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-900 dark:text-white font-semibold text-xs truncate">
                {commande.ville}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs truncate">
                {commande.quartier}
              </p>
            </div>
          </div>
        </div>

        {/* Récapitulatif de commande */}
        <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Produit
            </span>
            <span className="font-bold text-slate-900 dark:text-white capitalize">
              {commande.preparation === "vivant"
                ? "Silure Vivant"
                : "Silure Nettoyé"}
            </span>
          </div>
          <div className="flex justify-between items-center mb-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Quantité
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {commande.poidsKg} kg
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">
              Total à payer
            </span>
            <span className="font-black text-[#28a9ed] dark:text-[#00d2ff] text-lg">
              {commande.prixTotal.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>

        {commande.remarques && (
          <div className="mb-4 p-3 bg-blue-50/80 dark:bg-blue-900/15 border border-blue-200/80 dark:border-blue-900/30 rounded-xl">
            <p className="text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold text-blue-600 dark:text-blue-400">
                Note :
              </span>{" "}
              {commande.remarques}
            </p>
          </div>
        )}
      </div>

      {/* Barre d'Actions & Changement d'état */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
        {/* Alerte d'échec de mise à jour réseau */}
        {erreurAction && (
          <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center justify-between text-xs text-red-600 dark:text-red-400 font-semibold animate-pulse">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{erreurAction}</span>
            </span>
            <button
              type="button"
              onClick={() => setErreurAction(null)}
              className="text-red-400 hover:text-red-600 dark:hover:text-red-300 ml-2 text-sm font-bold leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Actions directes rapides selon le statut */}
        {commande.statut === "en_attente" && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={enMiseAJour}
              onClick={() => handleStatut("en_livraison")}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>En livraison</span>
            </button>
            <button
              type="button"
              disabled={enMiseAJour}
              onClick={() => handleStatut("annulee")}
              className="py-2.5 px-3 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:text-slate-300 dark:hover:text-red-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Annuler</span>
            </button>
          </div>
        )}

        {commande.statut === "en_livraison" && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={enMiseAJour}
              onClick={() => handleStatut("livree")}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Marquer Livrée</span>
            </button>
            <button
              type="button"
              disabled={enMiseAJour}
              onClick={() => handleStatut("en_attente")}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>En attente</span>
            </button>
          </div>
        )}

        {commande.statut === "livree" && (
          <div className="py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Commande
              livrée
            </span>
            <span className="text-[10px] text-emerald-600/80 font-normal">
              Terminée
            </span>
          </div>
        )}

        {commande.statut === "annulee" && (
          <div className="py-2 px-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-500" /> Commande annulée
            </span>
            <span className="text-[10px] text-red-500/80 font-normal">
              Refusée
            </span>
          </div>
        )}

        {/* Sélecteur universel de statut pour ajuster à tout moment */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 shrink-0">
            Changer l'état :
          </span>
          <div className="relative flex-1">
            <select
              value={commande.statut}
              disabled={enMiseAJour}
              onChange={(e) => handleStatut(e.target.value as StatutCommande)}
              className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 pl-2.5 pr-7 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-[#00d2ff] transition-all cursor-pointer disabled:opacity-50"
            >
              <option value="en_attente">🟡 En attente</option>
              <option value="en_livraison">🔵 En livraison</option>
              <option value="livree">🟢 Livrée</option>
              <option value="annulee">🔴 Annulée</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
