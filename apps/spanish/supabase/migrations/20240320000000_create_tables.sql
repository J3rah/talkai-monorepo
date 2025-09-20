-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT,
    summary TEXT
);

-- Create emotion_metrics table
CREATE TABLE IF NOT EXISTS emotion_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    emotion_type TEXT NOT NULL,
    intensity FLOAT NOT NULL,
    confidence FLOAT NOT NULL
);

-- Create therapy_sessions table
CREATE TABLE IF NOT EXISTS therapy_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    duration INTEGER, -- Duration in seconds
    status TEXT DEFAULT 'completed'::text,
    notes TEXT
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    role TEXT NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    emotion_data JSONB -- Store the emotion data from Hume
);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;

-- Create trigger for updating timestamps
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can insert their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON chat_sessions;

DROP POLICY IF EXISTS "Users can view their own emotion metrics" ON emotion_metrics;
DROP POLICY IF EXISTS "Users can insert their own emotion metrics" ON emotion_metrics;

DROP POLICY IF EXISTS "Users can view their own therapy sessions" ON therapy_sessions;
DROP POLICY IF EXISTS "Users can insert their own therapy sessions" ON therapy_sessions;
DROP POLICY IF EXISTS "Users can update their own therapy sessions" ON therapy_sessions;

DROP POLICY IF EXISTS "Users can view their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert their own chat messages" ON chat_messages;

-- Create new policies
CREATE POLICY "Users can view their own chat sessions"
    ON chat_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions"
    ON chat_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions"
    ON chat_sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- Emotion metrics policies
CREATE POLICY "Users can view their own emotion metrics"
    ON emotion_metrics FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM chat_sessions
        WHERE chat_sessions.id = emotion_metrics.chat_session_id
        AND chat_sessions.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own emotion metrics"
    ON emotion_metrics FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM chat_sessions
        WHERE chat_sessions.id = emotion_metrics.chat_session_id
        AND chat_sessions.user_id = auth.uid()
    ));

-- Therapy sessions policies
CREATE POLICY "Users can view their own therapy sessions"
    ON therapy_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own therapy sessions"
    ON therapy_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own therapy sessions"
    ON therapy_sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view their own chat messages"
    ON chat_messages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM chat_sessions
        WHERE chat_sessions.id = chat_messages.chat_session_id
        AND chat_sessions.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own chat messages"
    ON chat_messages FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM chat_sessions
        WHERE chat_sessions.id = chat_messages.chat_session_id
        AND chat_sessions.user_id = auth.uid()
    ));