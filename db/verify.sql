-- ============================================
-- DATABASE VERIFICATION SCRIPT
-- Run this after setting up your new database
-- ============================================

-- This script verifies that all tables were created correctly
-- and shows you a summary of your database structure

-- ============================================
-- PART 1: Verify All Tables Exist
-- ============================================

SELECT 
  table_name,
  CASE 
    WHEN table_name IN (
      'admins', 'profiles', 'sites', 'species', 'species_sites',
      'distribution_records', 'media_assets', 'feedback', 
      'analytics_events', 'performance_metrics', 'team_members', 'activity_log'
    ) THEN '✅ Created'
    ELSE '❌ Missing'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'admins', 'profiles', 'sites', 'species', 'species_sites',
    'distribution_records', 'media_assets', 'feedback', 
    'analytics_events', 'performance_metrics', 'team_members', 'activity_log'
  )
ORDER BY table_name;

-- ============================================
-- PART 2: Check Row Level Security Status
-- ============================================

SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'admins', 'profiles', 'sites', 'species', 'species_sites',
    'distribution_records', 'media_assets', 'feedback', 
    'analytics_events', 'performance_metrics', 'team_members', 'activity_log'
  )
ORDER BY tablename;

-- ============================================
-- PART 3: Count Policies Per Table
-- ============================================

SELECT 
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- ============================================
-- PART 4: Verify Extensions
-- ============================================

SELECT 
  extname as extension_name,
  extversion as version,
  '✅ Installed' as status
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pgcrypto')
ORDER BY extname;

-- ============================================
-- PART 5: Check Indexes
-- ============================================

SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'admins', 'profiles', 'sites', 'species', 'species_sites',
    'distribution_records', 'media_assets', 'feedback', 
    'analytics_events', 'performance_metrics', 'team_members', 'activity_log'
  )
ORDER BY tablename, indexname;

-- ============================================
-- PART 6: Verify Functions and Triggers
-- ============================================

-- Check functions
SELECT 
  routine_name,
  routine_type,
  '✅ Created' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('handle_new_user', 'handle_admin_login', 'handle_updated_at')
ORDER BY routine_name;

-- Check triggers
SELECT 
  trigger_name,
  event_object_table as table_name,
  '✅ Created' as status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN (
    'admins', 'profiles', 'sites', 'species', 'team_members'
  )
ORDER BY event_object_table, trigger_name;

-- ============================================
-- PART 7: Check for Admin Users
-- ============================================

SELECT 
  COUNT(*) as admin_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Admin users exist'
    ELSE '⚠️ No admin users yet - add one!'
  END as status
FROM public.admins;

-- ============================================
-- PART 8: Table Row Counts (should all be 0 for clean DB)
-- ============================================

SELECT 
  'admins' as table_name, COUNT(*) as row_count FROM public.admins
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'sites', COUNT(*) FROM public.sites
UNION ALL
SELECT 'species', COUNT(*) FROM public.species
UNION ALL
SELECT 'species_sites', COUNT(*) FROM public.species_sites
UNION ALL
SELECT 'distribution_records', COUNT(*) FROM public.distribution_records
UNION ALL
SELECT 'media_assets', COUNT(*) FROM public.media_assets
UNION ALL
SELECT 'feedback', COUNT(*) FROM public.feedback
UNION ALL
SELECT 'analytics_events', COUNT(*) FROM public.analytics_events
UNION ALL
SELECT 'performance_metrics', COUNT(*) FROM public.performance_metrics
UNION ALL
SELECT 'team_members', COUNT(*) FROM public.team_members
UNION ALL
SELECT 'activity_log', COUNT(*) FROM public.activity_log
ORDER BY table_name;

-- ============================================
-- PART 9: Storage Bucket Check (if you have storage extension)
-- ============================================

-- Note: This will only work if you have access to storage schema
-- Skip if you get an error
SELECT 
  name as bucket_name,
  public as is_public,
  '✅ Created' as status
FROM storage.buckets
WHERE name IN ('media', 'ar-models')
ORDER BY name;

-- ============================================
-- VERIFICATION COMPLETE
-- ============================================

-- Expected results for a clean, new database:
-- ✅ All 12 tables created
-- ✅ RLS enabled on all tables
-- ✅ Multiple policies per table
-- ✅ Extensions installed (uuid-ossp, pgcrypto)
-- ✅ Multiple indexes created
-- ✅ 3 functions created
-- ✅ Multiple triggers created
-- ⚠️ 0 or 1 admin users (you need to add your first admin)
-- ✅ All tables empty (row count = 0)
-- ✅ Storage buckets created (media, ar-models)

-- If any items show ❌ or ⚠️, review the setup steps!
