-- Add delete policy for admins to delete profiles
-- This will allow admins to delete profiles, which should cascade to auth.users
CREATE POLICY "Admins can delete profiles"
    ON profiles FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles admin_profile
            WHERE admin_profile.id = auth.uid() 
            AND admin_profile.is_admin = true
        )
    );

-- Also add a policy to allow service role to delete (for API operations)
CREATE POLICY "Service role can delete profiles"
    ON profiles FOR DELETE
    USING (auth.role() = 'service_role'); 