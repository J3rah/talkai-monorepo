-- Add is_flagged column to support moderation of public journals
ALTER TABLE public_journals
  ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN NOT NULL DEFAULT FALSE;

-- Simple index to query flagged/unflagged entries quickly
CREATE INDEX IF NOT EXISTS idx_public_journals_is_flagged ON public_journals(is_flagged); 