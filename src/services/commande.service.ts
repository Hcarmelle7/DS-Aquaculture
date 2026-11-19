import { REGLAGES_PAR_DEFAUT } from "@/data/contenu";
import { CommandePoisson, Langue, PreparationPoisson, ReglagesEntreprise } from "@/models";
import { genererLienWhatsAppCommande } from "@/services/whatsapp.service";
import { resoudrePoidsFinal } from "@/validators/commande.validator";

export function genererCodeCommande(): string {
  return `CMD-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function calculerPrixAuKg(
  preparation: PreparationPoisson,
  reglages: Pick<ReglagesEntreprise, "prixVivant" | "prixNettoye">
): number {
  return preparation === "vivant" ? reglages.prixVivant : reglages.prixNettoye;
}

export function calculerPrixTotalCommande(poidsKg: number, prixAuKg: number): number {
  return Math.round(poidsKg * prixAuKg);
}

export function calculerPortionsRecommandees(poidsKg: number): { min: number; max: number } {
  return {
    min: Math.max(1, Math.floor(poidsKg * 2)),
    max: Math.max(2, Math.ceil(poidsKg * 2.5)),
  };
}

export function calculerStatistiquesCommandes(commandes: CommandePoisson[]) {
  const livrees = commandes.filter((c) => c.statut === "livree");
  return {
    totalRevenus: livrees.reduce((acc, c) => acc + c.prixTotal, 0),
    totalKilos: livrees.reduce((acc, c) => acc + c.poidsKg, 0),
    commandesEnAttente: commandes.filter((c) => c.statut === "en_attente").length,
  };
}

export interface DonneesSoumissionCommande {
  nomClient: string;
  telephone: string;
  preparation: PreparationPoisson;
  poidsKg: number;
  prixAuKg: number;
  ville: string;
  quartier: string;
  remarques: string;
  telephoneEntreprise: string;
  langue: Langue;
}

/**
 * Orchestre la création d'une commande :
 * 1. Normalise le poids et calcule le total
 * 2. Enregistre dans Supabase via `enregistrerCommande`
 * 3. Génère systématiquement le lien WhatsApp (même si Supabase échoue) pour ne jamais perdre une vente
 */
export async function orchestrerSoumissionCommande(
  donnees: DonneesSoumissionCommande,
  enregistrerCommande: (
    commande: Omit<CommandePoisson, "id" | "creeLe" | "statut">
  ) => Promise<CommandePoisson | null>
): Promise<{ codeCommande: string; whatsappUrl: string; poidsFinal: number }> {
  const poidsFinal = resoudrePoidsFinal(donnees.poidsKg);
  const prixTotalFinal = calculerPrixTotalCommande(poidsFinal, donnees.prixAuKg);
  const codeCommandeGenere = genererCodeCommande();
  let codeCommandeEffectif = codeCommandeGenere;

  try {
    const nouvelleCommande = await enregistrerCommande({
      codeCommande: codeCommandeGenere,
      nomClient: donnees.nomClient,
      telephone: donnees.telephone,
      preparation: donnees.preparation,
      poidsKg: poidsFinal,
      prixAuKg: donnees.prixAuKg,
      prixTotal: prixTotalFinal,
      ville: donnees.ville,
      quartier: donnees.quartier,
      remarques: donnees.remarques,
    });

    if (nouvelleCommande?.codeCommande) {
      codeCommandeEffectif = nouvelleCommande.codeCommande;
    } else {
      console.warn(
        "Enregistrement Supabase indisponible, redirection WhatsApp de secours activée."
      );
    }
  } catch (err) {
    console.error(
      "Erreur lors de la commande, redirection WhatsApp de secours activée :",
      err
    );
  }

  const whatsappUrl = genererLienWhatsAppCommande({
    telephoneBrut: donnees.telephoneEntreprise || REGLAGES_PAR_DEFAUT.telephoneBrut,
    codeCommande: codeCommandeEffectif,
    nomClient: donnees.nomClient,
    telephoneClient: donnees.telephone,
    preparation: donnees.preparation,
    poidsKg: poidsFinal,
    prixTotal: prixTotalFinal,
    ville: donnees.ville,
    quartier: donnees.quartier,
    remarques: donnees.remarques,
    langueClient: donnees.langue,
  });

  return {
    codeCommande: codeCommandeEffectif,
    whatsappUrl,
    poidsFinal,
  };
}

