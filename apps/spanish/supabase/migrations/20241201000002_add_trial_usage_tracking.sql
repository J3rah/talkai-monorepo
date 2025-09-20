-- Add columns to track trial usage and prevent multiple trials
ALTER TABLE trial_sessions 
ADD COLUMN IF NOT EXISTS browser_fingerprint TEXT,
ADD COLUMN IF NOT EXISTS trial_started BOOLEAN DEFAULT FALSE;

-- Create index for browser fingerprint lookups
CREATE INDEX IF NOT EXISTS idx_trial_sessions_browser_fingerprint 
ON trial_sessions(browser_fingerprint);

-- Create index for trial_started lookups
CREATE INDEX IF NOT EXISTS idx_trial_sessions_trial_started 
ON trial_sessions(trial_started);

-- Create composite index for efficient trial usage checks
CREATE INDEX IF NOT EXISTS idx_trial_sessions_fingerprint_started 
ON trial_sessions(browser_fingerprint, trial_started); 