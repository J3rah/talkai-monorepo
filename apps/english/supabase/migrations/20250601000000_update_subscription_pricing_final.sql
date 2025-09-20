-- Update subscription plans with new pricing and duration limits
-- Centered: $9.99 -> $12.99, 300 minutes -> 120 minutes  
-- Premium: $19.99 -> $29.99, 750 minutes -> 300 minutes

-- Update Centered plan
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
WHERE name = 'Centered';

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

-- Keep Calm plan as is (30 minutes per month, $0) 