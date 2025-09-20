-- Simplified permissions and RLS diagnosis for chat_sessions table
-- Avoids foreign key constraint issues

-- 1. Check if RLS is enabled on chat_sessions table
SELECT 
    'RLS_STATUS' as query_type,
    n.nspname as schema_name,
    c.relname as table_name,
    c.relrowsecurity as rls_enabled,
    c.relforcerowsecurity as rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relname = 'chat_sessions' AND n.nspname = 'public';

-- 2. Show all RLS policies on chat_sessions table
SELECT 
    'RLS_POLICIES' as query_type,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command_type,
    qual as policy_condition,
    with_check
FROM pg_policies 
WHERE tablename = 'chat_sessions';

-- 3. Check current user and authentication context
SELECT 
    'CURRENT_USER_INFO' as query_type,
    current_user as current_user,
    session_user as session_user,
    CASE 
        WHEN auth.uid() IS NULL THEN 'NO_AUTH_CONTEXT'
        ELSE 'AUTH_CONTEXT_AVAILABLE'
    END as auth_status,
    auth.uid() as current_auth_uid;

-- 4. Count sessions as current user
SELECT 
    'COUNT_AS_CURRENT_USER' as query_type,
    COUNT(*) as session_count
FROM chat_sessions;

-- 5. Check what user we're authenticated as
SELECT 
    'AUTH_USER_INFO' as query_type,
    id,
    email,
    created_at as user_created_at
FROM auth.users 
WHERE id = auth.uid()
LIMIT 1;

-- 6. Try to see sessions without RLS (admin bypass test)
DO $$
BEGIN
    BEGIN
        SET row_security = off;
        PERFORM COUNT(*) FROM chat_sessions;
        RAISE NOTICE 'RLS bypass successful - sessions exist but are hidden by RLS';
    EXCEPTION
        WHEN insufficient_privilege THEN
            RAISE NOTICE 'RLS bypass failed - insufficient privileges (this is normal for non-admin users)';
        WHEN OTHERS THEN
            RAISE NOTICE 'RLS bypass failed - error: %', SQLERRM;
    END;
    SET row_security = on;
END $$;

-- 7. Check table grants and permissions
SELECT 
    'TABLE_GRANTS' as query_type,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'chat_sessions'
ORDER BY grantee, privilege_type;

-- 8. Test insert permissions with real auth user (safer test)
DO $$
DECLARE
    current_auth_uid uuid;
    test_session_id uuid;
BEGIN
    -- Get current authenticated user
    current_auth_uid := auth.uid();
    
    IF current_auth_uid IS NOT NULL THEN
        -- Try to insert with real user ID
        INSERT INTO chat_sessions (user_id, title, summary) 
        VALUES (current_auth_uid, 'PERMISSIONS_TEST', 'Testing if we can insert with real user')
        RETURNING id INTO test_session_id;
        
        -- Check if we can see what we just inserted
        IF EXISTS (SELECT 1 FROM chat_sessions WHERE id = test_session_id) THEN
            RAISE NOTICE 'INSERT_TEST: SUCCESS - Can insert and select with user ID: %', current_auth_uid;
        ELSE
            RAISE NOTICE 'INSERT_TEST: PARTIAL - Can insert but cannot select with user ID: %', current_auth_uid;
        END IF;
        
        -- Clean up test record
        DELETE FROM chat_sessions WHERE id = test_session_id;
        RAISE NOTICE 'INSERT_TEST: Cleaned up test record';
    ELSE
        RAISE NOTICE 'INSERT_TEST: SKIPPED - No authenticated user context';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'INSERT_TEST: FAILED - Error: %', SQLERRM;
END $$;

-- 9. Look for any sessions that might exist for current user
SELECT 
    'USER_SESSIONS_CHECK' as query_type,
    COUNT(*) as session_count,
    MIN(created_at) as earliest_session,
    MAX(created_at) as latest_session
FROM chat_sessions 
WHERE user_id = auth.uid();

-- 10. Check if there are sessions for other users (admin view)
SELECT 
    'ALL_USERS_SESSIONS' as query_type,
    user_id,
    COUNT(*) as session_count
FROM chat_sessions 
GROUP BY user_id
ORDER BY session_count DESC
LIMIT 5; 