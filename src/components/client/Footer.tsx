"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { Phone, Navigation, Compass } from "lucide-react";

export const Footer: React.FC = () => {
  const { reglages, langue } = useAppStore();
  const annee = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Section 1 : Marque & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-cyan-950/80 border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                <img src="/images/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <img src={reglages.logo} alt="logo text" className="h-7" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {langue === "en" ? reglages.sloganEn : reglages.slogan}
            </p>
          </div>

          {/* Section 2 : Liens Rapides */}
          <div className="space-y-4">
            <h4 className="text-white font-black text-lg">Liens Rapides</h4>
            <ul className="space-y-2 text-sm text-slate-400 font-medium">
              <li>
                <a href="#a-propos" className="hover:text-[#28a9ed] transition-colors flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  {langue === "fr" ? "À Propos" : "About Us"}
                </a>
              </li>
              <li>
                <a href="#commander" className="hover:text-[#28a9ed] transition-colors flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  {langue === "fr" ? "Commander" : "Order"}
                </a>
              </li>
            </ul>
          </div>

          {/* Section 3 : Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-black text-lg">Contact</h4>
            <div className="space-y-3 text-sm text-slate-400 font-medium">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#28a9ed]" />
                {reglages.telephoneAffichage}
              </p>
              <p className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#28a9ed]">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                </svg>
                <a href={reglages.urlTiktok} target="_blank" rel="noopener noreferrer" className="hover:text-[#28a9ed] transition-colors">
                  {reglages.nomUtilisateurTiktok}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-medium">
            &copy; {annee} {reglages.nom}. Tous droits réservés.
          </p>
          <div className="text-slate-500 text-xs font-medium bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 flex items-center gap-1">
            Développé par <span className="text-[#28a9ed] font-black uppercase tracking-wider ml-1">Carmelle</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
