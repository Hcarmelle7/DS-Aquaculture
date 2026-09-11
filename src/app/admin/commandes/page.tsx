"use client";

import React, { useEffect, useState } from "react";
import { NavBar } from "@/components/client/NavBar";
import { useAppStore } from "@/store/useAppStore";
import { CommandeCard } from "@/components/admin/CommandeCard";
import { ShoppingBag, TrendingUp, DollarSign } from "lucide-react";

export default function PageCommandes() {
  const { commandes, chargerCommandes } = useAppStore();
  const [filtreStatut, setFiltreStatut] = useState<"toutes" | "en_attente" | "en_livraison" | "livree">("toutes");

  useEffect(() => {
    chargerCommandes();
  }, [chargerCommandes]);

  const commandesFiltrees = commandes.filter((c) => 
    filtreStatut === "toutes" ? true : c.statut === filtreStatut
  );

  // Statistiques Rapides
  const totalRevenus = commandes
    .filter(c => c.statut === "livree")
    .reduce((acc, c) => acc + c.prixTotal, 0);

  const totalKilos = commandes
    .filter(c => c.statut === "livree")
    .reduce((acc, c) => acc + c.poidsKg, 0);

  const commandesEnAttente = commandes.filter(c => c.statut === "en_attente").length;

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-20 transition-colors duration-300">
      <NavBar />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#00d2ff]" />
            Commandes & Ventes
          </h1>
          <p className="text-[var(--text-muted)]">Gérez les commandes des clients et suivez vos statistiques de vente.</p>
        </div>

        {/* Stats Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-bold">À traiter</p>
              <p className="text-2xl font-black text-white">{commandesEnAttente}</p>
            </div>
          </div>
          
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-bold">Chiffre d'Affaires (Livré)</p>
              <p className="text-2xl font-black text-[#00d2ff]">{totalRevenus.toLocaleString("fr-FR")} FCFA</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-bold">Volume Vendu</p>
              <p className="text-2xl font-black text-white">{totalKilos} kg</p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setFiltreStatut("toutes")}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${filtreStatut === "toutes" ? "bg-[#00d2ff] text-slate-950" : "bg-slate-800 text-slate-300"}`}
          >
            Toutes
          </button>
          <button 
            onClick={() => setFiltreStatut("en_attente")}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${filtreStatut === "en_attente" ? "bg-yellow-500 text-yellow-950" : "bg-slate-800 text-slate-300"}`}
          >
            En attente ({commandes.filter(c => c.statut === "en_attente").length})
          </button>
          <button 
            onClick={() => setFiltreStatut("en_livraison")}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${filtreStatut === "en_livraison" ? "bg-blue-500 text-blue-950" : "bg-slate-800 text-slate-300"}`}
          >
            En livraison
          </button>
          <button 
            onClick={() => setFiltreStatut("livree")}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${filtreStatut === "livree" ? "bg-green-500 text-green-950" : "bg-slate-800 text-slate-300"}`}
          >
            Livrées
          </button>
        </div>

        {/* Liste des commandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commandesFiltrees.map((cmd) => (
            <CommandeCard key={cmd.id} commande={cmd} />
          ))}

          {commandesFiltrees.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-slate-900/50 rounded-3xl border border-slate-800/50 border-dashed">
              <ShoppingBag className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400 text-center max-w-md">Aucune commande trouvée pour ce statut.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
