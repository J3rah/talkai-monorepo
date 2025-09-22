/*
 Adds journal_entry_id column to chat_sessions if it does not exist.
 Usage: node apps/english/scripts/add-journal-entry-link.js
 Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL env vars.
*/

const { createClient } = require('@supabase/supabase-js');

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const admin = createClient(url, key);

  // Try to detect column by selecting it (will error if missing)
  const { error: selectErr } = await admin.from('chat_sessions').select('journal_entry_id').limit(1);
  if (!selectErr) {
    console.log('journal_entry_id already exists on chat_sessions. Nothing to do.');
    return;
  }

  console.log('Adding journal_entry_id column to chat_sessions...');
  const { error } = await admin.rpc('exec_sql', {
    q: `alter table chat_sessions add column if not exists journal_entry_id uuid;`
  });
  if (error) {
    // Fallback: try via raw http if rpc not present
    console.error('RPC exec_sql failed or not available:', error.message);
    console.log('Attempting alternative: create a helper function first or run SQL manually.');
    console.log('Run this SQL in your DB:\n  alter table chat_sessions add column if not exists journal_entry_id uuid;');
    process.exit(2);
  }
  console.log('Added journal_entry_id column to chat_sessions.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
