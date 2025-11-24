-- Create table for tracking admin activity logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('create', 'update', 'delete', 'login', 'logout', 'admin_action')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('species', 'site', 'team_member', 'admin', 'user')),
  entity_id TEXT,
  entity_name TEXT,
  details TEXT,
  user_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON public.activity_logs (type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON public.activity_logs (entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs (user_id);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read activity logs
CREATE POLICY "Admins can read activity logs" ON public.activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create policy for inserting activity logs (authenticated users)
CREATE POLICY "Authenticated users can insert activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create function to log admin activity
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  p_type TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT DEFAULT NULL,
  p_entity_name TEXT DEFAULT NULL,
  p_details TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id TEXT;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid()::TEXT;

  -- Insert activity log
  INSERT INTO public.activity_logs (
    type,
    entity_type,
    entity_id,
    entity_name,
    details,
    user_id,
    ip_address,
    user_agent
  ) VALUES (
    p_type,
    p_entity_type,
    p_entity_id,
    p_entity_name,
    p_details,
    current_user_id,
    p_ip_address,
    p_user_agent
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.log_admin_activity(TEXT, TEXT, TEXT, TEXT, TEXT, INET, TEXT) TO authenticated;