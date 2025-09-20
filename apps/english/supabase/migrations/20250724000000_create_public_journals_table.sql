-- Create public_journals table to store anonymous journal posts
CREATE TABLE IF NOT EXISTS public_journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  reflection TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable row-level security (optional for future policies)
ALTER TABLE public_journals ENABLE ROW LEVEL SECURITY; 