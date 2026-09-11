"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { Shield, Lock, LogOut, ArrowLeft, Sun, Moon, Mail } from "lucide-react";
import { NavBar } from "@/components/client/NavBar";

export default function AdminPage() {
  const { estAdminAuthentifie, connecterAdmin, deconnecterAdmin, verifierSessionActuelle, theme, basculerTheme, reglages } = useAppStore();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    verifierSessionActuelle().then(() => setChargement(false));
  }, [verifierSessionActuelle]);

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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <NavBar />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl font-black text-white">Tableau de Bord</h1>
        <p className="text-slate-400">Bienvenue dans l'espace de gestion. Le dashboard sera intégré ici à la prochaine étape.</p>
        
        {/* Futurs composants: Stats, Lots, Bassins */}
      </main>
    </div>
  );
}
