-- ==============================================================================
-- DS AQUACULTURE - HISTORIQUE DES CALIBRAGES & OPÉRATIONS (OPTION B)
-- Relié directement aux tables existantes `bassins` et `lots`
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.operations_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bassin_id UUID NOT NULL REFERENCES public.bassins(id) ON DELETE CASCADE,
    lot_id UUID REFERENCES public.lots(id) ON DELETE SET NULL,
    type_operation TEXT NOT NULL,                    -- 'calibrage', 'tri', 'transfert', 'mortalite', 'recolte', 'alevinage'
    quantite_avant INTEGER NOT NULL,
    quantite_apres INTEGER NOT NULL,
    quantite_delta INTEGER NOT NULL,                 -- Ex: -200 ou +200
    poids_moyen_g NUMERIC,                           -- Poids moyen constaté en grammes
    destination_bassin_id UUID REFERENCES public.bassins(id) ON DELETE SET NULL, -- En cas de transfert/tri
    calibre TEXT,                                    -- Ex: 'Petit (<50g)', 'Moyen (100-250g)', 'Gros (>300g)'
    opere_par TEXT DEFAULT 'Équipe Piscicole',       -- Prénom ou rôle de l'employé
    remarques TEXT,
    cree_le TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour des requêtes ultra-rapides sur le tableau de bord
CREATE INDEX IF NOT EXISTS idx_operations_log_bassin_id ON public.operations_log(bassin_id);
CREATE INDEX IF NOT EXISTS idx_operations_log_lot_id ON public.operations_log(lot_id);
CREATE INDEX IF NOT EXISTS idx_operations_log_cree_le ON public.operations_log(cree_le DESC);

-- Sécurité RLS
ALTER TABLE public.operations_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acces complet operations_log" ON public.operations_log;
CREATE POLICY "Acces complet operations_log" ON public.operations_log FOR ALL USING (true) WITH CHECK (true);
