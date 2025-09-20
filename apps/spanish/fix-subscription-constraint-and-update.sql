-- Fix subscription constraint and update data
-- Step 1: Drop the old constraint
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS valid_profile_subscription_status;

-- Step 2: Add new constraint with updated values
ALTER TABLE profiles 
ADD CONSTRAINT valid_profile_subscription_status 
CHECK (subscription_status = ANY (ARRAY['calm'::text, 'centered'::text, 'grounded'::text]));

-- Step 3: Show current subscription statuses
SELECT subscription_status, COUNT(*) as count 
FROM profiles 
GROUP BY subscription_status 
ORDER BY subscription_status;

-- Step 4: Update the data
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

-- Step 5: Show final subscription statuses
SELECT subscription_status, COUNT(*) as count 
FROM profiles 
GROUP BY subscription_status 
ORDER BY subscription_status;

-- Step 6: Show affected users
SELECT id, email, subscription_status, updated_at
FROM profiles 
ORDER BY updated_at DESC
LIMIT 10; 