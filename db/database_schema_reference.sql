-- =====================================================
-- MatiARBioAR Database Schema Reference
-- Generated: November 21, 2025
-- Database: Supabase PostgreSQL
-- Purpose: Complete schema documentation for reference
-- =====================================================

-- =====================================================
-- TABLE: admins
-- Purpose: Administrative user accounts with access control
-- =====================================================
CREATE TABLE public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for admins table
CREATE INDEX idx_admins_email ON public.admins(email);
CREATE INDEX idx_admins_role ON public.admins(role);

-- =====================================================
-- TABLE: profiles
-- Purpose: Extended user profile information
-- =====================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for profiles table
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_is_admin ON public.profiles(is_admin);

-- =====================================================
-- TABLE: sites
-- Purpose: Biodiversity hotspot locations and conservation sites
-- =====================================================
CREATE TABLE public.sites (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('marine', 'terrestrial', 'freshwater', 'coastal')),
    barangay TEXT,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    designation TEXT NOT NULL,
    area_hectares DECIMAL,
    lat DECIMAL(10,8) NOT NULL,
    lng DECIMAL(11,8) NOT NULL,
    elevation_range_meters INT4RANGE,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    stewardship TEXT NOT NULL,
    image_url TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    visitor_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for sites table
CREATE INDEX idx_sites_type ON public.sites(type);
CREATE INDEX idx_sites_city ON public.sites(city);
CREATE INDEX idx_sites_province ON public.sites(province);
CREATE INDEX idx_sites_lat_lng ON public.sites(lat, lng);
CREATE INDEX idx_sites_tags ON public.sites USING GIN(tags);

-- =====================================================
-- TABLE: species
-- Purpose: Comprehensive species information with AR support
-- =====================================================
CREATE TABLE public.species (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('flora', 'fauna')),
    common_name TEXT NOT NULL,
    scientific_name TEXT NOT NULL,

    -- Taxonomy fields
    kingdom TEXT,
    phylum TEXT,
    class TEXT,
    taxonomic_order TEXT,
    family TEXT,
    genus TEXT,
    species TEXT,
    authorship TEXT,
    synonyms TEXT[],

    -- Conservation and status
    conservation_status TEXT CHECK (conservation_status IN ('CR', 'EN', 'VU', 'NT', 'LC', 'DD')),
    endemic BOOLEAN NOT NULL DEFAULT FALSE,
    invasive BOOLEAN NOT NULL DEFAULT FALSE,

    -- Basic information
    description TEXT NOT NULL,
    key_facts TEXT[],

    -- Ecological information
    habitat TEXT,
    diet TEXT,
    behavior TEXT,
    reproduction TEXT,
    ecosystem_services TEXT[],
    phenology TEXT,
    interactions TEXT[],

    -- Plant-specific fields
    growth_form TEXT,
    leaf_type TEXT,
    flowering_period TEXT,
    ethnobotanical_uses TEXT[],

    -- Animal-specific fields
    mobility TEXT,
    activity_pattern TEXT,
    size TEXT,
    weight TEXT,
    lifespan TEXT,

    -- Population and conservation
    population_trend TEXT,
    threats TEXT[],
    conservation_actions TEXT[],
    legal_protection TEXT[],
    reference_sources TEXT[],

    -- Media and images
    image_urls TEXT[] NOT NULL DEFAULT '{}',

    -- AR (Augmented Reality) fields
    ar_model_url TEXT,
    ar_model_scale DECIMAL NOT NULL DEFAULT 1.0,
    ar_model_rotation JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "z": 0}',
    ar_pattern_url TEXT,
    ar_marker_image_url TEXT,
    ar_viewer_html TEXT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for species table
CREATE INDEX idx_species_category ON public.species(category);
CREATE INDEX idx_species_conservation_status ON public.species(conservation_status);
CREATE INDEX idx_species_endemic ON public.species(endemic);
CREATE INDEX idx_species_invasive ON public.species(invasive);
CREATE INDEX idx_species_ar_model_url ON public.species(ar_model_url) WHERE ar_model_url IS NOT NULL;
CREATE INDEX idx_species_ar_pattern_url ON public.species(ar_pattern_url) WHERE ar_pattern_url IS NOT NULL;
CREATE INDEX idx_species_image_urls ON public.species USING GIN(image_urls);
CREATE INDEX idx_species_synonyms ON public.species USING GIN(synonyms);
CREATE INDEX idx_species_threats ON public.species USING GIN(threats);

-- =====================================================
-- TABLE: species_sites
-- Purpose: Many-to-many relationship between species and sites
-- =====================================================
CREATE TABLE public.species_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    species_id TEXT NOT NULL REFERENCES public.species(id) ON DELETE CASCADE,
    site_id TEXT NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    highlight BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(species_id, site_id)
);

-- Indexes for species_sites table
CREATE INDEX idx_species_sites_species_id ON public.species_sites(species_id);
CREATE INDEX idx_species_sites_site_id ON public.species_sites(site_id);
CREATE INDEX idx_species_sites_highlight ON public.species_sites(highlight);

-- =====================================================
-- TABLE: distribution_records
-- Purpose: Species observation and distribution records
-- =====================================================
CREATE TABLE public.distribution_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    species_id TEXT NOT NULL REFERENCES public.species(id) ON DELETE CASCADE,
    site_id TEXT REFERENCES public.sites(id) ON DELETE SET NULL,
    observer_name TEXT,
    observer_email TEXT,
    observation_date DATE NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    abundance_estimate TEXT,
    notes TEXT,
    media_urls TEXT[] DEFAULT '{}',
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for distribution_records table
CREATE INDEX idx_distribution_records_species_id ON public.distribution_records(species_id);
CREATE INDEX idx_distribution_records_site_id ON public.distribution_records(site_id);
CREATE INDEX idx_distribution_records_observation_date ON public.distribution_records(observation_date);
CREATE INDEX idx_distribution_records_verified ON public.distribution_records(verified);
CREATE INDEX idx_distribution_records_lat_lng ON public.distribution_records(latitude, longitude);

-- =====================================================
-- TABLE: media_assets
-- Purpose: Centralized media management for images, videos, and AR models
-- =====================================================
CREATE TABLE public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'audio', 'model', 'document')),
    alt_text TEXT,
    caption TEXT,
    species_id TEXT REFERENCES public.species(id) ON DELETE SET NULL,
    site_id TEXT REFERENCES public.sites(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for media_assets table
CREATE INDEX idx_media_assets_species_id ON public.media_assets(species_id);
CREATE INDEX idx_media_assets_site_id ON public.media_assets(site_id);
CREATE INDEX idx_media_assets_uploaded_by ON public.media_assets(uploaded_by);
CREATE INDEX idx_media_assets_media_type ON public.media_assets(media_type);
CREATE INDEX idx_media_assets_is_public ON public.media_assets(is_public);

-- =====================================================
-- TABLE: feedback
-- Purpose: User feedback and contact form submissions
-- =====================================================
CREATE TABLE public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT,
    message TEXT NOT NULL,
    user_agent TEXT,
    url TEXT,
    ip_address INET,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for feedback table
CREATE INDEX idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX idx_feedback_email ON public.feedback(email);
CREATE INDEX idx_feedback_is_read ON public.feedback(is_read);
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at);

-- =====================================================
-- TABLE: analytics_events
-- Purpose: User interaction and usage analytics
-- =====================================================
CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_data JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    url TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for analytics_events table
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_event_data ON public.analytics_events USING GIN(event_data);

-- =====================================================
-- TABLE: performance_metrics
-- Purpose: Application performance monitoring
-- =====================================================
CREATE TABLE public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL,
    value DECIMAL NOT NULL,
    metadata JSONB,
    url TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance_metrics table
CREATE INDEX idx_performance_metrics_metric_type ON public.performance_metrics(metric_type);
CREATE INDEX idx_performance_metrics_created_at ON public.performance_metrics(created_at);
CREATE INDEX idx_performance_metrics_metadata ON public.performance_metrics USING GIN(metadata);

-- =====================================================
-- TABLE: team_members
-- Purpose: Team member profiles and information
-- =====================================================
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    email TEXT,
    avatar_url TEXT,
    social_links JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for team_members table
CREATE INDEX idx_team_members_is_active ON public.team_members(is_active);
CREATE INDEX idx_team_members_sort_order ON public.team_members(sort_order);

-- =====================================================
-- TABLE: activity_log
-- Purpose: Audit trail for administrative actions
-- =====================================================
CREATE TABLE public.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    action_details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for activity_log table
CREATE INDEX idx_activity_log_admin_id ON public.activity_log(admin_id);
CREATE INDEX idx_activity_log_action_type ON public.activity_log(action_type);
CREATE INDEX idx_activity_log_entity_type ON public.activity_log(entity_type);
CREATE INDEX idx_activity_log_created_at ON public.activity_log(created_at);

-- =====================================================
-- TRIGGERS: Automatic timestamp updates
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at columns
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON public.sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_species_updated_at BEFORE UPDATE ON public.species FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_distribution_records_updated_at BEFORE UPDATE ON public.distribution_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_assets_updated_at BEFORE UPDATE ON public.media_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
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

-- Admins table policies
CREATE POLICY "Admins can view their own record" ON public.admins FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Super admins can manage all admins" ON public.admins FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid() AND role = 'super_admin')
);

-- Profiles table policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Sites table policies (public read, admin write)
CREATE POLICY "Public can view sites" ON public.sites FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage sites" ON public.sites FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Species table policies (public read, admin write)
CREATE POLICY "Public can view species" ON public.species FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage species" ON public.species FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Species-sites relationship policies
CREATE POLICY "Public can view species_sites" ON public.species_sites FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage species_sites" ON public.species_sites FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Distribution records policies
CREATE POLICY "Public can view verified distribution records" ON public.distribution_records FOR SELECT TO public USING (verified = true);
CREATE POLICY "Authenticated users can create distribution records" ON public.distribution_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage all distribution records" ON public.distribution_records FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Media assets policies
CREATE POLICY "Public can view public media assets" ON public.media_assets FOR SELECT TO public USING (is_public = true);
CREATE POLICY "Authenticated users can upload media assets" ON public.media_assets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their own media assets" ON public.media_assets FOR UPDATE USING (uploaded_by = auth.uid());
CREATE POLICY "Admins can manage all media assets" ON public.media_assets FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Feedback policies (anonymous submissions allowed)
CREATE POLICY "Anyone can submit feedback" ON public.feedback FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can view and manage feedback" ON public.feedback FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Analytics policies (admin only)
CREATE POLICY "Admins can manage analytics events" ON public.analytics_events FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Performance metrics policies (admin only)
CREATE POLICY "Admins can manage performance metrics" ON public.performance_metrics FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Team members policies (public read, admin write)
CREATE POLICY "Public can view active team members" ON public.team_members FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Activity log policies (admin only)
CREATE POLICY "Admins can view activity log" ON public.activity_log FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "System can insert activity log" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (true);

-- =====================================================
-- STORAGE BUCKETS CONFIGURATION
-- =====================================================

-- Create storage buckets for media assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('species-models', 'species-models', true, 52428800, ARRAY['model/gltf-binary', 'application/octet-stream']),
    ('species-images', 'species-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('site-media', 'site-media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'video/mp4']),
    ('ar-patterns', 'ar-patterns', true, 1024000, ARRAY['text/plain', 'application/octet-stream']),
    ('ar-markers', 'ar-markers', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/jpg'])
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies
CREATE POLICY "Public can view species models" ON storage.objects FOR SELECT TO public USING (bucket_id = 'species-models');
CREATE POLICY "Authenticated users can upload species models" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'species-models');
CREATE POLICY "Admins can delete species models" ON storage.objects FOR DELETE TO authenticated USING (
    bucket_id = 'species-models' AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

CREATE POLICY "Public can view species images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'species-images');
CREATE POLICY "Authenticated users can upload species images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'species-images');
CREATE POLICY "Admins can delete species images" ON storage.objects FOR DELETE TO authenticated USING (
    bucket_id = 'species-images' AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

CREATE POLICY "Public can view site media" ON storage.objects FOR SELECT TO public USING (bucket_id = 'site-media');
CREATE POLICY "Authenticated users can upload site media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media');
CREATE POLICY "Admins can delete site media" ON storage.objects FOR DELETE TO authenticated USING (
    bucket_id = 'site-media' AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

CREATE POLICY "Public can view AR patterns" ON storage.objects FOR SELECT TO public USING (bucket_id = 'ar-patterns');
CREATE POLICY "Authenticated users can upload AR patterns" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ar-patterns');
CREATE POLICY "Admins can delete AR patterns" ON storage.objects FOR DELETE TO authenticated USING (
    bucket_id = 'ar-patterns' AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

CREATE POLICY "Public can view AR markers" ON storage.objects FOR SELECT TO public USING (bucket_id = 'ar-markers');
CREATE POLICY "Authenticated users can upload AR markers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ar-markers');
CREATE POLICY "Admins can delete AR markers" ON storage.objects FOR DELETE TO authenticated USING (
    bucket_id = 'ar-markers' AND EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- =====================================================
-- FUNCTIONS AND UTILITIES
-- =====================================================

-- Function to get species count by category
CREATE OR REPLACE FUNCTION get_species_count_by_category(category_filter TEXT DEFAULT NULL)
RETURNS TABLE(category TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.category::TEXT,
        COUNT(*)::BIGINT
    FROM public.species s
    WHERE category_filter IS NULL OR s.category = category_filter
    GROUP BY s.category
    ORDER BY s.category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get conservation status summary
CREATE OR REPLACE FUNCTION get_conservation_status_summary()
RETURNS TABLE(status TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(s.conservation_status, 'Not Evaluated')::TEXT as status,
        COUNT(*)::BIGINT
    FROM public.species s
    GROUP BY s.conservation_status
    ORDER BY
        CASE s.conservation_status
            WHEN 'CR' THEN 1
            WHEN 'EN' THEN 2
            WHEN 'VU' THEN 3
            WHEN 'NT' THEN 4
            WHEN 'LC' THEN 5
            WHEN 'DD' THEN 6
            ELSE 7
        END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search species by text
CREATE OR REPLACE FUNCTION search_species(search_term TEXT, limit_count INTEGER DEFAULT 50)
RETURNS TABLE(
    id TEXT,
    common_name TEXT,
    scientific_name TEXT,
    category TEXT,
    conservation_status TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.common_name,
        s.scientific_name,
        s.category,
        s.conservation_status,
        ts_rank_cd(to_tsvector('english', s.common_name || ' ' || s.scientific_name || ' ' || COALESCE(s.description, '')), plainto_tsquery('english', search_term)) as rank
    FROM public.species s
    WHERE to_tsvector('english', s.common_name || ' ' || s.scientific_name || ' ' || COALESCE(s.description, '')) @@ plainto_tsquery('english', search_term)
    ORDER BY rank DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INITIAL DATA (Optional - for development/testing)
-- =====================================================

-- Insert sample admin user (replace with actual UUID after user creation)
-- INSERT INTO public.admins (id, email, role) VALUES ('your-admin-uuid-here', 'admin@matiarbioar.com', 'super_admin');

-- Insert sample team member
INSERT INTO public.team_members (name, role, bio, sort_order) VALUES
('Dr. Maria Santos', 'Lead Researcher', 'PhD in Biodiversity Conservation with 15+ years experience in Philippine ecosystems.', 1),
('Dr. Antonio Reyes', 'Senior Biologist', 'Specialist in Philippine flora with extensive fieldwork in Mindanao.', 2),
('Prof. Elena Cruz', 'GIS Specialist', 'Expert in geospatial analysis and conservation mapping technologies.', 3);

-- =====================================================
-- SCHEMA INFORMATION AND COMMENTS
-- =====================================================

COMMENT ON TABLE public.admins IS 'Administrative user accounts with role-based access control';
COMMENT ON TABLE public.profiles IS 'Extended user profile information linked to auth.users';
COMMENT ON TABLE public.sites IS 'Biodiversity hotspot locations and conservation sites in Mati City';
COMMENT ON TABLE public.species IS 'Comprehensive species database with taxonomy, ecology, and AR support';
COMMENT ON TABLE public.species_sites IS 'Many-to-many relationship linking species to their habitats/sites';
COMMENT ON TABLE public.distribution_records IS 'User-submitted species observation records';
COMMENT ON TABLE public.media_assets IS 'Centralized media management for all uploaded files';
COMMENT ON TABLE public.feedback IS 'User feedback and contact form submissions';
COMMENT ON TABLE public.analytics_events IS 'User interaction and usage analytics data';
COMMENT ON TABLE public.performance_metrics IS 'Application performance monitoring metrics';
COMMENT ON TABLE public.team_members IS 'Team member profiles and information';
COMMENT ON TABLE public.activity_log IS 'Audit trail for administrative actions';

-- =====================================================
-- END OF SCHEMA
-- =====================================================

-- Notes:
-- 1. This schema is designed for Supabase PostgreSQL
-- 2. All tables use UUID primary keys where appropriate
-- 3. Row Level Security is enabled on all tables
-- 4. Automatic timestamp triggers are set up
-- 5. Comprehensive indexing for performance
-- 6. Storage buckets configured for media assets
-- 7. Utility functions provided for common queries