-- Add constraints to prevent multiple active subscriptions per user
-- This migration fixes the subscription upgrade issue

-- First, let's clean up any duplicate active subscriptions
-- Keep the most recent one for each user and deactivate the rest
WITH ranked_subscriptions AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM subscriptions 
  WHERE status = 'active'
)
UPDATE subscriptions 
SET status = 'cancelled'
WHERE id IN (
  SELECT id FROM ranked_subscriptions WHERE rn > 1
);

-- Add a unique partial index to prevent multiple active subscriptions per user
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_user_active 
ON subscriptions (user_id) 
WHERE status = 'active';

-- Add updated_at trigger for subscriptions table
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_updated_at();

-- Add a function to safely upgrade subscriptions
CREATE OR REPLACE FUNCTION upgrade_user_subscription(
    p_user_id UUID,
    p_new_plan_id UUID,
    p_stripe_session_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_subscription_id UUID;
BEGIN
    -- Deactivate any existing active subscriptions
    UPDATE subscriptions 
    SET status = 'cancelled', updated_at = NOW()
    WHERE user_id = p_user_id AND status = 'active';
    
    -- Create new subscription
    INSERT INTO subscriptions (
        user_id, 
        plan_id, 
        stripe_session_id,
        status,
        created_at,
        updated_at
    ) VALUES (
        p_user_id,
        p_new_plan_id,
        p_stripe_session_id,
        'pending',
        NOW(),
        NOW()
    ) RETURNING id INTO v_subscription_id;
    
    RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION upgrade_user_subscription TO service_role;
