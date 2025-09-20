-- Migration: Fix subscription status mapping for new plan names
-- Maps Calm -> free, Centered -> standard, Grounded -> premium

CREATE OR REPLACE FUNCTION update_user_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles 
    SET subscription_status = CASE 
        WHEN NEW.status = 'active' THEN (
            CASE
                WHEN (SELECT LOWER(name) FROM subscription_plans WHERE id = NEW.plan_id) = 'calm' THEN 'free'
                WHEN (SELECT LOWER(name) FROM subscription_plans WHERE id = NEW.plan_id) = 'centered' THEN 'standard'
                WHEN (SELECT LOWER(name) FROM subscription_plans WHERE id = NEW.plan_id) = 'grounded' THEN 'premium'
                ELSE 'free'
            END
        )
        ELSE 'free'
    END
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 