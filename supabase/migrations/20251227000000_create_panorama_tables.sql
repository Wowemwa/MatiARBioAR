-- Create panoramas table
CREATE TABLE IF NOT EXISTS panoramas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT false,
  initial_view_h NUMERIC DEFAULT 0,
  initial_view_v NUMERIC DEFAULT 0,
  initial_fov NUMERIC DEFAULT 75,
  location_lat NUMERIC,
  location_lng NUMERIC,
  floor_plan_x NUMERIC DEFAULT 0,
  floor_plan_y NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create panorama_links table (connections between panoramas)
CREATE TABLE IF NOT EXISTS panorama_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_panorama_id UUID REFERENCES panoramas(id) ON DELETE CASCADE,
  to_panorama_id UUID REFERENCES panoramas(id) ON DELETE CASCADE,
  position_x NUMERIC NOT NULL,
  position_y NUMERIC NOT NULL,
  position_z NUMERIC NOT NULL,
  rotation_y NUMERIC DEFAULT 0,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create panorama_markers table (interactive spots within a panorama)
CREATE TABLE IF NOT EXISTS panorama_markers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  panorama_id UUID REFERENCES panoramas(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'info', -- 'info', 'image', 'video'
  position_x NUMERIC NOT NULL,
  position_y NUMERIC NOT NULL,
  position_z NUMERIC NOT NULL,
  title TEXT,
  content TEXT,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE panoramas ENABLE ROW LEVEL SECURITY;
ALTER TABLE panorama_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE panorama_markers ENABLE ROW LEVEL SECURITY;

-- Create policies (allow read for everyone, write for authenticated users/admins)
CREATE POLICY "Allow public read access on panoramas" ON panoramas FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on panoramas" ON panoramas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on panoramas" ON panoramas FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on panoramas" ON panoramas FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access on panorama_links" ON panorama_links FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on panorama_links" ON panorama_links FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on panorama_links" ON panorama_links FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on panorama_links" ON panorama_links FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access on panorama_markers" ON panorama_markers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on panorama_markers" ON panorama_markers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on panorama_markers" ON panorama_markers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on panorama_markers" ON panorama_markers FOR DELETE USING (auth.role() = 'authenticated');
