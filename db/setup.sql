-- ============================================
-- MATI BIODIVERSITY DATABASE SETUP SCRIPT
-- Database: MatiARBio
-- Created: November 16, 2025
-- ============================================

-- This script creates a clean database schema for the Mati Biodiversity AR system
-- Run this in your Supabase SQL Editor after creating the new project

-- ============================================
-- STEP 1: Enable Required Extensions
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- STEP 2: Create Tables
-- ============================================

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
  image_urls TEXT[] DEFAULT '{}',
  ar_model_url TEXT DEFAULT NULL,
  ar_model_scale DECIMAL DEFAULT 1.0,
  ar_model_rotation JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
  ar_pattern_url TEXT DEFAULT NULL,
  ar_marker_image_url TEXT DEFAULT NULL,
  ar_viewer_html TEXT DEFAULT NULL,
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

-- ============================================
-- STEP 3: Enable Row Level Security
-- ============================================

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

-- ============================================
-- STEP 4: Create Row Level Security Policies
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "admins_select_own" ON public.admins;
DROP POLICY IF EXISTS "admins_insert_super_admin" ON public.admins;
DROP POLICY IF EXISTS "admins_update_own" ON public.admins;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "sites_select_all" ON public.sites;
DROP POLICY IF EXISTS "sites_insert_admin" ON public.sites;
DROP POLICY IF EXISTS "sites_update_admin" ON public.sites;
DROP POLICY IF EXISTS "sites_delete_admin" ON public.sites;
DROP POLICY IF EXISTS "species_select_all" ON public.species;
DROP POLICY IF EXISTS "species_insert_admin" ON public.species;
DROP POLICY IF EXISTS "species_update_admin" ON public.species;
DROP POLICY IF EXISTS "species_delete_admin" ON public.species;
DROP POLICY IF EXISTS "species_sites_select_all" ON public.species_sites;
DROP POLICY IF EXISTS "species_sites_insert_admin" ON public.species_sites;
DROP POLICY IF EXISTS "species_sites_update_admin" ON public.species_sites;
DROP POLICY IF EXISTS "species_sites_delete_admin" ON public.species_sites;
DROP POLICY IF EXISTS "distribution_records_select_all" ON public.distribution_records;
DROP POLICY IF EXISTS "distribution_records_insert_admin" ON public.distribution_records;
DROP POLICY IF EXISTS "distribution_records_update_admin" ON public.distribution_records;
DROP POLICY IF EXISTS "distribution_records_delete_admin" ON public.distribution_records;
DROP POLICY IF EXISTS "media_assets_select_public" ON public.media_assets;
DROP POLICY IF EXISTS "media_assets_select_own" ON public.media_assets;
DROP POLICY IF EXISTS "media_assets_insert_authenticated" ON public.media_assets;
DROP POLICY IF EXISTS "media_assets_update_admin" ON public.media_assets;
DROP POLICY IF EXISTS "media_assets_delete_admin" ON public.media_assets;
DROP POLICY IF EXISTS "feedback_insert_all" ON public.feedback;
DROP POLICY IF EXISTS "feedback_select_own" ON public.feedback;
DROP POLICY IF EXISTS "feedback_select_admin" ON public.feedback;
DROP POLICY IF EXISTS "feedback_update_admin" ON public.feedback;
DROP POLICY IF EXISTS "feedback_delete_admin" ON public.feedback;
DROP POLICY IF EXISTS "analytics_events_insert_all" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics_events_select_admin" ON public.analytics_events;
DROP POLICY IF EXISTS "performance_metrics_insert_all" ON public.performance_metrics;
DROP POLICY IF EXISTS "performance_metrics_select_admin" ON public.performance_metrics;
DROP POLICY IF EXISTS "team_members_select_all" ON public.team_members;
DROP POLICY IF EXISTS "team_members_insert_admin" ON public.team_members;
DROP POLICY IF EXISTS "team_members_update_admin" ON public.team_members;
DROP POLICY IF EXISTS "team_members_delete_admin" ON public.team_members;
DROP POLICY IF EXISTS "activity_log_select_admin" ON public.activity_log;
DROP POLICY IF EXISTS "activity_log_insert_admin" ON public.activity_log;

-- Admins: Only admins can view/modify admin records
CREATE POLICY "admins_select_own" ON public.admins 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "admins_insert_super_admin" ON public.admins 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "admins_update_own" ON public.admins 
  FOR UPDATE USING (auth.uid() = id);

-- Profiles: Users can view all profiles, modify their own
CREATE POLICY "profiles_select_all" ON public.profiles 
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Sites: Public read, admin write
CREATE POLICY "sites_select_all" ON public.sites 
  FOR SELECT USING (true);

CREATE POLICY "sites_insert_admin" ON public.sites 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "sites_update_admin" ON public.sites 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "sites_delete_admin" ON public.sites 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Species: Public read, admin write
CREATE POLICY "species_select_all" ON public.species 
  FOR SELECT USING (true);

CREATE POLICY "species_insert_admin" ON public.species 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "species_update_admin" ON public.species 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "species_delete_admin" ON public.species 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Species-sites: Public read, admin write
CREATE POLICY "species_sites_select_all" ON public.species_sites 
  FOR SELECT USING (true);

CREATE POLICY "species_sites_insert_admin" ON public.species_sites 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "species_sites_update_admin" ON public.species_sites 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "species_sites_delete_admin" ON public.species_sites 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Distribution records: Public read, admin write
CREATE POLICY "distribution_records_select_all" ON public.distribution_records 
  FOR SELECT USING (true);

CREATE POLICY "distribution_records_insert_admin" ON public.distribution_records 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "distribution_records_update_admin" ON public.distribution_records 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "distribution_records_delete_admin" ON public.distribution_records 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Media assets: Public read for public assets, authenticated upload
CREATE POLICY "media_assets_select_public" ON public.media_assets 
  FOR SELECT USING (public = true);

CREATE POLICY "media_assets_select_own" ON public.media_assets 
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "media_assets_insert_authenticated" ON public.media_assets 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "media_assets_update_admin" ON public.media_assets 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "media_assets_delete_admin" ON public.media_assets 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Feedback: Allow anonymous insert, admins can view all
CREATE POLICY "feedback_insert_all" ON public.feedback 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "feedback_select_own" ON public.feedback 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "feedback_select_admin" ON public.feedback 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "feedback_update_admin" ON public.feedback 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "feedback_delete_admin" ON public.feedback 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Analytics events: Insert for all, select for admins
CREATE POLICY "analytics_events_insert_all" ON public.analytics_events 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "analytics_events_select_admin" ON public.analytics_events 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Performance metrics: Insert for all, select for admins
CREATE POLICY "performance_metrics_insert_all" ON public.performance_metrics 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "performance_metrics_select_admin" ON public.performance_metrics 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Team members: Public read, admin write
CREATE POLICY "team_members_select_all" ON public.team_members 
  FOR SELECT USING (true);

CREATE POLICY "team_members_insert_admin" ON public.team_members 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "team_members_update_admin" ON public.team_members 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "team_members_delete_admin" ON public.team_members 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Activity log: Only admins can view and insert
CREATE POLICY "activity_log_select_admin" ON public.activity_log 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "activity_log_insert_admin" ON public.activity_log 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- ============================================
-- STEP 5: Create Functions and Triggers
-- ============================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update admin last login
CREATE OR REPLACE FUNCTION public.handle_admin_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.admins SET last_login_at = NOW() WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get admin info
CREATE OR REPLACE FUNCTION public.get_admin_info(user_uuid UUID)
RETURNS TABLE(id UUID, email TEXT, role TEXT, last_login_at TIMESTAMPTZ) AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.email, a.role, a.last_login_at
  FROM public.admins a
  WHERE a.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to authenticate admin
CREATE OR REPLACE FUNCTION public.authenticate_admin(user_uuid UUID)
RETURNS TABLE(is_admin BOOLEAN, role TEXT) AS $$
DECLARE
  admin_exists BOOLEAN := false;
  admin_role TEXT := '';
BEGIN
  -- Check if user is admin
  SELECT EXISTS(SELECT 1 FROM public.admins WHERE id = user_uuid) INTO admin_exists;
  
  IF admin_exists THEN
    -- Update last login time
    UPDATE public.admins SET last_login_at = NOW() WHERE id = user_uuid;
    
    -- Get role
    SELECT a.role INTO admin_role FROM public.admins a WHERE a.id = user_uuid;
  END IF;
  
  RETURN QUERY SELECT admin_exists, admin_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at columns
DROP TRIGGER IF EXISTS handle_updated_at_admins ON public.admins;
CREATE TRIGGER handle_updated_at_admins
  BEFORE UPDATE ON public.admins
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_sites ON public.sites;
CREATE TRIGGER handle_updated_at_sites
  BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_species ON public.species;
CREATE TRIGGER handle_updated_at_species
  BEFORE UPDATE ON public.species
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_team_members ON public.team_members;
CREATE TRIGGER handle_updated_at_team_members
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- STEP 6: Create Indexes for Performance
-- ============================================

-- Indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_species_sites_species_id ON public.species_sites(species_id);
CREATE INDEX IF NOT EXISTS idx_species_sites_site_id ON public.species_sites(site_id);
CREATE INDEX IF NOT EXISTS idx_distribution_records_species_id ON public.distribution_records(species_id);
CREATE INDEX IF NOT EXISTS idx_distribution_records_site_id ON public.distribution_records(site_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_species_id ON public.media_assets(species_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_site_id ON public.media_assets(site_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_admin_id ON public.activity_log(admin_id);

-- Indexes on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_species_category ON public.species(category);
CREATE INDEX IF NOT EXISTS idx_species_conservation_status ON public.species(conservation_status);
CREATE INDEX IF NOT EXISTS idx_species_endemic ON public.species(endemic);
CREATE INDEX IF NOT EXISTS idx_sites_type ON public.sites(type);
CREATE INDEX IF NOT EXISTS idx_sites_city ON public.sites(city);
CREATE INDEX IF NOT EXISTS idx_sites_province ON public.sites(province);
CREATE INDEX IF NOT EXISTS idx_feedback_is_read ON public.feedback(is_read);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON public.team_members(is_active);

-- GIN indexes for array columns
CREATE INDEX IF NOT EXISTS idx_species_image_urls ON public.species USING GIN(image_urls);
CREATE INDEX IF NOT EXISTS idx_sites_features ON public.sites USING GIN(features);
CREATE INDEX IF NOT EXISTS idx_sites_tags ON public.sites USING GIN(tags);

-- Indexes for AR features
CREATE INDEX IF NOT EXISTS idx_species_ar_model_url ON public.species(ar_model_url) WHERE ar_model_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_species_ar_pattern ON public.species(ar_pattern_url) WHERE ar_pattern_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_species_ar_marker ON public.species(ar_marker_image_url) WHERE ar_marker_image_url IS NOT NULL;

-- ============================================
-- STEP 7: Create Storage Buckets (Run separately in Supabase Dashboard)
-- ============================================

-- NOTE: You need to create these storage buckets manually in Supabase Dashboard:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a bucket named "media" (public)
-- 3. Create a bucket named "ar-models" (public)
-- 4. Set appropriate policies for each bucket

-- Example storage policies (apply in Storage > Policies):
-- Bucket: media
--   - Allow public SELECT
--   - Allow authenticated INSERT
--   - Allow admin UPDATE/DELETE

-- ============================================
-- STEP 8: Create Default Admin User
-- ============================================

-- IMPORTANT: First create the auth user in Supabase Dashboard
-- Then run this to add them to admins table:

-- Replace this UUID with the actual User ID from Supabase Authentication > Users
INSERT INTO public.admins (id, email, role, created_at, updated_at)
VALUES (
  '99485cec-feff-4fe3-ba24-df72e729ea42',  -- Updated with your provided admin UID
  'rey.loremia@dorsu.edu.ph',
  'super_admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Verify admin was created
SELECT id, email, role, created_at 
FROM public.admins 
WHERE email = 'rey.loremia@dorsu.edu.ph';

-- ============================================
-- DATABASE SETUP COMPLETE
-- ============================================

-- Next steps:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" (or "Invite User")
-- 3. Create user with:
--    Email: rey@gmail.com
--    Password: Rey21 (or your preferred password)
--    Check "Auto Confirm User"
-- 4. Copy the generated User UUID
-- 5. Update line 538 above with the copied UUID
-- 6. Run this entire script in SQL Editor
-- 7. Test login at your website
