-- Disable trial length A/B test to ensure consistent 5-minute trials
UPDATE ab_test_configs 
SET is_active = false 
WHERE test_name = 'trial_length';

-- Update the trial length A/B test to only have the 5-minute variant active
UPDATE ab_test_configs 
SET 
  variants = '[{"name": "5min", "duration": 300}]',
  traffic_allocation = '{"5min": 100}',
  description = 'Consistent 5-minute trial length (A/B testing disabled)'
WHERE test_name = 'trial_length'; 