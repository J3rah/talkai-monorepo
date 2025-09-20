-- Fix admin update policy for profiles table
-- This ensures admins can update other users' profiles, including the is_admin field

-- Drop the existing update policy if it exists
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "admins_view_all_profiles" ON profiles;
DROP FUNCTION IF EXISTS is_admin_user(UUID);

-- Users can update their own profile
CREATE POLICY "users_update_own_profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Service role can access all profiles (for admin operations)
CREATE POLICY "service_role_full_access"
    ON profiles FOR ALL
    USING (auth.role() = 'service_role'); 