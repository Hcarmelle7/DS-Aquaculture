import { Langue } from "@/types";

export interface ResultatValidationTelephone {
  valide: boolean;
  erreur?: string;
}

/**
 * Longueurs nationales attendues (min, max) pour les principaux indicatifs Afrique
 * (Cameroun en priorité, puis pays voisins CEMAC / CEDEAO / Afrique).
 */
const REGLES_PAYS_AFRIQUE: Record<string, { min: number; max: number }> = {
  "237": { min: 9, max: 9 },   // Cameroun
  "241": { min: 7, max: 9 },   // Gabon
  "242": { min: 9, max: 9 },   // Congo-Brazzaville
  "243": { min: 9, max: 9 },   // RD Congo
  "240": { min: 9, max: 9 },   // Guinée Équatoriale
  "235": { min: 8, max: 8 },   // Tchad
  "236": { min: 8, max: 8 },   // Centrafrique
  "234": { min: 10, max: 11 }, // Nigeria
  "225": { min: 8, max: 10 },  // Côte d'Ivoire
  "221": { min: 9, max: 9 },   // Sénégal
  "229": { min: 8, max: 10 },  // Bénin
  "228": { min: 8, max: 8 },   // Togo
  "226": { min: 8, max: 8 },   // Burkina Faso
  "223": { min: 8, max: 8 },   // Mali
  "227": { min: 8, max: 8 },   // Niger
  "233": { min: 9, max: 9 },   // Ghana
  "212": { min: 9, max: 9 },   // Maroc
  "213": { min: 9, max: 9 },   // Algérie
  "216": { min: 8, max: 8 },   // Tunisie
};

const MESSAGES_ERREUR = {
  fr: {
    requis: "Veuillez saisir votre numéro de téléphone.",
    caracteresInvalides: "Numéro invalide : utilisez uniquement des chiffres (et éventuellement +).",
    camerounInvalide:
      "Numéro camerounais invalide : 9 chiffres requis (ex. 691 16 51 92 ou +237 691 16 51 92).",
    internationalInvalide:
      "Numéro international invalide : vérifiez l'indicatif pays et le nombre de chiffres (ex. +237..., +241...).",
    localInvalide:
      "Numéro invalide. Cameroun : 9 chiffres (ex. 691 16 51 92) ou format international avec indicatif (ex. +241...).",
  },
  en: {
    requis: "Please enter your phone number.",
    caracteresInvalides: "Invalid number: use digits only (and optional leading +).",
    camerounInvalide:
      "Invalid Cameroon number: 9 digits required (e.g. 691 16 51 92 or +237 691 16 51 92).",
    internationalInvalide:
      "Invalid international number: check the country code and digit count (e.g. +237..., +241...).",
    localInvalide:
      "Invalid number. Cameroon: 9 digits (e.g. 691 16 51 92) or international format with country code (e.g. +241...).",
  },
} as const;

function estSuiteRepetee(chiffres: string): boolean {
  return /^(\d)\1+$/.test(chiffres);
}

/**
 * Valide un numéro de téléphone (priorité Cameroun +237 / 9 chiffres,
 * avec prise en charge des formats internationaux Afrique & autres pays).
 */
export function validerTelephoneClient(
  valeur: string,
  langue: Langue = "fr"
): ResultatValidationTelephone {
  const msg = MESSAGES_ERREUR[langue];
  const brut = valeur.trim();

  if (!brut) {
    return { valide: false, erreur: msg.requis };
  }

  if (!/^\+?[\d\s().-]+$/.test(brut)) {
    return { valide: false, erreur: msg.caracteresInvalides };
  }

  const nettoye = brut.replace(/[\s().-]/g, "");
  const estInternational = nettoye.startsWith("+") || nettoye.startsWith("00");
  const chiffres = nettoye.startsWith("+")
    ? nettoye.slice(1)
    : nettoye.startsWith("00")
      ? nettoye.slice(2)
      : nettoye;

  // 1. Priorité Cameroun : +237 / 00237 / 237xxxxxxxxx
  if (
    (estInternational && chiffres.startsWith("237")) ||
    (!estInternational && chiffres.startsWith("237") && chiffres.length >= 11)
  ) {
    const localCm = chiffres.slice(3);
    if (!/^[26]\d{8}$/.test(localCm) || estSuiteRepetee(localCm)) {
      return { valide: false, erreur: msg.camerounInvalide };
    }
    return { valide: true };
  }

  // 2. Format international avec indicatif pays (+ ou 00)
  if (estInternational) {
    // Vérification fine pour les pays africains (indicatifs 3 chiffres connus)
    const indicatif3 = chiffres.slice(0, 3);
    const reglePays = REGLES_PAYS_AFRIQUE[indicatif3];
    if (reglePays) {
      const local = chiffres.slice(3);
      if (
        local.length < reglePays.min ||
        local.length > reglePays.max ||
        estSuiteRepetee(local)
      ) {
        return { valide: false, erreur: msg.internationalInvalide };
      }
      return { valide: true };
    }

    // Autres indicatifs africains (+2XX : 3 chiffres d'indicatif + 7 à 10 chiffres)
    if (chiffres.startsWith("2") && !chiffres.startsWith("20") && !chiffres.startsWith("27")) {
      const local = chiffres.slice(3);
      if (local.length < 7 || local.length > 10 || estSuiteRepetee(local)) {
        return { valide: false, erreur: msg.internationalInvalide };
      }
      return { valide: true };
    }

    // Format international E.164 général (ex. +27, +20, +33, +1...)
    if (
      !/^[1-9]\d{8,14}$/.test(chiffres) ||
      estSuiteRepetee(chiffres.slice(2))
    ) {
      return { valide: false, erreur: msg.internationalInvalide };
    }
    return { valide: true };
  }

  // 3. Format local sans indicatif : Cameroun par défaut (9 chiffres commençant par 6 ou 2)
  if (!/^[26]\d{8}$/.test(chiffres) || estSuiteRepetee(chiffres)) {
    return { valide: false, erreur: msg.localInvalide };
  }

  return { valide: true };
}

