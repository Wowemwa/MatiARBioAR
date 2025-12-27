-- Create the 'panoramas' storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('panoramas', 'panoramas', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Set up security policies for the 'panoramas' bucket
CREATE POLICY "Give public access to panoramas" ON storage.objects
  FOR SELECT USING (bucket_id = 'panoramas');

CREATE POLICY "Allow authenticated uploads to panoramas" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'panoramas' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated updates to panoramas" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'panoramas' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated deletes to panoramas" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'panoramas' AND
    auth.role() = 'authenticated'
  );
