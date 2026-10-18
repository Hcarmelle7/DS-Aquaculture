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
} from "@/types";
import { REGLAGES_PAR_DEFAUT } from "@/data/contenu";
import { supabase } from "@/lib/supabase";

interface EtatApplication {
  langue: Langue;
  theme: ModeTheme;
  definirLangue: (langue: Langue) => void;
  definirTheme: (theme: ModeTheme) => void;
  basculerTheme: () => void;

  // Securite admin
  emailAdmin: string;
  estAdminAuthentifie: boolean;
  connecterAdmin: (email: string, motDePasse: string) => Promise<{ success: boolean; error?: string }>;
  deconnecterAdmin: () => Promise<void>;
  verifierSessionActuelle: () => Promise<void>;

  // Reglages entreprise 
  reglages: ReglagesEntreprise;
  chargerReglages: () => Promise<void>;
  mettreAJourReglages: (donnees: Partial<ReglagesEntreprise>) => Promise<boolean>;

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

      emailAdmin: "",
      estAdminAuthentifie: false,
      
      verifierSessionActuelle: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          set({ 
            estAdminAuthentifie: !!session,
            emailAdmin: session?.user?.email || ""
          });
        } catch (e) {
          console.error("Erreur session:", e);
        }
      },

      connecterAdmin: async (email, motDePasse) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: motDePasse,
          });

          if (error) throw error;
          
          set({ estAdminAuthentifie: true, emailAdmin: data.user.email });
          return { success: true };
        } catch (e: any) {
          console.error("Erreur connexion admin :", e);
          return { success: false, error: "Identifiants incorrects." };
        }
      },

      deconnecterAdmin: async () => {
        await supabase.auth.signOut();
        set({ estAdminAuthentifie: false, emailAdmin: "" });
      },

      // Réglages
      reglages: REGLAGES_PAR_DEFAUT,

      chargerReglages: async () => {
        try {
          const { data, error } = await supabase
            .from("business_settings")
            .select("*")
            .eq("id", "ds_main")
            .single();

          if (error) {
            console.warn("Utilisation des réglages locaux :", error.message);
            return;
          }

          if (data) {
            set({
              reglages: {
                id: data.id,
                nom: data.name,
                logo: data.logo_url || REGLAGES_PAR_DEFAUT.logo,
                slogan: data.slogan,
                sloganEn: data.slogan_en,
                telephoneBrut: data.phone_raw,
                telephoneAffichage: data.phone_display,
                nomUtilisateurTiktok: data.tiktok_username,
                urlTiktok: data.tiktok_url,
                prixVivant: data.price_vivant,
                prixNettoye: data.price_nettoye,
                estEnDirect: data.is_live_active,
                titreDirect: data.live_title,
                texteBannierePromo: data.promo_banner_text,
                urlImagePromo: data.promo_image_url,
                urlPhotoProfil: data.avatar_url,
                urlVideoHero: data.video_hero_url || REGLAGES_PAR_DEFAUT.urlVideoHero,
              },
            });
          }
        } catch (e) {
          console.error("Erreur chargement réglages :", e);
        }
      },

      mettreAJourReglages: async (donnees) => {
        try {
          const { error } = await supabase
            .from("business_settings")
            .update({
              name: donnees.nom,
              slogan: donnees.slogan,
              slogan_en: donnees.sloganEn,
              phone_raw: donnees.telephoneBrut,
              phone_display: donnees.telephoneAffichage,
              tiktok_username: donnees.nomUtilisateurTiktok,
              tiktok_url: donnees.urlTiktok,
              price_vivant: donnees.prixVivant,
              price_nettoye: donnees.prixNettoye,
              is_live_active: donnees.estEnDirect,
              live_title: donnees.titreDirect,
              promo_banner_text: donnees.texteBannierePromo,
              promo_image_url: donnees.urlImagePromo,
              avatar_url: donnees.urlPhotoProfil,
              updated_at: new Date().toISOString(),
            })
            .eq("id", "ds_main");

          if (error) throw error;

          set({ reglages: { ...get().reglages, ...donnees } });
          return true;
        } catch (e) {
          console.error("Erreur mise à jour réglages :", e);
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
        ]);
      },

      // Commandes
      commandes: [],

      chargerCommandes: async () => {
        try {
          const { data, error } = await supabase
            .from("fish_orders")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) throw error;

          if (data) {
            // Passerelle automatique de statut Supabase (anglais/SQL) vers l'application (francais)
            const mapperStatut = (status?: string | null): StatutCommande => {
              switch (status?.toLowerCase()) {
                case "pending":
                case "en_attente":
                  return "en_attente";
                case "in_delivery":
                case "en_livraison":
                  return "en_livraison";
                case "delivered":
                case "livree":
                  return "livree";
                case "cancelled":
                case "annulee":
                  return "annulee";
                default:
                  return "en_attente";
              }
            };

            const listeCommandes: CommandePoisson[] = data.map((cmd) => ({
              id: cmd.id,
              codeCommande: cmd.order_code,
              nomClient: cmd.customer_name,
              telephone: cmd.phone,
              preparation: cmd.preparation,
              poidsKg: Number(cmd.weight_kg),
              prixAuKg: cmd.price_per_kg,
              prixTotal: cmd.total_price,
              ville: cmd.location_city,
              quartier: cmd.neighborhood,
              remarques: cmd.notes,
              statut: mapperStatut(cmd.status),
              creeLe: cmd.created_at,
            }));

            set({ commandes: listeCommandes, erreurChargement: null });
          }
        } catch (e) {
          console.error("Erreur chargement commandes :", e);
          // Conservation des données en cache sans vider l'écran, avec alerte explicite
          set({
            erreurChargement: "Connexion instable : impossible d'actualiser les commandes.",
          });
        }
      },

      ajouterCommande: async (donneesCommande) => {
        try {
          const codeAleatoire = `CMD-${Math.floor(1000 + Math.random() * 9000)}`;

          const { data, error } = await supabase
            .from("fish_orders")
            .insert({
              order_code: codeAleatoire,
              customer_name: donneesCommande.nomClient,
              phone: donneesCommande.telephone,
              preparation: donneesCommande.preparation,
              weight_kg: donneesCommande.poidsKg,
              price_per_kg: donneesCommande.prixAuKg,
              total_price: donneesCommande.prixTotal,
              location_city: donneesCommande.ville,
              neighborhood: donneesCommande.quartier,
              notes: donneesCommande.remarques,
              status: "pending",
            })
            .select()
            .single();

          if (error) throw error;

          const nouvelleCommande: CommandePoisson = {
            id: data.id,
            codeCommande: data.order_code,
            nomClient: data.customer_name,
            telephone: data.phone,
            preparation: data.preparation,
            poidsKg: Number(data.weight_kg),
            prixAuKg: data.price_per_kg,
            prixTotal: data.total_price,
            ville: data.location_city,
            quartier: data.neighborhood,
            remarques: data.notes,
            statut: "en_attente",
            creeLe: data.created_at,
          };

          set({ commandes: [nouvelleCommande, ...get().commandes] });
          return nouvelleCommande;
        } catch (e) {
          console.error("Erreur ajout commande :", e);
          return null;
        }
      },

      mettreAJourStatutCommande: async (id, statut) => {
        try {
          // Conversion du statut vers la valeur SQL
          const statutSql =
            statut === "en_attente" ? "pending" :
            statut === "en_livraison" ? "in_delivery" :
            statut === "livree" ? "delivered" : "cancelled";

          const { error } = await supabase
            .from("fish_orders")
            .update({ status: statutSql })
            .eq("id", id);

          if (error) throw error;

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
          const { error } = await supabase
            .from("fish_orders")
            .delete()
            .eq("id", id);

          if (error) throw error;

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
          const { data: bassinsData, error: errBassins } = await supabase
            .from("bassins")
            .select("*")
            .order("cree_le", { ascending: true });
          
          if (errBassins) throw errBassins;

          const { data: lotsData, error: errLots } = await supabase
            .from("lots")
            .select("*")
            .eq("statut", "en_cours");
          
          if (errLots) throw errLots;

          const listeLots: Lot[] = (lotsData || []).map((l) => ({
            id: l.id,
            bassinId: l.bassin_id,
            souche: l.souche,
            dateArrivee: l.date_arrivee,
            quantiteInitiale: l.quantite_initiale,
            quantiteActuelle: l.quantite_actuelle,
            poidsMoyenInitialG: l.poids_moyen_initial_g,
            statut: l.statut,
            creeLe: l.cree_le,
          }));

          const listeBassins: Bassin[] = (bassinsData || []).map((b) => {
            const lotActif = listeLots.find((l) => l.bassinId === b.id && l.statut === "en_cours");
            const nombrePoissons = lotActif ? lotActif.quantiteActuelle : 0;
            const poidsMoyenG = lotActif ? Number(lotActif.poidsMoyenInitialG || 0) : 0;
            const biomasseTotaleKg = Number(((nombrePoissons * poidsMoyenG) / 1000).toFixed(2));

            return {
              id: b.id,
              nom: b.nom,
              categorie: b.categorie,
              capaciteMaxPoissons: b.capacite_max_poissons,
              statut: b.statut || "actif",
              creeLe: b.cree_le,
              lotActif,
              nombrePoissons,
              poidsMoyenKg: Number((poidsMoyenG / 1000).toFixed(3)),
              biomasseTotaleKg,
            };
          });

          set({ bassins: listeBassins, lots: listeLots, erreurChargement: null });
        } catch (e) {
          console.error("Erreur chargement bassins :", e);
          // Conservation des données en cache pour ne pas afficher un faux tableau blanc vide
          set({
            erreurChargement: "Connexion instable : impossible d'actualiser les bassins.",
          });
        }
      },

      ajouterBassin: async (donnees) => {
        try {
          const { data, error } = await supabase
            .from("bassins")
            .insert({
              nom: donnees.nom,
              categorie: donnees.categorie,
              capacite_max_poissons: donnees.capaciteMaxPoissons,
              statut: donnees.statut || "actif"
            })
            .select()
            .single();

          if (error) throw error;
          
          const nouveauBassin: Bassin = {
            id: data.id,
            nom: data.nom,
            categorie: data.categorie as any,
            capaciteMaxPoissons: data.capacite_max_poissons,
            statut: data.statut as any,
            creeLe: data.cree_le
          };

          set({ bassins: [...get().bassins, nouveauBassin] });
          return nouveauBassin;
        } catch (e) {
          console.error("Erreur ajout bassin :", e);
          return null;
        }
      },

      mettreAJourBassin: async (id, donnees) => {
        try {
          const updateData: any = {};
          if (donnees.nom) updateData.nom = donnees.nom;
          if (donnees.categorie) updateData.categorie = donnees.categorie;
          if (donnees.capaciteMaxPoissons !== undefined) updateData.capacite_max_poissons = donnees.capaciteMaxPoissons;
          if (donnees.statut) updateData.statut = donnees.statut;

          const { error } = await supabase
            .from("bassins")
            .update(updateData)
            .eq("id", id);

          if (error) throw error;

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
          const { error } = await supabase
            .from("bassins")
            .delete()
            .eq("id", id);

          if (error) throw error;

          set({
            bassins: get().bassins.filter((b) => b.id !== id),
          });
          return true;
        } catch (e) {
          console.error("Erreur suppression bassin :", e);
          return false;
        }
      },

      lots: [],
      relevesQualiteEau: [],
      relevesNourrissage: [],

      chargerRelevesNourrissage: async () => {
        try {
          const { data, error } = await supabase
            .from("releves_nourrissage")
            .select("*")
            .order("date_nourrissage", { ascending: false });

          if (error) throw error;

          if (data) {
            const listeReleves: ReleveNourrissage[] = data.map((r) => ({
              id: r.id,
              lotId: r.lot_id,
              dateNourrissage: r.date_nourrissage,
              typeAliment: r.type_aliment,
              quantiteKg: Number(r.quantite_kg),
              observations: r.observations,
              creeLe: r.cree_le,
            }));
            set({ relevesNourrissage: listeReleves });
          }
        } catch (e) {
          console.error("Erreur chargement relevés nourrissage :", e);
        }
      },

      ajouterLot: async (donneesLot) => {
        try {
          const { data, error } = await supabase
            .from("lots")
            .insert({
              bassin_id: donneesLot.bassinId,
              souche: donneesLot.souche,
              quantite_initiale: donneesLot.quantiteInitiale,
              quantite_actuelle: donneesLot.quantiteInitiale,
              poids_moyen_initial_g: donneesLot.poidsMoyenInitialG,
            })
            .select()
            .single();

          if (error) throw error;

          const nouveauLot: Lot = {
            id: data.id,
            bassinId: data.bassin_id,
            dateArrivee: data.date_arrivee,
            souche: data.souche,
            quantiteInitiale: data.quantite_initiale,
            quantiteActuelle: data.quantite_actuelle,
            poidsMoyenInitialG: data.poids_moyen_initial_g,
            statut: data.statut,
            creeLe: data.cree_le,
          };

          set({ lots: [nouveauLot, ...get().lots] });
          return nouveauLot;
        } catch (e) {
          console.error("Erreur ajout lot :", e);
          return null;
        }
      },

      ajouterReleveQualiteEau: async (donneesReleve) => {
        try {
          const { data, error } = await supabase
            .from("releves_qualite_eau")
            .insert({
              bassin_id: donneesReleve.bassinId,
              temperature_c: donneesReleve.temperatureC,
              ph: donneesReleve.ph,
              oxygene_mgl: donneesReleve.oxygeneMgl,
              remarques: donneesReleve.remarques,
            })
            .select()
            .single();

          if (error) throw error;

          const nouveauReleve: ReleveQualiteEau = {
            id: data.id,
            bassinId: data.bassin_id,
            dateReleve: data.date_releve,
            temperatureC: data.temperature_c,
            ph: data.ph,
            oxygeneMgl: data.oxygene_mgl,
            remarques: data.remarques,
            creeLe: data.cree_le,
          };

          set({ relevesQualiteEau: [nouveauReleve, ...get().relevesQualiteEau] });
          return nouveauReleve;
        } catch (e) {
          console.error("Erreur ajout releve qualite eau :", e);
          return null;
        }
      },

      ajouterReleveNourrissage: async (donneesReleve) => {
        try {
          const { data, error } = await supabase
            .from("releves_nourrissage")
            .insert({
              lot_id: donneesReleve.lotId,
              type_aliment: donneesReleve.typeAliment,
              quantite_kg: donneesReleve.quantiteKg,
              observations: donneesReleve.observations,
            })
            .select()
            .single();

          if (error) throw error;

          const nouveauReleve: ReleveNourrissage = {
            id: data.id,
            lotId: data.lot_id,
            dateNourrissage: data.date_nourrissage,
            typeAliment: data.type_aliment,
            quantiteKg: data.quantite_kg,
            observations: data.observations,
            creeLe: data.cree_le,
          };

          set({ relevesNourrissage: [nouveauReleve, ...get().relevesNourrissage] });
          return nouveauReleve;
        } catch (e) {
          console.error("Erreur ajout releve nourrissage :", e);
          return null;
        }
      },

      // Opérations de Calibrage & Traçabilité (V2)
      operationsLog: [],

      chargerOperationsLog: async (bassinId?: string) => {
        try {
          let requete = supabase.from("operations_log").select("*").order("cree_le", { ascending: false });
          if (bassinId) {
            requete = requete.eq("bassin_id", bassinId);
          }
          const { data, error } = await requete;
          if (error) throw error;
          if (data) {
            const logs: OperationLog[] = data.map((d: any) => ({
              id: d.id,
              bassinId: d.bassin_id,
              lotId: d.lot_id,
              typeOperation: d.type_operation,
              quantiteAvant: d.quantite_avant,
              quantiteApres: d.quantite_apres,
              quantiteDelta: d.quantite_delta,
              poidsMoyenG: Number(d.poids_moyen_g || 0),
              destinationBassinId: d.destination_bassin_id,
              calibre: d.calibre,
              operePar: d.opere_par,
              remarques: d.remarques,
              creeLe: d.cree_le,
            }));
            set({ operationsLog: logs });
          }
        } catch (e) {
          console.error("Erreur chargement logs opérations :", e);
        }
      },

      enregistrerCalibrage: async ({
        bassinId,
        lotId,
        typeOperation = "calibrage",
        quantiteApres,
        nouveauPoidsMoyenG,
        calibre,
        operePar = "Équipe Piscicole",
        remarques,
      }) => {
        try {
          const lotExistant = get().lots.find((l) => l.id === lotId);
          if (!lotExistant) throw new Error("Lot introuvable");

          const quantiteAvant = lotExistant.quantiteActuelle;
          const quantiteFinale = quantiteApres !== undefined ? quantiteApres : quantiteAvant;
          const quantiteDelta = quantiteFinale - quantiteAvant;
          const poidsFinal = nouveauPoidsMoyenG !== undefined ? nouveauPoidsMoyenG : lotExistant.poidsMoyenInitialG;

          // 1. Mise à jour de la table lots
          const { error: errLot } = await supabase
            .from("lots")
            .update({
              quantite_actuelle: quantiteFinale,
              poids_moyen_initial_g: poidsFinal,
            })
            .eq("id", lotId);

          if (errLot) throw errLot;

          // 2. Ajout dans operations_log
          const { data: logData, error: errLog } = await supabase
            .from("operations_log")
            .insert({
              bassin_id: bassinId,
              lot_id: lotId,
              type_operation: typeOperation,
              quantite_avant: quantiteAvant,
              quantite_apres: quantiteFinale,
              quantite_delta: quantiteDelta,
              poids_moyen_g: poidsFinal,
              calibre,
              opere_par: operePar,
              remarques,
            })
            .select()
            .single();

          if (errLog) console.warn("Erreur insertion log:", errLog);

          const nouveauLog: OperationLog = {
            id: logData?.id || `log-${Date.now()}`,
            bassinId,
            lotId,
            typeOperation,
            quantiteAvant,
            quantiteApres: quantiteFinale,
            quantiteDelta,
            poidsMoyenG: poidsFinal,
            calibre,
            operePar,
            remarques,
            creeLe: logData?.cree_le || new Date().toISOString(),
          };

          // 3. Mise à jour synchrone de l'état Zustand
          const lotsMaj = get().lots.map((l) =>
            l.id === lotId
              ? { ...l, quantiteActuelle: quantiteFinale, poidsMoyenInitialG: poidsFinal }
              : l
          );

          const bassinsMaj = get().bassins.map((b) => {
            if (b.id === bassinId) {
              const lotMaj = lotsMaj.find((l) => l.id === lotId);
              const biomasseTotaleKg = Number(((quantiteFinale * poidsFinal) / 1000).toFixed(2));
              return {
                ...b,
                lotActif: lotMaj,
                nombrePoissons: quantiteFinale,
                poidsMoyenKg: Number((poidsFinal / 1000).toFixed(3)),
                biomasseTotaleKg,
              };
            }
            return b;
          });

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

      transfererPoissons: async ({
        sourceBassinId,
        sourceLotId,
        destinationBassinId,
        quantite,
        poidsMoyenG,
        calibre,
        operePar = "Équipe Piscicole",
        remarques,
      }) => {
        try {
          const lotSource = get().lots.find((l) => l.id === sourceLotId);
          if (!lotSource) throw new Error("Lot source introuvable");
          if (lotSource.quantiteActuelle < quantite) throw new Error("Quantité insuffisante dans le lot source");

          const quantiteApresSource = lotSource.quantiteActuelle - quantite;

          // Vérifier si le bassin de destination a déjà un lot actif
          const lotDestExistant = get().lots.find(
            (l) => l.bassinId === destinationBassinId && l.statut === "en_cours"
          );

          let destLotId = lotDestExistant?.id;
          let lotsMaj = get().lots;
          let nouveauLotCree = false;

          // 1. TENTATIVE VIA PROCÉDURE RPC POSTGRESQL ATOMIQUE (SI DÉPLOYÉE DANS SUPABASE)
          let rpcReussie = false;
          if (typeof supabase.rpc === "function") {
            try {
              const { data: rpcData, error: rpcError } = await supabase.rpc(
                "transferer_poissons_atomique",
                {
                  p_bassin_source_id: sourceBassinId,
                  p_lot_source_id: sourceLotId,
                  p_bassin_dest_id: destinationBassinId,
                  p_quantite: quantite,
                  p_poids_moyen_g: poidsMoyenG || lotSource.poidsMoyenInitialG,
                  p_calibre: calibre || null,
                  p_opere_par: operePar,
                  p_remarques: remarques || null,
                }
              );

              if (!rpcError && rpcData && (rpcData.success || rpcData.succes)) {
                rpcReussie = true;
                if (rpcData.lot_dest_id) destLotId = rpcData.lot_dest_id;
              }
            } catch (errRpc) {
              console.warn("RPC non disponible ou échec, bascule sur compensation Saga :", errRpc);
            }
          }

          // 2. PATTERN SAGA AVEC COMPENSATION (ROLLBACK) SI RPC NON UTILISÉE
          if (!rpcReussie) {
            // ÉTAPE A : Sécurisation destination EN PREMIER (aucun risque de perte de poisson source)
            if (lotDestExistant) {
              const quantiteApresDest = lotDestExistant.quantiteActuelle + quantite;
              const { error: errDest } = await supabase
                .from("lots")
                .update({ quantite_actuelle: quantiteApresDest })
                .eq("id", lotDestExistant.id);
              if (errDest) throw new Error(`Échec destination: ${errDest.message}`);
            } else {
              const { data: newLotData, error: errNewLot } = await supabase
                .from("lots")
                .insert({
                  bassin_id: destinationBassinId,
                  souche: lotSource.souche,
                  quantite_initiale: quantite,
                  quantite_actuelle: quantite,
                  poids_moyen_initial_g: poidsMoyenG || lotSource.poidsMoyenInitialG,
                  statut: "en_cours",
                })
                .select()
                .single();
              if (errNewLot || !newLotData) throw new Error(`Échec création lot destination: ${errNewLot?.message}`);

              destLotId = newLotData.id;
              nouveauLotCree = true;
            }

            // ÉTAPE B : Décrémentation du lot source
            const { error: errSource } = await supabase
              .from("lots")
              .update({ quantite_actuelle: quantiteApresSource })
              .eq("id", sourceLotId);

            // COMPENSATION (ROLLBACK) SI ÉCHEC SOURCE
            if (errSource) {
              console.error("Échec décrémentation source, exécution du ROLLBACK destination...", errSource);
              if (nouveauLotCree && destLotId) {
                // Supprimer le lot nouvellement créé
                await supabase.from("lots").delete().eq("id", destLotId);
              } else if (lotDestExistant) {
                // Rétablir la quantité initiale du lot destinataire
                await supabase
                  .from("lots")
                  .update({ quantite_actuelle: lotDestExistant.quantiteActuelle })
                  .eq("id", lotDestExistant.id);
              }
              throw new Error(`Échec source (rollback destination effectué): ${errSource.message}`);
            }
          }

          // Mise à jour de l'état local des lots
          if (lotDestExistant) {
            const quantiteApresDest = lotDestExistant.quantiteActuelle + quantite;
            lotsMaj = lotsMaj.map((l) =>
              l.id === lotDestExistant.id ? { ...l, quantiteActuelle: quantiteApresDest } : l
            );
          } else {
            const nouveauLot: Lot = {
              id: destLotId || `lot-dest-${Date.now()}`,
              bassinId: destinationBassinId,
              souche: lotSource.souche,
              dateArrivee: new Date().toISOString(),
              quantiteInitiale: quantite,
              quantiteActuelle: quantite,
              poidsMoyenInitialG: poidsMoyenG || lotSource.poidsMoyenInitialG,
              statut: "en_cours",
              creeLe: new Date().toISOString(),
            };
            lotsMaj = [nouveauLot, ...lotsMaj];
          }

          lotsMaj = lotsMaj.map((l) =>
            l.id === sourceLotId ? { ...l, quantiteActuelle: quantiteApresSource } : l
          );

          // Ajout du log de traçabilité (si rpcReussie, le log a déjà été inséré côté DB)
          let logDataId = `log-${Date.now()}`;
          if (!rpcReussie) {
            const { data: logData, error: errLog } = await supabase
              .from("operations_log")
              .insert({
                bassin_id: sourceBassinId,
                lot_id: sourceLotId,
                destination_bassin_id: destinationBassinId,
                type_operation: "transfert",
                quantite_avant: lotSource.quantiteActuelle,
                quantite_apres: quantiteApresSource,
                quantite_delta: -quantite,
                poids_moyen_g: poidsMoyenG || lotSource.poidsMoyenInitialG,
                calibre,
                opere_par: operePar,
                remarques,
              })
              .select()
              .single();

            if (errLog) console.warn("Erreur log transfert:", errLog);
            if (logData?.id) logDataId = logData.id;
          }

          const nouveauLog: OperationLog = {
            id: logDataId,
            bassinId: sourceBassinId,
            lotId: sourceLotId,
            destinationBassinId,
            typeOperation: "transfert",
            quantiteAvant: lotSource.quantiteActuelle,
            quantiteApres: quantiteApresSource,
            quantiteDelta: -quantite,
            poidsMoyenG: poidsMoyenG || lotSource.poidsMoyenInitialG,
            calibre,
            operePar,
            remarques,
            creeLe: new Date().toISOString(),
          };

          // Recalcul des bassins
          const bassinsMaj = get().bassins.map((b) => {
            const lotActif = lotsMaj.find((l) => l.bassinId === b.id && l.statut === "en_cours");
            const nombrePoissons = lotActif ? lotActif.quantiteActuelle : 0;
            const poidsG = lotActif ? Number(lotActif.poidsMoyenInitialG || 0) : 0;
            const biomasseTotaleKg = Number(((nombrePoissons * poidsG) / 1000).toFixed(2));
            return {
              ...b,
              lotActif,
              nombrePoissons,
              poidsMoyenKg: Number((poidsG / 1000).toFixed(3)),
              biomasseTotaleKg,
            };
          });

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

      enregistrerMortalite: async ({
        bassinId,
        lotId,
        quantiteMorts,
        operePar = "Équipe Piscicole",
        remarques,
      }) => {
        try {
          const lot = get().lots.find((l) => l.id === lotId);
          if (!lot) throw new Error("Lot introuvable");

          const quantiteAvant = lot.quantiteActuelle;
          const quantiteApres = Math.max(0, quantiteAvant - quantiteMorts);

          const { error: errLot } = await supabase
            .from("lots")
            .update({ quantite_actuelle: quantiteApres })
            .eq("id", lotId);
          if (errLot) throw errLot;

          const { data: logData, error: errLog } = await supabase
            .from("operations_log")
            .insert({
              bassin_id: bassinId,
              lot_id: lotId,
              type_operation: "mortalite",
              quantite_avant: quantiteAvant,
              quantite_apres: quantiteApres,
              quantite_delta: -quantiteMorts,
              poids_moyen_g: lot.poidsMoyenInitialG,
              opere_par: operePar,
              remarques,
            })
            .select()
            .single();

          if (errLog) console.warn("Erreur log mortalité:", errLog);

          const nouveauLog: OperationLog = {
            id: logData?.id || `log-${Date.now()}`,
            bassinId,
            lotId,
            typeOperation: "mortalite",
            quantiteAvant,
            quantiteApres,
            quantiteDelta: -quantiteMorts,
            poidsMoyenG: lot.poidsMoyenInitialG,
            operePar,
            remarques,
            creeLe: logData?.cree_le || new Date().toISOString(),
          };

          const lotsMaj = get().lots.map((l) =>
            l.id === lotId ? { ...l, quantiteActuelle: quantiteApres } : l
          );

          const bassinsMaj = get().bassins.map((b) => {
            if (b.id === bassinId) {
              const biomasseTotaleKg = Number(
                ((quantiteApres * (lot.poidsMoyenInitialG || 0)) / 1000).toFixed(2)
              );
              return {
                ...b,
                lotActif: { ...lot, quantiteActuelle: quantiteApres },
                nombrePoissons: quantiteApres,
                biomasseTotaleKg,
              };
            }
            return b;
          });

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