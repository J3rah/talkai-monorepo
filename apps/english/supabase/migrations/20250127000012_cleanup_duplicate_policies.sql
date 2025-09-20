-- Clean up all duplicate and conflicting RLS policies on profiles table
-- This will remove all existing policies and create only the essential ones

-- Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can access all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles for admin panel" ON profiles;
DROP POLICY IF EXISTS "Admin users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Service role full access" ON profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_view_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "service_role_full_access" ON profiles;
DROP POLICY IF EXISTS "admins_view_all_profiles" ON profiles;
DROP POLICY IF EXISTS "admins_delete_profiles" ON profiles;

-- Also drop any functions we created that might be causing issues
DROP FUNCTION IF EXISTS is_admin_user(UUID);

-- Now create ONLY the essential policies we need
-- 1. Users can insert their own profile (CRITICAL for signup)
CREATE POLICY "users_insert_own_profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 2. Users can view their own profile
CREATE POLICY "users_view_own_profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- 3. Users can update their own profile
CREATE POLICY "users_update_own_profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. Service role has full access (for admin API operations)
CREATE POLICY "service_role_full_access"
    ON profiles FOR ALL
    USING (auth.role() = 'service_role');

-- 5. Admins can view all profiles (for admin panel)
-- Using a simple approach that shouldn't cause recursion
-- CREATE POLICY "admins_view_all_profiles"
--     ON profiles FOR SELECT
--     USING (
--         -- Allow own profile
--         auth.uid() = id
--         OR
--         -- Allow if service role
--         auth.role() = 'service_role'
--         OR
--         -- Allow if user is admin (simple check)
--         auth.uid() IN (
--             SELECT p.id FROM profiles p WHERE p.is_admin = true AND p.id = auth.uid()
--         )
--     );

-- 6. Admins can delete profiles (for admin operations)
-- CREATE POLICY "admins_delete_profiles"
--     ON profiles FOR DELETE
--     USING (
--         auth.role() = 'service_role'
--         OR
--         auth.uid() IN (
--             SELECT p.id FROM profiles p WHERE p.is_admin = true AND p.id = auth.uid()
--         )
--     ); 