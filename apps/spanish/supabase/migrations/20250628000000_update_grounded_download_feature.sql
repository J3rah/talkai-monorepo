-- Update Grounded tier download feature to clarify both data and audio downloads
-- Change "Download therapy sessions" to "Download therapy sessions (data & audio)"

UPDATE subscription_plans 
SET 
  features = ARRAY[
    '300 minutes per month', 
    'Premium AI therapy sessions', 
    'Download therapy sessions (data & audio)', 
    'Unlimited session history', 
    'Advanced analytics & insights', 
    'All therapist voices & personalities'
  ]
WHERE name = 'Grounded';

-- Also update if the plan is still named 'Premium' in some environments
UPDATE subscription_plans 
SET 
  features = ARRAY[
    '300 minutes per month', 
    'Premium AI therapy sessions', 
    'Download therapy sessions (data & audio)', 
    'Unlimited session history', 
    'Advanced analytics & insights', 
    'All therapist voices & personalities'
  ]
WHERE name = 'Premium';

-- Verify the update
SELECT name, features FROM subscription_plans WHERE name IN ('Grounded', 'Premium'); 