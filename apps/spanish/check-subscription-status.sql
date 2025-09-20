-- Check current subscription statuses in the database
SELECT 
    id,
    email,
    subscription_status,
    created_at,
    updated_at
FROM profiles 
ORDER BY updated_at DESC 
LIMIT 10;

-- Check if there are any subscription statuses that might be unexpected
SELECT 
    subscription_status, 
    COUNT(*) as count 
FROM profiles 
GROUP BY subscription_status 
ORDER BY count DESC; 