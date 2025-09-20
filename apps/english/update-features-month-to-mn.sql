-- Update subscription plan features to change "per month" to "per mn"

-- Update Free plan (Calm)
UPDATE subscription_plans 
SET features = ARRAY[
  '30 minutes per mn',
  'Basic AI therapy sessions', 
  'Limited conversation history'
]
WHERE name = 'Calm';

-- Update Centered plan
UPDATE subscription_plans 
SET features = ARRAY[
  '120 minutes per mn',
  'Advanced AI therapy sessions', 
  'Priority support', 
  'Session history & analytics', 
  'Multiple therapist voices'
]
WHERE name = 'Centered';

-- Update Grounded plan  
UPDATE subscription_plans 
SET features = ARRAY[
  '300 minutes per mn',
  'Premium AI therapy sessions', 
  'Download therapy sessions', 
  'Unlimited session history', 
  'Advanced analytics & insights', 
  'All therapist voices & personalities'
]
WHERE name = 'Grounded';

-- Verify the updates
SELECT name, features FROM subscription_plans ORDER BY price_amount; 