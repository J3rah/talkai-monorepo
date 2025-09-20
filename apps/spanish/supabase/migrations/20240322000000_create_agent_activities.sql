-- Create agent_activities table for logging agent operations
CREATE TABLE IF NOT EXISTS agent_activities (
    id BIGSERIAL PRIMARY KEY,
    agent_name TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agent_activities_agent_name ON agent_activities(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_activities_created_at ON agent_activities(created_at);

-- Enable RLS
ALTER TABLE agent_activities ENABLE ROW LEVEL SECURITY;

-- Only allow service role to manage agent activities
CREATE POLICY "service_role_agent_activities" ON agent_activities
    FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read agent activities
CREATE POLICY "authenticated_users_read_agent_activities" ON agent_activities
    FOR SELECT USING (auth.role() = 'authenticated'); 