import { Bassin, Lot, OperationLog, TypeOperation } from "@/models";
import {
  creerLotTransfertDb,
  creerOperationLogDb,
  executerTransfertRpc,
  mettreAJourLotDb,
  supprimerLotDb,
} from "@/repositories/bassin.repository";

export function calculerBiomasseKg(nombrePoissons: number, poidsMoyenG: number): number {
  return Number(((nombrePoissons * poidsMoyenG) / 1000).toFixed(2));
}

export function calculerPoidsMoyenKg(poidsMoyenG: number): number {
  return Number((poidsMoyenG / 1000).toFixed(3));
}

export function enrichirBassinsAvecLots(bassins: Bassin[], lots: Lot[]): Bassin[] {
  return bassins.map((b) => {
    const lotActif = lots.find((l) => l.bassinId === b.id && l.statut === "en_cours");
    const nombrePoissons = lotActif ? lotActif.quantiteActuelle : 0;
    const poidsMoyenG = lotActif ? Number(lotActif.poidsMoyenInitialG || 0) : 0;
    return {
      ...b,
      lotActif,
      nombrePoissons,
      poidsMoyenKg: calculerPoidsMoyenKg(poidsMoyenG),
      biomasseTotaleKg: calculerBiomasseKg(nombrePoissons, poidsMoyenG),
    };
  });
}

export async function executerCalibrageBassin(
  params: {
    bassinId: string;
    lotId: string;
    typeOperation?: TypeOperation;
    quantiteApres?: number;
    nouveauPoidsMoyenG?: number;
    calibre?: string;
    operePar?: string;
    remarques?: string;
  },
  lots: Lot[],
  bassins: Bassin[]
): Promise<{ lotsMaj: Lot[]; bassinsMaj: Bassin[]; nouveauLog: OperationLog }> {
  const {
    bassinId,
    lotId,
    typeOperation = "calibrage",
    quantiteApres,
    nouveauPoidsMoyenG,
    calibre,
    operePar = "Équipe Piscicole",
    remarques,
  } = params;

  const lotExistant = lots.find((l) => l.id === lotId);
  if (!lotExistant) throw new Error("Lot introuvable");

  const quantiteAvant = lotExistant.quantiteActuelle;
  const quantiteFinale = quantiteApres !== undefined ? quantiteApres : quantiteAvant;
  const quantiteDelta = quantiteFinale - quantiteAvant;
  const poidsFinal =
    nouveauPoidsMoyenG !== undefined ? nouveauPoidsMoyenG : lotExistant.poidsMoyenInitialG;

  const { error: errLot } = await mettreAJourLotDb(lotId, {
    quantite_actuelle: quantiteFinale,
    poids_moyen_initial_g: poidsFinal,
  });
  if (errLot) throw errLot;

  const logData = await creerOperationLogDb({
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
  });

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

  const lotsMaj = lots.map((l) =>
    l.id === lotId
      ? { ...l, quantiteActuelle: quantiteFinale, poidsMoyenInitialG: poidsFinal }
      : l
  );

  const bassinsMaj = bassins.map((b) => {
    if (b.id === bassinId) {
      const lotMaj = lotsMaj.find((l) => l.id === lotId);
      return {
        ...b,
        lotActif: lotMaj,
        nombrePoissons: quantiteFinale,
        poidsMoyenKg: calculerPoidsMoyenKg(poidsFinal),
        biomasseTotaleKg: calculerBiomasseKg(quantiteFinale, poidsFinal),
      };
    }
    return b;
  });

  return { lotsMaj, bassinsMaj, nouveauLog };
}

export async function executerTransfertPoissons(
  params: {
    sourceBassinId: string;
    sourceLotId: string;
    destinationBassinId: string;
    quantite: number;
    poidsMoyenG?: number;
    calibre?: string;
    operePar?: string;
    remarques?: string;
  },
  lots: Lot[],
  bassins: Bassin[]
): Promise<{ lotsMaj: Lot[]; bassinsMaj: Bassin[]; nouveauLog: OperationLog }> {
  const {
    sourceBassinId,
    sourceLotId,
    destinationBassinId,
    quantite,
    poidsMoyenG,
    calibre,
    operePar = "Équipe Piscicole",
    remarques,
  } = params;

  const lotSource = lots.find((l) => l.id === sourceLotId);
  if (!lotSource) throw new Error("Lot source introuvable");
  if (lotSource.quantiteActuelle < quantite) {
    throw new Error("Quantité insuffisante dans le lot source");
  }

  const quantiteApresSource = lotSource.quantiteActuelle - quantite;
  const poidsEffectifG = poidsMoyenG || lotSource.poidsMoyenInitialG;
  const lotDestExistant = lots.find(
    (l) => l.bassinId === destinationBassinId && l.statut === "en_cours"
  );

  let destLotId = lotDestExistant?.id;
  let lotsMaj = lots;
  let nouveauLotCree = false;

  // 1. Tentative RPC atomique
  const resultatRpc = await executerTransfertRpc({
    sourceBassinId,
    sourceLotId,
    destinationBassinId,
    quantite,
    poidsMoyenG: poidsEffectifG,
    calibre,
    operePar,
    remarques,
  });

  const rpcReussie = resultatRpc.reussi;
  if (rpcReussie && resultatRpc.lotDestId) {
    destLotId = resultatRpc.lotDestId;
  }

  // 2. Pattern Saga avec rollback compensatoire si RPC indisponible
  if (!rpcReussie) {
    if (lotDestExistant) {
      const quantiteApresDest = lotDestExistant.quantiteActuelle + quantite;
      const { error: errDest } = await mettreAJourLotDb(lotDestExistant.id, {
        quantite_actuelle: quantiteApresDest,
      });
      if (errDest) throw new Error(`Échec destination: ${errDest.message}`);
    } else {
      const cree = await creerLotTransfertDb({
        bassinId: destinationBassinId,
        souche: lotSource.souche,
        quantite,
        poidsMoyenG: poidsEffectifG,
      });
      destLotId = cree.id;
      nouveauLotCree = true;
    }

    const { error: errSource } = await mettreAJourLotDb(sourceLotId, {
      quantite_actuelle: quantiteApresSource,
    });

    if (errSource) {
      console.error("Échec décrémentation source, exécution du ROLLBACK destination...", errSource);
      if (nouveauLotCree && destLotId) {
        await supprimerLotDb(destLotId);
      } else if (lotDestExistant) {
        await mettreAJourLotDb(lotDestExistant.id, {
          quantite_actuelle: lotDestExistant.quantiteActuelle,
        });
      }
      throw new Error(`Échec source (rollback destination effectué): ${errSource.message}`);
    }
  }

  // Mise à jour locale des lots
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
      poidsMoyenInitialG: poidsEffectifG,
      statut: "en_cours",
      creeLe: new Date().toISOString(),
    };
    lotsMaj = [nouveauLot, ...lotsMaj];
  }

  lotsMaj = lotsMaj.map((l) =>
    l.id === sourceLotId ? { ...l, quantiteActuelle: quantiteApresSource } : l
  );

  // Traçabilité si non déjà loguée par RPC
  let logDataId = `log-${Date.now()}`;
  if (!rpcReussie) {
    const logData = await creerOperationLogDb({
      bassinId: sourceBassinId,
      lotId: sourceLotId,
      destinationBassinId,
      typeOperation: "transfert",
      quantiteAvant: lotSource.quantiteActuelle,
      quantiteApres: quantiteApresSource,
      quantiteDelta: -quantite,
      poidsMoyenG: poidsEffectifG,
      calibre,
      operePar,
      remarques,
    });
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
    poidsMoyenG: poidsEffectifG,
    calibre,
    operePar,
    remarques,
    creeLe: new Date().toISOString(),
  };

  const bassinsMaj = enrichirBassinsAvecLots(bassins, lotsMaj);
  return { lotsMaj, bassinsMaj, nouveauLog };
}

export async function executerMortaliteBassin(
  params: {
    bassinId: string;
    lotId: string;
    quantiteMorts: number;
    operePar?: string;
    remarques?: string;
  },
  lots: Lot[],
  bassins: Bassin[]
): Promise<{ lotsMaj: Lot[]; bassinsMaj: Bassin[]; nouveauLog: OperationLog }> {
  const { bassinId, lotId, quantiteMorts, operePar = "Équipe Piscicole", remarques } = params;

  const lot = lots.find((l) => l.id === lotId);
  if (!lot) throw new Error("Lot introuvable");

  const quantiteAvant = lot.quantiteActuelle;
  const quantiteApres = Math.max(0, quantiteAvant - quantiteMorts);

  const { error: errLot } = await mettreAJourLotDb(lotId, {
    quantite_actuelle: quantiteApres,
  });
  if (errLot) throw errLot;

  const logData = await creerOperationLogDb({
    bassinId,
    lotId,
    typeOperation: "mortalite",
    quantiteAvant,
    quantiteApres,
    quantiteDelta: -quantiteMorts,
    poidsMoyenG: lot.poidsMoyenInitialG,
    operePar,
    remarques,
  });

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

  const lotsMaj = lots.map((l) =>
    l.id === lotId ? { ...l, quantiteActuelle: quantiteApres } : l
  );

  const bassinsMaj = bassins.map((b) => {
    if (b.id === bassinId) {
      return {
        ...b,
        lotActif: { ...lot, quantiteActuelle: quantiteApres },
        nombrePoissons: quantiteApres,
        biomasseTotaleKg: calculerBiomasseKg(quantiteApres, lot.poidsMoyenInitialG || 0),
      };
    }
    return b;
  });

  return { lotsMaj, bassinsMaj, nouveauLog };
}

