-- Comprehensive session analysis for debugging resumption issues
-- Session ID: 8c04aeaa-0243-4706-b193-3913abdff479

-- 1. Check if the specific session exists
SELECT 
    'SPECIFIC SESSION CHECK' as query_type,
    *
FROM chat_sessions 
WHERE id = '8c04aeaa-0243-4706-b193-3913abdff479';

-- 2. Count total sessions in database
SELECT 
    'TOTAL SESSION COUNT' as query_type,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN hume_chat_group_id IS NOT NULL THEN 1 END) as sessions_with_hume_id,
    COUNT(CASE WHEN hume_chat_group_id IS NULL THEN 1 END) as sessions_without_hume_id
FROM chat_sessions;

-- 3. Show 10 most recent sessions
SELECT 
    'RECENT SESSIONS' as query_type,
    id,
    title,
    created_at,
    status,
    user_id,
    hume_chat_id,
    hume_chat_group_id,
    CASE 
        WHEN hume_chat_group_id IS NOT NULL THEN 'RESUMABLE'
        ELSE 'NOT_RESUMABLE'
    END as resumability_status
FROM chat_sessions 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Search for sessions with similar ID pattern (in case there's a typo)
SELECT 
    'SIMILAR ID SEARCH' as query_type,
    id,
    title,
    created_at,
    hume_chat_group_id
FROM chat_sessions 
WHERE id::text LIKE '%8c04aeaa%' OR id::text LIKE '%0243-4706%' OR id::text LIKE '%3913abdff479%';

-- 5. Check if there are any sessions created today
SELECT 
    'TODAYS SESSIONS' as query_type,
    id,
    title,
    created_at,
    hume_chat_group_id,
    status
FROM chat_sessions 
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;

-- 6. Check for sessions in the last 24 hours
SELECT 
    'LAST_24_HOURS' as query_type,
    id,
    title,
    created_at,
    hume_chat_group_id,
    status,
    EXTRACT(EPOCH FROM (NOW() - created_at))/3600 as hours_ago
FROM chat_sessions 
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 7. Check for any messages associated with the session ID (in case session exists but not visible)
SELECT 
    'MESSAGES_CHECK' as query_type,
    chat_session_id,
    COUNT(*) as message_count,
    MIN(created_at) as first_message,
    MAX(created_at) as last_message
FROM chat_messages 
WHERE chat_session_id = '8c04aeaa-0243-4706-b193-3913abdff479'
GROUP BY chat_session_id;

-- 8. Check therapy sessions table for any references
SELECT 
    'THERAPY_SESSION_CHECK' as query_type,
    id,
    chat_session_id,
    created_at,
    status
FROM therapy_sessions 
WHERE chat_session_id = '8c04aeaa-0243-4706-b193-3913abdff479';

-- 9. Show database schema for chat_sessions table
SELECT 
    'SCHEMA_CHECK' as query_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'chat_sessions' 
ORDER BY ordinal_position; 