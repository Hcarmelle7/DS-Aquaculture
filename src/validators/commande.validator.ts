export const POIDS_MIN_COMMANDE_KG = 1;
export const POIDS_MAX_COMMANDE_KG = 9999;
export const POIDS_PAR_DEFAUT_KG = 3;
export const PAS_POIDS_KG = 0.5;

/**
 * Vérifie que la saisie en cours correspond à un nombre décimal positif (0 à 2 décimales, . ou ,).
 * Autorise la chaîne vide afin de ne pas bloquer l'effacement pendant la frappe.
 */
export function estSaisiePoidsValide(valeur: string): boolean {
  return /^\d*([.,]\d{0,2})?$/.test(valeur);
}

/**
 * Convertit la saisie texte en poids numérique sûr (jamais NaN).
 * Retourne 0 tant que la saisie est vide ou <= 0.
 */
export function normaliserPoidsSaisi(poidsSaisi: string): number {
  const valeurParsee = parseFloat(poidsSaisi.replace(",", "."));
  if (!Number.isFinite(valeurParsee) || valeurParsee <= 0) {
    return 0;
  }
  return Math.min(POIDS_MAX_COMMANDE_KG, +valeurParsee.toFixed(2));
}

/**
 * Garantit un poids strictement positif avant envoi ou au blur.
 */
export function resoudrePoidsFinal(poidsKg: number): number {
  return poidsKg > 0 ? poidsKg : POIDS_MIN_COMMANDE_KG;
}

export function decrementerPoids(poidsKg: number): number {
  return Math.max(
    POIDS_MIN_COMMANDE_KG,
    +((poidsKg || POIDS_MIN_COMMANDE_KG) - PAS_POIDS_KG).toFixed(2)
  );
}

export function incrementerPoids(poidsKg: number): number {
  return Math.min(
    POIDS_MAX_COMMANDE_KG,
    +((poidsKg || 0) + PAS_POIDS_KG).toFixed(2)
  );
}

