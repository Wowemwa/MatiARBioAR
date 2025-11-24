-- Create table for tracking site visits
CREATE TABLE IF NOT EXISTS public.site_visits (
  id SERIAL PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(visitor_id, visit_date)
);

-- Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting visits
CREATE POLICY "Anyone can insert site visits" ON public.site_visits
  FOR INSERT WITH CHECK (true);

-- Create policy for reading visit counts (only aggregated data)
CREATE POLICY "Anyone can read aggregated visit data" ON public.site_visits
  FOR SELECT USING (false); -- No direct reads, only through function

-- Create function to track site visits and return total count
CREATE OR REPLACE FUNCTION public.track_site_visit(
  p_visitor_id TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_visitors INTEGER;
BEGIN
  -- Insert the visit record (will be ignored if visitor already visited today due to UNIQUE constraint)
  INSERT INTO public.site_visits (visitor_id, ip_address, user_agent)
  VALUES (p_visitor_id, p_ip_address, p_user_agent)
  ON CONFLICT (visitor_id, visit_date)
  DO NOTHING;

  -- Count unique visitors (unique visitor_ids)
  SELECT COUNT(DISTINCT visitor_id) INTO total_visitors
  FROM public.site_visits;

  RETURN total_visitors;
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.track_site_visit(TEXT, INET, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.track_site_visit(TEXT, INET, TEXT) TO anon;