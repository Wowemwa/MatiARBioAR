-- Add model_url column to panorama_markers table
ALTER TABLE panorama_markers 
ADD COLUMN IF NOT EXISTS model_url TEXT;

-- Create storage bucket for 3D models if it doesn't exist
-- Using 'models_3d' to avoid potential parser issues with starting numbers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('models_3d', 'models_3d', true, 52428800, ARRAY['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'])
ON CONFLICT (id) DO NOTHING;

-- Allow public access to models_3d bucket
CREATE POLICY "Public Access 3D Models"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'models_3d' );

-- Allow authenticated uploads to models_3d bucket
CREATE POLICY "Authenticated Upload 3D Models"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'models_3d' AND auth.role() = 'authenticated' );
