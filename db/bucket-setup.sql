-- ============================================
-- SUPABASE STORAGE BUCKET SETUP SCRIPT
-- Run this in Supabase SQL Editor to create buckets and policies
-- ============================================

-- ============================================
-- CREATE BUCKETS VIA SQL
-- ============================================

-- Create media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Create ar-models bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('ar-models', 'ar-models', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- MEDIA BUCKET POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Management" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Access AR" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload AR" ON storage.objects;
DROP POLICY IF EXISTS "Admin Management AR" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete AR" ON storage.objects;

-- Allow public to view media files
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Allow authenticated users to upload media
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'media' AND auth.role() = 'authenticated'
);

-- Allow admins to update/delete media
CREATE POLICY "Admin Management" ON storage.objects FOR UPDATE USING (
  bucket_id = 'media' AND EXISTS (
    SELECT 1 FROM public.admins WHERE id = auth.uid()
  )
);

CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'media' AND EXISTS (
    SELECT 1 FROM public.admins WHERE id = auth.uid()
  )
);

-- ============================================
-- AR-MODELS BUCKET POLICIES
-- ============================================

-- Allow public to view AR models
CREATE POLICY "Public Access AR" ON storage.objects FOR SELECT USING (bucket_id = 'ar-models');

-- Allow authenticated users to upload AR models
CREATE POLICY "Authenticated Upload AR" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'ar-models' AND auth.role() = 'authenticated'
);

-- Allow admins to update/delete AR models
CREATE POLICY "Admin Management AR" ON storage.objects FOR UPDATE USING (
  bucket_id = 'ar-models' AND EXISTS (
    SELECT 1 FROM public.admins WHERE id = auth.uid()
  )
);

CREATE POLICY "Admin Delete AR" ON storage.objects FOR DELETE USING (
  bucket_id = 'ar-models' AND EXISTS (
    SELECT 1 FROM public.admins WHERE id = auth.uid()
  )
);

-- ============================================
-- VERIFY BUCKET SETUP
-- ============================================

-- Check if buckets exist
SELECT id, name, public FROM storage.buckets WHERE name IN ('media', 'ar-models');

-- Check policies
SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';