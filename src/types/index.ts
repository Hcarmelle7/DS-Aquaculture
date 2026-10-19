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
  capaciteMaxPoissons?: number;
  statut?: 'actif' | 'maintenance' | 'inactif';
  creeLe?: string;

  // Tableau Blanc numérique (calculé à partir du lot actif)
  lotActif?: Lot;
  nombrePoissons?: number;
  poidsMoyenKg?: number;
  biomasseTotaleKg?: number;
  dernierNourrissage?: string;
}

export interface Lot {
  id: string;
  bassinId: string;
  dateArrivee: string;
  souche: string;
  quantiteInitiale: number;
  quantiteActuelle: number;
  poidsMoyenInitialG: number;
  statut: 'en_cours' | 'recolte';
  creeLe: string;
}

export interface ReleveQualiteEau {
  id: string;
  bassinId: string;
  dateReleve: string;
  temperatureC: number;
  ph: number;
  oxygeneMgl: number;
  remarques?: string;
  creeLe: string;
}

export interface ReleveNourrissage {
  id: string;
  lotId: string;
  dateNourrissage: string;
  typeAliment: string;
  quantiteKg: number;
  observations?: string;
  creeLe: string;
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

export type TypePromo = "prix" | "evenement" | "info";
export type StylePromo = "ruban_incline" | "badge_minimaliste" | "banniere_classique";

export interface ReglagesEntreprise {
  id: string;
  nom: string;
  logo: string;
  slogan: string;
  sloganEn: string;
  telephoneBrut: string;
  telephoneAffichage: string;
  nomUtilisateurTiktok: string;
  urlTiktok: string;
  prixVivant: number;
  prixNettoye: number;
  texteFormation: string;
  prixFormation: number;
  dureeFormation: string;
  programmeFormation: string;
  promoActive: boolean;
  promoTitre: string;
  promoTexte: string;
  promoType: TypePromo;
  promoImageUrl?: string | null;
  promoStyle: StylePromo;
  estEnDirect: boolean;
  titreDirect: string;
  texteBannierePromo: string;
  urlImagePromo?: string | null;
  urlPhotoProfil?: string | null;
  urlVideoHero?: string | null;
}

export interface TemoignageClient {
  id: string;
  nomAuteur: string;
  ville: string;
  note: number;
  commentaire: string;
  creeLe: string;
}

// ==========================================
// OPÉRATIONS DE CALIBRAGE & TRAÇABILITÉ (V2)
// ==========================================

export type TypeOperation = 'calibrage' | 'tri' | 'transfert' | 'mortalite' | 'recolte' | 'alevinage';

export interface OperationLog {
  id: string;
  bassinId: string;
  lotId?: string;
  typeOperation: TypeOperation;
  quantiteAvant: number;
  quantiteApres: number;
  quantiteDelta: number;
  poidsMoyenG?: number;
  destinationBassinId?: string;
  calibre?: string;
  operePar?: string;
  remarques?: string;
  creeLe: string;
}

export interface DonneesCalibrage {
  bassinId: string;
  lotId: string;
  typeOperation: TypeOperation;
  quantiteApres?: number;
  quantiteTransferee?: number;
  destinationBassinId?: string;
  nouveauPoidsMoyenG?: number;
  calibre?: string;
  operePar?: string;
  remarques?: string;
}