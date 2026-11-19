import {
  Bassin,
  CommandePoisson,
  Lot,
  OperationLog,
  ReglagesEntreprise,
  ReleveNourrissage,
  ReleveQualiteEau,
  StatutCommande,
  StylePromo,
  TemoignageClient,
  TypePromo,
} from "@/models";

// ==========================================
// STATUTS & COMMANDES (fish_orders)
// ==========================================

export function mapperStatutCommandeDepuisSql(status?: string | null): StatutCommande {
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
}

export function mapperStatutCommandeVersSql(statut: StatutCommande): string {
  switch (statut) {
    case "en_attente":
      return "pending";
    case "en_livraison":
      return "in_delivery";
    case "livree":
      return "delivered";
    case "annulee":
      return "cancelled";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapperCommandeDepuisSql(cmd: any): CommandePoisson {
  return {
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
    statut: mapperStatutCommandeDepuisSql(cmd.status),
    creeLe: cmd.created_at,
  };
}

// ==========================================
// RÉGLAGES ENTREPRISE (business_settings)
// ==========================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapperReglagesDepuisSql(data: any, existant: ReglagesEntreprise): ReglagesEntreprise {
  return {
    ...existant,
    id: data.id || "ds_main",
    prixVivant: data.prix_poisson_vivant ?? data.price_vivant ?? existant.prixVivant,
    prixNettoye: data.prix_poisson_nettoye ?? data.price_nettoye ?? existant.prixNettoye,
    texteFormation: data.texte_formation ?? existant.texteFormation,
    prixFormation: data.prix_formation ?? existant.prixFormation,
    dureeFormation: data.duree_formation ?? existant.dureeFormation,
    programmeFormation: data.programme_formation ?? existant.programmeFormation,
    promoActive: data.promo_active ?? existant.promoActive,
    promoTitre: data.promo_titre ?? existant.promoTitre,
    promoTexte: data.promo_texte ?? existant.promoTexte,
    promoType: (data.promo_type as TypePromo) ?? existant.promoType,
    promoImageUrl: data.promo_image_url ?? existant.promoImageUrl ?? null,
    promoStyle: (data.promo_style as StylePromo) ?? existant.promoStyle ?? "ruban_incline",
    texteBannierePromo: data.promo_texte ?? data.promo_banner_text ?? existant.texteBannierePromo,
  };
}

export function construirePayloadReglagesSql(
  donnees: Partial<ReglagesEntreprise>
): Record<string, unknown> {
  const chargeUtile: Record<string, unknown> = {
    mis_a_jour_le: new Date().toISOString(),
  };

  if (donnees.prixVivant !== undefined) chargeUtile.prix_poisson_vivant = donnees.prixVivant;
  if (donnees.prixNettoye !== undefined) chargeUtile.prix_poisson_nettoye = donnees.prixNettoye;
  if (donnees.texteFormation !== undefined) chargeUtile.texte_formation = donnees.texteFormation;
  if (donnees.prixFormation !== undefined) chargeUtile.prix_formation = donnees.prixFormation;
  if (donnees.dureeFormation !== undefined) chargeUtile.duree_formation = donnees.dureeFormation;
  if (donnees.programmeFormation !== undefined) chargeUtile.programme_formation = donnees.programmeFormation;
  if (donnees.promoActive !== undefined) chargeUtile.promo_active = donnees.promoActive;
  if (donnees.promoTitre !== undefined) chargeUtile.promo_titre = donnees.promoTitre;
  if (donnees.promoTexte !== undefined) chargeUtile.promo_texte = donnees.promoTexte;
  if (donnees.promoType !== undefined) chargeUtile.promo_type = donnees.promoType;
  if (donnees.promoImageUrl !== undefined) chargeUtile.promo_image_url = donnees.promoImageUrl;
  if (donnees.promoStyle !== undefined) chargeUtile.promo_style = donnees.promoStyle;

  return chargeUtile;
}

// ==========================================
// BASSINS, LOTS & OPÉRATIONS
// ==========================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapperLotDepuisSql(l: any): Lot {
  return {
    id: l.id,
    bassinId: l.bassin_id,
    souche: l.souche,
    dateArrivee: l.date_arrivee,
    quantiteInitiale: l.quantite_initiale,
    quantiteActuelle: l.quantite_actuelle,
    poidsMoyenInitialG: l.poids_moyen_initial_g,
    statut: l.statut,
    creeLe: l.cree_le,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapperBassinBaseDepuisSql(b: any): Bassin {
  return {
    id: b.id,
    nom: b.nom,
    categorie: b.categorie as Bassin["categorie"],
    capaciteMaxPoissons: b.capacite_max_poissons,
    statut: (b.statut || "actif") as Bassin["statut"],
    creeLe: b.cree_le,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapperOperationLogDepuisSql(d: any): OperationLog {
  return {
    id: d.id,
    bassinId: d.bassin_id,
    lotId: d.lot_id || undefined,
    typeOperation: d.type_operation,
    quantiteAvant: d.quantite_avant,
    quantiteApres: d.quantite_apres,
    quantiteDelta: d.quantite_delta,
    poidsMoyenG: Number(d.poids_moyen_g || 0),
    destinationBassinId: d.destination_bassin_id || undefined,
    calibre: d.calibre || undefined,
    operePar: d.opere_par || undefined,
    remarques: d.remarques || undefined,
    creeLe: d.cree_le,
  };
}

// ==========================================
// RELEVÉS (NOURRISSAGE & QUALITÉ EAU)
// ==========================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapperReleveNourrissageDepuisSql(r: any): ReleveNourrissage {
  return {
    id: r.id,
    lotId: r.lot_id,
    dateNourrissage: r.date_nourrissage,
    typeAliment: r.type_aliment,
    quantiteKg: Number(r.quantite_kg),
    observations: r.observations,
    creeLe: r.cree_le,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapperReleveQualiteEauDepuisSql(r: any): ReleveQualiteEau {
  return {
    id: r.id,
    bassinId: r.bassin_id,
    dateReleve: r.date_releve,
    temperatureC: Number(r.temperature_c),
    ph: Number(r.ph),
    oxygeneMgl: Number(r.oxygene_mgl),
    remarques: r.remarques || undefined,
    creeLe: r.cree_le,
  };
}

// ==========================================
// TÉMOIGNAGES (customer_reviews)
// ==========================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapperTemoignageDepuisSql(d: any): TemoignageClient {
  return {
    id: d.id,
    nomAuteur: d.author_name,
    ville: d.city,
    note: d.rating,
    commentaire: d.comment,
    creeLe: d.created_at,
  };
}

