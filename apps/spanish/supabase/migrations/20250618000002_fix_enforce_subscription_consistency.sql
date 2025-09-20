-- Migration: Fix enforce_subscription_consistency trigger function
-- This trigger was setting subscription_status to lowercase plan names instead of the allowed values

CREATE OR REPLACE FUNCTION enforce_subscription_consistency()
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
$$ LANGUAGE plpgsql; 