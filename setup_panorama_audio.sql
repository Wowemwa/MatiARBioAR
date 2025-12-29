-- Run this SQL in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new

-- Step 1: Add audio_url column to sites table (for site-wide background music)
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Step 2: Create the panorama_audio storage bucket
-- Note: This INSERT will fail if bucket already exists, which is fine
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'panorama_audio', 
  'panorama_audio', 
  true,
  10485760, -- 10MB limit
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Set up storage policies for panorama_audio bucket
-- Delete existing policies first (if any)
DROP POLICY IF EXISTS "Anyone can view panorama audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload panorama audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update panorama audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete panorama audio" ON storage.objects;

-- Allow public viewing
CREATE POLICY "Anyone can view panorama audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'panorama_audio');

-- Allow authenticated uploads
CREATE POLICY "Authenticated users can upload panorama audio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'panorama_audio');

-- Allow authenticated updates
CREATE POLICY "Authenticated users can update panorama audio"
ON storage.objects FOR UPDATE
USING (bucket_id = 'panorama_audio');

-- Allow authenticated deletes
CREATE POLICY "Authenticated users can delete panorama audio"
ON storage.objects FOR DELETE
USING (bucket_id = 'panorama_audio');

-- Done! You can now upload audio files to sites.
-- Audio will play continuously across all panoramas in the same site.
