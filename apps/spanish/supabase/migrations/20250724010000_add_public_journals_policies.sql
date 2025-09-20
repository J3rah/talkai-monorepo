-- Enable RLS if not already enabled
ALTER TABLE public_journals ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anon key) to SELECT published entries
CREATE POLICY public_journals_select
  ON public_journals
  FOR SELECT
  USING ( is_published = true );

-- Optional: allow inserts for anyone (entries are anonymous)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'public_journals' AND policyname = 'public_journals_insert'
  ) THEN
    CREATE POLICY public_journals_insert
      ON public_journals
      FOR INSERT
      WITH CHECK ( true );
  END IF;
END$$; 