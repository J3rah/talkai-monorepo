-- Create trial_sessions table to track trial usage
CREATE TABLE IF NOT EXISTS trial_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL, -- Browser session ID or generated ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration INTEGER DEFAULT 0, -- Duration in seconds
    trial_length INTEGER DEFAULT 180, -- Trial length in seconds (for A/B testing)
    voice_selected TEXT,
    therapist_name TEXT,
    converted_to_signup BOOLEAN DEFAULT FALSE,
    converted_at TIMESTAMP WITH TIME ZONE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Set if they convert
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    landing_page_variant TEXT, -- For A/B testing landing pages
    trial_variant TEXT -- For A/B testing trial lengths
);

-- Create trial_events table to track detailed trial interactions
CREATE TABLE IF NOT EXISTS trial_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trial_session_id UUID REFERENCES trial_sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    event_type TEXT NOT NULL, -- 'trial_started', 'voice_selected', 'trial_completed', 'signup_clicked', etc.
    event_data JSONB,
    timestamp_in_trial INTEGER -- Seconds into the trial when event occurred
);

-- Create ab_test_configs table for managing A/B tests
CREATE TABLE IF NOT EXISTS ab_test_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    test_name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    variants JSONB NOT NULL, -- Array of variant configurations
    traffic_allocation JSONB NOT NULL, -- Percentage allocation for each variant
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
);

-- Create landing_page_variants table for A/B testing landing pages
CREATE TABLE IF NOT EXISTS landing_page_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    variant_name TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    hero_title TEXT,
    hero_subtitle TEXT,
    cta_text TEXT,
    features JSONB,
    testimonials JSONB,
    colors JSONB -- Theme colors for the variant
);

-- Create conversion_funnels table to track conversion steps
CREATE TABLE IF NOT EXISTS conversion_funnels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trial_session_id UUID REFERENCES trial_sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    step_name TEXT NOT NULL, -- 'landing_view', 'trial_start', 'trial_complete', 'signup_start', 'signup_complete'
    step_data JSONB,
    time_from_start INTEGER -- Seconds from first interaction
);

-- Enable RLS
ALTER TABLE trial_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_funnels ENABLE ROW LEVEL SECURITY;

-- Create policies for trial_sessions (public read for analytics, admin write)
CREATE POLICY "Anyone can insert trial sessions"
    ON trial_sessions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can update their own trial session"
    ON trial_sessions FOR UPDATE
    USING (true);

CREATE POLICY "Admins can view all trial sessions"
    ON trial_sessions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create policies for trial_events
CREATE POLICY "Anyone can insert trial events"
    ON trial_events FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view all trial events"
    ON trial_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create policies for ab_test_configs
CREATE POLICY "Anyone can view active AB tests"
    ON ab_test_configs FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage AB tests"
    ON ab_test_configs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create policies for landing_page_variants
CREATE POLICY "Anyone can view active landing page variants"
    ON landing_page_variants FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage landing page variants"
    ON landing_page_variants FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create policies for conversion_funnels
CREATE POLICY "Anyone can insert conversion funnel data"
    ON conversion_funnels FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view all conversion funnel data"
    ON conversion_funnels FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trial_sessions_created_at ON trial_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_trial_sessions_converted ON trial_sessions(converted_to_signup);
CREATE INDEX IF NOT EXISTS idx_trial_sessions_trial_variant ON trial_sessions(trial_variant);
CREATE INDEX IF NOT EXISTS idx_trial_events_trial_session_id ON trial_events(trial_session_id);
CREATE INDEX IF NOT EXISTS idx_trial_events_event_type ON trial_events(event_type);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_trial_session_id ON conversion_funnels(trial_session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_step_name ON conversion_funnels(step_name);

-- Insert default A/B test configurations
INSERT INTO ab_test_configs (test_name, description, variants, traffic_allocation, is_active) VALUES
('trial_length', 'Test different trial lengths', 
 '[{"name": "2min", "duration": 120}, {"name": "3min", "duration": 180}, {"name": "5min", "duration": 300}]',
 '{"2min": 33, "3min": 34, "5min": 33}',
 true),
('landing_page', 'Test different landing page designs',
 '[{"name": "default", "variant": "default"}, {"name": "minimal", "variant": "minimal"}, {"name": "feature_focused", "variant": "feature_focused"}]',
 '{"default": 34, "minimal": 33, "feature_focused": 33}',
 true);

-- Insert default landing page variants
INSERT INTO landing_page_variants (variant_name, hero_title, hero_subtitle, cta_text, features, is_active) VALUES
('default', 'The Empathetic AI', 'Heartificial Intelligence with a Dash of Emotional Analysis', 'Start Free 5-Minute Trial', 
 '[{"title": "Emotion Detection", "description": "Real-time analysis of your emotional state"}, {"title": "Personalized Responses", "description": "AI adapts to your unique needs"}, {"title": "Safe & Private", "description": "Secure and confidential conversations"}]',
 true),
('minimal', 'AI Therapy That Understands You', 'Experience personalized emotional support in minutes', 'Try It Free Now',
 '[{"title": "Instant Access", "description": "No signup required"}, {"title": "5-Minute Trial", "description": "Quick but meaningful experience"}, {"title": "Real AI Therapy", "description": "Not just a chatbot"}]',
 true),
('feature_focused', 'Revolutionary Empathic AI Therapy', 'Advanced emotion detection meets personalized therapeutic responses', 'Start Your Journey',
 '[{"title": "Advanced Emotion AI", "description": "Cutting-edge emotion recognition technology"}, {"title": "Therapeutic Expertise", "description": "AI trained on therapeutic best practices"}, {"title": "Personalized Experience", "description": "Adapts to your unique emotional patterns"}, {"title": "Privacy First", "description": "Your conversations are completely confidential"}]',
 true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_ab_test_configs_updated_at
    BEFORE UPDATE ON ab_test_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_page_variants_updated_at
    BEFORE UPDATE ON landing_page_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 