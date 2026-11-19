import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from './useAppStore';
import { Bassin, Lot, OperationLog } from '@/types';

// Mock du client Supabase pour bassins, lots et operations_log
const mockBassinsData = [
  {
    id: 'bassin-1',
    nom: 'Bassin Béton 01',
    categorie: 'grossissement',
    capacite_max_poissons: 2000,
    statut: 'actif',
    cree_le: '2026-10-01T08:00:00Z',
  },
  {
    id: 'bassin-2',
    nom: 'Bassin Béton 02',
    categorie: 'grossissement',
    capacite_max_poissons: 2000,
    statut: 'actif',
    cree_le: '2026-10-01T08:00:00Z',
  },
];

const mockLotsData = [
  {
    id: 'lot-1',
    bassin_id: 'bassin-1',
    souche: 'Clarias gariepinus',
    quantite_initiale: 1500,
    quantite_actuelle: 1200,
    poids_moyen_initial_g: 250,
    statut: 'en_cours',
    date_arrivee: '2026-09-01T10:00:00Z',
    cree_le: '2026-09-01T10:00:00Z',
  },
];

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'bassins') {
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockBassinsData,
              error: null,
            }),
          }),
          update: vi.fn((donnees) => ({
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          })),
        };
      }

      if (table === 'lots') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockLotsData,
              error: null,
            }),
          }),
          insert: vi.fn((donnees) => ({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'lot-new-id',
                  bassin_id: donnees.bassin_id,
                  souche: donnees.souche,
                  quantite_initiale: donnees.quantite_initiale,
                  quantite_actuelle: donnees.quantite_actuelle,
                  poids_moyen_initial_g: donnees.poids_moyen_initial_g,
                  statut: donnees.statut || 'en_cours',
                  date_arrivee: new Date().toISOString(),
                  cree_le: new Date().toISOString(),
                },
                error: null,
              }),
            }),
          })),
          update: vi.fn((donnees) => ({
            eq: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          })),
        };
      }

      if (table === 'operations_log') {
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
          insert: vi.fn((donnees) => ({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: {
                  id: 'op-log-id',
                  bassin_id: donnees.bassin_id,
                  lot_id: donnees.lot_id,
                  type_operation: donnees.type_operation,
                  quantite_avant: donnees.quantite_avant,
                  quantite_apres: donnees.quantite_apres,
                  quantite_delta: donnees.quantite_delta,
                  poids_moyen_g: donnees.poids_moyen_g,
                  destination_bassin_id: donnees.destination_bassin_id,
                  calibre: donnees.calibre,
                  opere_par: donnees.opere_par,
                  remarques: donnees.remarques,
                  cree_le: new Date().toISOString(),
                },
                error: null,
              }),
            }),
          })),
        };
      }

      return {
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      };
    }),
  },
}));

describe('TDD - Numérisation du Tableau Blanc (bassins + lots) & Calibrages (operations_log)', () => {
  beforeEach(() => {
    useAppStore.setState({
      bassins: [],
      lots: [],
      operationsLog: [],
    } as any);
    vi.clearAllMocks();
  });

  it('1. DEVRAIT charger les bassins, associer le lot actif et calculer la biomasse', async () => {
    const store = useAppStore.getState() as any;

    expect(typeof store.chargerBassins).toBe('function');
    await store.chargerBassins();

    const state = useAppStore.getState() as any;
    expect(state.bassins.length).toBe(2);
    expect(state.lots.length).toBe(1);

    // Bassin 1 a un lot actif : 1200 poissons * 250g = 300 kg
    const bassin1: Bassin = state.bassins.find((b: Bassin) => b.id === 'bassin-1');
    expect(bassin1).toBeDefined();
    expect(bassin1.nombrePoissons).toBe(1200);
    expect(bassin1.biomasseTotaleKg).toBe(300);
    expect(bassin1.lotActif).toBeDefined();
    expect(bassin1.lotActif?.souche).toBe('Clarias gariepinus');

    // Bassin 2 est vide : pas de lot actif
    const bassin2: Bassin = state.bassins.find((b: Bassin) => b.id === 'bassin-2');
    expect(bassin2).toBeDefined();
    expect(bassin2.nombrePoissons).toBe(0);
    expect(bassin2.biomasseTotaleKg).toBe(0);
    expect(bassin2.lotActif).toBeUndefined();
  });

  it('2. DEVRAIT enregistrer un calibrage interne (ajustement effectif & pesée échantillon)', async () => {
    const store = useAppStore.getState() as any;
    useAppStore.setState({
      bassins: [
        {
          id: 'bassin-1',
          nom: 'Bassin Béton 01',
          categorie: 'grossissement',
          statut: 'actif',
          nombrePoissons: 1200,
          biomasseTotaleKg: 300,
        },
      ],
      lots: [
        {
          id: 'lot-1',
          bassinId: 'bassin-1',
          souche: 'Clarias gariepinus',
          quantiteInitiale: 1500,
          quantiteActuelle: 1200,
          poidsMoyenInitialG: 250,
          statut: 'en_cours',
        },
      ],
      operationsLog: [],
    } as any);

    // L'employé trie et compte 1150 poissons avec un nouveau poids moyen de 280g
    const resultat = await store.enregistrerCalibrage({
      bassinId: 'bassin-1',
      lotId: 'lot-1',
      typeOperation: 'calibrage',
      quantiteApres: 1150,
      nouveauPoidsMoyenG: 280,
      calibre: 'Moyen (250-300g)',
      operePar: 'Jean (Chef de ferme)',
      remarques: 'Pesée échantillon 50 poissons',
    });

    expect(resultat).toBe(true);

    const state = useAppStore.getState() as any;
    const lotModifie: Lot = state.lots.find((l: Lot) => l.id === 'lot-1');
    expect(lotModifie.quantiteActuelle).toBe(1150);
    expect(lotModifie.poidsMoyenInitialG).toBe(280);

    // Vérifie la mise à jour du bassin
    const bassinModifie: Bassin = state.bassins.find((b: Bassin) => b.id === 'bassin-1');
    expect(bassinModifie.nombrePoissons).toBe(1150);
    expect(bassinModifie.biomasseTotaleKg).toBe(322); // 1150 * 280g = 322 kg

    // Vérifie le journal operationsLog
    expect(state.operationsLog.length).toBe(1);
    const log: OperationLog = state.operationsLog[0];
    expect(log.bassinId).toBe('bassin-1');
    expect(log.lotId).toBe('lot-1');
    expect(log.typeOperation).toBe('calibrage');
    expect(log.quantiteAvant).toBe(1200);
    expect(log.quantiteApres).toBe(1150);
    expect(log.quantiteDelta).toBe(-50);
  });

  it('3. DEVRAIT exécuter un tri avec transfert de poissons vers un autre bassin', async () => {
    const store = useAppStore.getState() as any;
    useAppStore.setState({
      bassins: [
        { id: 'bassin-source', nom: 'Bassin 01', statut: 'actif', nombrePoissons: 1000, biomasseTotaleKg: 200 },
        { id: 'bassin-dest', nom: 'Bassin 02', statut: 'actif', nombrePoissons: 0, biomasseTotaleKg: 0 },
      ],
      lots: [
        {
          id: 'lot-source',
          bassinId: 'bassin-source',
          souche: 'Clarias gariepinus',
          quantiteInitiale: 1000,
          quantiteActuelle: 1000,
          poidsMoyenInitialG: 200,
          statut: 'en_cours',
        },
      ],
      operationsLog: [],
    } as any);

    // Sortie de 300 gros poissons du Bassin 01 vers le Bassin 02 (qui était vide)
    const succes = await store.transfererPoissons({
      sourceBassinId: 'bassin-source',
      sourceLotId: 'lot-source',
      destinationBassinId: 'bassin-dest',
      quantite: 300,
      poidsMoyenG: 320,
      calibre: 'Gros (>300g)',
      operePar: 'Paul',
      remarques: 'Séparation des plus gros',
    });

    expect(succes).toBe(true);

    const state = useAppStore.getState() as any;
    const lotSource = state.lots.find((l: Lot) => l.id === 'lot-source');
    expect(lotSource?.quantiteActuelle).toBe(700);

    const bassinSource = state.bassins.find((b: Bassin) => b.id === 'bassin-source');
    expect(bassinSource?.nombrePoissons).toBe(700);

    // Le bassin de destination reçoit un nouveau lot
    const lotDest = state.lots.find((l: Lot) => l.bassinId === 'bassin-dest' && l.statut === 'en_cours');
    expect(lotDest).toBeDefined();
    expect(lotDest?.quantiteActuelle).toBe(300);

    const bassinDest = state.bassins.find((b: Bassin) => b.id === 'bassin-dest');
    expect(bassinDest?.nombrePoissons).toBe(300);

    // Vérifie le log
    expect(state.operationsLog.length).toBe(1);
    const log = state.operationsLog[0];
    expect(log.bassinId).toBe('bassin-source');
    expect(log.destinationBassinId).toBe('bassin-dest');
    expect(log.typeOperation).toBe('transfert');
    expect(log.quantiteDelta).toBe(-300);
  });

  it('4. DEVRAIT enregistrer une mortalité et mettre à jour le cheptel', async () => {
    const store = useAppStore.getState() as any;
    useAppStore.setState({
      bassins: [
        { id: 'bassin-1', nom: 'Bassin 01', statut: 'actif', nombrePoissons: 1000, biomasseTotaleKg: 200 },
      ],
      lots: [
        {
          id: 'lot-1',
          bassinId: 'bassin-1',
          souche: 'Clarias gariepinus',
          quantiteInitiale: 1000,
          quantiteActuelle: 1000,
          poidsMoyenInitialG: 200,
          statut: 'en_cours',
        },
      ],
      operationsLog: [],
    } as any);

    // Retrait de 12 poissons morts le matin
    const succes = await store.enregistrerMortalite({
      bassinId: 'bassin-1',
      lotId: 'lot-1',
      quantiteMorts: 12,
      operePar: 'Mamadou',
      remarques: 'Mortalité normale post-calibrage',
    });

    expect(succes).toBe(true);

    const state = useAppStore.getState() as any;
    const lot = state.lots.find((l: Lot) => l.id === 'lot-1');
    expect(lot?.quantiteActuelle).toBe(988);

    const bassin = state.bassins.find((b: Bassin) => b.id === 'bassin-1');
    expect(bassin?.nombrePoissons).toBe(988);
    expect(bassin?.biomasseTotaleKg).toBe(197.6); // 988 * 200g = 197.6 kg

    const log = state.operationsLog[0];
    expect(log.typeOperation).toBe('mortalite');
    expect(log.quantiteDelta).toBe(-12);
    expect(log.quantiteApres).toBe(988);
  });
});
