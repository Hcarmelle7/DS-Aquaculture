-- Activation de l'extension UUID (si non activée par défaut sur Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table des Bassins (Infrastructures physiques)
CREATE TABLE IF NOT EXISTS public.bassins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    categorie TEXT,
    capacite_max_poissons INTEGER,
    statut TEXT DEFAULT 'actif',
    cree_le TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des Lots (Groupes de poissons pour la traçabilité)
CREATE TABLE IF NOT EXISTS public.lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bassin_id UUID REFERENCES public.bassins(id) ON DELETE SET NULL,
    date_arrivee TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    souche TEXT NOT NULL,
    quantite_initiale INTEGER NOT NULL,
    quantite_actuelle INTEGER NOT NULL,
    poids_moyen_initial_g NUMERIC,
    statut TEXT DEFAULT 'en_cours',
    cree_le TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des Relevés de Qualité de l'Eau
CREATE TABLE IF NOT EXISTS public.releves_qualite_eau (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bassin_id UUID REFERENCES public.bassins(id) ON DELETE CASCADE,
    date_releve TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    temperature_c NUMERIC,
    ph NUMERIC,
    oxygene_mgl NUMERIC,
    remarques TEXT,
    cree_le TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des Relevés de Nourrissage (Calcul du FCR)
CREATE TABLE IF NOT EXISTS public.releves_nourrissage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lot_id UUID REFERENCES public.lots(id) ON DELETE CASCADE,
    date_nourrissage TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type_aliment TEXT NOT NULL,
    quantite_kg NUMERIC NOT NULL,
    observations TEXT,
    cree_le TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table des Commandes (E-commerce / Boutique)
CREATE TABLE IF NOT EXISTS public.fish_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    preparation TEXT NOT NULL,
    weight_kg NUMERIC NOT NULL,
    price_per_kg NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    location_city TEXT,
    neighborhood TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- SÉCURITÉ RLS (Row Level Security)
-- ==========================================

-- Activation du RLS sur toutes les tables
ALTER TABLE public.bassins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.releves_qualite_eau ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.releves_nourrissage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fish_orders ENABLE ROW LEVEL SECURITY;

-- Note : Puisque l'application utilise un Code PIN côté Frontend (Zustand) 
-- pour l'instant, on ouvre l'accès public. 
-- Pour une vraie sécurité backend plus tard, on remplacera `true` par `auth.uid() = ...`

CREATE POLICY "Acces complet bassins" ON public.bassins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces complet lots" ON public.lots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces complet releves qualite" ON public.releves_qualite_eau FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces complet releves nourrissage" ON public.releves_nourrissage FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces complet commandes" ON public.fish_orders FOR ALL USING (true) WITH CHECK (true);
