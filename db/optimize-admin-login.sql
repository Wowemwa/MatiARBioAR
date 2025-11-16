-- ============================================
-- ADMIN LOGIN PERFORMANCE OPTIMIZATION
-- Fix slow admin authentication issues
-- ============================================

-- Step 1: Add performance indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON public.admins(role);
CREATE INDEX IF NOT EXISTS idx_admins_last_login ON public.admins(last_login_at);

-- Step 2: Create optimized admin check function
-- This bypasses RLS for faster admin verification
CREATE OR REPLACE FUNCTION public.is_user_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  -- Direct query without RLS overhead for performance
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create fast admin lookup function
CREATE OR REPLACE FUNCTION public.get_admin_info(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE (
  id UUID,
  email TEXT,
  role TEXT,
  last_login_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Direct query for admin info
  RETURN QUERY
  SELECT a.id, a.email, a.role, a.last_login_at
  FROM public.admins a
  WHERE a.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Optimize RLS policies for better performance
-- Drop existing slow policies
DROP POLICY IF EXISTS "admins_select_own" ON public.admins;
DROP POLICY IF EXISTS "admins_update_own" ON public.admins;

-- Create optimized policies
CREATE POLICY "admins_select_own_optimized" ON public.admins
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "admins_update_own_optimized" ON public.admins
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Step 5: Create admin login tracking function
CREATE OR REPLACE FUNCTION public.update_admin_login(user_uuid UUID DEFAULT auth.uid())
RETURNS VOID AS $$
BEGIN
  UPDATE public.admins
  SET last_login_at = NOW(), updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create fast admin authentication function
-- This combines the admin check and login update in one call
CREATE OR REPLACE FUNCTION public.authenticate_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE (
  is_admin BOOLEAN,
  email TEXT,
  role TEXT
) AS $$
DECLARE
  admin_record RECORD;
BEGIN
  -- Check if user is admin and get their info
  SELECT a.id, a.email, a.role INTO admin_record
  FROM public.admins a
  WHERE a.id = user_uuid;

  IF FOUND THEN
    -- Update login time
    UPDATE public.admins
    SET last_login_at = NOW(), updated_at = NOW()
    WHERE id = user_uuid;

    -- Return success
    RETURN QUERY SELECT TRUE, admin_record.email, admin_record.role;
  ELSE
    -- Return failure
    RETURN QUERY SELECT FALSE, NULL::TEXT, NULL::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_user_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_info(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_admin_login(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.authenticate_admin(UUID) TO authenticated;

-- Step 8: Analyze table for query optimization
ANALYZE public.admins;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check indexes
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'admins'
ORDER BY indexname;

-- Check function performance
SELECT
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('is_user_admin', 'get_admin_info', 'update_admin_login', 'authenticate_admin')
ORDER BY p.proname;

-- Test admin count
SELECT
    'Admin users count' as metric,
    COUNT(*) as value
FROM public.admins;

-- ============================================
-- USAGE INSTRUCTIONS
-- ============================================

/*
To use the optimized functions in your application:

1. Replace the slow admin check in AdminContext.tsx:

   OLD (slow):
   const { data: adminData, error: adminError } = await supabase
     .from('admins')
     .select('id')
     .eq('id', data.user.id)
     .single();

   NEW (fast):
   const { data: adminData, error: adminError } = await supabase
     .rpc('authenticate_admin', { user_uuid: data.user.id });

   if (adminData && adminData[0]?.is_admin) {
     // User is admin
     setLastLoginAt(new Date().toISOString());
   }

2. Or use the simpler check:
   const { data: isAdmin } = await supabase
     .rpc('is_user_admin', { user_uuid: data.user.id });

This should reduce login time from ~3-5 seconds to ~0.5-1 second.
*/