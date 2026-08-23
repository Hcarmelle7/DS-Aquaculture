"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { UploadCloud, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProprietesTeleversement {
  dossierCible?: string;
  urlImageActuelle?: string | null;
  auSucces: (urlPublique: string) => void;
  libelle?: string;
}

export const TeleversementImage: React.FC<ProprietesTeleversement> = ({
  dossierCible = "promotions",
  urlImageActuelle,
  auSucces,
  libelle = "Téléverser une image",
}) => {
  const [enCours, setEnCours] = useState(false);
  const [apercu, setApercu] = useState<string | null>(urlImageActuelle || null);
  const [erreur, setErreur] = useState<string | null>(null);

  const gererTeleversement = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichier = e.target.files?.[0];
    if (!fichier) return;

    // Vérification du type
    if (!fichier.type.startsWith("image/")) {
      setErreur("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).");
      return;
    }

    // Vérification de la taille (max 5 Mo)
    if (fichier.size > 5 * 1024 * 1024) {
      setErreur("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setEnCours(true);
    setErreur(null);

    try {
      const extension = fichier.name.split(".").pop();
      const nomFichierUnique = `${dossierCible}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;

      // Envoi direct vers le bucket public "ds-media"
      const { error: erreurUpload } = await supabase.storage
        .from("ds-media")
        .upload(nomFichierUnique, fichier, {
          cacheControl: "3600",
          upsert: true,
        });

      if (erreurUpload) throw erreurUpload;

      // Récupération de l'URL publique
      const { data } = supabase.storage.from("ds-media").getPublicUrl(nomFichierUnique);

      if (data?.publicUrl) {
        setApercu(data.publicUrl);
        auSucces(data.publicUrl);
      }
    } catch (err: any) {
      console.error("Erreur téléversement :", err);
      setErreur(err.message || "Échec de l'envoi de l'image.");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-semibold text-slate-300">{libelle}</span>

      <label
        className={cn(
          "flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
          "bg-slate-900/60 border-slate-700 hover:border-[#00d2ff]/60",
          enCours && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={gererTeleversement}
          disabled={enCours}
        />

        {apercu ? (
          <div className="flex items-center gap-3 w-full">
            <img
              src={apercu}
              alt="Aperçu téléversé"
              className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Image en ligne
              </p>
              <p className="text-[10px] text-slate-400 truncate">Cliquer pour remplacer</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-center">
            {enCours ? (
              <div className="w-6 h-6 border-2 border-[#00d2ff] border-t-transparent rounded-full animate-spin my-1" />
            ) : (
              <UploadCloud className="w-6 h-6 text-[#00d2ff]" />
            )}
            <p className="text-xs text-slate-300 font-medium">
              {enCours ? "Téléversement en cours..." : "Choisir une photo depuis le téléphone"}
            </p>
            <p className="text-[10px] text-slate-500">JPG, PNG ou WebP (max 5 Mo)</p>
          </div>
        )}
      </label>

      {erreur && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{erreur}</span>
        </p>
      )}
    </div>
  );
};