"use client";

import React, { useEffect, useState } from "react";
import { NavBar } from "@/components/client/NavBar";
import { useAppStore } from "@/store/useAppStore";
import { Bouton } from "@/components/ui/Bouton";
import { BanniereErreurReseau } from "@/components/admin/BanniereErreurReseau";
import { TeleversementImage } from "@/components/ui/TeleversementImage";
import { BannierePromoHero } from "@/components/client/BannierePromoHero";
import { StylePromo, TypePromo } from "@/types";
import {
  Settings,
  Fish,
  GraduationCap,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  Minus,
  Clock,
  ListOrdered,
  Tag,
  Zap,
  Megaphone,
  ArrowRight,
  LayoutTemplate,
  ImageIcon,
} from "lucide-react";

export default function PageAdminReglages() {
  const { reglages, chargerReglages, mettreAJourReglages } = useAppStore();

  const [prixVivant, setPrixVivant] = useState<number>(reglages.prixVivant || 2200);
  const [prixNettoye, setPrixNettoye] = useState<number>(reglages.prixNettoye || 2500);
  const [prixFormation, setPrixFormation] = useState<number>(reglages.prixFormation || 50000);
  const [dureeFormation, setDureeFormation] = useState<string>(
    reglages.dureeFormation || "5 Jours complets"
  );
  const [texteFormation, setTexteFormation] = useState<string>(
    reglages.texteFormation ||
      "Formation complète en pisciculture hors-sol : maîtrise de la qualité de l'eau, alimentation optimale et rentabilité."
  );
  const [programmeFormation, setProgrammeFormation] = useState<string>(
    reglages.programmeFormation ||
      "Module 1 : Dimensionnement et installation des bacs hors-sol\nModule 2 : Gestion physico-chimique de l'eau (pH, O2, Température)\nModule 3 : Alimentation haute performance et calcul des rations journalières\nModule 4 : Reproduction artificielle et suivi des alevins\nModule 5 : Prévention sanitaire et modèle économique de rentabilité"
  );

  const [promoActive, setPromoActive] = useState<boolean>(reglages.promoActive || false);
  const [promoTitre, setPromoTitre] = useState<string>(reglages.promoTitre || "OFFRE FLASH");
  const [promoTexte, setPromoTexte] = useState<string>(
    reglages.promoTexte ||
      "Arrivage de silures frais gros calibres ce week-end ! Commandez en ligne dès maintenant."
  );
  const [promoType, setPromoType] = useState<TypePromo>(
    reglages.promoType || "prix"
  );
  const [promoImageUrl, setPromoImageUrl] = useState<string | null>(
    reglages.promoImageUrl || null
  );
  const [promoStyle, setPromoStyle] = useState<StylePromo>(
    reglages.promoStyle || "ruban_incline"
  );

  const [enCours, setEnCours] = useState<boolean>(false);
  const [succes, setSucces] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    chargerReglages();
  }, [chargerReglages]);

  // Synchroniser les champs locaux lorsque reglages est chargé depuis Supabase
  useEffect(() => {
    if (reglages) {
      if (reglages.prixVivant) setPrixVivant(reglages.prixVivant);
      if (reglages.prixNettoye) setPrixNettoye(reglages.prixNettoye);
      if (reglages.prixFormation) setPrixFormation(reglages.prixFormation);
      if (reglages.dureeFormation) setDureeFormation(reglages.dureeFormation);
      if (reglages.texteFormation) setTexteFormation(reglages.texteFormation);
      if (reglages.programmeFormation) setProgrammeFormation(reglages.programmeFormation);
      if (reglages.promoActive !== undefined) setPromoActive(reglages.promoActive);
      if (reglages.promoTitre) setPromoTitre(reglages.promoTitre);
      if (reglages.promoTexte) setPromoTexte(reglages.promoTexte);
      if (reglages.promoType) setPromoType(reglages.promoType);
      if (reglages.promoImageUrl !== undefined) setPromoImageUrl(reglages.promoImageUrl);
      if (reglages.promoStyle) setPromoStyle(reglages.promoStyle);
    }
  }, [reglages]);

  const handleEnregistrer = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    setSucces(null);
    setErreur(null);

    try {
      const ok = await mettreAJourReglages({
        prixVivant: Number(prixVivant),
        prixNettoye: Number(prixNettoye),
        prixFormation: Number(prixFormation),
        dureeFormation: dureeFormation.trim(),
        texteFormation: texteFormation.trim(),
        programmeFormation: programmeFormation.trim(),
        promoActive,
        promoTitre: promoTitre.trim(),
        promoTexte: promoTexte.trim(),
        promoType,
        promoImageUrl: promoImageUrl || null,
        promoStyle,
      });

      if (ok) {
        setSucces("Les réglages commerciaux ont été mis à jour et synchronisés sur le site !");
        setTimeout(() => setSucces(null), 4000);
      } else {
        setErreur("Une erreur est survenue lors de l'enregistrement dans Supabase.");
      }
    } catch {
      setErreur("Erreur réseau. Veuillez vérifier votre connexion.");
    } finally {
      setEnCours(false);
    }
  };

  const ecartNettoyage = Math.max(0, prixNettoye - prixVivant);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-24 transition-colors duration-300">
      <NavBar />

      <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
        <BanniereErreurReseau />

        {/* En-tête de la page */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3 text-slate-900 dark:text-white">
              <Settings className="w-8 h-8 text-[#00d2ff]" />
              Réglages
            </h1>
            {/* <p className="text-[var(--text-muted)] text-sm mt-1">
              Pilotez vos tarifs, le programme de formation et votre bannière promotionnelle Hero.
            </p> */}
          </div>
        </div>

        {/* Feedback messages */}
        {succes && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-sm font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            <span>{succes}</span>
          </div>
        )}

        {erreur && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-sm font-bold text-red-700 dark:text-red-300 flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{erreur}</span>
          </div>
        )}

        <form onSubmit={handleEnregistrer} className="space-y-8">
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-[#00d2ff]/10 text-[#28a9ed] dark:text-[#00d2ff] flex items-center justify-center border border-[#00d2ff]/20 shrink-0">
                <Fish className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Tarifs des Poissons
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ces prix sont affichés en direct sur le formulaire de commande client.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Poisson Vivant */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Silure Vivant
                  </label>
                  <span className="text-xs font-bold text-[#28a9ed] dark:text-[#00d2ff] bg-[#00d2ff]/10 px-2 py-0.5 rounded-full">
                    Frais du bac
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPrixVivant((p) => Math.max(500, p - 100))}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="relative flex-1">
                    <input
                      type="number"
                      step={50}
                      min={500}
                      required
                      value={prixVivant}
                      onChange={(e) => setPrixVivant(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xl font-black text-slate-900 dark:text-white text-center outline-none focus:border-[#00d2ff] shadow-sm"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setPrixVivant((p) => p + 100)}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-center font-bold text-slate-500">FCFA / Kilogramme</p>
              </div>

              {/* Poisson Nettoyé */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Silure Nettoyé
                  </label>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Prêt à cuire
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPrixNettoye((p) => Math.max(500, p - 100))}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="relative flex-1">
                    <input
                      type="number"
                      step={50}
                      min={500}
                      required
                      value={prixNettoye}
                      onChange={(e) => setPrixNettoye(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xl font-black text-slate-900 dark:text-white text-center outline-none focus:border-[#00d2ff] shadow-sm"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setPrixNettoye((p) => p + 100)}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-center font-bold text-slate-500">FCFA / Kilogramme</p>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl text-xs text-blue-800 dark:text-blue-300 font-medium">
              💡 <strong>Différentiel de nettoyage :</strong> +{ecartNettoyage.toLocaleString("fr-FR")} FCFA / kg par rapport au poisson vivant.
            </div>
          </div>

          {/* ========================================================== */}
          {/* BLOC 2 : FORMATIONS PISCICOLES                            */}
          {/* ========================================================== */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-[#28a9ed]/10 text-[#28a9ed] flex items-center justify-center border border-[#28a9ed]/20 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Formations & Accompagnement
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Personnalisez le tarif, la durée et le programme complet des modules de formation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Tarif de la Formation (FCFA)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={1000}
                    min={1000}
                    required
                    value={prixFormation}
                    onChange={(e) => setPrixFormation(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-[#00d2ff] shadow-sm"
                  />
                  <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
                    FCFA
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Durée de la formation</span>
                </label>
                <input
                  type="text"
                  required
                  value={dureeFormation}
                  onChange={(e) => setDureeFormation(e.target.value)}
                  placeholder="Ex: 5 Jours complets, 3 Jours intensifs..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#00d2ff] shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Description générale de l'offre
              </label>
              <textarea
                rows={2}
                required
                value={texteFormation}
                onChange={(e) => setTexteFormation(e.target.value)}
                placeholder="Explication synthétique du bénéfice de la formation..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-[#00d2ff] transition-all resize-none shadow-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
                <span>Programme détaillé des modules (1 module par ligne)</span>
              </label>
              <textarea
                rows={5}
                required
                value={programmeFormation}
                onChange={(e) => setProgrammeFormation(e.target.value)}
                placeholder="Module 1 : Dimensionnement des bacs&#10;Module 2 : Qualité de l'eau&#10;Module 3 : Alimentation et calcul des rations..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-[#00d2ff] transition-all resize-none shadow-sm"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                💡 Chaque ligne saisie apparaîtra automatiquement comme une étape avec coche verte dans la section "Au programme" de la vitrine.
              </p>
            </div>
          </div>

          {/* ========================================================== */}
          {/* BLOC 3 : BANNIÈRE PROMOTIONNELLE                          */}
          {/* ========================================================== */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Bannière Promotionnelle Hero
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Affiche Canva prioritaire ou template CSS au choix si aucune image n&apos;est fournie.
                  </p>
                </div>
              </div>

              {/* Interrupteur Toggle Switch */}
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
            </div>

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
                {/* Choix du Template CSS */}
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

                {/* Type d'événement / annonce */}
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
                {/* Titre court du badge */}
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

                {/* Texte explicatif de l'offre */}
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
          </div>

          {/* Bouton de sauvegarde fixe / ergonomique */}
          <div className="sticky bottom-4 z-20 flex justify-end">
            <Bouton
              type="submit"
              variante="primaire"
              chargement={enCours}
              className="py-3.5 px-8 rounded-2xl font-black text-sm flex items-center gap-2.5 shadow-xl shadow-[#00d2ff]/25 active:scale-95 cursor-pointer"
            >
              <Save className="w-5 h-5" />
              <span>Enregistrer les Réglages</span>
            </Bouton>
          </div>
        </form>
      </main>
    </div>
  );
}
