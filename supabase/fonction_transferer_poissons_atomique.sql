-- ==============================================================================
-- FONCTION RPC POSTGRESQL : TRANSFERT ATOMIQUE DE POISSONS ENTRE BASSINS
-- Exécute l'intégralité du transfert dans une transaction ACID native
-- Empêche toute perte de poissons en cas de coupure ou panne réseau
-- À exécuter dans la console Supabase (SQL Editor)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.transferer_poissons_atomique(
    p_bassin_source_id UUID,
    p_lot_source_id UUID,
    p_bassin_dest_id UUID,
    p_quantite INTEGER,
    p_poids_moyen_g NUMERIC DEFAULT NULL,
    p_calibre TEXT DEFAULT NULL,
    p_opere_par TEXT DEFAULT 'Équipe Piscicole',
    p_remarques TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_source_lot RECORD;
    v_dest_lot RECORD;
    v_quantite_source_apres INTEGER;
    v_quantite_dest_apres INTEGER;
    v_dest_lot_id UUID;
    v_poids_moyen NUMERIC;
    v_log_id UUID;
BEGIN
    -- 1. Vérification et verrouillage ligne du lot source (FOR UPDATE)
    SELECT * INTO v_source_lot
    FROM public.lots
    WHERE id = p_lot_source_id AND bassin_id = p_bassin_source_id AND statut = 'en_cours'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lot source introuvable ou inactif';
    END IF;

    IF v_source_lot.quantite_actuelle < p_quantite THEN
        RAISE EXCEPTION 'Quantité insuffisante dans le lot source (actuelle: %, demandée: %)', 
            v_source_lot.quantite_actuelle, p_quantite;
    END IF;

    IF p_bassin_source_id = p_bassin_dest_id THEN
        RAISE EXCEPTION 'Le bassin source et le bassin destination doivent être distincts';
    END IF;

    v_quantite_source_apres := v_source_lot.quantite_actuelle - p_quantite;
    v_poids_moyen := COALESCE(p_poids_moyen_g, v_source_lot.poids_moyen_initial_g);

    -- 2. Décrémentation du lot source
    UPDATE public.lots
    SET quantite_actuelle = v_quantite_source_apres
    WHERE id = p_lot_source_id;

    -- 3. Vérification et verrouillage du bassin de destination (FOR UPDATE)
    SELECT * INTO v_dest_lot
    FROM public.lots
    WHERE bassin_id = p_bassin_dest_id AND statut = 'en_cours'
    ORDER BY cree_le DESC
    LIMIT 1
    FOR UPDATE;

    IF FOUND THEN
        v_dest_lot_id := v_dest_lot.id;
        v_quantite_dest_apres := v_dest_lot.quantite_actuelle + p_quantite;
        UPDATE public.lots
        SET quantite_actuelle = v_quantite_dest_apres
        WHERE id = v_dest_lot_id;
    ELSE
        -- Création d'un nouveau lot dans le bassin de destination
        INSERT INTO public.lots (
            bassin_id,
            souche,
            quantite_initiale,
            quantite_actuelle,
            poids_moyen_initial_g,
            statut
        ) VALUES (
            p_bassin_dest_id,
            v_source_lot.souche,
            p_quantite,
            p_quantite,
            v_poids_moyen,
            'en_cours'
        )
        RETURNING id INTO v_dest_lot_id;
    END IF;

    -- 4. Insertion de la traçabilité dans operations_log
    INSERT INTO public.operations_log (
        bassin_id,
        lot_id,
        destination_bassin_id,
        type_operation,
        quantite_avant,
        quantite_apres,
        quantite_delta,
        poids_moyen_g,
        calibre,
        opere_par,
        remarques
    ) VALUES (
        p_bassin_source_id,
        p_lot_source_id,
        p_bassin_dest_id,
        'transfert',
        v_source_lot.quantite_actuelle,
        v_quantite_source_apres,
        -p_quantite,
        v_poids_moyen,
        p_calibre,
        p_opere_par,
        p_remarques
    )
    RETURNING id INTO v_log_id;

    RETURN jsonb_build_object(
        'success', true,
        'succes', true,
        'source_lot_id', p_lot_source_id,
        'dest_lot_id', v_dest_lot_id,
        'quantite_source_apres', v_quantite_source_apres,
        'quantite_transferee', p_quantite,
        'log_id', v_log_id
    );
END;
$$;
