-- Fix subscription data first, then update constraint
-- Step 1: Show current subscription statuses
SELECT subscription_status, COUNT(*) as count 
FROM profiles 
GROUP BY subscription_status 
ORDER BY subscription_status;

-- Step 2: Drop the old constraint first
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS valid_profile_subscription_status;

-- Step 3: Update the data (no constraint blocking us now)
-- Update free to calm (if any exist)
UPDATE profiles 
SET subscription_status = 'calm'
WHERE subscription_status = 'free';

-- Update standard to centered (if any exist)  
UPDATE profiles 
SET subscription_status = 'centered'
WHERE subscription_status = 'standard';

-- Update premium to grounded
UPDATE profiles 
SET subscription_status = 'grounded'
WHERE subscription_status = 'premium';

-- Step 4: Show updated subscription statuses
SELECT subscription_status, COUNT(*) as count 
FROM profiles 
GROUP BY subscription_status 
ORDER BY subscription_status;

-- Step 5: Now add the new constraint (all data should be valid now)
ALTER TABLE profiles 
ADD CONSTRAINT valid_profile_subscription_status 
CHECK (subscription_status = ANY (ARRAY['calm'::text, 'centered'::text, 'grounded'::text]));

-- Step 6: Final verification
SELECT 'Final status:' as info;
SELECT subscription_status, COUNT(*) as count 
FROM profiles 
GROUP BY subscription_status 
ORDER BY subscription_status; 