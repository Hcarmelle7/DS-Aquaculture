"use client";

import React from "react";
import { CheckCircle2, Eye, LayoutTemplate, Sparkles } from "lucide-react";
import { StylePromo, TypePromo } from "@/models";
import { SectionCarteAdmin } from "@/components/admin/SectionCarteAdmin";
import { TeleversementImage } from "@/components/ui/TeleversementImage";
import { BannierePromoHero } from "@/components/client/BannierePromoHero";

interface SectionBannierePromoProps {
  promoActive: boolean;
  setPromoActive: (val: boolean) => void;
  promoTitre: string;
  setPromoTitre: (val: string) => void;
  promoTexte: string;
  setPromoTexte: (val: string) => void;
  promoType: TypePromo;
  setPromoType: (val: TypePromo) => void;
  promoImageUrl: string | null;
  setPromoImageUrl: (val: string | null) => void;
  promoStyle: StylePromo;
  setPromoStyle: (val: StylePromo) => void;
}

export const SectionBannierePromo: React.FC<SectionBannierePromoProps> = ({
  promoActive,
  setPromoActive,
  promoTitre,
  setPromoTitre,
  promoTexte,
  setPromoTexte,
  promoType,
  setPromoType,
  promoImageUrl,
  setPromoImageUrl,
  promoStyle,
  setPromoStyle,
}) => {
  return (
    <SectionCarteAdmin
      titre="Bannière Promotionnelle Hero"
      sousTitre="Affiche Canva prioritaire ou template CSS au choix si aucune image n'est fournie."
      Icone={Sparkles}
      iconeContainerClassName="bg-amber-500/10 text-amber-500 border-amber-500/20"
      actionDroite={
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
            {promoActive ? "🟢 En ligne" : "⚪ Masquée"}
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={promoActive}
            onClick={() => setPromoActive(!promoActive)}
            className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
              promoActive
                ? "bg-emerald-500 shadow-md shadow-emerald-500/30"
                : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                promoActive ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      }
    >
      {/* Téléversement d'affiche / image Canva (Priorité Absolue) */}
      <div className="p-5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-4">
        <TeleversementImage
          valeur={promoImageUrl}
          auChangement={setPromoImageUrl}
          label="Affiche Publicitaire Importée (Canva / Flyer)"
          description="Téléversez votre visuel Canva. S'il est présent, il sera affiché en priorité absolue dans le Hero."
        />

        {promoImageUrl ? (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Priorité Image active :</strong> Cette affiche sera affichée directement dans le Hero. Les textes ci-dessous servent de sécurité en cas de suppression de l&apos;image.
            </span>
          </div>
        ) : (
          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2 font-medium">
            <LayoutTemplate className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              <strong>Mode Template CSS actif :</strong> Aucune image importée. Le système génère automatiquement un sticker ou badge stylisé avec les textes ci-dessous.
            </span>
          </div>
        )}
      </div>

      {/* Paramètres du Template CSS & Textes */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Configuration du Template CSS & Textes
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Template de Présentation
            </label>
            <select
              value={promoStyle}
              onChange={(e) => setPromoStyle(e.target.value as StylePromo)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#00d2ff] shadow-sm cursor-pointer"
            >
              <option value="ruban_incline">🏷️ Ruban Incliné (Punchy Sticker dynamique)</option>
              <option value="badge_minimaliste">✨ Badge Minimaliste (Pill épuré avec puce animée)</option>
              <option value="banniere_classique">💎 Carte Translucide (Bannière moderne Glassmorphism)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Thème Visuel / Type d&apos;Offre
            </label>
            <select
              value={promoType}
              onChange={(e) => setPromoType(e.target.value as TypePromo)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#00d2ff] shadow-sm cursor-pointer"
            >
              <option value="prix">💰 Prix / Réduction (Jaune & Orange solaire)</option>
              <option value="evenement">🎉 Événement / Formations / Dégustation (Fuchsia & Rose)</option>
              <option value="info">📢 Nouveauté / Arrivage (Émeraude & Cyan)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Titre du badge
            </label>
            <input
              type="text"
              required={promoActive && !promoImageUrl}
              value={promoTitre}
              onChange={(e) => setPromoTitre(e.target.value)}
              placeholder="Ex: OFFRE FLASH, DÉGUSTATION..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-black uppercase text-slate-900 dark:text-white outline-none focus:border-[#00d2ff] shadow-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Texte explicatif de l&apos;offre
            </label>
            <input
              type="text"
              required={promoActive && !promoImageUrl}
              value={promoTexte}
              onChange={(e) => setPromoTexte(e.target.value)}
              placeholder="Ex: Silures gros calibres disponibles ce week-end ! -10% dès 5kg achetés."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-[#00d2ff] shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Aperçu en direct dans le contexte réel du Hero */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          Aperçu fidèle du rendu dans le Hero public :
        </span>

        {promoActive ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#28a9ed] relative overflow-hidden flex flex-col items-center justify-center text-center shadow-inner">
            <BannierePromoHero
              apercuReglages={{
                promoActive,
                promoTitre,
                promoTexte,
                promoType,
                promoImageUrl,
                promoStyle,
              }}
              estModeApercu
            />
            <p className="text-[11px] text-white/80 font-semibold mt-4">
              Positionné au sommet du Hero, juste au-dessus du titre principal de la vitrine.
            </p>
          </div>
        ) : (
          <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-400 font-medium">
            La bannière est actuellement masquée et n&apos;apparaîtra pas sur la vitrine.
          </div>
        )}
      </div>
    </SectionCarteAdmin>
  );
};
