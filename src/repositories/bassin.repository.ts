import { supabase } from "@/lib/supabase";
import { Bassin, Lot, OperationLog, TypeOperation } from "@/models";
import {
  mapperBassinBaseDepuisSql,
  mapperLotDepuisSql,
  mapperOperationLogDepuisSql,
} from "@/models/mappers";

// ==========================================
// BASSINS
// ==========================================

export async function listerBassinsBruts(): Promise<Bassin[]> {
  const { data, error } = await supabase
    .from("bassins")
    .select("*")
    .order("cree_le", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapperBassinBaseDepuisSql);
}

export async function creerBassin(
  donnees: Omit<Bassin, "id" | "creeLe">
): Promise<Bassin> {
  const { data, error } = await supabase
    .from("bassins")
    .insert({
      nom: donnees.nom,
      categorie: donnees.categorie,
      capacite_max_poissons: donnees.capaciteMaxPoissons,
      statut: donnees.statut || "actif",
    })
    .select()
    .single();

  if (error) throw error;
  return mapperBassinBaseDepuisSql(data);
}

export async function mettreAJourBassinDb(
  id: string,
  donnees: Partial<Bassin>
): Promise<void> {
  const updateData: Record<string, unknown> = {};
  if (donnees.nom) updateData.nom = donnees.nom;
  if (donnees.categorie) updateData.categorie = donnees.categorie;
  if (donnees.capaciteMaxPoissons !== undefined) {
    updateData.capacite_max_poissons = donnees.capaciteMaxPoissons;
  }
  if (donnees.statut) updateData.statut = donnees.statut;

  const { error } = await supabase.from("bassins").update(updateData).eq("id", id);
  if (error) throw error;
}

export async function supprimerBassinDb(id: string): Promise<void> {
  const { error } = await supabase.from("bassins").delete().eq("id", id);
  if (error) throw error;
}

// ==========================================
// LOTS
// ==========================================

export async function listerLotsEnCours(): Promise<Lot[]> {
  const { data, error } = await supabase
    .from("lots")
    .select("*")
    .eq("statut", "en_cours");

  if (error) throw error;
  return (data || []).map(mapperLotDepuisSql);
}

export async function creerLot(
  donneesLot: Omit<Lot, "id" | "creeLe" | "dateArrivee" | "statut" | "quantiteActuelle">
): Promise<Lot> {
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
  return mapperLotDepuisSql(data);
}

export async function creerLotTransfertDb(params: {
  bassinId: string;
  souche: string;
  quantite: number;
  poidsMoyenG: number;
}): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from("lots")
    .insert({
      bassin_id: params.bassinId,
      souche: params.souche,
      quantite_initiale: params.quantite,
      quantite_actuelle: params.quantite,
      poids_moyen_initial_g: params.poidsMoyenG,
      statut: "en_cours",
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Échec création lot destination: ${error?.message}`);
  }
  return { id: data.id };
}

export async function mettreAJourLotDb(
  lotId: string,
  champs: { quantite_actuelle?: number; poids_moyen_initial_g?: number }
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("lots").update(champs).eq("id", lotId);
  return { error };
}

export async function supprimerLotDb(lotId: string): Promise<void> {
  await supabase.from("lots").delete().eq("id", lotId);
}

// ==========================================
// JOURNAL DES OPÉRATIONS & RPC TRANSFERT
// ==========================================

export async function listerOperationsLogDb(bassinId?: string): Promise<OperationLog[]> {
  let requete = supabase
    .from("operations_log")
    .select("*")
    .order("cree_le", { ascending: false });

  if (bassinId) {
    requete = requete.eq("bassin_id", bassinId);
  }

  const { data, error } = await requete;
  if (error) throw error;
  return (data || []).map(mapperOperationLogDepuisSql);
}

export async function creerOperationLogDb(params: {
  bassinId: string;
  lotId: string;
  destinationBassinId?: string;
  typeOperation: TypeOperation;
  quantiteAvant: number;
  quantiteApres: number;
  quantiteDelta: number;
  poidsMoyenG?: number;
  calibre?: string;
  operePar?: string;
  remarques?: string;
}): Promise<{ id?: string; cree_le?: string } | null> {
  const payload: Record<string, unknown> = {
    bassin_id: params.bassinId,
    lot_id: params.lotId,
    type_operation: params.typeOperation,
    quantite_avant: params.quantiteAvant,
    quantite_apres: params.quantiteApres,
    quantite_delta: params.quantiteDelta,
    poids_moyen_g: params.poidsMoyenG,
    opere_par: params.operePar,
    remarques: params.remarques,
  };

  if (params.destinationBassinId !== undefined) {
    payload.destination_bassin_id = params.destinationBassinId;
  }
  if (params.calibre !== undefined) {
    payload.calibre = params.calibre;
  }

  const { data, error } = await supabase
    .from("operations_log")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.warn("Erreur insertion log:", error);
    return null;
  }
  return data;
}

export async function executerTransfertRpc(params: {
  sourceBassinId: string;
  sourceLotId: string;
  destinationBassinId: string;
  quantite: number;
  poidsMoyenG: number;
  calibre?: string;
  operePar: string;
  remarques?: string;
}): Promise<{ reussi: boolean; lotDestId?: string }> {
  if (typeof supabase.rpc !== "function") {
    return { reussi: false };
  }

  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "transferer_poissons_atomique",
      {
        p_bassin_source_id: params.sourceBassinId,
        p_lot_source_id: params.sourceLotId,
        p_bassin_dest_id: params.destinationBassinId,
        p_quantite: params.quantite,
        p_poids_moyen_g: params.poidsMoyenG,
        p_calibre: params.calibre || null,
        p_opere_par: params.operePar,
        p_remarques: params.remarques || null,
      }
    );

    if (!rpcError && rpcData && (rpcData.success || rpcData.succes)) {
      return { reussi: true, lotDestId: rpcData.lot_dest_id };
    }
  } catch (errRpc) {
    console.warn("RPC non disponible ou échec, bascule sur compensation Saga :", errRpc);
  }

  return { reussi: false };
}

