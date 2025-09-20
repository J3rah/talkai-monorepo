-- Add subscription tier information to voice configuration descriptions
-- This migration updates voice descriptions to show which subscription tiers can access each voice

-- Update Classic Voices with subscription tier information
UPDATE voice_configurations 
SET description = 'A male therapeutic voice • Available on Calm, Centered, and Grounded plans',
    updated_at = TIMEZONE('utc'::text, NOW())
WHERE internal_name = 'male';

UPDATE voice_configurations 
SET description = 'A female therapeutic voice • Available on Calm, Centered, and Grounded plans',
    updated_at = TIMEZONE('utc'::text, NOW())
WHERE internal_name = 'female';

UPDATE voice_configurations 
SET description = 'A softer, more soothing voice • Available on Centered and Grounded plans',
    updated_at = TIMEZONE('utc'::text, NOW())
WHERE internal_name = 'calm';

UPDATE voice_configurations 
SET description = 'A more dynamic and engaging voice • Available on Centered and Grounded plans',
    updated_at = TIMEZONE('utc'::text, NOW())
WHERE internal_name = 'energetic';

UPDATE voice_configurations 
SET description = 'A clear and authoritative voice • Available on Grounded plan only',
    updated_at = TIMEZONE('utc'::text, NOW())
WHERE internal_name = 'professional';

UPDATE voice_configurations 
SET description = 'A warm and approachable voice • Available on Grounded plan only',
    updated_at = TIMEZONE('utc'::text, NOW())
WHERE internal_name = 'friendly';

-- Update Character Voices with subscription tier information
UPDATE voice_configurations 
SET description = 'A friendly, down-to-earth voice with western charm • Available on Grounded plan only',
    updated_at = TIMEZONE('utc'::text, NOW())
WHERE internal_name = 'sass';

UPDATE voice_configurations 
SET description = 'A charismatic and witty voice inspired by legendary pirates • Available on Grounded plan only',
    updated_at = TIMEZONE('utc'::text, NOW())
WHERE internal_name = 'jacksparrow';

-- Update Brit voice (if it exists) with subscription tier information
UPDATE voice_configurations 
SET description = 'A friendly British accent voice with warm, approachable charm • Available on Centered and Grounded plans',
    updated_at = TIMEZONE('utc'::text, NOW())
WHERE internal_name = 'brit';

-- Verify the updates
SELECT display_name, description, required_plan 
FROM voice_configurations 
ORDER BY group_id, sort_order;
