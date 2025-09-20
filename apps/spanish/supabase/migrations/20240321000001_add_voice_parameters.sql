-- Add voice parameters and base voice columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS voice_parameters JSONB DEFAULT '{"speaking_rate": 1.0, "pitch": 0.0}'::jsonb,
ADD COLUMN IF NOT EXISTS base_voice TEXT DEFAULT 'ITO';

-- Add comment to explain the columns
COMMENT ON COLUMN profiles.voice_parameters IS 'Voice parameters for Hume AI including speaking_rate and pitch';
COMMENT ON COLUMN profiles.base_voice IS 'Base voice model for Hume AI (e.g., ITO)';

-- Create an index on base_voice for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_base_voice ON profiles(base_voice); 