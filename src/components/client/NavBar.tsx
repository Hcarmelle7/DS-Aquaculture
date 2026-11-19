"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { TRADUCTIONS } from "@/data/contenu";
import { LogoVideoClip } from "@/components/ui/LogoVideoClip";
import {
  Menu,
  X,
  ShoppingBag,
  GraduationCap,
  Utensils,
  Shield,
  Sun,
  Moon,
  PhoneCall,
  Compass,
  LogOut,
  LayoutDashboard,
  Waves,
  Droplets,
  Settings,
  Sparkles,
} from "lucide-react";

export const NavBar: React.FC = () => {
  const { langue, definirLangue, theme, basculerTheme, reglages, deconnecterAdmin } = useAppStore();
  const [estOuvert, setEstOuvert] = useState<boolean>(false);
  const [compteurTaps, setCompteurTaps] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const t = TRADUCTIONS[langue];

  const estModeAdmin = pathname.startsWith("/admin");

  const liensClient = [
    {
      id: "a-propos",
      label: t.navigationAPropos,
      icone: Compass,
      href: "/#a-propos",
    },
    {
      id: "commander",
      label: t.navigationBoutique,
      icone: ShoppingBag,
      href: "/#commander",
    },
    {
      id: "formations",
      label: t.navigationFormations,
      icone: GraduationCap,
      href: "/#formations",
    },
    {
      id: "recettes",
      label: t.navigationRecettes,
      icone: Utensils,
      href: "/#recettes",
    },
  ];

  const liensAdmin = [
    { id: "dashboard", label: "Tableau de Bord", icone: LayoutDashboard, href: "/admin" },
    { id: "bassins", label: "Bassins & Lots", icone: Waves, href: "/admin/bassins" },
    { id: "eau", label: "Qualité de l'Eau", icone: Droplets, href: "/admin/eau" },
    { id: "nourriture", label: "Nourrissage", icone: Utensils, href: "/admin/nourriture" },
    { id: "commandes", label: "Commandes", icone: ShoppingBag, href: "/admin/commandes" },
    { id: "reglages", label: "Réglages", icone: Settings, href: "/admin/reglages" },
  ];

  const liensAffichage = estModeAdmin ? liensAdmin : liensClient;

  const fermerMenu = () => setEstOuvert(false);

  // Raccourci secret (5 taps rapides) pour aller à l'admin
  useEffect(() => {
    if (compteurTaps >= 5) {
      setCompteurTaps(0);
      router.push("/admin");
    }
    const timer = setTimeout(() => setCompteurTaps(0), 1500);
    return () => clearTimeout(timer);
  }, [compteurTaps, router]);

  const handleLogoTap = (e: React.MouseEvent) => {
    // Si on est déjà sur l'admin, le clic nous ramène à l'accueil
    if (estModeAdmin) return;
    e.preventDefault();
    setCompteurTaps((prev) => prev + 1);
  };

  return (
    <>
      {/* 1. BARRE DE NAVIGATION SUPÉRIEURE STICKY */}
      <nav className="sticky top-0 z-40 w-full bg-[#050811]/90 backdrop-blur-xl border-b border-slate-800/80 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Logo d'origine */}
          <Link
            href={estModeAdmin ? "/admin" : "/"}
            className="flex items-center gap-2 group select-none"
            onClick={(e) => {
              fermerMenu();
              handleLogoTap(e);
            }}
          >
            <div className="w-9 h-9 bg-cyan-950/80 border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.2)] group-hover:scale-105 transition-transform">
              <img src="/images/logo.png" alt="" />
            </div>
            <div className="flex flex-col">
              <img src={reglages.logo} alt="logo" className="h-7" />
            </div>
          </Link>

          {/* Liens desktop */}
          {/* <div className="hidden md:flex items-center gap-6">
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
          </div> */}

          <div className="flex items-center gap-2">
            {/* Sélecteur de langue */}
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 text-[11px] font-bold transition-colors duration-300">
              <button
                onClick={() => definirLangue("fr")}
                className={`px-2 py-1 rounded-lg transition-all ${langue === "fr"
                    ? "bg-[#00d2ff] text-slate-950"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                FR
              </button>
              <button
                onClick={() => definirLangue("en")}
                className={`px-2 py-1 rounded-lg transition-all ${langue === "en"
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
              className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 text-[#00d2ff] flex items-center justify-center hover:border-slate-700 transition-colors active:scale-95"
            >
              {theme === "sombre" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-amber-500" />}
            </button>

            {estModeAdmin ? (
              <button
                onClick={deconnecterAdmin}
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors text-sm font-bold border border-slate-800 hover:border-slate-700 ml-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            ) : null}

            {/* Bouton d'ouverture du menu */}
            <button
              onClick={() => setEstOuvert(true)}
              aria-label="Ouvrir le menu"
              className="w-9 h-9 ml-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white flex items-center justify-center hover:border-[#00d2ff]/40 transition-colors active:scale-95 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. VOLET  */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${estOuvert ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Fond flouté */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={fermerMenu}
        />

        <div className="relative w-full h-full flex justify-between">
          {/* Section Gauche  */}
          <div
            className="hidden md:flex flex-1 items-center justify-center p-8 cursor-pointer select-none"
            onClick={fermerMenu}
          >
            <div className="flex flex-col items-center gap-2 transition-transform duration-500 hover:scale-105">
              <LogoVideoClip className="w-90 h-94 drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)]" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/75 text-center max-w-xs">
                {reglages.slogan}
              </p>
            </div>
          </div>

          {/* Section Droite */}
          <div
            className={`w-full md:w-[560px] h-full bg-white dark:bg-[#050811] border-l border-slate-200 dark:border-slate-800/80 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto transition-transform transition-colors duration-500 ease-out md:rounded-l-[40px] ${estOuvert ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className=" hidden md:block md:flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-50 dark:bg-cyan-950/80 border border-[#00d2ff]/40 flex items-center justify-center text-[#00d2ff] rounded-lg">
                  <img src="/images/logo.png" alt="" />
                </div>
                <img src={reglages.logo} alt="logo" className="h-6" />
              </div>

              <LogoVideoClip className="block md:hidden w-18 h-18 " />

              <button
                onClick={fermerMenu}
                aria-label="Fermer le menu"
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-[#00d2ff] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 " />
              </button>
            </div>

            {/* Liens de navigation */}
            <div className="space-y-4 my-auto py-6">
              {liensAffichage.map((lien) => {
                const Icone = lien.icone;
                return (
                  <Link
                    key={lien.id}
                    href={lien.href}
                    onClick={fermerMenu}
                    className="group flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 text-lg sm:text-xl font-black text-slate-800 dark:text-slate-200 hover:text-[#00d2ff] dark:hover:text-[#00d2ff] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <Icone className="w-5 h-5 text-[#00d2ff] group-hover:scale-110 transition-transform" />
                      <span>{lien.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* footer */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800/80">
              <a
                href={`tel:${reglages.telephoneBrut}`}
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/70 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#00d2ff] dark:hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#00d2ff]">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">Service client</span>
                  <span>{reglages.telephoneAffichage}</span>
                </div>
              </a>

              {estModeAdmin ? (
                <button
                  onClick={() => {
                    fermerMenu();
                    deconnecterAdmin();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm font-bold hover:bg-red-500/20 transition mt-4 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;