import { supabase } from "@/lib/supabase";
import { ReglagesEntreprise } from "@/models";
import { construirePayloadReglagesSql, mapperReglagesDepuisSql } from "@/models/mappers";

export async function recupererReglagesEntreprise(
  existant: ReglagesEntreprise
): Promise<ReglagesEntreprise | null> {
  const { data, error } = await supabase
    .from("business_settings")
    .select("*")
    .eq("id", "ds_main")
    .single();

  if (error) {
    console.warn("Utilisation des réglages locaux :", error.message);
    return null;
  }

  return data ? mapperReglagesDepuisSql(data, existant) : null;
}

export async function sauvegarderReglagesEntreprise(
  donnees: Partial<ReglagesEntreprise>
): Promise<void> {
  const chargeUtile = construirePayloadReglagesSql(donnees);
  const { error } = await supabase
    .from("business_settings")
    .update(chargeUtile)
    .eq("id", "ds_main");

  if (error) throw error;
}

export async function televerserMediaPromoStorage(fichier: File): Promise<string> {
  const extension = fichier.name.split(".").pop() || "png";
  const nomFichier = `promotions/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

  const { error: erreurUpload } = await supabase.storage
    .from("ds-media")
    .upload(nomFichier, fichier, {
      cacheControl: "3600",
      upsert: true,
    });

  if (erreurUpload) {
    console.error("Erreur upload Supabase Storage :", erreurUpload);
    throw erreurUpload;
  }

  const { data: urlData } = supabase.storage
    .from("ds-media")
    .getPublicUrl(nomFichier);

  return urlData.publicUrl;
}

export async function supprimerMediaPromoStorage(url: string): Promise<void> {
  const match = url.match(/ds-media\/(.+)$/);
  const chemin = match ? match[1] : null;
  if (chemin) {
    await supabase.storage.from("ds-media").remove([chemin]);
  }
}

