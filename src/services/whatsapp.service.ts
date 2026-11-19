import { PreparationPoisson, Langue } from "@/models";

export interface ParametresCommandeWhatsApp {
  telephoneBrut: string;
  codeCommande: string;
  nomClient: string;
  telephoneClient: string;
  preparation: PreparationPoisson;
  poidsKg: number;
  prixTotal: number;
  ville: string;
  quartier: string;
  remarques?: string;
  langueClient: Langue;
}

/**
 * Génère le lien WhatsApp avec message de commande pré-rempli.
 */
export function genererLienWhatsAppCommande(params: ParametresCommandeWhatsApp): string {
  const {
    telephoneBrut,
    codeCommande,
    nomClient,
    telephoneClient,
    preparation,
    poidsKg,
    prixTotal,
    ville,
    quartier,
    remarques,
    langueClient,
  } = params;

  const numeroNettoye = telephoneBrut.replace(/\D/g, "");
  const remarquesNettoyees = remarques?.trim();
  const libellePreparation =
    preparation === "vivant" ? "Poisson Vivant" : "Poisson Nettoyé & Éviscéré";
  const indicateurLangue = langueClient === "en" ? " (Client anglophone)" : "";

  const message =
    `Bonjour @DS ! \n\n` +
    `Nouvelle commande de silure frais [${codeCommande}]${indicateurLangue} :\n\n` +
    `• *Produit :* ${libellePreparation}\n` +
    `• *Quantité :* ${poidsKg} Kg\n` +
    `• *Montant estimé :* ${prixTotal.toLocaleString("fr-FR")} FCFA\n` +
    `• *Lieu de livraison :* ${ville} (${quartier})\n` +
    `• *Nom du client :* ${nomClient}\n` +
    `• *Contact :* ${telephoneClient}\n` +
    (remarquesNettoyees ? `• *Précisions :* ${remarquesNettoyees}\n` : "") +
    `Pouvez-vous me confirmer la disponibilité et le délai de livraison ?`;

  return `https://wa.me/${numeroNettoye}?text=${encodeURIComponent(message)}`;
}

/**
 * Génère le lien WhatsApp pour les inscriptions aux formations.
 */
export function genererLienWhatsAppFormation(params: {
  telephoneBrut: string;
  titreFormation: string;
  prix: number;
  langueClient: Langue;
}): string {
  const { telephoneBrut, titreFormation, prix, langueClient } = params;
  const numeroNettoye = telephoneBrut.replace(/\D/g, "");
  const indicateurLangue = langueClient === "en" ? " (Client anglophone 🇬🇧)" : "";

  const message =
    `Bonjour @DS ! \n\n` +
    `Je souhaite m'inscrire à la formation : *${titreFormation}* (${prix.toLocaleString("fr-FR")} FCFA)${indicateurLangue}.\n` +
    `Pourriez-vous me transmettre les dates de la prochaine session et les modalités pratiques d'inscription ?`;

  return `https://wa.me/${numeroNettoye}?text=${encodeURIComponent(message)}`;
}

/**
 * Génère un lien WhatsApp direct avec texte personnalisé.
 */
export function genererLienWhatsAppDirect(telephoneBrut: string, texte: string): string {
  const numeroNettoye = telephoneBrut.replace(/\D/g, "");
  return `https://wa.me/${numeroNettoye}?text=${encodeURIComponent(texte)}`;
}

