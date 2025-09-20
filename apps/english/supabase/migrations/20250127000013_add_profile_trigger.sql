-- Create a trigger to automatically create a profile when a user signs up
-- This bypasses the RLS issue by using a SECURITY DEFINER function

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    therapist_name,
    notification_preferences,
    profile_settings
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'Talk Therapist',
    '{
      "email_notifications": true,
      "session_reminders": true,
      "progress_updates": false,
      "marketing_emails": false
    }'::jsonb,
    '{
      "timezone": "America/New_York",
      "language": "en",
      "theme": "system",
      "privacy_mode": false
    }'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role; 