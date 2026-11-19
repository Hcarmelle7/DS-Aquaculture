import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from './useAppStore';

// Mock du client Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn((table) => ({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { 
              id: 'test-id', 
              bassin_id: 'bassin-1', 
              lot_id: 'lot-1',
              souche: 'Clarias',
              ph: 7.2,
              quantite_kg: 5,
              cree_le: new Date().toISOString() 
            },
            error: null
          })
        })
      }),
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [],
          error: null
        })
      })
    }))
  }
}));

describe('useAppStore - Phase 3 (Espace Admin)', () => {
  beforeEach(() => {
    // Réinitialisation de l'état partiel pour les tests
    useAppStore.setState({
      lots: [],
      relevesQualiteEau: [],
      relevesNourrissage: []
    } as any);
    vi.clearAllMocks();
  });

  it('devrait ajouter un nouveau lot', async () => {
    const store = useAppStore.getState();
    // On suppose que la fonction ajouterLot existe et retourne le Lot créé
    const nouveauLot = await (store as any).ajouterLot({
      bassinId: 'bassin-1',
      souche: 'Clarias',
      quantiteInitiale: 1000,
      poidsMoyenInitialG: 10,
    });

    expect(nouveauLot).not.toBeNull();
    expect(nouveauLot?.souche).toBe('Clarias');
    expect((useAppStore.getState() as any).lots.length).toBe(1);
  });

  it('devrait ajouter un relevé de qualité d\'eau', async () => {
    const store = useAppStore.getState();
    const releve = await (store as any).ajouterReleveQualiteEau({
      bassinId: 'bassin-1',
      temperatureC: 28.5,
      ph: 7.2,
      oxygeneMgl: 5.5,
    });

    expect(releve).not.toBeNull();
    expect(releve?.ph).toBe(7.2);
    expect((useAppStore.getState() as any).relevesQualiteEau.length).toBe(1);
  });

  it('devrait ajouter un relevé de nourrissage', async () => {
    const store = useAppStore.getState();
    const releve = await (store as any).ajouterReleveNourrissage({
      lotId: 'lot-1',
      typeAliment: 'Granulé 2mm',
      quantiteKg: 5,
    });

    expect(releve).not.toBeNull();
    expect(releve?.quantiteKg).toBe(5);
    expect((useAppStore.getState() as any).relevesNourrissage.length).toBe(1);
  });
});
