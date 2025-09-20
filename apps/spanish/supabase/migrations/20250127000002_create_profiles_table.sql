-- Create profiles table if it doesn't exist
-- This table extends the auth.users table with additional profile information
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_admin BOOLEAN DEFAULT FALSE,
    therapist_name TEXT DEFAULT 'Talk Therapist',
    voice_config_id TEXT,
    voice_parameters JSONB DEFAULT '{"speaking_rate": 1.0, "pitch": 0.0}'::jsonb,
    base_voice TEXT DEFAULT 'ITO',
    subscription_status TEXT DEFAULT 'free',
    notification_preferences JSONB DEFAULT '{
        "email_notifications": true,
        "session_reminders": true,
        "progress_updates": false,
        "marketing_emails": false
    }'::jsonb,
    profile_settings JSONB DEFAULT '{
        "timezone": "America/New_York",
        "language": "en",
        "theme": "system",
        "privacy_mode": false
    }'::jsonb
);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating timestamps
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_profiles_base_voice ON profiles(base_voice);
CREATE INDEX IF NOT EXISTS idx_profiles_notification_preferences ON profiles USING GIN (notification_preferences);
CREATE INDEX IF NOT EXISTS idx_profiles_profile_settings ON profiles USING GIN (profile_settings);

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles extending auth.users with additional information';
COMMENT ON COLUMN profiles.id IS 'References auth.users.id';
COMMENT ON COLUMN profiles.email IS 'User email address (duplicated from auth.users for convenience)';
COMMENT ON COLUMN profiles.full_name IS 'Full name of the user for display purposes';
COMMENT ON COLUMN profiles.is_admin IS 'Whether the user has admin privileges';
COMMENT ON COLUMN profiles.therapist_name IS 'Preferred name for the AI therapist';
COMMENT ON COLUMN profiles.voice_config_id IS 'Selected voice configuration ID for Hume AI';
COMMENT ON COLUMN profiles.voice_parameters IS 'Voice parameters for Hume AI including speaking_rate and pitch';
COMMENT ON COLUMN profiles.base_voice IS 'Base voice model for Hume AI (e.g., ITO)';
COMMENT ON COLUMN profiles.subscription_status IS 'Current subscription status (free, standard, premium)';
COMMENT ON COLUMN profiles.notification_preferences IS 'User notification preferences stored as JSON';
COMMENT ON COLUMN profiles.profile_settings IS 'User profile settings like timezone, language, theme stored as JSON'; 