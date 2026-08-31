export type Langue = 'fr' | 'en';
export type ModeTheme = 'sombre' | 'clair';

export type PreparationPoisson = 'vivant' | 'nettoye';
export type StatutCommande = 'en_attente' | 'en_livraison' | 'livree' | 'annulee';

export interface CommandePoisson {
  id: string;
  codeCommande: string;
  nomClient: string;
  telephone: string;
  preparation: PreparationPoisson;
  poidsKg: number;
  prixAuKg: number;
  prixTotal: number;
  ville: string;
  quartier: string;
  remarques?: string;
  statut: StatutCommande;
  creeLe: string;
}

export interface Bassin {
  id: string;
  nom: string;
  categorie: 'alevinage' | 'grossissement' | 'geniteurs';
  nombrePoissons: number;
  poidsMoyenKg: number;
  biomasseTotaleKg: number;
  dernierNourrissage?: string;
}

export interface OffreFormation {
  id: string;
  titre: string;
  prix: number;
  duree: string;
  description: string;
  pointsCles: string[];
}

export interface RecetteCuisine {
  id: string;
  titre: string;
  tempsPreparation: string;
  difficulte: string;
  ingredients: string[];
  instructions: string[];
}

export interface ReglagesEntreprise {
  id: string;
  nom: string;
  slogan: string;
  sloganEn: string;
  telephoneBrut: string;
  telephoneAffichage: string;
  nomUtilisateurTiktok: string;
  urlTiktok: string;
  prixVivant: number;
  prixNettoye: number;
  estEnDirect: boolean;
  titreDirect: string;
  texteBannierePromo: string;
  urlImagePromo?: string | null;
  urlPhotoProfil?: string | null;
  urlVideoHero?: string | null;
}