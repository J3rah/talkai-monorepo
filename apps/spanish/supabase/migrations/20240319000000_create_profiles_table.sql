-- Create profiles table first to avoid dependency issues
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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "users_select_own_profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Service role has full access
CREATE POLICY "service_role_full_access"
    ON profiles FOR ALL
    USING (auth.role() = 'service_role');

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_profiles_base_voice ON profiles(base_voice);
CREATE INDEX IF NOT EXISTS idx_profiles_notification_preferences ON profiles USING GIN (notification_preferences);
CREATE INDEX IF NOT EXISTS idx_profiles_profile_settings ON profiles USING GIN (profile_settings); 