-- Update remaining Premium to Grounded in database
-- This updates the subscription_status field in profiles table

-- Show current subscription statuses
SELECT subscription_status, COUNT(*) as count 
FROM profiles 
GROUP BY subscription_status 
ORDER BY subscription_status;

-- Update premium to grounded
UPDATE profiles 
SET subscription_status = 'grounded'
WHERE subscription_status = 'premium';

-- Show updated subscription statuses
SELECT subscription_status, COUNT(*) as count 
FROM profiles 
GROUP BY subscription_status 
ORDER BY subscription_status;

-- Show affected users
SELECT id, email, subscription_status, updated_at
FROM profiles 
WHERE subscription_status = 'grounded'
ORDER BY updated_at DESC; 