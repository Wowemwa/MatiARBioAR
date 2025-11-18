-- ============================================
-- ADMIN USER QUICK SETUP
-- Run this in Supabase SQL Editor AFTER creating auth user
-- ============================================

-- Step 1: Check if admin user already exists
SELECT 
    'Checking existing admin users...' as status;

SELECT 
    a.id,
    a.email,
    a.role,
    a.created_at,
    au.email as auth_email,
    au.created_at as auth_created_at,
    au.email_confirmed_at
FROM public.admins a
LEFT JOIN auth.users au ON a.id = au.id
ORDER BY a.created_at DESC;

-- Step 2: If no admin exists, create one
-- IMPORTANT: Replace 'YOUR_USER_UUID_HERE' with actual UUID from Authentication > Users

DO $$
DECLARE
    v_user_id UUID := '99485cec-feff-4fe3-ba24-df72e729ea42'; -- REPLACE THIS
    v_email TEXT := 'rey.loremia@dorsu.edu.ph';
    v_exists BOOLEAN;
BEGIN
    -- Check if user exists in auth.users
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = v_user_id) INTO v_exists;
    
    IF v_exists THEN
        -- Insert or update admin
        INSERT INTO public.admins (id, email, role, created_at, updated_at)
        VALUES (v_user_id, v_email, 'super_admin', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            role = EXCLUDED.role,
            updated_at = NOW();
        
        RAISE NOTICE '✅ Admin user created/updated successfully!';
    ELSE
        RAISE NOTICE '❌ Auth user with ID % does not exist!', v_user_id;
        RAISE NOTICE '👉 Create the user first in Authentication > Users';
        RAISE NOTICE '   Email: %', v_email;
        RAISE NOTICE '   Password: Rey21 (or your choice)';
        RAISE NOTICE '   Then update v_user_id in this script and run again';
    END IF;
END $$;

-- Step 3: Verify admin is properly set up
SELECT 
    'Final verification...' as status;

SELECT 
    a.id,
    a.email,
    a.role,
    CASE 
        WHEN au.id IS NOT NULL THEN '✅ Auth user exists'
        ELSE '❌ Auth user missing'
    END as auth_status,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN '✅ Email confirmed'
        ELSE '⚠️ Email not confirmed'
    END as email_status
FROM public.admins a
LEFT JOIN auth.users au ON a.id = au.id
WHERE a.email = 'rey.loremia@dorsu.edu.ph';

-- If no results, you need to:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Create user: rey.loremia@dorsu.edu.ph with password Rey21
-- 3. Copy the UUID
-- 4. Update v_user_id above
-- 5. Run this script again
