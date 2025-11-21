-- ============================================
-- SITE VISITS TRACKING TABLE
-- For tracking unique device visits to the website
-- Created: November 21, 2025
-- ============================================

-- Create site_visits table for tracking unique visits
CREATE TABLE IF NOT EXISTS public.site_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id TEXT NOT NULL UNIQUE, -- Unique identifier for each device/browser
  ip_address INET,
  user_agent TEXT,
  first_visit_at TIMESTAMPTZ DEFAULT NOW(),
  last_visit_at TIMESTAMPTZ DEFAULT NOW(),
  visit_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anonymous insert (for tracking visits)
CREATE POLICY "site_visits_insert_all" ON public.site_visits
  FOR INSERT WITH CHECK (true);

-- Allow anonymous update for existing visitor_id (to update visit count)
CREATE POLICY "site_visits_update_own_visitor" ON public.site_visits
  FOR UPDATE USING (true);

-- Only admins can select/view the data
CREATE POLICY "site_visits_select_admin" ON public.site_visits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_site_visits_visitor_id ON public.site_visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_site_visits_first_visit_at ON public.site_visits(first_visit_at);
CREATE INDEX IF NOT EXISTS idx_site_visits_last_visit_at ON public.site_visits(last_visit_at);

-- Create function to track site visits
CREATE OR REPLACE FUNCTION public.track_site_visit(
  p_visitor_id TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  total_visitors INTEGER;
BEGIN
  -- Try to update existing visitor
  UPDATE public.site_visits
  SET
    visit_count = site_visits.visit_count + 1,
    last_visit_at = NOW(),
    updated_at = NOW(),
    ip_address = COALESCE(p_ip_address, site_visits.ip_address),
    user_agent = COALESCE(p_user_agent, site_visits.user_agent)
  WHERE visitor_id = p_visitor_id;

  -- If no row was updated, insert new visitor
  IF NOT FOUND THEN
    INSERT INTO public.site_visits (visitor_id, ip_address, user_agent)
    VALUES (p_visitor_id, p_ip_address, p_user_agent);
  END IF;

  -- Return the total number of unique visitors
  SELECT COUNT(*) INTO total_visitors FROM public.site_visits;
  RETURN total_visitors;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get total unique visitors count
CREATE OR REPLACE FUNCTION public.get_total_visitors()
RETURNS INTEGER AS $$
DECLARE
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM public.site_visits;
  RETURN total_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.track_site_visit(TEXT, INET, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_total_visitors() TO anon;