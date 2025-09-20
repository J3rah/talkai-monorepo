-- Migration: Fix specific user subscription status
-- Update the user who should be Grounded but shows as free

UPDATE profiles 
SET subscription_status = 'premium' 
WHERE email = 'jerah.cameron@pm.me' 
AND subscription_status = 'free';

-- Also ensure they have an active subscription record
INSERT INTO subscriptions (user_id, plan_id, status, current_period_start, current_period_end)
SELECT 
  '72fac107-9e47-470c-a8d8-c35145e477d1' as user_id,
  sp.id as plan_id,
  'active' as status,
  NOW() as current_period_start,
  NOW() + INTERVAL '1 month' as current_period_end
FROM subscription_plans sp
WHERE sp.name = 'Grounded'
AND NOT EXISTS (
  SELECT 1 FROM subscriptions s 
  WHERE s.user_id = '72fac107-9e47-470c-a8d8-c35145e477d1' 
  AND s.status = 'active'
); 