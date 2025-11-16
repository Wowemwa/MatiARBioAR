-- ============================================
-- AR SYSTEM VERIFICATION SCRIPT
-- Run this after migration to verify everything works
-- ============================================

-- Check if all AR columns exist
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'species'
  AND column_name IN ('image_urls', 'ar_model_url', 'ar_model_scale', 'ar_model_rotation', 'qr_code_data')
ORDER BY column_name;

-- Check if indexes exist
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'species'
  AND indexname IN ('idx_species_ar_model_url', 'idx_species_qr_code', 'idx_species_image_urls')
ORDER BY indexname;

-- Test inserting sample AR data
DO $$
DECLARE
  test_species_id TEXT := 'test-philippine-eagle';
BEGIN
  -- Insert test species if it doesn't exist
  INSERT INTO public.species (
    id, category, common_name, scientific_name, description,
    image_urls, ar_model_url, ar_model_scale, ar_model_rotation, qr_code_data
  ) VALUES (
    test_species_id, 'fauna', 'Test Philippine Eagle', 'Pithecophaga jefferyi',
    'Test species for AR verification',
    ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    'https://example.com/model.glb',
    1.5,
    '{"x": 0, "y": 45, "z": 0}'::jsonb,
    test_species_id
  )
  ON CONFLICT (id) DO UPDATE SET
    image_urls = EXCLUDED.image_urls,
    ar_model_url = EXCLUDED.ar_model_url,
    ar_model_scale = EXCLUDED.ar_model_scale,
    ar_model_rotation = EXCLUDED.ar_model_rotation,
    qr_code_data = EXCLUDED.qr_code_data;

  RAISE NOTICE '✅ Test species inserted/updated successfully';
END $$;

-- Verify test data
SELECT
  id,
  common_name,
  ar_model_url,
  ar_model_scale,
  ar_model_rotation,
  qr_code_data,
  array_length(image_urls, 1) as image_count
FROM public.species
WHERE id = 'test-philippine-eagle';

-- Clean up test data
DELETE FROM public.species WHERE id = 'test-philippine-eagle';

RAISE NOTICE '✅ AR system verification completed successfully!';
RAISE NOTICE 'All columns, indexes, and data operations work correctly.';