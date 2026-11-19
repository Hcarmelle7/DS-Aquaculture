import { supabase } from "@/lib/supabase";
import { TemoignageClient } from "@/models";
import { mapperTemoignageDepuisSql } from "@/models/mappers";

export async function listerTemoignages(): Promise<TemoignageClient[]> {
  const { data, error } = await supabase
    .from("customer_reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapperTemoignageDepuisSql);
}

export async function creerTemoignage(donnees: {
  nomAuteur: string;
  ville: string;
  note: number;
  commentaire: string;
}): Promise<boolean> {
  const { error } = await supabase.from("customer_reviews").insert({
    author_name: donnees.nomAuteur,
    city: donnees.ville,
    rating: donnees.note,
    comment: donnees.commentaire,
  });

  return !error;
}

