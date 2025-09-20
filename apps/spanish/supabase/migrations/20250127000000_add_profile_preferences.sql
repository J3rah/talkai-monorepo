-- Add notification_preferences and profile_settings columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "email_notifications": true,
  "session_reminders": true,
  "progress_updates": false,
  "marketing_emails": false
}'::jsonb,
ADD COLUMN IF NOT EXISTS profile_settings JSONB DEFAULT '{
  "timezone": "America/New_York",
  "language": "en",
  "theme": "system",
  "privacy_mode": false
}'::jsonb;

-- Update existing rows to have default values if they don't already have them
UPDATE profiles 
SET 
  notification_preferences = COALESCE(notification_preferences, '{
    "email_notifications": true,
    "session_reminders": true,
    "progress_updates": false,
    "marketing_emails": false
  }'::jsonb),
  profile_settings = COALESCE(profile_settings, '{
    "timezone": "America/New_York",
    "language": "en",
    "theme": "system",
    "privacy_mode": false
  }'::jsonb)
WHERE 
  notification_preferences IS NULL 
  OR profile_settings IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN profiles.notification_preferences IS 'User notification preferences stored as JSON';
COMMENT ON COLUMN profiles.profile_settings IS 'User profile settings like timezone, language, theme stored as JSON';

-- Create indexes for better performance on JSON queries
CREATE INDEX IF NOT EXISTS idx_profiles_notification_preferences ON profiles USING GIN (notification_preferences);
CREATE INDEX IF NOT EXISTS idx_profiles_profile_settings ON profiles USING GIN (profile_settings); 