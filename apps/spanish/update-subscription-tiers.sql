-- Update subscription plans with new pricing and duration limits
-- Standard: $9.99 -> $12.99, 300 minutes -> 120 minutes
-- Premium: $19.99 -> $29.99, 750 minutes -> 300 minutes

-- First, let's see current plans
SELECT name, price_amount, features FROM subscription_plans ORDER BY price_amount;

-- Update Standard plan
UPDATE subscription_plans 
SET 
  price_amount = 1299, -- $12.99 in cents
  features = ARRAY[
    '120 minutes per month', 
    'Advanced AI therapy sessions', 
    'Priority support', 
    'Session history & analytics', 
    'Multiple therapist voices'
  ]
WHERE name = 'Standard';

-- Update Premium plan  
UPDATE subscription_plans 
SET 
  price_amount = 2999, -- $29.99 in cents
  features = ARRAY[
    '300 minutes per month', 
    'Premium AI therapy sessions', 
    'Download therapy sessions', 
    'Unlimited session history', 
    'Advanced analytics & insights', 
    'All therapist voices & personalities'
  ]
WHERE name = 'Premium';

-- Keep Free plan as is (30 minutes per month, $0)

-- Verify the updates
SELECT name, price_amount, features FROM subscription_plans ORDER BY price_amount; 