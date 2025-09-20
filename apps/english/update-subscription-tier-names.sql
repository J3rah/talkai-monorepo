-- Update subscription plan names to new therapeutic naming
-- Free -> Calm
-- Centered -> Centered  
-- Grounded -> Grounded

-- Show current plans
SELECT name, price_amount, features FROM subscription_plans ORDER BY price_amount;

-- Update Free plan to Calm
UPDATE subscription_plans 
SET name = 'Calm'
WHERE name = 'Free';

-- Update Centered plan to Centered
UPDATE subscription_plans 
SET name = 'Centered'
WHERE name = 'Centered';

-- Update Grounded plan to Grounded
UPDATE subscription_plans 
SET name = 'Grounded'
WHERE name = 'Grounded';

-- Show updated plans
SELECT name, price_amount, features FROM subscription_plans ORDER BY price_amount;

-- Note: You'll also need to update any hardcoded references in the application code
-- to use the new naming: 'calm', 'centered', 'grounded' (lowercase for status checks) 