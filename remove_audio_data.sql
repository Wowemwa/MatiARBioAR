-- SQL commands to remove audio data from species
-- This will clear the audio_url field for all species that have audio uploaded

-- Update all species to remove audio URLs
UPDATE species
SET audio_url = NULL
WHERE audio_url IS NOT NULL;

-- Optional: If you want to delete specific species' audio (replace 'species-id' with actual ID)
-- UPDATE species SET audio_url = NULL WHERE id = 'species-id';

-- Note: To delete the actual audio files from Supabase storage bucket 'species-audio',
-- you would need to use the Supabase client or API, as SQL cannot directly delete files from storage.
-- The files will remain in storage but won't be referenced anymore.

-- Check how many species had audio before cleanup
SELECT COUNT(*) as species_with_audio_cleared
FROM species
WHERE audio_url IS NOT NULL;