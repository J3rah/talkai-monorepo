-- Add data_saving_preference column to profiles table
-- This feature is for Centered and Grounded users only
-- Default is FALSE (data not saved by default)

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS data_saving_preference BOOLEAN DEFAULT FALSE;

-- Update existing rows to have the default value
UPDATE profiles 
SET data_saving_preference = FALSE 
WHERE data_saving_preference IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN profiles.data_saving_preference IS 'Whether to save conversation data for future reference (Centered/Grounded only). Default is FALSE (not saved).';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_data_saving_preference ON profiles(data_saving_preference); 