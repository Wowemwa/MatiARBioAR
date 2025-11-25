-- Add audio_url column to species table
ALTER TABLE public.species ADD COLUMN audio_url TEXT;

-- Create index for audio_url
CREATE INDEX idx_species_audio_url ON public.species(audio_url) WHERE audio_url IS NOT NULL;

-- Create species-audio storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('species-audio', 'species-audio', true, 10485760, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'])
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket policies for species-audio
CREATE POLICY "Public can view species audio" ON storage.objects FOR SELECT TO public USING (bucket_id = 'species-audio');
CREATE POLICY "Authenticated users can upload species audio" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'species-audio');
CREATE POLICY "Admins can delete species audio" ON storage.objects FOR DELETE TO authenticated USING (
    bucket_id = 'species-audio' AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);