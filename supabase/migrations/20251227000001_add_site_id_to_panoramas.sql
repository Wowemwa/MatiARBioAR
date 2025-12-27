-- Add site_id to panoramas table to link with sites (hotspots)
ALTER TABLE panoramas 
ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES sites(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_panoramas_site_id ON panoramas(site_id);
