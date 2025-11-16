-- ============================================
-- MATI AR SYSTEM MIGRATION SCRIPT
-- Run this to upgrade existing database to AR 2.0
-- ============================================

-- IMPORTANT: Run this in Supabase SQL Editor
-- This script is safe to run multiple times (idempotent)

-- ============================================
-- STEP 1: Add AR Columns to Species Table
-- ============================================

DO $$ 
BEGIN
  -- Add image_urls array if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'species' AND column_name = 'image_urls'
  ) THEN
    ALTER TABLE public.species ADD COLUMN image_urls TEXT[] DEFAULT '{}';
    RAISE NOTICE 'Added image_urls column';
  ELSE
    RAISE NOTICE 'image_urls column already exists';
  END IF;

  -- Ensure ar_model_url exists (may already be there)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'species' AND column_name = 'ar_model_url'
  ) THEN
    ALTER TABLE public.species ADD COLUMN ar_model_url TEXT DEFAULT NULL;
    RAISE NOTICE 'Added ar_model_url column';
  ELSE
    RAISE NOTICE 'ar_model_url column already exists';
  END IF;

  -- Add ar_model_scale if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'species' AND column_name = 'ar_model_scale'
  ) THEN
    ALTER TABLE public.species ADD COLUMN ar_model_scale DECIMAL DEFAULT 1.0;
    RAISE NOTICE 'Added ar_model_scale column';
  ELSE
    RAISE NOTICE 'ar_model_scale column already exists';
  END IF;

  -- Add ar_model_rotation if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'species' AND column_name = 'ar_model_rotation'
  ) THEN
    ALTER TABLE public.species ADD COLUMN ar_model_rotation JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}';
    RAISE NOTICE 'Added ar_model_rotation column';
  ELSE
    RAISE NOTICE 'ar_model_rotation column already exists';
  END IF;

  -- Add qr_code_data if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'species' AND column_name = 'qr_code_data'
  ) THEN
    ALTER TABLE public.species ADD COLUMN qr_code_data TEXT DEFAULT NULL;
    RAISE NOTICE 'Added qr_code_data column';
  ELSE
    RAISE NOTICE 'qr_code_data column already exists';
  END IF;
END $$;

-- ============================================
-- STEP 2: Create Indexes for AR Features
-- ============================================

-- Index for AR model lookups
CREATE INDEX IF NOT EXISTS idx_species_ar_model_url 
  ON public.species(ar_model_url) 
  WHERE ar_model_url IS NOT NULL;

-- Index for QR code lookups
CREATE INDEX IF NOT EXISTS idx_species_qr_code 
  ON public.species(qr_code_data) 
  WHERE qr_code_data IS NOT NULL;

-- Index for image URLs (GIN for array search)
CREATE INDEX IF NOT EXISTS idx_species_image_urls 
  ON public.species USING GIN(image_urls);

-- ============================================
-- STEP 3: Verify Migration
-- ============================================

-- Check that all columns exist
DO $$
DECLARE
  missing_columns TEXT[] := ARRAY[]::TEXT[];
  required_columns TEXT[] := ARRAY['image_urls', 'ar_model_url', 'ar_model_scale', 'ar_model_rotation', 'qr_code_data'];
  col TEXT;
BEGIN
  FOREACH col IN ARRAY required_columns
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'species' AND column_name = col
    ) THEN
      missing_columns := array_append(missing_columns, col);
    END IF;
  END LOOP;

  IF array_length(missing_columns, 1) > 0 THEN
    RAISE EXCEPTION 'Migration failed! Missing columns: %', array_to_string(missing_columns, ', ');
  ELSE
    RAISE NOTICE '✅ Migration successful! All AR columns present.';
  END IF;
END $$;

-- Check that indexes exist
DO $$
DECLARE
  missing_indexes TEXT[] := ARRAY[]::TEXT[];
  required_indexes TEXT[] := ARRAY['idx_species_ar_model_url', 'idx_species_qr_code', 'idx_species_image_urls'];
  idx TEXT;
BEGIN
  FOREACH idx IN ARRAY required_indexes
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE tablename = 'species' AND indexname = idx
    ) THEN
      missing_indexes := array_append(missing_indexes, idx);
    END IF;
  END LOOP;

  IF array_length(missing_indexes, 1) > 0 THEN
    RAISE WARNING 'Some indexes are missing: %', array_to_string(missing_indexes, ', ');
  ELSE
    RAISE NOTICE '✅ All AR indexes created successfully!';
  END IF;
END $$;

-- ============================================
-- STEP 4: Display Current Schema
-- ============================================

-- Show AR-related columns in species table
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'species' 
  AND column_name IN ('image_urls', 'ar_model_url', 'ar_model_scale', 'ar_model_rotation', 'qr_code_data')
ORDER BY column_name;

-- Show AR-related indexes
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'species' 
  AND indexname IN ('idx_species_ar_model_url', 'idx_species_qr_code', 'idx_species_image_urls')
ORDER BY indexname;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Summary of changes:
-- ✅ Added 5 new columns for AR functionality
-- ✅ Created 3 indexes for performance
-- ✅ Verified all changes applied successfully

-- Next steps:
-- 1. Create storage buckets in Supabase Dashboard
-- 2. Run setup-storage.sql to create storage policies
-- 3. Test AR upload via Admin Panel
-- 4. Verify files appear in species-models bucket

-- Display completion message
DO $$
BEGIN
  RAISE NOTICE '╔════════════════════════════════════════╗';
  RAISE NOTICE '║   AR SYSTEM MIGRATION COMPLETED ✅     ║';
  RAISE NOTICE '╚════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Create storage buckets (species-models, species-images, site-media)';
  RAISE NOTICE '2. Run setup-storage.sql for storage policies';
  RAISE NOTICE '3. Upload test GLB model via Admin Panel';
  RAISE NOTICE '4. Generate QR codes for species';
  RAISE NOTICE '5. Test AR on mobile device';
  RAISE NOTICE '';
  RAISE NOTICE 'Read QUICK_START_AR.md for detailed instructions.';
END $$;
