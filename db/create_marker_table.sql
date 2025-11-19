-- Supabase SQL: Table for storing AR markers
CREATE TABLE species_markers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    species_id text NOT NULL,
    marker_url text, -- URL or base64 string
    marker_type text, -- e.g. 'image', 'pattern', 'mind', etc.
    uploaded_at timestamptz DEFAULT now(),
    uploaded_by text -- admin user id or name
);

-- Index for fast lookup by species
CREATE INDEX idx_species_markers_species_id ON species_markers(species_id);

-- Example: To store a marker, insert species_id, marker_url, marker_type, and uploaded_by.