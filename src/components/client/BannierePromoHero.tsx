"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { ReglagesEntreprise, StylePromo, TypePromo } from "@/types";
import { Sparkles, Megaphone, Zap, ArrowRight, ExternalLink } from "lucide-react";

interface BannierePromoHeroProps {
  /**
   * Permet de surcharger les réglages pour l'aperçu en direct dans l'interface admin
   */
  apercuReglages?: Partial<ReglagesEntreprise>;
  /**
   * Indique si le composant est affiché dans un cadre d'aperçu d'administration
   */
  estModeApercu?: boolean;
}

export const BannierePromoHero: React.FC<BannierePromoHeroProps> = ({
  apercuReglages,
  estModeApercu = false,
}) => {
  const { reglages: reglagesStore } = useAppStore();

  const reglages: ReglagesEntreprise = {
    ...reglagesStore,
    ...apercuReglages,
  };

  const {
    promoActive,
    promoTitre = "OFFRE FLASH",
    promoTexte = "",
    promoType = "prix" as TypePromo,
    promoImageUrl,
    promoStyle = "ruban_incline" as StylePromo,
  } = reglages;

  // Si la promo est inactive et qu'on n'est pas en mode aperçu, on n'affiche rien
  if (!promoActive && !estModeApercu) {
    return null;
  }

  // Si la promo est inactive en mode aperçu, message explicatif
  if (!promoActive && estModeApercu) {
    return (
      <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400 font-medium">
        La bannière est actuellement masquée et n&apos;apparaîtra pas sur la vitrine.
      </div>
    );
  }

  // URL cible selon le type de promotion
  const cibleLien = promoType === "evenement" ? "#formations" : "#commander";

  // Icone selon le type
  const renderIcone = (className = "w-3.5 h-3.5") => {
    switch (promoType) {
      case "evenement":
        return <Sparkles className={className} />;
      case "info":
        return <Megaphone className={className} />;
      case "prix":
      default:
        return <Zap className={`${className} fill-current`} />;
    }
  };

  // =========================================================================
  // CAS 1 : PRIORITÉ ABSOLUE À L'IMAGE UPLOADÉE (Canva / Flyer commercial)
  // =========================================================================
  if (promoImageUrl) {
    const contenuImage = (
      <div className="relative group max-w-xl sm:max-w-2xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border-2 border-white ring-4 ring-black/15 transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer bg-slate-950">
        <img
          src={promoImageUrl}
          alt={promoTitre || "Offre promotionnelle DS Aquaculture"}
          className="w-full max-h-56 sm:max-h-72 object-cover sm:object-contain mx-auto block group-hover:scale-105 transition-transform duration-500"
          loading="eager"
        />

        {/* Badge discret d'identification en haut à gauche */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-black uppercase px-3 py-1.5 rounded-xl border border-white/20 shadow-lg flex items-center gap-1.5">
          {renderIcone("w-3 h-3 text-[#00d2ff]")}
          <span>{promoTitre || "OFFRE SPÉCIALE"}</span>
        </div>

        {/* Bouton d'action flottant au survol */}
        <div className="absolute bottom-3 right-3 bg-white/95 text-slate-900 text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
          <span>Profiter de l&apos;offre</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#00d2ff]" />
        </div>
      </div>
    );

    if (estModeApercu) {
      return (
        <div className="w-full flex flex-col items-center justify-center">
          {contenuImage}
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            💡 Priorité Image active : L&apos;affiche Canva remplace automatiquement le texte.
          </p>
        </div>
      );
    }

    return (
      <div className="mb-6 sm:mb-8 flex justify-center w-full px-2">
        <a href={cibleLien} className="block w-full max-w-2xl">
          {contenuImage}
        </a>
      </div>
    );
  }

  // =========================================================================
  // CAS 2 : PAS D'IMAGE => APPLICATION DU TEMPLATE CSS DYNAMIQUE CHOISI
  // =========================================================================

  // 1. Template : Ruban Incliné (Punchy Sticker)
  if (promoStyle === "ruban_incline") {
    const fondRuban =
      promoType === "evenement"
        ? "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white"
        : promoType === "info"
        ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-slate-950"
        : "bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 text-slate-950";

    const badgeRuban =
      promoType === "evenement"
        ? "bg-white text-fuchsia-600"
        : "bg-slate-950 text-amber-300";

    const contenuRuban = (
      <div
        className={`group inline-flex items-center gap-3 px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl shadow-2xl -rotate-2 hover:rotate-0 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white ring-4 ring-black/10 cursor-pointer ${fondRuban}`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`text-[11px] sm:text-xs font-black uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-sm flex items-center gap-1.5 ${badgeRuban}`}
          >
            {renderIcone()}
            <span>{promoTitre || "OFFRE FLASH"}</span>
          </span>
          <span className="text-sm sm:text-base font-black tracking-tight drop-shadow-sm text-left">
            {promoTexte}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform shrink-0" />
      </div>
    );

    if (estModeApercu) {
      return (
        <div className="flex flex-col items-center justify-center">
          {contenuRuban}
        </div>
      );
    }

    return (
      <div className="mb-6 sm:mb-8 flex justify-center w-full px-2">
        <a href={cibleLien} className="inline-block">
          {contenuRuban}
        </a>
      </div>
    );
  }

  // 2. Template : Badge Minimaliste (Pill épuré avec puce animée)
  if (promoStyle === "badge_minimaliste") {
    const couleurPuce =
      promoType === "evenement"
        ? "bg-fuchsia-500"
        : promoType === "info"
        ? "bg-teal-500"
        : "bg-amber-500";

    const contenuBadge = (
      <div className="group inline-flex items-center gap-3 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-xl shadow-black/20 border border-white/60 dark:border-slate-700/60 backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
        {/* Puce d'animation pulsation */}
        <div className="relative flex items-center justify-center">
          <span
            className={`animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 ${couleurPuce}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${couleurPuce}`}
          />
        </div>

        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
          {promoTitre || "NOUVEAU"}
        </span>

        <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100 text-left">
          {promoTexte}
        </span>

        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    );

    if (estModeApercu) {
      return (
        <div className="flex flex-col items-center justify-center">
          {contenuBadge}
        </div>
      );
    }

    return (
      <div className="mb-6 sm:mb-8 flex justify-center w-full px-2">
        <a href={cibleLien} className="inline-block">
          {contenuBadge}
        </a>
      </div>
    );
  }

  // 3. Template : Bannière Classique (Glassmorphism moderne avec bouton CTA)
  const contenuClassique = (
    <div className="w-full max-w-2xl mx-auto rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/20 dark:bg-black/40 border border-white/40 dark:border-white/20 shadow-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:border-white/70">
      <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            promoType === "evenement"
              ? "bg-gradient-to-br from-fuchsia-500 to-rose-600 text-white"
              : promoType === "info"
              ? "bg-gradient-to-br from-teal-400 to-emerald-600 text-white"
              : "bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950"
          }`}
        >
          {renderIcone("w-5 h-5")}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-md">
              {promoTitre || "OFFRE EN COURS"}
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-white drop-shadow-sm mt-0.5">
            {promoTexte}
          </p>
        </div>
      </div>

      <div className="w-full sm:w-auto flex justify-end">
        <span className="w-full sm:w-auto px-4 py-2.5 bg-white text-[#28a9ed] rounded-xl font-black text-xs shadow-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 shrink-0 group-hover:scale-105">
          <span>Découvrir</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );

  if (estModeApercu) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        {contenuClassique}
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8 flex justify-center w-full px-2">
      <a href={cibleLien} className="block w-full max-w-2xl">
        {contenuClassique}
      </a>
    </div>
  );
};
