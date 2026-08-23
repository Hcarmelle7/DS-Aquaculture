import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Langue,
  ModeTheme,
  CommandePoisson,
  Bassin,
  ReglagesEntreprise,
  StatutCommande,
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
  codePinAdmin: string;
  estAdminAuthentifie: boolean;
  verifierPin: (pin: string) => boolean;
  deconnecterAdmin: () => void;
  definirCodePin: (nouveauPin: string) => void;

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
  mettreAJourBassin: (id: string, donnees: Partial<Bassin>) => Promise<boolean>;
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

      
      codePinAdmin: "2026",
      estAdminAuthentifie: false,
      verifierPin: (pin) => {
        const estValide = pin === get().codePinAdmin;
        if (estValide) set({ estAdminAuthentifie: true });
        return estValide;
      },
      deconnecterAdmin: () => set({ estAdminAuthentifie: false }),
      definirCodePin: (nouveauPin) => set({ codePinAdmin: nouveauPin }),

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
          const { data, error } = await supabase
            .from("tanks")
            .select("*")
            .order("created_at", { ascending: true });

          if (error) throw error;

          if (data) {
            const listeBassins: Bassin[] = data.map((b) => ({
              id: b.id,
              nom: b.name,
              categorie: b.category,
              nombrePoissons: b.fish_count,
              poidsMoyenKg: Number(b.avg_weight_kg),
              biomasseTotaleKg: Number(b.total_biomass_kg),
              dernierNourrissage: b.last_feeding_time,
            }));

            set({ bassins: listeBassins });
          }
        } catch (e) {
          console.error("Erreur chargement bassins :", e);
        }
      },

      mettreAJourBassin: async (id, donnees) => {
        try {
          const { error } = await supabase
            .from("tanks")
            .update({
              name: donnees.nom,
              fish_count: donnees.nombrePoissons,
              avg_weight_kg: donnees.poidsMoyenKg,
              total_biomass_kg: donnees.biomasseTotaleKg,
              last_feeding_time: donnees.dernierNourrissage,
            })
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
    }),
    {
      name: "ds-aquaculture-session",
      partialize: (state) => ({
        langue: state.langue,
        theme: state.theme,
        codePinAdmin: state.codePinAdmin,
        estAdminAuthentifie: state.estAdminAuthentifie,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          appliquerThemeDOM(state.theme);
        }
      },
    }
  )
);