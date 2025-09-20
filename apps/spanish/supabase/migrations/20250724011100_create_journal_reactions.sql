-- Create table for emoji reactions on public journals
CREATE TABLE IF NOT EXISTS public_journal_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id UUID REFERENCES public_journals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public_journal_reactions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reactions
CREATE POLICY public_journal_reactions_select ON public_journal_reactions
  FOR SELECT USING (true);

-- Allow anyone to insert reactions (anonymous)
CREATE POLICY public_journal_reactions_insert ON public_journal_reactions
  FOR INSERT WITH CHECK (true);

-- Unique constraint to avoid duplicate reactions per user per emoji
CREATE UNIQUE INDEX IF NOT EXISTS uniq_journal_reaction_user_emoji
  ON public_journal_reactions(journal_id, user_id, emoji); 