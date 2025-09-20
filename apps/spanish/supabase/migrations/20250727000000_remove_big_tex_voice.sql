-- Remove Big Tex voice configuration
-- This migration removes the "Big Tex" voice that was added to the database

-- Delete the Big Tex voice configuration
DELETE FROM voice_configurations 
WHERE display_name = 'Big Tex' 
   OR internal_name = 'bigtex' 
   OR internal_name = 'big_tex';

-- If you want to deactivate instead of delete, use this instead:
-- UPDATE voice_configurations 
-- SET is_active = false 
-- WHERE display_name = 'Big Tex' 
--    OR internal_name = 'bigtex' 
--    OR internal_name = 'big_tex';
