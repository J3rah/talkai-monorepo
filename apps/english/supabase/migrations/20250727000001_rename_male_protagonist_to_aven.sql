
-- Rename "Male Protagonist" voice configuration to "Aven"
-- This migration updates the display name of the voice configuration

-- Update the display name from "Male Protagonist" to "Aven"
UPDATE voice_configurations 
SET display_name = 'Aven',
    updated_at = TIMEZONE('utc'::text, NOW())
WHERE display_name = 'Male Protagonist';

-- If you also want to update the internal_name, uncomment this:
-- UPDATE voice_configurations 
-- SET internal_name = 'aven',
--     display_name = 'Aven',
--     updated_at = TIMEZONE('utc'::text, NOW())
-- WHERE internal_name = 'male_protagonist' 
--    OR display_name = 'Male Protagonist';
