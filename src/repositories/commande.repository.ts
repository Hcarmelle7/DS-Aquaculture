import { supabase } from "@/lib/supabase";
import { CommandePoisson, StatutCommande } from "@/models";
import { mapperCommandeDepuisSql, mapperStatutCommandeVersSql } from "@/models/mappers";

export async function listerCommandes(): Promise<CommandePoisson[]> {
  const { data, error } = await supabase
    .from("fish_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapperCommandeDepuisSql);
}

export async function creerCommande(
  donneesCommande: Omit<CommandePoisson, "id" | "creeLe" | "statut">,
  codeFinal: string
): Promise<CommandePoisson> {
  const { data, error } = await supabase
    .from("fish_orders")
    .insert({
      order_code: codeFinal,
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

  return {
    ...mapperCommandeDepuisSql(data),
    statut: "en_attente",
  };
}

export async function mettreAJourStatutCommandeDb(
  id: string,
  statut: StatutCommande
): Promise<void> {
  const statutSql = mapperStatutCommandeVersSql(statut);
  const { error } = await supabase
    .from("fish_orders")
    .update({ status: statutSql })
    .eq("id", id);

  if (error) throw error;
}

export async function supprimerCommandeDb(id: string): Promise<void> {
  const { error } = await supabase.from("fish_orders").delete().eq("id", id);
  if (error) throw error;
}

