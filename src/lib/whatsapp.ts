import { PreparationPoisson, Langue } from "@/types";

interface ParametresCommandeWhatsApp {
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
 * message pre-rempli 
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

  const libellePreparation = preparation === "vivant" ? "Poisson Vivant" : "Poisson Nettoyé & Éviscéré";
  const indicateurLangue = langueClient === "en" ? " (Client anglophone)" : "";

  // Message toujours en francais
  const message =
    `Bonjour @DS ! \n\n` +
    `Nouvelle commande de silure frais [${codeCommande}]${indicateurLangue} :\n\n` +
    `• *Produit :* ${libellePreparation}\n` +
    `• *Quantité :* ${poidsKg} Kg\n` +
    `• *Montant estimé :* ${prixTotal.toLocaleString("fr-FR")} FCFA\n` +
    `• *Lieu de livraison :* ${ville} (${quartier})\n` +
    `• *Nom du client :* ${nomClient}\n` +
    `• *Contact :* ${telephoneClient}\n` +
    (remarques ? `• *Précisions :* ${remarques}\n` : "") +
    `Pouvez-vous me confirmer la disponibilité et le délai de livraison ?`;

  return `https://wa.me/${telephoneBrut}?text=${encodeURIComponent(message)}`;
}

/**
 * URL WhatsApp pour les inscriptions aux formations
 */
export function genererLienWhatsAppFormation(params: {
  telephoneBrut: string;
  titreFormation: string;
  prix: number;
  langueClient: Langue;
}): string {
  const { telephoneBrut, titreFormation, prix, langueClient } = params;
  const indicateurLangue = langueClient === "en" ? " (Client anglophone 🇬🇧)" : "";

  const message =
    `Bonjour @DS ! \n\n` +
    `Je souhaite m'inscrire à la formation : *${titreFormation}* (${prix.toLocaleString("fr-FR")} FCFA)${indicateurLangue}.\n` +
    `Pourriez-vous me transmettre les dates de la prochaine session et les modalités pratiques d'inscription ?`;

  return `https://wa.me/${telephoneBrut}?text=${encodeURIComponent(message)}`;
}

/**
 * lien WhatsApp general
 */
export function genererLienWhatsAppDirect(telephoneBrut: string, texte: string): string {
  return `https://wa.me/${telephoneBrut}?text=${encodeURIComponent(texte)}`;
}