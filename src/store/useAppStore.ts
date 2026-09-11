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
              statut: cmd.status,
              creeLe: cmd.created_at,
            }));

            set({ commandes: listeCommandes });
          }
        } catch (e) {
          console.error("Erreur chargement commandes :", e);
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

      // Bassins
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

          if (bassinsData) {
            const listeBassins: Bassin[] = bassinsData.map((b) => ({
              id: b.id,
              nom: b.nom,
              categorie: b.categorie,
              capaciteMaxPoissons: b.capacite_max_poissons,
              statut: b.statut || "actif",
              creeLe: b.cree_le
            }));
            set({ bassins: listeBassins });
          }

          if (lotsData) {
            const listeLots: Lot[] = lotsData.map((l) => ({
              id: l.id,
              bassinId: l.bassin_id,
              souche: l.souche,
              dateArrivee: l.date_arrivee,
              quantiteInitiale: l.quantite_initiale,
              quantiteActuelle: l.quantite_actuelle,
              poidsMoyenInitialG: l.poids_moyen_initial_g,
              statut: l.statut,
              creeLe: l.cree_le
            }));
            set({ lots: listeLots });
          }
        } catch (e) {
          console.error("Erreur chargement bassins :", e);
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