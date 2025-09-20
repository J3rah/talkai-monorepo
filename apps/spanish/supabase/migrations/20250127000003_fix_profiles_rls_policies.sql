-- Fix infinite recursion in profiles RLS policies
-- Drop the problematic admin policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON profiles;
DROP FUNCTION IF EXISTS is_admin_user(UUID);

-- Users can insert their own profile (already exists)
-- Users can update their own profile (already exists)
-- Users can view their own profile (already exists)

-- Service role has full access (for admin API operations)
CREATE POLICY "service_role_full_access"
    ON profiles FOR ALL
    USING (auth.role() = 'service_role'); 