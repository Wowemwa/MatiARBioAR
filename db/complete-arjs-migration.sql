-- ============================================
-- COMPLETE AR.JS MIGRATION & SETUP SCRIPT
-- Mati Biodiversity Database - AR.js Pattern Tracking
-- Date: November 18, 2025
-- ============================================
-- This script performs a complete migration to AR.js pattern-based
-- marker tracking, including database schema updates, storage setup,
-- and verification steps.

-- ============================================
-- STEP 1: MIGRATE EXISTING DATABASE
-- ============================================

-- Add new AR.js columns to species table
ALTER TABLE public.species
ADD COLUMN IF NOT EXISTS ar_pattern_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ar_marker_image_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ar_viewer_html TEXT DEFAULT NULL;

-- Add helpful comments to new columns
COMMENT ON COLUMN public.species.ar_pattern_url IS 'URL to the .patt file for AR.js pattern recognition';
COMMENT ON COLUMN public.species.ar_marker_image_url IS 'URL to the PNG marker image displayed in species card';
COMMENT ON COLUMN public.species.ar_viewer_html IS 'Optional: Custom HTML for AR viewer (if different from default)';

-- Create indexes for new AR fields
CREATE INDEX IF NOT EXISTS idx_species_ar_pattern ON public.species(ar_pattern_url)
WHERE ar_pattern_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_species_ar_marker ON public.species(ar_marker_image_url)
WHERE ar_marker_image_url IS NOT NULL;

-- ============================================
-- STEP 2: VERIFY MIGRATION SUCCESS
-- ============================================

-- Check that new columns were added
DO $$
DECLARE
    pattern_col_exists BOOLEAN;
    marker_col_exists BOOLEAN;
    viewer_col_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'species'
          AND table_schema = 'public'
          AND column_name = 'ar_pattern_url'
    ) INTO pattern_col_exists;

    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'species'
          AND table_schema = 'public'
          AND column_name = 'ar_marker_image_url'
    ) INTO marker_col_exists;

    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'species'
          AND table_schema = 'public'
          AND column_name = 'ar_viewer_html'
    ) INTO viewer_col_exists;

    IF pattern_col_exists AND marker_col_exists AND viewer_col_exists THEN
        RAISE NOTICE '✅ Migration successful: All AR.js columns added';
    ELSE
        RAISE EXCEPTION '❌ Migration failed: Some columns missing';
    END IF;
END $$;

-- Display current species table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default,
    col_description
FROM information_schema.columns c
LEFT JOIN pg_description d ON d.objoid = c.table_name::regclass
    AND d.objsubid = c.ordinal_position
WHERE c.table_name = 'species'
  AND c.table_schema = 'public'
  AND c.column_name LIKE 'ar_%'
ORDER BY c.ordinal_position;

-- ============================================
-- STEP 3: STORAGE BUCKET POLICIES
-- ============================================

-- === AR PATTERNS BUCKET POLICIES ===

-- Allow public to view all AR patterns
DROP POLICY IF EXISTS "ar_patterns_public_read" ON storage.objects;
CREATE POLICY "ar_patterns_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'ar-patterns');

-- Allow authenticated users to upload patterns
DROP POLICY IF EXISTS "ar_patterns_authenticated_insert" ON storage.objects;
CREATE POLICY "ar_patterns_authenticated_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ar-patterns');

-- Allow admins to update patterns
DROP POLICY IF EXISTS "ar_patterns_admin_update" ON storage.objects;
CREATE POLICY "ar_patterns_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ar-patterns'
  AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Allow admins to delete patterns
DROP POLICY IF EXISTS "ar_patterns_admin_delete" ON storage.objects;
CREATE POLICY "ar_patterns_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'ar-patterns'
  AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- === AR MARKERS BUCKET POLICIES ===

-- Allow public to view all AR markers
DROP POLICY IF EXISTS "ar_markers_public_read" ON storage.objects;
CREATE POLICY "ar_markers_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'ar-markers');

-- Allow authenticated users to upload markers
DROP POLICY IF EXISTS "ar_markers_authenticated_insert" ON storage.objects;
CREATE POLICY "ar_markers_authenticated_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ar-markers');

-- Allow admins to update markers
DROP POLICY IF EXISTS "ar_markers_admin_update" ON storage.objects;
CREATE POLICY "ar_markers_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ar-markers'
  AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Allow admins to delete markers
DROP POLICY IF EXISTS "ar_markers_admin_delete" ON storage.objects;
CREATE POLICY "ar_markers_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'ar-markers'
  AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- === SPECIES MODELS BUCKET POLICIES ===

-- Allow public to view all 3D models
DROP POLICY IF EXISTS "species_models_public_read" ON storage.objects;
CREATE POLICY "species_models_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'species-models');

-- Allow authenticated users to upload models
DROP POLICY IF EXISTS "species_models_authenticated_insert" ON storage.objects;
CREATE POLICY "species_models_authenticated_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'species-models');

-- Allow admins to update models
DROP POLICY IF EXISTS "species_models_admin_update" ON storage.objects;
CREATE POLICY "species_models_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'species-models'
  AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Allow admins to delete models
DROP POLICY IF EXISTS "species_models_admin_delete" ON storage.objects;
CREATE POLICY "species_models_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'species-models'
  AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- ============================================
-- STEP 4: VERIFY STORAGE SETUP
-- ============================================

-- Check all storage policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND (
    policyname LIKE '%ar_patterns%'
    OR policyname LIKE '%ar_markers%'
    OR policyname LIKE '%species_models%'
  )
ORDER BY policyname;

-- Check storage buckets (if they exist)
SELECT
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types,
    created_at
FROM storage.buckets
WHERE name IN ('ar-patterns', 'ar-markers', 'species-models', 'media')
ORDER BY name;

-- ============================================
-- STEP 5: CREATE HELPER FUNCTIONS
-- ============================================

-- Function to get species AR assets
CREATE OR REPLACE FUNCTION public.get_species_ar_assets(species_id_param TEXT)
RETURNS TABLE (
    species_id TEXT,
    ar_model_url TEXT,
    ar_pattern_url TEXT,
    ar_marker_image_url TEXT,
    ar_viewer_html TEXT,
    ar_model_scale DECIMAL,
    ar_model_rotation JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.ar_model_url,
        s.ar_pattern_url,
        s.ar_marker_image_url,
        s.ar_viewer_html,
        s.ar_model_scale,
        s.ar_model_rotation
    FROM public.species s
    WHERE s.id = species_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if species has complete AR setup
CREATE OR REPLACE FUNCTION public.species_has_ar_content(species_id_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    has_content BOOLEAN := FALSE;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.species
        WHERE id = species_id_param
          AND ar_model_url IS NOT NULL
          AND ar_pattern_url IS NOT NULL
          AND ar_marker_image_url IS NOT NULL
    ) INTO has_content;

    RETURN has_content;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 6: TEST DATA INSERTION (OPTIONAL)
-- ============================================

-- Uncomment and modify these lines to insert test data
-- This is for testing purposes only

/*
-- Insert test species with AR content
INSERT INTO public.species (
    id,
    category,
    common_name,
    scientific_name,
    description,
    ar_model_url,
    ar_pattern_url,
    ar_marker_image_url,
    ar_model_scale,
    ar_model_rotation
) VALUES (
    'test-philippine-eagle',
    'fauna',
    'Philippine Eagle',
    'Pithecophaga jefferyi',
    'The Philippine eagle is a critically endangered species...',
    'https://your-supabase-url.supabase.co/storage/v1/object/public/species-models/test-philippine-eagle/test-philippine-eagle.glb',
    'https://your-supabase-url.supabase.co/storage/v1/object/public/ar-patterns/test-philippine-eagle/test-philippine-eagle.patt',
    'https://your-supabase-url.supabase.co/storage/v1/object/public/ar-markers/test-philippine-eagle/test-philippine-eagle-marker.png',
    1.0,
    '{"x": 0, "y": 0, "z": 0}'
) ON CONFLICT (id) DO UPDATE SET
    ar_model_url = EXCLUDED.ar_model_url,
    ar_pattern_url = EXCLUDED.ar_pattern_url,
    ar_marker_image_url = EXCLUDED.ar_marker_image_url,
    updated_at = NOW();
*/

-- ============================================
-- STEP 7: FINAL VERIFICATION
-- ============================================

-- Count species with AR content
SELECT
    COUNT(*) as total_species,
    COUNT(CASE WHEN ar_model_url IS NOT NULL THEN 1 END) as with_models,
    COUNT(CASE WHEN ar_pattern_url IS NOT NULL THEN 1 END) as with_patterns,
    COUNT(CASE WHEN ar_marker_image_url IS NOT NULL THEN 1 END) as with_markers,
    COUNT(CASE
        WHEN ar_model_url IS NOT NULL
         AND ar_pattern_url IS NOT NULL
         AND ar_marker_image_url IS NOT NULL
        THEN 1 END) as complete_ar_species
FROM public.species;

-- Show species with complete AR setup
SELECT
    id,
    common_name,
    scientific_name,
    ar_model_url,
    ar_pattern_url,
    ar_marker_image_url,
    ar_model_scale,
    ar_model_rotation
FROM public.species
WHERE ar_model_url IS NOT NULL
  AND ar_pattern_url IS NOT NULL
  AND ar_marker_image_url IS NOT NULL
ORDER BY common_name;

-- ============================================
-- STEP 8: PERFORMANCE OPTIMIZATION
-- ============================================

-- Analyze tables for query optimization
ANALYZE public.species;
ANALYZE storage.objects;

-- Show index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename = 'species'
  AND indexname LIKE '%ar_%'
ORDER BY indexname;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '🎉 AR.js Migration Complete!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Create storage buckets in Supabase Dashboard:';
    RAISE NOTICE '   - ar-patterns (public: true)';
    RAISE NOTICE '   - ar-markers (public: true)';
    RAISE NOTICE '   - species-models (public: true)';
    RAISE NOTICE '';
    RAISE NOTICE '2. Test admin panel file uploads';
    RAISE NOTICE '3. Generate markers for existing species';
    RAISE NOTICE '4. Test AR viewer functionality';
    RAISE NOTICE '';
    RAISE NOTICE 'For help, see: AR_JS_IMPLEMENTATION_GUIDE.md';
END $$;

-- ============================================
-- END OF SCRIPT
-- ============================================