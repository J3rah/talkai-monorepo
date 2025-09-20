-- Add admin policy to view all profiles
-- This policy allows admins to view all profiles for the admin panel

-- Remove all admin policies and the is_admin_user function from the profiles table
DROP POLICY IF EXISTS "Admins can view all profiles for admin panel" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON profiles;
DROP FUNCTION IF EXISTS is_admin_user(UUID);

-- Only allow users to view their own profile
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id); 