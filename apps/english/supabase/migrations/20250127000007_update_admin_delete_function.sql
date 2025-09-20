-- Update the admin_delete_user function with better error handling
CREATE OR REPLACE FUNCTION admin_delete_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    calling_user_id UUID;
    is_admin_user BOOLEAN;
    user_exists BOOLEAN;
BEGIN
    -- Get the calling user's ID
    calling_user_id := auth.uid();
    
    -- Check if the calling user exists and is an admin
    SELECT is_admin INTO is_admin_user
    FROM profiles
    WHERE id = calling_user_id;
    
    -- If not admin, raise exception
    IF NOT COALESCE(is_admin_user, FALSE) THEN
        RAISE EXCEPTION 'Only admins can delete users';
    END IF;
    
    -- Prevent admins from deleting themselves
    IF calling_user_id = target_user_id THEN
        RAISE EXCEPTION 'Cannot delete your own account';
    END IF;
    
    -- Check if target user exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = target_user_id) INTO user_exists;
    IF NOT user_exists THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- First, delete from profiles explicitly (this should work with our RLS policies)
    DELETE FROM profiles WHERE id = target_user_id;
    
    -- Then delete from auth.users
    DELETE FROM auth.users WHERE id = target_user_id;
    
    -- Return success
    RETURN TRUE;
    
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'Cannot delete user due to foreign key constraints. User may have associated data that needs to be cleaned up first.';
    WHEN OTHERS THEN
        -- Log the error and re-raise with more context
        RAISE EXCEPTION 'Failed to delete user (ID: %): %', target_user_id, SQLERRM;
END;
$$; 