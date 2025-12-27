-- Add model_url column to panorama_markers table
ALTER TABLE panorama_markers 
ADD COLUMN IF NOT EXISTS model_url TEXT;

-- Create storage bucket for 3D models if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('3d-models', '3d-models', true, 52428800, ARRAY['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'])
ON CONFLICT (id) DO NOTHING;

-- Allow public access to 3d-models bucket
CREATE POLICY "Public Access 3D Models"
  ON storage.objects FOR SELECT
  USING ( bucket_id = '3d-models' );

-- Allow authenticated uploads to 3d-models bucket
CREATE POLICY "Authenticated Upload 3D Models"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = '3d-models' AND auth.role() = 'authenticated' );
