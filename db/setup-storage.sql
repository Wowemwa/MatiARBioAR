-- ============================================
-- MATI BIODIVERSITY STORAGE SETUP
-- Configure Supabase Storage for Species Assets
-- ============================================

-- IMPORTANT: Storage buckets must be created manually in Supabase Dashboard
-- This script only creates the storage policies

-- ============================================
-- STEP 1: Create Storage Buckets (Manual)
-- ============================================

-- Go to Supabase Dashboard > Storage > Create Bucket
-- Create the following buckets:

-- 1. Bucket Name: species-images
--    Description: Species photos and illustrations
--    Public: YES
--    File Size Limit: 5MB
--    Allowed MIME types: image/jpeg, image/png, image/webp, image/avif

-- 2. Bucket Name: species-models
--    Description: 3D AR models (.glb files)
--    Public: YES
--    File Size Limit: 50MB
--    Allowed MIME types: model/gltf-binary, application/octet-stream

-- 3. Bucket Name: ar-patterns
--    Description: AR.js pattern files (.patt)
--    Public: YES
--    File Size Limit: 1MB
--    Allowed MIME types: text/plain, application/octet-stream

-- 4. Bucket Name: ar-markers
--    Description: AR marker images to display for scanning
--    Public: YES
--    File Size Limit: 2MB
--    Allowed MIME types: image/png, image/jpeg, image/jpg

-- 5. Bucket Name: site-media
--    Description: Conservation site photos and media
--    Public: YES
--    File Size Limit: 10MB
--    Allowed MIME types: image/jpeg, image/png, image/webp, video/mp4

-- ============================================
-- STEP 2: Create Storage Policies
-- ============================================

-- === SPECIES IMAGES BUCKET ===

-- Allow public to view all images
CREATE POLICY "Public can view species images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'species-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload species images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'species-images');

-- Allow admins to update images
CREATE POLICY "Admins can update species images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'species-images' AND
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Allow admins to delete images
CREATE POLICY "Admins can delete species images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'species-images' AND
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- === SPECIES MODELS BUCKET ===

-- Allow public to view all 3D models
CREATE POLICY "Public can view species models"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'species-models');

-- Allow authenticated users to upload models
CREATE POLICY "Authenticated users can upload species models"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'species-models');

-- Allow admins to update models
CREATE POLICY "Admins can update species models"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'species-models' AND
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Allow admins to delete models
CREATE POLICY "Admins can delete species models"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'species-models' AND
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- === AR PATTERNS BUCKET ===

-- Allow public to view all AR patterns
CREATE POLICY "Public can view ar patterns"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'ar-patterns');

-- Allow authenticated users to upload patterns
CREATE POLICY "Authenticated users can upload ar patterns"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ar-patterns');

-- Allow admins to update patterns
CREATE POLICY "Admins can update ar patterns"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ar-patterns' AND
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Allow admins to delete patterns
CREATE POLICY "Admins can delete ar patterns"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'ar-patterns' AND
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- === AR MARKERS BUCKET ===

-- Allow public to view all AR markers
CREATE POLICY "Public can view ar markers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'ar-markers');

-- Allow authenticated users to upload markers
CREATE POLICY "Authenticated users can upload ar markers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ar-markers');

-- Allow admins to update markers
CREATE POLICY "Admins can update ar markers"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'ar-markers' AND
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Allow admins to delete markers
CREATE POLICY "Admins can delete ar markers"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'ar-markers' AND
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- === SITE MEDIA BUCKET ===

-- Allow public to view all site media
CREATE POLICY "Public can view site media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-media');

-- Allow authenticated users to upload site media
CREATE POLICY "Authenticated users can upload site media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-media');

-- Allow admins to update site media
CREATE POLICY "Admins can update site media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-media' AND
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Allow admins to delete site media
CREATE POLICY "Admins can delete site media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-media' AND
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- ============================================
-- STEP 3: Update Species Table for AR Models
-- ============================================

-- Add columns if they don't exist
ALTER TABLE public.species 
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ar_model_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ar_model_scale DECIMAL DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS ar_model_rotation JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
ADD COLUMN IF NOT EXISTS ar_pattern_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ar_marker_image_url TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ar_viewer_html TEXT DEFAULT NULL;

-- Create indexes for AR model lookups
CREATE INDEX IF NOT EXISTS idx_species_ar_model_url ON public.species(ar_model_url) WHERE ar_model_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_species_ar_pattern ON public.species(ar_pattern_url) WHERE ar_pattern_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_species_ar_marker ON public.species(ar_marker_image_url) WHERE ar_marker_image_url IS NOT NULL;

-- ============================================
-- STEP 4: Create Helper Function for Asset URLs
-- ============================================

-- Function to generate storage URLs
CREATE OR REPLACE FUNCTION public.get_species_asset_url(
  species_id TEXT,
  asset_type TEXT, -- 'image' or 'model'
  file_extension TEXT DEFAULT 'jpg'
)
RETURNS TEXT AS $$
DECLARE
  bucket_name TEXT;
  file_path TEXT;
BEGIN
  -- Determine bucket based on asset type
  IF asset_type = 'image' THEN
    bucket_name := 'species-images';
    file_path := species_id || '/' || species_id || '-main.' || file_extension;
  ELSIF asset_type = 'model' THEN
    bucket_name := 'species-models';
    file_path := species_id || '/' || species_id || '.glb';
  ELSE
    RETURN NULL;
  END IF;

  -- Return public URL
  RETURN 'https://' || current_setting('app.settings.supabase_url') || '/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STORAGE CONFIGURATION COMPLETE
-- ============================================

-- IMPORTANT NEXT STEPS:
-- 1. Manually create the three storage buckets in Supabase Dashboard
-- 2. Run this script to create storage policies
-- 3. Verify policies by testing file uploads through the website

-- Storage folder structure for each species:
-- species-images/{species-id}/{species-id}-main.jpg      (Primary image)
-- species-images/{species-id}/{species-id}-1.jpg         (Additional images)
-- species-images/{species-id}/{species-id}-2.jpg         (Additional images)
-- species-models/{species-id}/{species-id}.glb           (3D AR model)
-- ar-patterns/{species-id}/{species-id}.patt             (AR.js pattern file)
-- ar-markers/{species-id}/{species-id}-marker.png        (AR marker image)

-- Example:
-- species-images/philippine-eagle/philippine-eagle-main.jpg
-- species-images/philippine-eagle/philippine-eagle-1.jpg
-- species-models/philippine-eagle/philippine-eagle.glb
-- ar-patterns/philippine-eagle/philippine-eagle.patt
-- ar-markers/philippine-eagle/philippine-eagle-marker.png
