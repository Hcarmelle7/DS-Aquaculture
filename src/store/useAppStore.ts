import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Langue,
  ModeTheme,
  CommandePoisson,
  Bassin,
  ReglagesEntreprise,
  StatutCommande,
  Lot,
  ReleveQualiteEau,
  ReleveNourrissage,
  OperationLog,
  TypeOperation,
} from "@/models";
import { REGLAGES_PAR_DEFAUT } from "@/data/contenu";
import {
  connecterAvecMotDePasse,
  deconnecterSession,
  obtenirSessionActuelle,
} from "@/repositories/auth.repository";
import {
  recupererReglagesEntreprise,
  sauvegarderReglagesEntreprise,
  supprimerMediaPromoStorage,
  televerserMediaPromoStorage,
} from "@/repositories/reglages.repository";
import {
  creerCommande,
  listerCommandes,
  mettreAJourStatutCommandeDb,
  supprimerCommandeDb,
} from "@/repositories/commande.repository";
import {
  creerBassin,
  creerLot,
  listerBassinsBruts,
  listerLotsEnCours,
  listerOperationsLogDb,
  mettreAJourBassinDb,
  supprimerBassinDb,
} from "@/repositories/bassin.repository";
import {
  creerReleveNourrissage,
  creerReleveQualiteEau,
  listerRelevesNourrissage,
  listerRelevesQualiteEau,
} from "@/repositories/releves.repository";
import { genererCodeCommande } from "@/services/commande.service";
import {
  enrichirBassinsAvecLots,
  executerCalibrageBassin,
  executerMortaliteBassin,
  executerTransfertPoissons,
} from "@/services/bassin.service";

interface EtatApplication {
  langue: Langue;
  theme: ModeTheme;
  definirLangue: (langue: Langue) => void;
  definirTheme: (theme: ModeTheme) => void;
  basculerTheme: () => void;

  // Sécurité admin
  emailAdmin: string;
  estAdminAuthentifie: boolean;
  connecterAdmin: (email: string, motDePasse: string) => Promise<{ success: boolean; error?: string }>;
  deconnecterAdmin: () => Promise<void>;
  verifierSessionActuelle: () => Promise<void>;

  // Réglages entreprise
  reglages: ReglagesEntreprise;
  chargerReglages: () => Promise<void>;
  mettreAJourReglages: (donnees: Partial<ReglagesEntreprise>) => Promise<boolean>;
  televerserMediaPromo: (fichier: File) => Promise<string | null>;
  supprimerMediaPromo: (url: string) => Promise<boolean>;

  // Commandes
  commandes: CommandePoisson[];
  chargerCommandes: () => Promise<void>;
  ajouterCommande: (commande: Omit<CommandePoisson, "id" | "creeLe" | "statut">) => Promise<CommandePoisson | null>;
  mettreAJourStatutCommande: (id: string, statut: StatutCommande) => Promise<boolean>;
  supprimerCommande: (id: string) => Promise<boolean>;

  // Connectivité et erreurs réseau
  erreurChargement: string | null;
  effacerErreur: () => void;
  reessayerChargement: () => Promise<void>;

  // Bassins / Stocks
  bassins: Bassin[];
  chargerBassins: () => Promise<void>;
  ajouterBassin: (bassin: Omit<Bassin, "id" | "creeLe">) => Promise<Bassin | null>;
  mettreAJourBassin: (id: string, donnees: Partial<Bassin>) => Promise<boolean>;
  supprimerBassin: (id: string) => Promise<boolean>;

  // Lots & Relevés
  lots: Lot[];
  relevesQualiteEau: ReleveQualiteEau[];
  relevesNourrissage: ReleveNourrissage[];
  chargerRelevesNourrissage: () => Promise<void>;
  chargerRelevesQualiteEau: (bassinId?: string) => Promise<void>;
  ajouterLot: (lot: Omit<Lot, "id" | "creeLe" | "dateArrivee" | "statut" | "quantiteActuelle">) => Promise<Lot | null>;
  ajouterReleveQualiteEau: (releve: Omit<ReleveQualiteEau, "id" | "creeLe" | "dateReleve">) => Promise<ReleveQualiteEau | null>;
  ajouterReleveNourrissage: (releve: Omit<ReleveNourrissage, "id" | "creeLe" | "dateNourrissage">) => Promise<ReleveNourrissage | null>;

  // Calibrages, Tris & Traçabilité (V2)
  operationsLog: OperationLog[];
  chargerOperationsLog: (bassinId?: string) => Promise<void>;
  enregistrerCalibrage: (donnees: {
    bassinId: string;
    lotId: string;
    typeOperation?: TypeOperation;
    quantiteApres?: number;
    nouveauPoidsMoyenG?: number;
    calibre?: string;
    operePar?: string;
    remarques?: string;
  }) => Promise<boolean>;
  transfererPoissons: (donnees: {
    sourceBassinId: string;
    sourceLotId: string;
    destinationBassinId: string;
    quantite: number;
    poidsMoyenG?: number;
    calibre?: string;
    operePar?: string;
    remarques?: string;
  }) => Promise<boolean>;
  enregistrerMortalite: (donnees: {
    bassinId: string;
    lotId: string;
    quantiteMorts: number;
    operePar?: string;
    remarques?: string;
  }) => Promise<boolean>;
}

const appliquerThemeDOM = (theme: ModeTheme) => {
  if (typeof document !== "undefined") {
    if (theme === "sombre") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }
};

export const useAppStore = create<EtatApplication>()(
  persist(
    (set, get) => ({
      langue: "fr",
      theme: "sombre",

      definirLangue: (langue) => set({ langue }),
      definirTheme: (theme) => {
        appliquerThemeDOM(theme);
        set({ theme });
      },
      basculerTheme: () => {
        const prochainTheme = get().theme === "sombre" ? "clair" : "sombre";
        appliquerThemeDOM(prochainTheme);
        set({ theme: prochainTheme });
      },

      // Authentification Admin
      emailAdmin: "",
      estAdminAuthentifie: false,

      verifierSessionActuelle: async () => {
        try {
          const session = await obtenirSessionActuelle();
          set({
            estAdminAuthentifie: !!session,
            emailAdmin: session?.user?.email || "",
          });
        } catch (e) {
          console.error("Erreur session:", e);
        }
      },

      connecterAdmin: async (email, motDePasse) => {
        try {
          const data = await connecterAvecMotDePasse(email, motDePasse);
          set({ estAdminAuthentifie: true, emailAdmin: data.user.email || "" });
          return { success: true };
        } catch (e) {
          console.error("Erreur connexion admin :", e);
          return { success: false, error: "Identifiants incorrects." };
        }
      },

      deconnecterAdmin: async () => {
        await deconnecterSession();
        set({ estAdminAuthentifie: false, emailAdmin: "" });
      },

      // Réglages entreprise
      reglages: REGLAGES_PAR_DEFAUT,

      chargerReglages: async () => {
        try {
          const reglagesCharges = await recupererReglagesEntreprise(get().reglages);
          if (reglagesCharges) {
            set({ reglages: reglagesCharges });
          }
        } catch (e) {
          console.error("Erreur chargement réglages :", e);
        }
      },

      mettreAJourReglages: async (donnees) => {
        try {
          await sauvegarderReglagesEntreprise(donnees);
          set({ reglages: { ...get().reglages, ...donnees } });
          return true;
        } catch (e) {
          console.error("Erreur mise à jour réglages :", e);
          return false;
        }
      },

      televerserMediaPromo: async (fichier) => {
        try {
          return await televerserMediaPromoStorage(fichier);
        } catch (e) {
          console.error("Erreur téléversement média promo :", e);
          return null;
        }
      },

      supprimerMediaPromo: async (url) => {
        try {
          await supprimerMediaPromoStorage(url);
          return true;
        } catch (e) {
          console.warn("Erreur suppression média promo :", e);
          return false;
        }
      },

      // Connectivité et état d'erreur réseau
      erreurChargement: null,
      effacerErreur: () => set({ erreurChargement: null }),
      reessayerChargement: async () => {
        set({ erreurChargement: null });
        await Promise.all([
          get().chargerBassins(),
          get().chargerCommandes(),
          get().chargerOperationsLog(),
          get().chargerRelevesNourrissage(),
          get().chargerRelevesQualiteEau(),
        ]);
      },

      // Commandes
      commandes: [],

      chargerCommandes: async () => {
        try {
          const listeCommandes = await listerCommandes();
          set({ commandes: listeCommandes, erreurChargement: null });
        } catch (e) {
          console.error("Erreur chargement commandes :", e);
          set({
            erreurChargement: "Connexion instable : impossible d'actualiser les commandes.",
          });
        }
      },

      ajouterCommande: async (donneesCommande) => {
        try {
          const codeFinal = donneesCommande.codeCommande?.trim() || genererCodeCommande();
          const nouvelleCommande = await creerCommande(donneesCommande, codeFinal);
          set({ commandes: [nouvelleCommande, ...get().commandes] });
          return nouvelleCommande;
        } catch (e) {
          console.error("Erreur ajout commande :", e);
          return null;
        }
      },

      mettreAJourStatutCommande: async (id, statut) => {
        try {
          await mettreAJourStatutCommandeDb(id, statut);
          set({
            commandes: get().commandes.map((cmd) =>
              cmd.id === id ? { ...cmd, statut } : cmd
            ),
          });
          return true;
        } catch (e) {
          console.error("Erreur mise a jour statut commande :", e);
          return false;
        }
      },

      supprimerCommande: async (id) => {
        try {
          await supprimerCommandeDb(id);
          set({ commandes: get().commandes.filter((cmd) => cmd.id !== id) });
          return true;
        } catch (e) {
          console.error("Erreur suppression commande :", e);
          return false;
        }
      },

      // Bassins & Tableau Blanc
      bassins: [],

      chargerBassins: async () => {
        try {
          const [bassinsBruts, listeLots] = await Promise.all([
            listerBassinsBruts(),
            listerLotsEnCours(),
          ]);
          const listeBassins = enrichirBassinsAvecLots(bassinsBruts, listeLots);
          set({ bassins: listeBassins, lots: listeLots, erreurChargement: null });
        } catch (e) {
          console.error("Erreur chargement bassins :", e);
          set({
            erreurChargement: "Connexion instable : impossible d'actualiser les bassins.",
          });
        }
      },

      ajouterBassin: async (donnees) => {
        try {
          const nouveauBassin = await creerBassin(donnees);
          set({ bassins: [...get().bassins, nouveauBassin] });
          return nouveauBassin;
        } catch (e) {
          console.error("Erreur ajout bassin :", e);
          return null;
        }
      },

      mettreAJourBassin: async (id, donnees) => {
        try {
          await mettreAJourBassinDb(id, donnees);
          set({
            bassins: get().bassins.map((b) =>
              b.id === id ? { ...b, ...donnees } : b
            ),
          });
          return true;
        } catch (e) {
          console.error("Erreur mise a jour bassin :", e);
          return false;
        }
      },

      supprimerBassin: async (id) => {
        try {
          await supprimerBassinDb(id);
          set({ bassins: get().bassins.filter((b) => b.id !== id) });
          return true;
        } catch (e) {
          console.error("Erreur suppression bassin :", e);
          return false;
        }
      },

      // Lots & Relevés
      lots: [],
      relevesQualiteEau: [],
      relevesNourrissage: [],

      chargerRelevesNourrissage: async () => {
        try {
          const listeReleves = await listerRelevesNourrissage();
          set({ relevesNourrissage: listeReleves });
        } catch (e) {
          console.error("Erreur chargement relevés nourrissage :", e);
        }
      },

      chargerRelevesQualiteEau: async (bassinId) => {
        try {
          const listeReleves = await listerRelevesQualiteEau(bassinId);
          set({ relevesQualiteEau: listeReleves });
        } catch (e) {
          console.error("Erreur chargement relevés qualité eau :", e);
          set({
            erreurChargement: "Impossible d'actualiser les relevés de qualité d'eau.",
          });
        }
      },

      ajouterLot: async (donneesLot) => {
        try {
          const nouveauLot = await creerLot(donneesLot);
          set({ lots: [nouveauLot, ...get().lots] });
          return nouveauLot;
        } catch (e) {
          console.error("Erreur ajout lot :", e);
          return null;
        }
      },

      ajouterReleveQualiteEau: async (donneesReleve) => {
        try {
          const nouveauReleve = await creerReleveQualiteEau(donneesReleve);
          set({ relevesQualiteEau: [nouveauReleve, ...get().relevesQualiteEau] });
          return nouveauReleve;
        } catch (e) {
          console.error("Erreur ajout releve qualite eau :", e);
          return null;
        }
      },

      ajouterReleveNourrissage: async (donneesReleve) => {
        try {
          const nouveauReleve = await creerReleveNourrissage(donneesReleve);
          set({ relevesNourrissage: [nouveauReleve, ...get().relevesNourrissage] });
          return nouveauReleve;
        } catch (e) {
          console.error("Erreur ajout releve nourrissage :", e);
          return null;
        }
      },

      // Opérations de Calibrage & Traçabilité (V2)
      operationsLog: [],

      chargerOperationsLog: async (bassinId) => {
        try {
          const logs = await listerOperationsLogDb(bassinId);
          set({ operationsLog: logs });
        } catch (e) {
          console.error("Erreur chargement logs opérations :", e);
        }
      },

      enregistrerCalibrage: async (donnees) => {
        try {
          const { lotsMaj, bassinsMaj, nouveauLog } = await executerCalibrageBassin(
            donnees,
            get().lots,
            get().bassins
          );
          set({
            lots: lotsMaj,
            bassins: bassinsMaj,
            operationsLog: [nouveauLog, ...get().operationsLog],
          });
          return true;
        } catch (e) {
          console.error("Erreur enregistrerCalibrage :", e);
          return false;
        }
      },

      transfererPoissons: async (donnees) => {
        try {
          const { lotsMaj, bassinsMaj, nouveauLog } = await executerTransfertPoissons(
            donnees,
            get().lots,
            get().bassins
          );
          set({
            lots: lotsMaj,
            bassins: bassinsMaj,
            operationsLog: [nouveauLog, ...get().operationsLog],
          });
          return true;
        } catch (e) {
          console.error("Erreur transfererPoissons :", e);
          return false;
        }
      },

      enregistrerMortalite: async (donnees) => {
        try {
          const { lotsMaj, bassinsMaj, nouveauLog } = await executerMortaliteBassin(
            donnees,
            get().lots,
            get().bassins
          );
          set({
            lots: lotsMaj,
            bassins: bassinsMaj,
            operationsLog: [nouveauLog, ...get().operationsLog],
          });
          return true;
        } catch (e) {
          console.error("Erreur enregistrerMortalite :", e);
          return false;
        }
      },
    }),
    {
      name: "ds-aquaculture-session",
      partialize: (state) => ({
        langue: state.langue,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          appliquerThemeDOM(state.theme);
        }
      },
    }
  )
);
