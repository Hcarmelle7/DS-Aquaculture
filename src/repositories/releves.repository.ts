import { supabase } from "@/lib/supabase";
import { ReleveNourrissage, ReleveQualiteEau } from "@/models";
import {
  mapperReleveNourrissageDepuisSql,
  mapperReleveQualiteEauDepuisSql,
} from "@/models/mappers";

// ==========================================
// NOURRISSAGE
// ==========================================

export async function listerRelevesNourrissage(): Promise<ReleveNourrissage[]> {
  const { data, error } = await supabase
    .from("releves_nourrissage")
    .select("*")
    .order("date_nourrissage", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapperReleveNourrissageDepuisSql);
}

export async function creerReleveNourrissage(
  donneesReleve: Omit<ReleveNourrissage, "id" | "creeLe" | "dateNourrissage">
): Promise<ReleveNourrissage> {
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
  return mapperReleveNourrissageDepuisSql(data);
}

// ==========================================
// QUALITÉ D'EAU
// ==========================================

export async function listerRelevesQualiteEau(
  bassinId?: string
): Promise<ReleveQualiteEau[]> {
  let requete = supabase
    .from("releves_qualite_eau")
    .select("*")
    .order("date_releve", { ascending: false });

  if (bassinId) {
    requete = requete.eq("bassin_id", bassinId);
  }

  const { data, error } = await requete;
  if (error) throw error;
  return (data || []).map(mapperReleveQualiteEauDepuisSql);
}

export async function creerReleveQualiteEau(
  donneesReleve: Omit<ReleveQualiteEau, "id" | "creeLe" | "dateReleve">
): Promise<ReleveQualiteEau> {
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
  return mapperReleveQualiteEauDepuisSql(data);
}

