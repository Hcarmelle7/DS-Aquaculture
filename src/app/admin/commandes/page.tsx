"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag, TrendingUp, DollarSign } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { CommandeCard } from "@/components/admin/CommandeCard";
import { BarreFiltres, OptionFiltre } from "@/components/ui/BarreFiltres";
import { EtatVide } from "@/components/ui/EtatVide";
import { calculerStatistiquesCommandes } from "@/services/commande.service";

type FiltreStatutCommande = "toutes" | "en_attente" | "en_livraison" | "livree" | "annulee";

export default function PageCommandes() {
  const { commandes, chargerCommandes } = useAppStore();
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatutCommande>("toutes");

  useEffect(() => {
    chargerCommandes();
  }, [chargerCommandes]);

  const commandesFiltrees = commandes.filter((c) =>
    filtreStatut === "toutes" ? true : c.statut === filtreStatut
  );

  const { totalRevenus, totalKilos, commandesEnAttente } =
    calculerStatistiquesCommandes(commandes);

  const optionsFiltres: OptionFiltre<FiltreStatutCommande>[] = [
    {
      valeur: "toutes",
      libelle: "Toutes",
      classeActif: "bg-[#00d2ff] text-slate-950 font-black shadow-sm",
    },
    {
      valeur: "en_attente",
      libelle: `En attente (${commandes.filter((c) => c.statut === "en_attente").length})`,
      classeActif: "bg-yellow-500 text-slate-950 font-black shadow-sm",
    },
    {
      valeur: "en_livraison",
      libelle: `En livraison (${commandes.filter((c) => c.statut === "en_livraison").length})`,
      classeActif: "bg-blue-500 text-white font-black shadow-sm",
    },
    {
      valeur: "livree",
      libelle: `Livrées (${commandes.filter((c) => c.statut === "livree").length})`,
      classeActif: "bg-emerald-500 text-white font-black shadow-sm",
    },
    {
      valeur: "annulee",
      libelle: `Annulées (${commandes.filter((c) => c.statut === "annulee").length})`,
      classeActif: "bg-red-500 text-white font-black shadow-sm",
    },
  ];

  return (
    <AdminPageLayout
      titre="Commandes & Ventes"
      sousTitre="Gérez les commandes des clients et suivez vos statistiques de vente."
      Icone={ShoppingBag}
      paddingBottomClass="pb-20"
      titreClassName="mb-2"
      sousTitreClassName="mt-0 text-base"
    >
      {/* Stats Rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">À traiter</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {commandesEnAttente}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">
              Chiffre d&apos;Affaires (Livré)
            </p>
            <p className="text-2xl font-black text-[#28a9ed] dark:text-[#00d2ff]">
              {totalRevenus.toLocaleString("fr-FR")} FCFA
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">Volume Vendu</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {totalKilos} kg
            </p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <BarreFiltres
        options={optionsFiltres}
        valeurActive={filtreStatut}
        auChangement={setFiltreStatut}
        className="pb-2 scrollbar-hide"
        classeBouton="px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-colors"
        classeInactif="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
      />

      {/* Liste des commandes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {commandesFiltrees.map((cmd) => (
          <CommandeCard key={cmd.id} commande={cmd} />
        ))}

        {commandesFiltrees.length === 0 && (
          <EtatVide
            Icone={ShoppingBag}
            message="Aucune commande trouvée pour ce statut."
            variante="carteDashed"
            className="border-slate-200 dark:border-slate-800/50 shadow-sm"
            iconeClassName="mb-4"
          />
        )}
      </div>
    </AdminPageLayout>
  );
}
