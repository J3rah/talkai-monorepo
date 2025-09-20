-- Update Brit voice configuration to require Centered subscription
-- This migration updates the existing Brit voice to require a Centered subscription

-- Update the existing Brit voice configuration to require 'centered' subscription
UPDATE voice_configurations 
SET required_plan = 'centered',
    updated_at = TIMEZONE('utc'::text, NOW())
WHERE display_name = 'Brit' OR internal_name = 'brit';

-- Verify the update
SELECT display_name, required_plan, updated_at 
FROM voice_configurations 
WHERE display_name = 'Brit' OR internal_name = 'brit';
