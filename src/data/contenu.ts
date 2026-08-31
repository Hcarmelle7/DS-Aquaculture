import { ReglagesEntreprise, OffreFormation, RecetteCuisine, Langue } from "@/types";

/**
 * Reglages initiaux de l'entreprise @DS
 */
export const REGLAGES_PAR_DEFAUT: ReglagesEntreprise = {
  id: "ds_principal",
  nom: "@DS",
  slogan: "ÉLEVER AVEC SOIN, DISTRIBUER AVEC PASSION",
  sloganEn: "RAISED WITH CARE, DISTRIBUTED WITH PASSION",
  telephoneBrut: "237691165192",
  telephoneAffichage: "+237 691 16 51 92",
  nomUtilisateurTiktok: "@dsste2",
  urlTiktok: "https://www.tiktok.com/@dsste2",
  prixVivant: 2200,
  prixNettoye: 2500,
  estEnDirect: true,
  titreDirect: "Pêche en direct & calibrage de silures",
  texteBannierePromo: "Arrivage de silures frais gros calibres ce week-end !",
  urlImagePromo: null,
  urlPhotoProfil: null,
  urlVideoHero: "https://assets.mixkit.co/videos/preview/mixkit-clear-water-in-a-lake-1199-large.mp4",
};

/**
 * Dictionnaire de traduction Francais / Anglais
 */
export const TRADUCTIONS = {
  fr: {
    banniereDirect: "En direct sur TikTok",
    titrePrincipal: "Silures Frais du Terroir & Formations Piscicoles",
    sousTitrePrincipal: "Élevage local de haute qualité et accompagnement pratique pour réussir vos projets aquacoles.",
    badgeLivraison: "Livraison rapide : Douala & Yaoundé",
    titreCommande: "Commander du Silure Frais",
    poissonVivant: "Poisson Vivant",
    poissonNettoye: "Poisson Nettoyé",
    etiquetteVivant: "Frais du bac",
    etiquetteNettoye: "Prêt à cuisiner",
    libelleQuantite: "Quantité souhaitée (Kg)",
    totalEstime: "Total estimé",
    cadeauBonus: "Bonus inclus : Livret numérique de 5 recettes au silure offert avec votre commande !",
    libelleVille: "Ville de livraison",
    libelleQuartier: "Quartier",
    espaceReserveQuartier: "Ex: Akwa, Bonamoussadi, Bastos...",
    libelleNomClient: "Votre nom complet",
    libelleTelephoneClient: "Numéro WhatsApp / Téléphone",
    boutonCommander: "Commander sur WhatsApp",
    titreFormations: "Formations en Pisciculture",
    sousTitreFormations: "Maîtrisez l'élevage hors-sol et la reproduction avec nos experts.",
    boutonReserverFormation: "Réserver la Formation",
    titreRecettes: "Recettes Traditionnelles & Idées Cuisson",
    sousTitreRecettes: "Des préparations faciles pour sublimer votre poisson silure.",
    navigationBoutique: "Commander",
    navigationFormations: "Formations",
    navigationRecettes: "Recettes",
    navigationAdmin: "Espace Gestionnaire",
  },
  en: {
    banniereDirect: "Live on TikTok",
    titrePrincipal: "Fresh Local Catfish & Fish Farming Training",
    sousTitrePrincipal: "High-quality local breeding and practical guidance to succeed in aquaculture.",
    badgeLivraison: "Fast Delivery: Douala & Yaounde",
    titreCommande: "Order Fresh Catfish",
    poissonVivant: "Live Fish",
    poissonNettoye: "Cleaned Fish",
    etiquetteVivant: "Fresh from tank",
    etiquetteNettoye: "Ready to cook",
    libelleQuantite: "Quantity (Kg)",
    totalEstime: "Estimated total",
    cadeauBonus: "Bonus included: Free 5-recipe digital booklet with your order!",
    libelleVille: "Delivery city",
    libelleQuartier: "Neighborhood",
    espaceReserveQuartier: "e.g. Akwa, Bonamoussadi, Bastos...",
    libelleNomClient: "Your full name",
    libelleTelephoneClient: "WhatsApp / Phone number",
    boutonCommander: "Order via WhatsApp",
    titreFormations: "Aquaculture Training",
    sousTitreFormations: "Master above-ground tanks and breeding with our experts.",
    boutonReserverFormation: "Book Training",
    titreRecettes: "Traditional Recipes & Cooking Ideas",
    sousTitreRecettes: "Easy and tasty recipes to cook your catfish to perfection.",
    navigationBoutique: "Order",
    navigationFormations: "Training",
    navigationRecettes: "Recipes",
    navigationAdmin: "Manager Portal",
  },
};

/**
 * Offres de formations piscicoles
 */
export const OFFRES_FORMATIONS: Record<Langue, OffreFormation[]> = {
  fr: [
    {
      id: "pack-initiation",
      titre: "Pack Initiation : Bacs Hors-Sol",
      prix: 25000,
      duree: "2 Jours intensifs",
      description: "Les bases fondamentales pour démarrer votre premier bac hors-sol sans risque de mortalité.",
      pointsCles: [
        "Dimensionnement et installation du bac hors-sol",
        "Paramètres essentiels de l'eau (pH, Oxygène, Température)",
        "Techniques de nourrissage et calcul des rations",
        "Suivi et support WhatsApp pendant 30 jours",
      ],
    },
    {
      id: "pack-master-pro",
      titre: "Pack Master Pro & Rentabilité",
      prix: 50000,
      duree: "5 Jours complets",
      description: "Formation complète : reproduction artificielle, grossissement rapide et rentabilité commerciale.",
      pointsCles: [
        "Reproduction artificielle (sélection des géniteurs et incubation)",
        "Formulation d'aliments locaux à faible coût",
        "Prévention sanitaire et gestion des maladies",
        "Immersion pratique sur notre ferme @DS",
      ],
    },
  ],
  en: [
    {
      id: "pack-initiation",
      titre: "Starter Pack: Above-Ground Tanks",
      prix: 25000,
      duree: "2 Intensive days",
      description: "Essential basics to launch your first fish tank setup safely.",
      pointsCles: [
        "Tank sizing and setup guide",
        "Water quality parameters (pH, Oxygen, Temperature)",
        "Feeding techniques and daily rations",
        "30-day dedicated WhatsApp mentorship",
      ],
    },
    {
      id: "pack-master-pro",
      titre: "Master Pro & Farm Profitability",
      prix: 50000,
      duree: "5 Full days",
      description: "Full mastery: artificial breeding, rapid growth, and business economics.",
      pointsCles: [
        "Artificial hormone breeding and hatchery care",
        "Low-cost local feed formulation",
        "Health management and disease prevention",
        "Hands-on practice at @DS operational farm",
      ],
    },
  ],
};

/**
 * Fiches recettes de cuisine
 */
export const RECETTES_CUISINE: Record<Langue, RecetteCuisine[]> = {
  fr: [
    {
      id: "bouillon-piquant",
      titre: "Bouillon Piquant de Silure Frais (Pepper Soup)",
      tempsPreparation: "25 min",
      difficulte: "Facile",
      ingredients: [
        "Silure frais @DS découpé en darnes",
        "Épices à bouillon (Esese, Pébè, Rondelles)",
        "Poivre blanc de Penja, ail et gingembre",
        "Piment frais et basilic sauvage",
      ],
      instructions: [
        "Nettoyer les morceaux de silure au sel et au jus de citron.",
        "Faire bouillir l'eau avec le mélange d'épices écrasées.",
        "Plonger délicatement les tranches de poisson dans le bouillon.",
        "Laisser frémir à feu doux pendant 15 minutes sans remuer avec une cuillère.",
        "Servir bien chaud avec des plantains ou du manioc.",
      ],
    },
    {
      id: "silure-braise",
      titre: "Silure Braisé aux Épices Locales & Njangsa",
      tempsPreparation: "40 min",
      difficulte: "Moyen",
      ingredients: [
        "1 gros silure @DS nettoyé et incisé",
        "Njangsa torréfié, Pébè, poivre de Penja",
        "Ail, oignon, poireau, huile végétale",
        "Bâtons de manioc (Miondo / Bobolo)",
      ],
      instructions: [
        "Mixer les aromates avec le Njangsa et l'huile pour former la marinade.",
        "Badigeonner généreusement le silure à l'intérieur et dans les incisions.",
        "Braiser à braise douce en arrosant d'huile parfumée.",
        "Servir croustillant avec la sauce pimentée et les bâtons de manioc.",
      ],
    },
  ],
  en: [
    {
      id: "bouillon-piquant",
      titre: "Spicy Fresh Catfish Pepper Soup",
      tempsPreparation: "25 min",
      difficulte: "Easy",
      ingredients: [
        "Fresh @DS catfish sliced into steaks",
        "Pepper soup spices (Esese, Pebe, Rondelles)",
        "Penja white pepper, garlic, ginger",
        "Fresh chili and local basil leaves",
      ],
      instructions: [
        "Clean fish pieces with salt and lemon juice.",
        "Bring seasoned water and crushed spices to a boil.",
        "Gently slide fresh catfish steaks into the broth.",
        "Simmer over low heat for 15 minutes without heavy stirring.",
        "Serve hot with plantains or steamed cassava.",
      ],
    },
    {
      id: "silure-braise",
      titre: "Charcoal Grilled Catfish with Njangsa",
      tempsPreparation: "40 min",
      difficulte: "Medium",
      ingredients: [
        "1 large cleaned and scored @DS catfish",
        "Roasted Njangsa, Pebe, Penja pepper",
        "Garlic, onions, herbs, vegetable oil",
        "Cassava sticks (Miondo / Bobolo)",
      ],
      instructions: [
        "Blend herbs and spices with oil to create a rich marinade.",
        "Coat the fish thoroughly on both sides and inside cuts.",
        "Grill slowly over coals while basting with spice-infused oil.",
        "Serve golden and crispy with spicy sauce and cassava sticks.",
      ],
    },
  ],
};