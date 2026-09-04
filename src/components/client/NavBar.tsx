"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { TRADUCTIONS } from "@/data/contenu";
import {
  Menu,
  X,
  ShoppingBag,
  GraduationCap,
  Utensils,
  Shield,
  Globe,
  Sun,
  Moon,
  PhoneCall,
  Waves,
} from "lucide-react";

export const NavBar: React.FC = () => {
  const { langue, definirLangue, theme, basculerTheme, reglages } = useAppStore();
  const [estOuvert, setEstOuvert] = useState<boolean>(false);
  const t = TRADUCTIONS[langue];

  const liensNavigation = [
    {
      id: "commander",
      label: t.navigationBoutique,
      icone: ShoppingBag,
      href: "#commander",
    },
    {
      id: "formations",
      label: t.navigationFormations,
      icone: GraduationCap,
      href: "#formations",
    },
    {
      id: "recettes",
      label: t.navigationRecettes,
      icone: Utensils,
      href: "#recettes",
    },
  ];

  const fermerMenu = () => setEstOuvert(false);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-[#050811]/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 group select-none"
            onClick={fermerMenu}
          >
            <div className="w-9 h-9 bg-cyan-950/80 border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.2)] group-hover:scale-105 transition-transform">
              <img src="/images/logo.png" alt="" />
            </div>
            <div className="flex flex-col">
              <img src={reglages.nom} alt="logo" className=" h-7" />
              
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {liensNavigation.map((lien) => {
              const Icone = lien.icone;
              return (
                <a
                  key={lien.id}
                  href={lien.href}
                  className="flex items-center gap-2 text-md font-bold text-slate-300 hover:text-[#00d2ff] transition-colors"
                >
                  <Icone className="w-5 h-5 text-[#00d2ff]" />
                  <span>{lien.label}</span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* Commutateur de langues */}
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 text-[11px] font-bold">
              <button
                onClick={() => definirLangue("fr")}
                className={`px-2 py-1 rounded-lg transition-all ${
                  langue === "fr"
                    ? "bg-[#00d2ff] text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => definirLangue("en")}
                className={`px-2 py-1 rounded-lg transition-all ${
                  langue === "en"
                    ? "bg-[#00d2ff] text-slate-950"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* Thème */}
            <button
              onClick={basculerTheme}
              aria-label="Changer le thème"
              className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-[#00d2ff] flex items-center justify-center hover:border-slate-700 transition active:scale-95"
            >
              {theme === "sombre" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-amber-300" />}
            </button>

            {/* Bouton Menu */}
            <button
              onClick={() => setEstOuvert(!estOuvert)}
              aria-label="Ouvrir le menu"
              className="md:hidden w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-white flex items-center justify-center hover:border-[#00d2ff]/40 transition active:scale-95"
            >
              {estOuvert ? <X className="w-5 h-5 text-[#00d2ff]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Collapse */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-800/80 bg-[#050811]/98 backdrop-blur-2xl ${
            estOuvert ? "max-h-[450px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
          }`}
        >
          <div className="max-w-xl mx-auto px-4 space-y-2">
            {liensNavigation.map((lien) => {
              const Icone = lien.icone;
              return (
                <a
                  key={lien.id}
                  href={lien.href}
                  onClick={fermerMenu}
                  className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-slate-900/50 border border-slate-800/70 text-sm font-bold text-white hover:border-[#00d2ff]/40 hover:bg-cyan-950/20 active:scale-[0.98] transition"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-[#00d2ff]">
                    <Icone className="w-4 h-4" />
                  </div>
                  <span>{lien.label}</span>
                </a>
              );
            })}

            {/* Appel direct */}
            <a
              href={`tel:${reglages.telephoneBrut}`}
              className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-slate-900/50 border border-slate-800/70 text-sm font-bold text-slate-300 hover:text-white transition"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-[#00d2ff]">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase">Service client</span>
                <span>{reglages.telephoneAffichage}</span>
              </div>
            </a>

            {/* Accès Administration */}
            <div className="pt-2 border-t border-slate-800/60 mt-2">
              <Link
                href="/admin"
                onClick={fermerMenu}
                className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/15 transition"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>{t.navigationAdmin}</span>
                </div>
                <span className="text-[10px] uppercase font-semibold text-amber-400/80">Accès gérant →</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;