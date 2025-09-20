-- Add missing columns to chat_sessions table
ALTER TABLE chat_sessions
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in_progress',
ADD COLUMN IF NOT EXISTS duration INTEGER,
ADD COLUMN IF NOT EXISTS previous_session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS hume_chat_id UUID,
ADD COLUMN IF NOT EXISTS hume_chat_group_id UUID;

-- Update existing rows to have the default status
UPDATE chat_sessions
SET status = 'completed'
WHERE status IS NULL; 