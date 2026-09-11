"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Lock, LogOut, ArrowLeft, Sun, Moon, Mail, Fish, Waves, Activity } from "lucide-react";
import { NavBar } from "@/components/client/NavBar";
import { StatCard } from "@/components/admin/StatCard";
import { BassinCard } from "@/components/admin/BassinCard";
import { CommandeCard } from "@/components/admin/CommandeCard";
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

  const totalPoissons = lots.filter(l => l.statut === "en_cours").reduce((acc, lot) => acc + lot.quantiteActuelle, 0);
  const bassinsActifs = bassins.filter(b => b.statut === "actif").length;

  const handleActionBassin = (bassinId: string) => {
    console.log("Action sur le bassin", bassinId);
    // TODO: Ouvrir le modal d'ajout de lot ou de gestion
  };

  const commandesEnAttente = commandes.filter(c => c.statut === "en_attente");
  const commandesEnLivraison = commandes.filter(c => c.statut === "en_livraison");

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-20 transition-colors duration-300">
      <NavBar />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Tableau de Bord</h1>
          <p className="text-[var(--text-muted)]">Aperçu en temps réel de votre ferme aquacole.</p>
        </div>

        {/* Commandes En Attente (Vue directe) */}
        {commandesEnAttente.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></span>
              <h2 className="text-xl sm:text-2xl font-black text-white">Nouvelles Commandes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commandesEnAttente.map((cmd) => (
                <CommandeCard key={cmd.id} commande={cmd} />
              ))}
            </div>
          </div>
        )}

        {/* Commandes En Cours de Livraison */}
        {commandesEnLivraison.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-400"></span>
              <h2 className="text-xl sm:text-2xl font-black text-white">En cours de livraison</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commandesEnLivraison.map((cmd) => (
                <CommandeCard key={cmd.id} commande={cmd} />
              ))}
            </div>
          </div>
        )}
        
        {/* Ligne des Statistiques */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 md:pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="snap-center min-w-[85vw] sm:min-w-[300px] md:min-w-0 flex-shrink-0">
            <StatCard 
              titre="Biomasse Totale (Estimation)" 
              valeur="--- kg" 
              Icone={Activity} 
              description="Calculée sur base du FCR" 
            />
          </div>
          <div className="snap-center min-w-[85vw] sm:min-w-[300px] md:min-w-0 flex-shrink-0">
            <StatCard 
              titre="Population Vivante" 
              valeur={totalPoissons.toLocaleString("fr-FR")} 
              Icone={Fish} 
              description="Poissons en cours d'élevage" 
            />
          </div>
          <div className="snap-center min-w-[85vw] sm:min-w-[300px] md:min-w-0 flex-shrink-0">
            <StatCard 
              titre="Bassins Actifs" 
              valeur={`${bassinsActifs} / ${bassins.length}`} 
              Icone={Waves} 
              description="En cours d'exploitation" 
            />
          </div>
        </div>

        {/* Grille des Bassins */}
        <div>
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
            <Waves className="w-6 h-6 text-[#00d2ff]" />
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
              <div className="col-span-full py-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800/50 border-dashed">
                <p className="text-slate-400">Aucun bassin configuré.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
