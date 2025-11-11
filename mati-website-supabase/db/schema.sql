-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table (for admin authentication)
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (for regular users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Biodiversity sites/hotspots
CREATE TABLE IF NOT EXISTS public.sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('marine', 'terrestrial', 'freshwater', 'mixed')),
  barangay TEXT,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  designation TEXT,
  area_hectares DECIMAL,
  lat DECIMAL NOT NULL,
  lng DECIMAL NOT NULL,
  elevation_range_meters INT4RANGE,
  summary TEXT NOT NULL,
  description TEXT,
  features TEXT[],
  stewardship TEXT,
  image_url TEXT,
  tags TEXT[],
  visitor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Species taxonomy
CREATE TABLE IF NOT EXISTS public.species (
  id TEXT PRIMARY KEY,
  category TEXT CHECK (category IN ('flora', 'fauna')) NOT NULL,
  common_name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  kingdom TEXT,
  phylum TEXT,
  class TEXT,
  taxonomic_order TEXT,
  family TEXT,
  genus TEXT,
  species TEXT,
  authorship TEXT,
  synonyms TEXT[],
  conservation_status TEXT CHECK (conservation_status IN ('DD', 'LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX')),
  endemic BOOLEAN DEFAULT FALSE,
  invasive BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  key_facts TEXT[],
  habitat TEXT,
  diet TEXT,
  behavior TEXT,
  reproduction TEXT,
  ecosystem_services TEXT[],
  phenology TEXT,
  interactions TEXT[],
  growth_form TEXT,
  leaf_type TEXT,
  flowering_period TEXT,
  ethnobotanical_uses TEXT[],
  mobility TEXT,
  activity_pattern TEXT,
  size TEXT,
  weight TEXT,
  lifespan TEXT,
  population_trend TEXT CHECK (population_trend IN ('increasing', 'stable', 'decreasing', 'unknown')),
  threats TEXT[],
  conservation_actions TEXT[],
  legal_protection TEXT[],
  reference_sources TEXT[],
  image_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Species-site relationships (many-to-many)
CREATE TABLE IF NOT EXISTS public.species_sites (
  species_id TEXT REFERENCES public.species(id) ON DELETE CASCADE,
  site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
  is_highlight BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (species_id, site_id)
);

-- Species distribution records
CREATE TABLE IF NOT EXISTS public.distribution_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  species_id TEXT REFERENCES public.species(id) ON DELETE CASCADE,
  site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
  latitude DECIMAL,
  longitude DECIMAL,
  elevation_m DECIMAL,
  habitat_type TEXT,
  observation_date DATE,
  source TEXT,
  observer TEXT,
  abundance TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media assets
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  species_id TEXT REFERENCES public.species(id) ON DELETE CASCADE,
  site_id TEXT REFERENCES public.sites(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('image', 'video', 'model', 'audio')) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  credit TEXT,
  license TEXT,
  caption TEXT,
  bucket_name TEXT DEFAULT 'media',
  file_path TEXT,
  public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT DEFAULT 'Anonymous',
  email TEXT,
  message TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  user_agent TEXT,
  url TEXT,
  ip_address INET,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  event_data JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  url TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type TEXT NOT NULL,
  value DECIMAL NOT NULL,
  metadata JSONB,
  url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  email TEXT,
  avatar_url TEXT,
  social_links JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log for admin actions
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribution_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Admins: Only admins can view/modify admin records
DROP POLICY IF EXISTS "admins_select_own" ON public.admins;
CREATE POLICY "admins_select_own" ON public.admins FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "admins_insert_super_admin" ON public.admins;
CREATE POLICY "admins_insert_super_admin" ON public.admins FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND role = 'super_admin')
);
DROP POLICY IF EXISTS "admins_update_own" ON public.admins;
CREATE POLICY "admins_update_own" ON public.admins FOR UPDATE USING (auth.uid() = id);

-- Profiles: Users can view all profiles, modify their own
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Sites: Public read, admin write
DROP POLICY IF EXISTS "sites_select_all" ON public.sites;
CREATE POLICY "sites_select_all" ON public.sites FOR SELECT USING (true);
DROP POLICY IF EXISTS "sites_insert_admin" ON public.sites;
CREATE POLICY "sites_insert_admin" ON public.sites FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "sites_update_admin" ON public.sites;
CREATE POLICY "sites_update_admin" ON public.sites FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "sites_delete_admin" ON public.sites;
CREATE POLICY "sites_delete_admin" ON public.sites FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Species: Public read, admin write
DROP POLICY IF EXISTS "species_select_all" ON public.species;
CREATE POLICY "species_select_all" ON public.species FOR SELECT USING (true);
DROP POLICY IF EXISTS "species_insert_admin" ON public.species;
CREATE POLICY "species_insert_admin" ON public.species FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "species_update_admin" ON public.species;
CREATE POLICY "species_update_admin" ON public.species FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "species_delete_admin" ON public.species;
CREATE POLICY "species_delete_admin" ON public.species FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Species-sites: Public read, admin write
DROP POLICY IF EXISTS "species_sites_select_all" ON public.species_sites;
CREATE POLICY "species_sites_select_all" ON public.species_sites FOR SELECT USING (true);
DROP POLICY IF EXISTS "species_sites_insert_admin" ON public.species_sites;
CREATE POLICY "species_sites_insert_admin" ON public.species_sites FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "species_sites_update_admin" ON public.species_sites;
CREATE POLICY "species_sites_update_admin" ON public.species_sites FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "species_sites_delete_admin" ON public.species_sites;
CREATE POLICY "species_sites_delete_admin" ON public.species_sites FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Distribution records: Public read, admin write
DROP POLICY IF EXISTS "distribution_records_select_all" ON public.distribution_records;
CREATE POLICY "distribution_records_select_all" ON public.distribution_records FOR SELECT USING (true);
DROP POLICY IF EXISTS "distribution_records_insert_admin" ON public.distribution_records;
CREATE POLICY "distribution_records_insert_admin" ON public.distribution_records FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "distribution_records_update_admin" ON public.distribution_records;
CREATE POLICY "distribution_records_update_admin" ON public.distribution_records FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "distribution_records_delete_admin" ON public.distribution_records;
CREATE POLICY "distribution_records_delete_admin" ON public.distribution_records FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Media assets: Public read for public assets, authenticated upload
DROP POLICY IF EXISTS "media_assets_select_public" ON public.media_assets;
CREATE POLICY "media_assets_select_public" ON public.media_assets FOR SELECT USING (public = true);
DROP POLICY IF EXISTS "media_assets_select_own" ON public.media_assets;
CREATE POLICY "media_assets_select_own" ON public.media_assets FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    id IN (SELECT id FROM public.media_assets WHERE species_id IN (
      SELECT id FROM public.species WHERE id IN (
        SELECT species_id FROM public.species_sites WHERE site_id IN (
          SELECT id FROM public.sites WHERE id IN (
            SELECT site_id FROM public.distribution_records WHERE observer = auth.email()
          )
        )
      )
    ))
  )
);
DROP POLICY IF EXISTS "media_assets_insert_authenticated" ON public.media_assets;
CREATE POLICY "media_assets_insert_authenticated" ON public.media_assets FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "media_assets_update_own" ON public.media_assets;
CREATE POLICY "media_assets_update_own" ON public.media_assets FOR UPDATE USING (
  auth.uid() IS NOT NULL AND (
    id IN (SELECT id FROM public.media_assets WHERE species_id IN (
      SELECT id FROM public.species WHERE id IN (
        SELECT species_id FROM public.species_sites WHERE site_id IN (
          SELECT id FROM public.sites WHERE id IN (
            SELECT site_id FROM public.distribution_records WHERE observer = auth.email()
          )
        )
      )
    ))
  )
);

-- Feedback: Allow anonymous insert, admins can view all and delete
DROP POLICY IF EXISTS "feedback_insert_all" ON public.feedback;
CREATE POLICY "feedback_insert_all" ON public.feedback FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "feedback_select_own" ON public.feedback;
CREATE POLICY "feedback_select_own" ON public.feedback FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "feedback_select_admin" ON public.feedback;
CREATE POLICY "feedback_select_admin" ON public.feedback FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "feedback_update_admin" ON public.feedback;
CREATE POLICY "feedback_update_admin" ON public.feedback FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "feedback_delete_admin" ON public.feedback;
CREATE POLICY "feedback_delete_admin" ON public.feedback FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Analytics events: Insert for all, select for admins
DROP POLICY IF EXISTS "analytics_events_insert_all" ON public.analytics_events;
CREATE POLICY "analytics_events_insert_all" ON public.analytics_events FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "analytics_events_select_admin" ON public.analytics_events;
CREATE POLICY "analytics_events_select_admin" ON public.analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Performance metrics: Insert for all, select for admins
DROP POLICY IF EXISTS "performance_metrics_insert_all" ON public.performance_metrics;
CREATE POLICY "performance_metrics_insert_all" ON public.performance_metrics FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "performance_metrics_select_admin" ON public.performance_metrics;
CREATE POLICY "performance_metrics_select_admin" ON public.performance_metrics FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Team members: Public read, admin write
DROP POLICY IF EXISTS "team_members_select_all" ON public.team_members;
CREATE POLICY "team_members_select_all" ON public.team_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "team_members_insert_admin" ON public.team_members;
CREATE POLICY "team_members_insert_admin" ON public.team_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "team_members_update_admin" ON public.team_members;
CREATE POLICY "team_members_update_admin" ON public.team_members FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "team_members_delete_admin" ON public.team_members;
CREATE POLICY "team_members_delete_admin" ON public.team_members FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Activity log: Only admins can view
DROP POLICY IF EXISTS "activity_log_select_admin" ON public.activity_log;
CREATE POLICY "activity_log_select_admin" ON public.activity_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "activity_log_insert_admin" ON public.activity_log;
CREATE POLICY "activity_log_insert_admin" ON public.activity_log FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Functions for triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_admin_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.admins SET last_login_at = NOW() WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_admin_login ON public.admins;
CREATE TRIGGER on_admin_login
  AFTER UPDATE OF last_login_at ON public.admins
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_login();