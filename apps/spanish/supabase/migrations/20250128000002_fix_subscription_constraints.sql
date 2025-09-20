-- Fix Subscription Database Design Issues
-- This migration addresses:
-- 1. Missing foreign key relationship between subscriptions and profiles
-- 2. Missing constraint to prevent multiple active subscriptions per user
-- 3. Improve data integrity

-- Step 1: Add foreign key relationship between subscriptions and profiles
-- Currently subscriptions.user_id references auth.users(id)
-- We want it to also enforce consistency with profiles table

-- First, let's add an index on subscriptions.user_id for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);

-- Step 2: Add constraint to prevent multiple active subscriptions per user
-- Instead of a unique constraint on (user_id, status), we'll use a partial unique index
-- This only applies to 'active' status, allowing multiple inactive/canceled subscriptions
DROP INDEX IF EXISTS unique_active_subscription_per_user;
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_subscription_per_user 
ON subscriptions (user_id) 
WHERE status = 'active';

-- Step 3: Add check constraints for data integrity
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS valid_subscription_status;
ALTER TABLE subscriptions 
ADD CONSTRAINT valid_subscription_status 
CHECK (status IN ('active', 'inactive', 'pending', 'canceled', 'past_due'));

-- Step 4: Add check constraint for profiles subscription_status
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS valid_profile_subscription_status;
ALTER TABLE profiles 
ADD CONSTRAINT valid_profile_subscription_status 
CHECK (subscription_status IN ('free', 'standard', 'premium'));

-- Step 5: Create a function to ensure subscription consistency
-- This function will be triggered to maintain data integrity
CREATE OR REPLACE FUNCTION enforce_subscription_consistency()
RETURNS TRIGGER AS $$
BEGIN
    -- If we're inserting/updating an active subscription
    IF NEW.status = 'active' THEN
        -- Deactivate any other active subscriptions for this user
        UPDATE subscriptions 
        SET status = 'inactive', updated_at = NOW()
        WHERE user_id = NEW.user_id 
        AND status = 'active' 
        AND id != NEW.id;
        
        -- Update the user's profile subscription status
        UPDATE profiles 
        SET subscription_status = CASE 
            WHEN NEW.status = 'active' THEN (
                SELECT LOWER(name) FROM subscription_plans WHERE id = NEW.plan_id
            )
            ELSE 'free'
        END
        WHERE id = NEW.user_id;
    ELSIF NEW.status IN ('inactive', 'canceled', 'past_due') THEN
        -- Check if this was the user's only active subscription
        IF NOT EXISTS (
            SELECT 1 FROM subscriptions 
            WHERE user_id = NEW.user_id 
            AND status = 'active' 
            AND id != NEW.id
        ) THEN
            -- No other active subscriptions, set to free
            UPDATE profiles 
            SET subscription_status = 'free'
            WHERE id = NEW.user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create trigger to enforce consistency
DROP TRIGGER IF EXISTS subscription_consistency_trigger ON subscriptions;
CREATE TRIGGER subscription_consistency_trigger
    AFTER INSERT OR UPDATE ON subscriptions
    FOR EACH ROW 
    EXECUTE FUNCTION enforce_subscription_consistency();

-- Step 7: Add comments for documentation
COMMENT ON INDEX unique_active_subscription_per_user IS 
'Ensures each user can only have one active subscription at a time';

COMMENT ON CONSTRAINT valid_subscription_status ON subscriptions IS 
'Ensures subscription status is one of the valid values';

COMMENT ON CONSTRAINT valid_profile_subscription_status ON profiles IS 
'Ensures profile subscription_status matches available plan types';

COMMENT ON FUNCTION enforce_subscription_consistency() IS 
'Maintains consistency between subscriptions and profiles tables, ensures only one active subscription per user';

-- Step 8: Clean up any existing inconsistencies
-- Deactivate duplicate active subscriptions (keep the most recent one)
WITH ranked_subscriptions AS (
    SELECT id, 
           user_id,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
    FROM subscriptions 
    WHERE status = 'active'
)
UPDATE subscriptions 
SET status = 'inactive', updated_at = NOW()
WHERE id IN (
    SELECT id FROM ranked_subscriptions WHERE rn > 1
);

-- Step 9: Update any profiles with incorrect subscription_status
-- This ensures consistency after cleaning up duplicates
UPDATE profiles 
SET subscription_status = COALESCE(
    (SELECT LOWER(sp.name) 
     FROM subscriptions s 
     JOIN subscription_plans sp ON s.plan_id = sp.id 
     WHERE s.user_id = profiles.id 
     AND s.status = 'active' 
     ORDER BY s.created_at DESC 
     LIMIT 1), 
    'free'
)
WHERE id IN (
    SELECT DISTINCT p.id 
    FROM profiles p 
    LEFT JOIN subscriptions s ON p.id = s.user_id AND s.status = 'active'
    LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE p.subscription_status != COALESCE(LOWER(sp.name), 'free')
);

-- Step 10: Verify constraints are working
-- This will show current subscription distribution
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN subscription_status = 'free' THEN 1 END) as free_users,
    COUNT(CASE WHEN subscription_status = 'standard' THEN 1 END) as standard_users,
    COUNT(CASE WHEN subscription_status = 'premium' THEN 1 END) as premium_users
FROM profiles;

-- Show any users with multiple active subscriptions (should be 0 after this migration)
SELECT user_id, COUNT(*) as active_subscription_count
FROM subscriptions 
WHERE status = 'active' 
GROUP BY user_id 
HAVING COUNT(*) > 1; 