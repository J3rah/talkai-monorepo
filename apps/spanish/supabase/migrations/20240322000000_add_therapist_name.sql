-- Add therapist_name column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS therapist_name TEXT DEFAULT 'Talk Therapist';

-- Update existing profiles to have the default therapist name
UPDATE profiles SET therapist_name = 'Talk Therapist' WHERE therapist_name IS NULL; 