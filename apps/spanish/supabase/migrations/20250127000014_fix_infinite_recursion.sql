-- Fix infinite recursion in RLS policies
-- The issue is that the admin policy tries to check if a user is admin by querying the same table

-- Drop the problematic policies
DROP POLICY IF EXISTS "admins_view_all_profiles" ON profiles;
DROP POLICY IF EXISTS "admins_delete_profiles" ON profiles;

-- Create simpler policies that don't cause recursion
-- For admin access, we'll rely on the service role for admin operations
-- and only allow users to see their own profiles through the client

-- Users can only view their own profile (no admin check needed here)
CREATE POLICY "users_view_own_profile_only"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Service role has full access (for admin API operations)
-- This policy already exists but let's make sure it's there
DROP POLICY IF EXISTS "service_role_full_access" ON profiles;
CREATE POLICY "service_role_full_access"
    ON profiles FOR ALL
    USING (auth.role() = 'service_role');

-- For admin functionality, we'll handle it through API routes that use the service role
-- rather than trying to give admin users direct database access through RLS 