-- Migration: Expand UGT ID format to 9 digits with alphanumeric overflow support
-- Date: July 22, 2026
-- Purpose: Increase ID capacity from 99,999,999 to 999,999,999 and add overflow handling

-- ============================================
-- STEP 1: Update the core get_next_ugt_id function
-- ============================================
CREATE OR REPLACE FUNCTION public.get_next_ugt_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_seq_value BIGINT;
    v_prefix TEXT := 'UGT-';
    v_id TEXT;
    v_max_numeric BIGINT := 999999999; -- 9 digits max
BEGIN
    -- Get next sequence value
    v_seq_value := nextval('public.ugt_id_seq');
    
    -- Check if we're still in numeric range (9 digits)
    IF v_seq_value <= v_max_numeric THEN
        -- Generate 9-digit numeric ID: UGT-000000001
        v_id := v_prefix || LPAD(v_seq_value::TEXT, 9, '0');
    ELSE
        -- Overflow to alphanumeric: UGT-A00000001, UGT-B00000001, etc.
        -- Convert to base-26 (A-Z) for the prefix
        DECLARE
            v_letter_prefix TEXT;
            v_remaining BIGINT;
            v_letter_count INT;
            v_char_index INT;
            v_letter_part TEXT := '';
        BEGIN
            v_remaining := v_seq_value - v_max_numeric;
            v_letter_count := 1;
            
            -- Calculate how many letters we need
            WHILE v_remaining > POW(26, v_letter_count) LOOP
                v_remaining := v_remaining - POW(26, v_letter_count)::BIGINT;
                v_letter_count := v_letter_count + 1;
            END LOOP;
            
            -- Generate letter prefix (A, B, ... Z, AA, AB, ... ZZ, AAA, etc.)
            v_remaining := v_seq_value - v_max_numeric;
            FOR i IN 1..v_letter_count LOOP
                v_char_index := (v_remaining / POW(26, v_letter_count - i))::INT % 26;
                v_letter_part := v_letter_part || CHR(65 + v_char_index); -- A=65
            END LOOP;
            
            -- Generate remaining digits (8 digits after letters)
            v_id := v_prefix || v_letter_part || LPAD((v_seq_value % 100000000)::TEXT, 8, '0');
        END;
    END IF;
    
    RETURN v_id;
END;
$$;

-- ============================================
-- STEP 2: Create monitoring function for sequence status
-- ============================================
CREATE OR REPLACE FUNCTION public.get_ugt_sequence_status()
RETURNS TABLE (
    current_value BIGINT,
    max_numeric_value BIGINT,
    capacity_percentage NUMERIC,
    status TEXT,
    estimated_exhaustion_date TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current BIGINT;
    v_max BIGINT := 999999999;
    v_percent NUMERIC;
    v_status TEXT;
    v_daily_rate BIGINT;
    v_days_left BIGINT;
    v_estimated_exhaustion_date TEXT;
BEGIN
    -- Get current sequence value
    SELECT last_value INTO v_current FROM public.ugt_id_seq;
    
    -- Calculate percentage
    v_percent := ROUND((v_current::NUMERIC / v_max) * 100, 2);
    
    -- Determine status
    IF v_percent >= 90 THEN
        v_status := 'CRITICAL - Approaching limit';
    ELSIF v_percent >= 75 THEN
        v_status := 'WARNING - Monitor closely';
    ELSIF v_percent >= 50 THEN
        v_status := 'CAUTION - Plan for expansion';
    ELSE
        v_status := 'HEALTHY';
    END IF;
    
    -- Estimate exhaustion (assuming 1000 registrations per day as baseline)
    v_daily_rate := 1000;
    v_days_left := (v_max - v_current) / v_daily_rate;
    
    IF v_days_left > 365 THEN
        v_estimated_exhaustion_date := (CURRENT_DATE + (v_days_left || ' days')::INTERVAL)::TEXT;
    ELSIF v_days_left > 0 THEN
        v_estimated_exhaustion_date := v_days_left || ' days remaining';
    ELSE
        v_estimated_exhaustion_date := 'EXHAUSTED - Alphanumeric mode active';
    END IF;
    
    RETURN QUERY SELECT 
        v_current,
        v_max,
        v_percent,
        v_status,
        v_estimated_exhaustion_date;
END;
$$;

-- ============================================
-- STEP 3: Grant execute permissions
-- ============================================
GRANT EXECUTE ON FUNCTION public.get_next_ugt_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_next_ugt_id() TO anon;
GRANT EXECUTE ON FUNCTION public.get_next_ugt_id() TO service_role;

GRANT EXECUTE ON FUNCTION public.get_ugt_sequence_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_ugt_sequence_status() TO anon;
GRANT EXECUTE ON FUNCTION public.get_ugt_sequence_status() TO service_role;

-- ============================================
-- STEP 4: Verify the changes
-- ============================================
-- Test the new function (will show current status)
-- SELECT * FROM public.get_ugt_sequence_status();

-- ============================================
-- STEP 5: Log the migration
-- ============================================
DO $$
BEGIN
    RAISE NOTICE 'Migration 010 complete: UGT ID format expanded to 9 digits with alphanumeric overflow';
    RAISE NOTICE 'New format: UGT-000000001 (9 digits)';
    RAISE NOTICE 'Overflow format: UGT-A00000001, UGT-B00000001, etc.';
    RAISE NOTICE 'Max capacity: 999,999,999 numeric + unlimited alphanumeric';
END;
$$;