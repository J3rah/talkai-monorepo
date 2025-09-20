-- Fix admin subscription management by adding proper RLS policies
-- This allows admins to create/update/delete subscriptions for any user

-- Drop existing restrictive policies on subscriptions
DROP POLICY IF EXISTS "subscriptions_select" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_insert" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_update" ON subscriptions;
DROP POLICY IF EXISTS "subscriptions_delete" ON subscriptions;

-- Create new policies that allow both user self-management and admin management

-- 1. SELECT: Users can view their own subscriptions, admins can view all
CREATE POLICY "subscriptions_select_policy" ON subscriptions
    FOR SELECT USING (
        auth.uid() = user_id  -- Users can see their own
        OR 
        auth.role() = 'service_role'  -- Service role can see all
        OR
        auth.uid() IN (  -- Admins can see all
            SELECT id FROM profiles WHERE is_admin = true AND id = auth.uid()
        )
    );

-- 2. INSERT: Users can create their own subscriptions, admins can create for anyone
CREATE POLICY "subscriptions_insert_policy" ON subscriptions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id  -- Users can create their own
        OR 
        auth.role() = 'service_role'  -- Service role can create for anyone
        OR
        auth.uid() IN (  -- Admins can create for anyone
            SELECT id FROM profiles WHERE is_admin = true AND id = auth.uid()
        )
    );

-- 3. UPDATE: Users can update their own subscriptions, admins can update any
CREATE POLICY "subscriptions_update_policy" ON subscriptions
    FOR UPDATE USING (
        auth.uid() = user_id  -- Users can update their own
        OR 
        auth.role() = 'service_role'  -- Service role can update any
        OR
        auth.uid() IN (  -- Admins can update any
            SELECT id FROM profiles WHERE is_admin = true AND id = auth.uid()
        )
    );

-- 4. DELETE: Users can delete their own subscriptions, admins can delete any
CREATE POLICY "subscriptions_delete_policy" ON subscriptions
    FOR DELETE USING (
        auth.uid() = user_id  -- Users can delete their own
        OR 
        auth.role() = 'service_role'  -- Service role can delete any
        OR
        auth.uid() IN (  -- Admins can delete any
            SELECT id FROM profiles WHERE is_admin = true AND id = auth.uid()
        )
    );

-- Also ensure admins can update profiles (for subscription_status)
-- Drop existing profile update policy and recreate with admin support
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (
        auth.uid() = id  -- Users can update their own profile
        OR 
        auth.role() = 'service_role'  -- Service role can update any profile
        OR
        auth.uid() IN (  -- Admins can update any profile
            SELECT p.id FROM profiles p WHERE p.is_admin = true AND p.id = auth.uid()
        )
    ); 