-- ============================================
-- ADMIN LOGIN DEBUGGING SCRIPT
-- Run this to diagnose and fix slow admin login
-- ============================================

-- Step 1: Check current admin setup
SELECT
    '=== ADMIN USER STATUS ===' as section;

SELECT
    a.id,
    a.email,
    a.role,
    a.last_login_at,
    CASE
        WHEN au.id IS NOT NULL THEN '✅ Auth user exists'
        ELSE '❌ MISSING AUTH USER'
    END as auth_status,
    CASE
        WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Email confirmed'
        ELSE '⚠️ Email not confirmed'
    END as email_status
FROM public.admins a
LEFT JOIN auth.users au ON a.id = au.id;

-- Step 2: Check database performance
SELECT
    '=== DATABASE PERFORMANCE ===' as section;

-- Check table size
SELECT
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows
FROM pg_stat_user_tables
WHERE tablename = 'admins';

-- Check index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE tablename = 'admins';

-- Step 3: Test the optimized functions
SELECT
    '=== FUNCTION TESTS ===' as section;

-- Test with a known admin user (replace with actual UUID)
DO $$
DECLARE
    test_user_id UUID := '07a3cfb7-a762-40f1-9ae4-cbbb8666abe3'; -- Replace with your admin UUID
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    result RECORD;
BEGIN
    RAISE NOTICE 'Testing optimized admin functions...';

    -- Test is_user_admin function
    start_time := clock_timestamp();
    SELECT public.is_user_admin(test_user_id) INTO result;
    end_time := clock_timestamp();
    RAISE NOTICE 'is_user_admin() took: % ms', EXTRACT(millisecond FROM (end_time - start_time));

    -- Test get_admin_info function
    start_time := clock_timestamp();
    SELECT * FROM public.get_admin_info(test_user_id) INTO result;
    end_time := clock_timestamp();
    RAISE NOTICE 'get_admin_info() took: % ms', EXTRACT(millisecond FROM (end_time - start_time));

    -- Test authenticate_admin function
    start_time := clock_timestamp();
    SELECT * FROM public.authenticate_admin(test_user_id) INTO result;
    end_time := clock_timestamp();
    RAISE NOTICE 'authenticate_admin() took: % ms', EXTRACT(millisecond FROM (end_time - start_time));

    RAISE NOTICE '✅ All function tests completed';
END $$;

-- Step 4: Check for common issues
SELECT
    '=== COMMON ISSUES CHECK ===' as section;

-- Check RLS policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'admins'
ORDER BY policyname;

-- Check if functions exist
SELECT
    proname as function_name,
    pg_get_function_identity_arguments(oid) as arguments
FROM pg_proc
WHERE proname IN ('is_user_admin', 'get_admin_info', 'authenticate_admin', 'update_admin_login')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- Step 5: Performance recommendations
SELECT
    '=== PERFORMANCE RECOMMENDATIONS ===' as section;

-- Check if we need more indexes
SELECT
    'Consider adding composite indexes if you have many admin queries' as recommendation
WHERE NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'admins'
    AND indexname LIKE '%email%'
);

-- Check table bloat
SELECT
    'Consider running VACUUM on admins table if high dead tuples' as recommendation
WHERE (
    SELECT n_dead_tup::float / (n_live_tup + n_dead_tup) * 100
    FROM pg_stat_user_tables
    WHERE tablename = 'admins'
) > 20;

-- ============================================
-- QUICK FIXES
-- ============================================

-- If functions don't exist, run the optimization script first
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc
        WHERE proname = 'authenticate_admin'
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN
        RAISE NOTICE '❌ Optimized functions missing! Run optimize-admin-login.sql first';
    ELSE
        RAISE NOTICE '✅ Optimized functions are available';
    END IF;
END $$;

-- ============================================
-- FINAL STATUS
-- ============================================

SELECT
    '=== FINAL STATUS ===' as section,
    CASE
        WHEN EXISTS (SELECT 1 FROM public.admins) THEN '✅ Admin users exist'
        ELSE '❌ No admin users found'
    END as admin_users,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM pg_proc
            WHERE proname = 'authenticate_admin'
            AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        ) THEN '✅ Optimized functions ready'
        ELSE '❌ Missing optimized functions'
    END as functions,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM pg_indexes
            WHERE tablename = 'admins' AND indexname LIKE '%email%'
        ) THEN '✅ Performance indexes exist'
        ELSE '⚠️ Missing performance indexes'
    END as indexes;