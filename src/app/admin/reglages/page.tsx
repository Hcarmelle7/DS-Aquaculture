"use client";

import React, { useEffect, useState } from "react";
import { Settings, Save } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { StylePromo, TypePromo } from "@/models";
import { Bouton } from "@/components/ui/Bouton";
import { AlerteFeedback } from "@/components/ui/AlerteFeedback";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { SectionTarifsPoissons } from "@/components/admin/reglages/SectionTarifsPoissons";
import { SectionFormationsAdmin } from "@/components/admin/reglages/SectionFormationsAdmin";
import { SectionBannierePromo } from "@/components/admin/reglages/SectionBannierePromo";

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
  const [promoType, setPromoType] = useState<TypePromo>(reglages.promoType || "prix");
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

  return (
    <AdminPageLayout
      titre="Réglages"
      Icone={Settings}
      maxWidthClass="max-w-5xl"
      titreClassName="text-slate-900 dark:text-white"
    >
      {succes && <AlerteFeedback type="succes" styleSurface="plein" message={succes} />}
      {erreur && <AlerteFeedback type="erreur" styleSurface="plein" message={erreur} />}

      <form onSubmit={handleEnregistrer} className="space-y-8">
        <SectionTarifsPoissons
          prixVivant={prixVivant}
          setPrixVivant={setPrixVivant}
          prixNettoye={prixNettoye}
          setPrixNettoye={setPrixNettoye}
        />

        <SectionFormationsAdmin
          prixFormation={prixFormation}
          setPrixFormation={setPrixFormation}
          dureeFormation={dureeFormation}
          setDureeFormation={setDureeFormation}
          texteFormation={texteFormation}
          setTexteFormation={setTexteFormation}
          programmeFormation={programmeFormation}
          setProgrammeFormation={setProgrammeFormation}
        />

        <SectionBannierePromo
          promoActive={promoActive}
          setPromoActive={setPromoActive}
          promoTitre={promoTitre}
          setPromoTitre={setPromoTitre}
          promoTexte={promoTexte}
          setPromoTexte={setPromoTexte}
          promoType={promoType}
          setPromoType={setPromoType}
          promoImageUrl={promoImageUrl}
          setPromoImageUrl={setPromoImageUrl}
          promoStyle={promoStyle}
          setPromoStyle={setPromoStyle}
        />

        <div className="sticky bottom-4 z-20 flex justify-end">
          <Bouton
            type="submit"
            variante="primaire"
            graisse="black"
            chargement={enCours}
            iconeGauche={<Save className="w-5 h-5" />}
            className="py-3.5 px-8 text-sm gap-2.5 shadow-xl shadow-[#00d2ff]/25 active:scale-95"
          >
            <span>Enregistrer les Réglages</span>
          </Bouton>
        </div>
      </form>
    </AdminPageLayout>
  );
}
