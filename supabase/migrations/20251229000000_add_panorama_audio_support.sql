-- Add audio support to panoramas
ALTER TABLE panoramas
ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Create audio storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('panorama_audio', 'panorama_audio', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for panorama_audio bucket
CREATE POLICY "Anyone can view panorama audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'panorama_audio');

CREATE POLICY "Authenticated users can upload panorama audio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'panorama_audio' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update panorama audio"
ON storage.objects FOR UPDATE
USING (bucket_id = 'panorama_audio' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete panorama audio"
ON storage.objects FOR DELETE
USING (bucket_id = 'panorama_audio' AND auth.role() = 'authenticated');
