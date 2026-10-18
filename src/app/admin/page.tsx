"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Lock,
  LogOut,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  Mail,
  Fish,
  Waves,
  Activity,
  ShoppingBag,
} from "lucide-react";
import { NavBar } from "@/components/client/NavBar";
import { StatCard } from "@/components/admin/StatCard";
import { BassinCard } from "@/components/admin/BassinCard";
import { CommandeCard } from "@/components/admin/CommandeCard";
import { BanniereErreurReseau } from "@/components/admin/BanniereErreurReseau";
import { useAppStore } from "@/store/useAppStore";

export default function AdminPage() {
  const { 
    estAdminAuthentifie, connecterAdmin, deconnecterAdmin, verifierSessionActuelle, 
    theme, basculerTheme, reglages,
    bassins, lots, chargerBassins,
    commandes, chargerCommandes
  } = useAppStore();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    verifierSessionActuelle().then(() => {
      setChargement(false);
      if (estAdminAuthentifie) {
        chargerBassins();
        chargerCommandes();
      }
    });
  }, [verifierSessionActuelle, estAdminAuthentifie, chargerBassins, chargerCommandes]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);
    const result = await connecterAdmin(email, motDePasse);
    if (!result.success) {
      setErreur(result.error || "Erreur lors de la connexion");
    }
    setChargement(false);
  };

  if (chargement) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Shield className="w-8 h-8 text-amber-500 animate-pulse" /></div>;
  }

  if (!estAdminAuthentifie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Espace Gérant</h1>
          <p className="text-sm text-slate-400 mb-8">Accès sécurisé pour la gestion de la ferme.</p>

          <div className="relative mb-4">
            <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse email"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all"
              autoFocus
              required
            />
          </div>

          <div className="relative mb-6">
            <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="Mot de passe"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] outline-none transition-all"
              required
            />
          </div>

          {erreur && <p className="text-red-400 text-xs font-bold mb-4">{erreur}</p>}

          <button type="submit" disabled={chargement} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl transition-colors mb-4 disabled:opacity-50">
            {chargement ? "Connexion..." : "Déverrouiller l'accès"}
          </button>

          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retourner à la boutique
          </Link>
        </form>
      </div>
    );
  }

  // Calculs dynamiques des KPIs
  const bassinsActifsIds = new Set(bassins.filter(b => b.statut === "actif").map(b => b.id));
  const totalPoissons = lots.filter(l => l.statut === "en_cours").reduce((acc, lot) => acc + (lot.quantiteActuelle || 0), 0);
  const bassinsActifs = bassins.filter(b => b.statut === "actif").length;

  // Biomasse totale calculée sur tous les lots en cours
  const biomasseTotaleKg = Number(
    lots
      .filter(l => l.statut === "en_cours" && (bassinsActifsIds.size === 0 || bassinsActifsIds.has(l.bassinId)))
      .reduce((acc, l) => acc + ((l.quantiteActuelle || 0) * (l.poidsMoyenInitialG || 0)) / 1000, 0)
      .toFixed(1)
  );

  // Commandes passées aujourd'hui
  const aujourdhuiStr = new Date().toDateString();
  const commandesAujourdhui = commandes.filter(c => {
    if (!c.creeLe) return false;
    return new Date(c.creeLe).toDateString() === aujourdhuiStr;
  }).length;

  const handleActionBassin = (bassinId: string) => {
    console.log("Action sur le bassin", bassinId);
  };

  // 3 à 5 commandes les plus récentes
  const dernieresCommandes = commandes.slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-20 transition-colors duration-300">
      <NavBar />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <BanniereErreurReseau />

        <div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Tableau de Bord</h1>
          <p className="text-[var(--text-muted)]">Aperçu en temps réel de votre ferme aquacole.</p>
        </div>

        {/* Ligne des Statistiques (KPIs réparés et dynamiques) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            titre="Biomasse Totale (Estimation)" 
            valeur={`${biomasseTotaleKg.toLocaleString("fr-FR")} kg`} 
            Icone={Activity} 
            description="Poids total calculé des bacs actifs" 
          />
          <StatCard 
            titre="Commandes du Jour" 
            valeur={commandesAujourdhui} 
            Icone={ShoppingBag} 
            description={commandesAujourdhui > 1 ? "Commandes reçues aujourd'hui" : "Commande reçue aujourd'hui"} 
          />
          <StatCard 
            titre="Population Vivante" 
            valeur={`${totalPoissons.toLocaleString("fr-FR")} poissons`} 
            Icone={Fish} 
            description="Poissons en cours d'élevage" 
          />
          <StatCard 
            titre="Bassins Actifs" 
            valeur={`${bassinsActifs} / ${bassins.length}`} 
            Icone={Waves} 
            description="Bacs en exploitation" 
          />
        </div>

        {/* Section Dernières Commandes (Directement visible avec bouton Voir tout) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00d2ff]/10 text-[#28a9ed] dark:text-[#00d2ff] flex items-center justify-center border border-[#00d2ff]/20 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Dernières Commandes
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {commandes.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Modifiez l'état des commandes directement depuis cette vue
                </p>
              </div>
            </div>

            <Link
              href="/admin/commandes"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#28a9ed] dark:text-[#00d2ff] hover:underline self-start sm:self-auto bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors"
            >
              <span>Voir toutes les commandes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dernieresCommandes.map((cmd) => (
              <CommandeCard key={cmd.id} commande={cmd} />
            ))}

            {commandes.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800/50 border-dashed shadow-sm text-center p-6">
                <ShoppingBag className="w-10 h-10 text-slate-400 dark:text-slate-600 mb-2 opacity-50" />
                <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">
                  Aucune commande enregistrée pour le moment.
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Les nouvelles commandes des clients apparaîtront directement ici.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Grille des Bassins */}
        <div>
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
            <Waves className="w-6 h-6 text-[#28a9ed] dark:text-[#00d2ff]" />
            État des Bassins
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bassins.map(bassin => {
              const lotActif = lots.find(l => l.bassinId === bassin.id && l.statut === "en_cours");
              return (
                <BassinCard 
                  key={bassin.id} 
                  bassin={bassin} 
                  lotActif={lotActif} 
                  surAction={handleActionBassin} 
                />
              );
            })}
            
            {bassins.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800/50 border-dashed shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 font-semibold">Aucun bassin configuré.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
