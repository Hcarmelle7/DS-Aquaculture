"use client";

import React from "react";
import { Fish } from "lucide-react";
import { SectionCarteAdmin } from "@/components/admin/SectionCarteAdmin";
import { CarteTarifStepper } from "@/components/admin/reglages/CarteTarifStepper";

interface SectionTarifsPoissonsProps {
  prixVivant: number;
  setPrixVivant: (val: number) => void;
  prixNettoye: number;
  setPrixNettoye: (val: number) => void;
}

export const SectionTarifsPoissons: React.FC<SectionTarifsPoissonsProps> = ({
  prixVivant,
  setPrixVivant,
  prixNettoye,
  setPrixNettoye,
}) => {
  const ecartNettoyage = Math.max(0, prixNettoye - prixVivant);

  return (
    <SectionCarteAdmin
      titre="Tarifs des Poissons"
      sousTitre="Ces prix sont affichés en direct sur le formulaire de commande client."
      Icone={Fish}
      iconeContainerClassName="bg-[#00d2ff]/10 text-[#28a9ed] dark:text-[#00d2ff] border-[#00d2ff]/20"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CarteTarifStepper
          libelle="Silure Vivant"
          badgeTexte="Frais du bac"
          badgeClassName="text-[#28a9ed] dark:text-[#00d2ff] bg-[#00d2ff]/10"
          valeur={prixVivant}
          auChangement={setPrixVivant}
        />

        <CarteTarifStepper
          libelle="Silure Nettoyé"
          badgeTexte="Prêt à cuire"
          badgeClassName="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
          valeur={prixNettoye}
          auChangement={setPrixNettoye}
        />
      </div>

      <div className="p-3 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl text-xs text-blue-800 dark:text-blue-300 font-medium">
        💡 <strong>Différentiel de nettoyage :</strong> +
        {ecartNettoyage.toLocaleString("fr-FR")} FCFA / kg par rapport au poisson vivant.
      </div>
    </SectionCarteAdmin>
  );
};
