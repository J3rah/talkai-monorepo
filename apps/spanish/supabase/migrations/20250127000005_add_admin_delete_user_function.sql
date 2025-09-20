-- Create a function that allows admins to delete users
-- This function will delete from auth.users, which cascades to profiles
CREATE OR REPLACE FUNCTION admin_delete_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    calling_user_id UUID;
    is_admin_user BOOLEAN;
BEGIN
    -- Get the calling user's ID
    calling_user_id := auth.uid();
    
    -- Check if the calling user is an admin
    SELECT is_admin INTO is_admin_user
    FROM profiles
    WHERE id = calling_user_id;
    
    -- If not admin, raise exception
    IF NOT is_admin_user THEN
        RAISE EXCEPTION 'Only admins can delete users';
    END IF;
    
    -- Prevent admins from deleting themselves
    IF calling_user_id = target_user_id THEN
        RAISE EXCEPTION 'Cannot delete your own account';
    END IF;
    
    -- Delete from auth.users (this will cascade to profiles and other tables)
    DELETE FROM auth.users WHERE id = target_user_id;
    
    -- Return success
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error and re-raise
        RAISE EXCEPTION 'Failed to delete user: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_delete_user(UUID) TO authenticated; 