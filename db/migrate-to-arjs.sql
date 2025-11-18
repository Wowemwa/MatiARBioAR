-- ============================================
-- MIGRATION: Update to AR.js Pattern-Based Tracking
-- Date: November 18, 2025
-- ============================================
-- This migration updates the species table to support AR.js pattern-based
-- marker tracking instead of MindAR/QR codes

-- Step 1: Add new columns for AR.js pattern tracking
ALTER TABLE public.species 
ADD COLUMN IF NOT EXISTS ar_pattern_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ar_marker_image_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ar_viewer_html TEXT DEFAULT NULL;

-- Step 2: Remove old QR code column (optional - comment out if you want to keep data)
-- ALTER TABLE public.species DROP COLUMN IF EXISTS qr_code_data;

-- Step 3: Create indexes for new AR fields
CREATE INDEX IF NOT EXISTS idx_species_ar_pattern ON public.species(ar_pattern_url) 
WHERE ar_pattern_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_species_ar_marker ON public.species(ar_marker_image_url) 
WHERE ar_marker_image_url IS NOT NULL;

-- Step 4: Drop old QR code index
DROP INDEX IF EXISTS idx_species_qr_code;

-- Step 5: Add helpful comments to columns
COMMENT ON COLUMN public.species.ar_model_url IS 'URL to the GLB/GLTF 3D model for AR viewing';
COMMENT ON COLUMN public.species.ar_pattern_url IS 'URL to the .patt file for AR.js pattern recognition';
COMMENT ON COLUMN public.species.ar_marker_image_url IS 'URL to the PNG marker image displayed in species card';
COMMENT ON COLUMN public.species.ar_viewer_html IS 'Optional: Custom HTML for AR viewer (if different from default)';
COMMENT ON COLUMN public.species.ar_model_scale IS 'Scale factor for the 3D model in AR view (default: 1.0)';
COMMENT ON COLUMN public.species.ar_model_rotation IS 'JSON rotation values for x, y, z axes in degrees';

-- Step 6: Verify migration
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'species' 
  AND table_schema = 'public'
  AND column_name LIKE 'ar_%'
ORDER BY ordinal_position;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Create storage buckets for AR assets:
--    - 'ar-patterns' bucket for .patt files
--    - 'ar-markers' bucket for marker PNG images
--    - 'species-models' bucket for GLB files (should already exist)
-- 2. Set bucket policies to allow public read access
-- 3. Update your application code to upload and display these new assets
-- 4. Test AR functionality with pattern-based markers

-- Storage bucket setup (run in Supabase Dashboard Storage section):
-- CREATE BUCKET ar-patterns (public: true)
-- CREATE BUCKET ar-markers (public: true)
-- CREATE BUCKET species-models (public: true) -- if not exists
