-- Comprehensive permissions and RLS diagnosis for chat_sessions table
-- This will help identify if sessions exist but aren't visible due to RLS policies

-- 1. Check if RLS is enabled on chat_sessions table (corrected for PostgreSQL compatibility)
SELECT 
    'RLS_STATUS' as query_type,
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    hasrules as has_rules
FROM pg_tables 
WHERE tablename = 'chat_sessions';

-- 1b. Alternative RLS check using pg_class
SELECT 
    'RLS_STATUS_ALT' as query_type,
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

-- 3. Check current user and role
SELECT 
    'CURRENT_USER_INFO' as query_type,
    current_user as current_user,
    current_role as current_role,
    session_user as session_user,
    current_setting('role') as role_setting;

-- 4. Try to count sessions as different users/contexts
-- (This helps identify if it's an authentication context issue)

-- As current user
SELECT 
    'COUNT_AS_CURRENT_USER' as query_type,
    COUNT(*) as session_count
FROM chat_sessions;

-- 5. Check if auth.users() function works (Supabase specific)
SELECT 
    'AUTH_FUNCTION_TEST' as query_type,
    CASE 
        WHEN auth.uid() IS NULL THEN 'NO_AUTH_CONTEXT'
        ELSE 'AUTH_CONTEXT_AVAILABLE'
    END as auth_status,
    auth.uid() as current_auth_uid;

-- 6. Try to see sessions without RLS (requires elevated permissions)
-- This will fail if you don't have the right permissions, but that's diagnostic info
BEGIN;
SET row_security = off;
SELECT 
    'SESSIONS_WITHOUT_RLS' as query_type,
    COUNT(*) as total_sessions_bypassing_rls,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as recent_sessions
FROM chat_sessions;
ROLLBACK;

-- 7. Check table grants and permissions
SELECT 
    'TABLE_GRANTS' as query_type,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'chat_sessions'
ORDER BY grantee, privilege_type;

-- 8. Test insert permissions (this will show if we can insert but not select)
-- We'll do a dry run with a rollback
BEGIN;
INSERT INTO chat_sessions (user_id, title, summary) 
VALUES (
    '00000000-0000-0000-0000-000000000000', 
    'PERMISSIONS_TEST', 
    'Testing if we can insert'
);
SELECT 
    'INSERT_TEST' as query_type,
    'INSERT_SUCCESS' as result,
    id,
    created_at
FROM chat_sessions 
WHERE title = 'PERMISSIONS_TEST'
ORDER BY created_at DESC
LIMIT 1;
ROLLBACK;

-- 9. Check if there are any sessions for specific user ID (if you know your user ID)
-- Replace 'YOUR_USER_ID' with actual user ID from auth.users or profiles table
SELECT 
    'USER_SPECIFIC_CHECK' as query_type,
    COUNT(*) as session_count,
    user_id
FROM chat_sessions 
WHERE user_id = auth.uid()
GROUP BY user_id;

-- 10. Show auth.users table info if accessible
SELECT 
    'AUTH_USERS_INFO' as query_type,
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE id = auth.uid()
LIMIT 1; 