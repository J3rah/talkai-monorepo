-- Add full_name column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.full_name IS 'Full name of the user for display purposes';

-- Create index for better performance on name searches
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name); 