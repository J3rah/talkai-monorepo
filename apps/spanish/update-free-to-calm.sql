-- Update Free to Calm in database
-- This script updates existing 'free' references to 'calm' in the database

-- Show current subscription statuses
SELECT subscription_status, COUNT(*) as count 
FROM profiles 
GROUP BY subscription_status 
ORDER BY subscription_status;

-- Update profiles table: change 'free' to 'calm'
UPDATE profiles 
SET subscription_status = 'calm'
WHERE subscription_status = 'free';

-- Show updated subscription statuses
SELECT subscription_status, COUNT(*) as count 
FROM profiles 
GROUP BY subscription_status 
ORDER BY subscription_status;

-- Update subscription_plans table if it exists and has 'Free' plan
-- (This might not exist depending on your schema)
UPDATE subscription_plans 
SET name = 'Calm'
WHERE name = 'Free';

-- Show final state
SELECT 'Updated profiles:' as info;
SELECT subscription_status, COUNT(*) as count 
FROM profiles 
GROUP BY subscription_status 
ORDER BY subscription_status;

-- If subscription_plans table exists, show it too
SELECT 'Subscription plans:' as info;
SELECT name, price_amount, features FROM subscription_plans ORDER BY price_amount; 