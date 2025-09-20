-- Clean slate: Drop everything subscription-related
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP FUNCTION IF EXISTS update_subscription_status() CASCADE;

-- Remove subscription_status column from profiles if it exists
ALTER TABLE profiles DROP COLUMN IF EXISTS subscription_status;

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price_id TEXT NOT NULL UNIQUE,
    price_amount INTEGER NOT NULL, -- in cents
    features TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    stripe_session_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add subscription_status to profiles
ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'free';

-- Insert subscription plans
INSERT INTO subscription_plans (name, description, price_id, price_amount, features) VALUES
('Free', 'Basic therapy sessions for getting started', 'free', 0, ARRAY['30 minutes per month', 'Basic AI therapy sessions', 'Limited conversation history']),
('Standard', 'Enhanced therapy support for regular users', 'price_1RGpF6IgpnvoGs6avvZSPi1u', 999, ARRAY['300 minutes per month', 'Advanced AI therapy sessions', 'Priority support', 'Session history & analytics', 'Multiple therapist voices']),
('Premium', 'Comprehensive therapy support for dedicated users', 'price_1RGpF7IgpnvoGs6awGxTWzJ5', 1999, ARRAY['750 minutes per month', 'Premium AI therapy sessions', '24/7 priority support', 'Unlimited session history', 'Advanced analytics & insights', 'All therapist voices & personalities'])
ON CONFLICT (price_id) DO NOTHING;

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (everyone can read)
CREATE POLICY "subscription_plans_select" ON subscription_plans
    FOR SELECT USING (true);

-- RLS Policies for subscriptions
CREATE POLICY "subscriptions_select" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "subscriptions_insert" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "subscriptions_update" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Service role policies (for API operations)
CREATE POLICY "service_subscription_plans" ON subscription_plans
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Function to update user subscription status
CREATE OR REPLACE FUNCTION update_user_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the user's subscription status in profiles
    UPDATE profiles 
    SET subscription_status = CASE 
        WHEN NEW.status = 'active' THEN (
            SELECT LOWER(name) FROM subscription_plans WHERE id = NEW.plan_id
        )
        ELSE 'free'
    END
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update subscription status
CREATE TRIGGER update_subscription_status_trigger
    AFTER INSERT OR UPDATE OF status ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_user_subscription_status(); 