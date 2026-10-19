"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

interface TeleversementImageProps {
  valeur?: string | null;
  auChangement: (url: string | null) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const TeleversementImage: React.FC<TeleversementImageProps> = ({
  valeur,
  auChangement,
  label = "Affiche / Image Promotionnelle (Canva, Flyer, Photo)",
  description = "Format recommandé : Format horizontal 16:9 ou 2:1 (ex: 1200x600 px). Max 5 Mo.",
  disabled = false,
}) => {
  const { televerserMediaPromo } = useAppStore();
  const [televersementEnCours, setTeleversementEnCours] = useState<boolean>(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [estGlisseSurvole, setEstGlisseSurvole] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const traiterFichier = async (fichier: File) => {
    if (!fichier) return;

    // Vérification du type de fichier
    if (!fichier.type.startsWith("image/")) {
      setErreur("Format non supporté. Veuillez sélectionner une image (PNG, JPG, WEBP).");
      return;
    }

    // Limite de taille : 5 Mo
    if (fichier.size > 5 * 1024 * 1024) {
      setErreur("L'image dépasse la taille maximale autorisée de 5 Mo.");
      return;
    }

    setErreur(null);
    setTeleversementEnCours(true);

    try {
      const urlPublique = await televerserMediaPromo(fichier);
      if (urlPublique) {
        auChangement(urlPublique);
      } else {
        setErreur("Impossible de téléverser l'image sur Supabase Storage (ds-media).");
      }
    } catch {
      setErreur("Erreur lors de l'envoi de l'image. Vérifiez votre connexion.");
    } finally {
      setTeleversementEnCours(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const gererSelectionFichier = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichiers = e.target.files;
    if (fichiers && fichiers[0]) {
      traiterFichier(fichiers[0]);
    }
  };

  const gererGlisserDeposer = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setEstGlisseSurvole(false);
    if (disabled || televersementEnCours) return;

    const fichiers = e.dataTransfer.files;
    if (fichiers && fichiers[0]) {
      traiterFichier(fichiers[0]);
    }
  };

  const supprimerImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    auChangement(null);
    setErreur(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label}
          </label>
          {valeur && (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Image active (Priorité Hero)
            </span>
          )}
        </div>
      )}

      {erreur && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{erreur}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={gererSelectionFichier}
        className="hidden"
        disabled={disabled || televersementEnCours}
      />

      {valeur ? (
        /* Image déjà présente : affichage avec boutons d'action */
        <div className="relative group rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-sm transition-all">
          <div className="relative w-full h-48 sm:h-56 bg-slate-900/5 flex items-center justify-center overflow-hidden">
            <img
              src={valeur}
              alt="Aperçu bannière promotionnelle"
              className="w-full h-full object-cover sm:object-contain group-hover:scale-105 transition-transform duration-300"
            />

            {/* Voile sombre d'action au survol */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || televersementEnCours}
                className="px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-xs shadow-lg hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Remplacer
              </button>

              <button
                type="button"
                onClick={supprimerImage}
                disabled={disabled || televersementEnCours}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-xs shadow-lg hover:bg-red-700 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Supprimer
              </button>
            </div>
          </div>

          {/* Barre inférieure d'informations */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-xs">
              {valeur.split("/").pop()}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-xs font-bold text-[#00d2ff] hover:underline cursor-pointer"
              >
                Changer
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                type="button"
                onClick={supprimerImage}
                className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Zone de téléversement (Drop zone) */
        <div
          onClick={() => !televersementEnCours && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setEstGlisseSurvole(true);
          }}
          onDragLeave={() => setEstGlisseSurvole(false)}
          onDrop={gererGlisserDeposer}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
            estGlisseSurvole
              ? "border-[#00d2ff] bg-[#00d2ff]/5 scale-[0.99]"
              : "border-slate-300 dark:border-slate-700 hover:border-[#00d2ff] dark:hover:border-[#00d2ff] bg-slate-50 dark:bg-slate-950/60"
          } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        >
          {televersementEnCours ? (
            <div className="py-4 flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-[#00d2ff] animate-spin" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Téléversement vers Supabase Storage en cours...
              </p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#00d2ff]/10 text-[#00d2ff] flex items-center justify-center border border-[#00d2ff]/20">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Cliquez pour importer votre affiche ou glissez-déposez ici
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {description}
                </p>
              </div>
              <div className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#00d2ff]" />
                <span>Sélectionner un fichier</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
