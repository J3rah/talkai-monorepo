/*
 Backfill chat_sessions.journal_entry_id from journal content and add index/foreign key.
 Usage:
   NEXT_PUBLIC_SUPABASE_URL="https://<proj>.supabase.co" \
   SUPABASE_SERVICE_ROLE_KEY="<service_role_key>" \
   node apps/english/scripts/backfill-journal-links.js

 This script:
 1) Ensures the journal_entry_id column exists (created previously).
 2) Attempts to create an index and foreign key (best-effort); prints SQL if RPC unavailable.
 3) Scans public_journals for entries created via the Save button and links them to chat_sessions by parsing the session id from content.
*/

const { createClient } = require('@supabase/supabase-js');

const UUID_RE = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/;

async function ensureIndexAndFk(admin) {
  // Try RPC exec_sql if available; otherwise print SQL
  const sql = `
    do $$ begin
      begin
        create index if not exists idx_chat_sessions_journal_entry_id on chat_sessions (journal_entry_id);
      exception when others then null; end;
      begin
        alter table chat_sessions
          add constraint chat_sessions_journal_entry_id_fkey
          foreign key (journal_entry_id)
          references public_journals(id)
          on delete set null;
      exception when duplicate_object then null; when others then null; end;
    end $$;
  `;
  try {
    const { error } = await admin.rpc('exec_sql', { q: sql });
    if (error) {
      console.warn('[Backfill] exec_sql RPC unavailable or failed; please run this SQL manually in Supabase SQL editor:\n', sql);
    } else {
      console.log('[Backfill] Index/foreign key ensured.');
    }
  } catch (e) {
    console.warn('[Backfill] exec_sql RPC not found. Run this SQL manually to add index/FK if desired:\n', sql);
  }
}

function extractSessionIdFromContent(content) {
  if (typeof content !== 'string') return null;
  // English pattern: "Therapist Feedback (Session <uuid>):"
  // Spanish pattern: "Retroalimentación del Terapeuta (Sesión <uuid>):"
  const enIdx = content.indexOf('(Session');
  const esIdx = content.indexOf('(Sesión');
  const idx = enIdx >= 0 ? enIdx : esIdx;
  if (idx === -1) return null;
  const after = content.slice(idx);
  const match = after.match(UUID_RE);
  return match ? match[0] : null;
}

async function backfill(admin) {
  let offset = 0;
  const pageSize = 500;
  let totalChecked = 0;
  let totalLinked = 0;

  while (true) {
    const { data: entries, error } = await admin
      .from('public_journals')
      .select('id, content, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;
    if (!entries || entries.length === 0) break;

    for (const entry of entries) {
      totalChecked += 1;
      const sid = extractSessionIdFromContent(entry.content);
      if (!sid) continue;

      // Link if chat_session exists and not already linked
      const { data: session, error: sErr } = await admin
        .from('chat_sessions')
        .select('id, journal_entry_id')
        .eq('id', sid)
        .single();

      if (sErr) continue; // session not found or not accessible
      if (session.journal_entry_id) continue; // already linked

      const { error: updErr } = await admin
        .from('chat_sessions')
        .update({ journal_entry_id: entry.id })
        .eq('id', sid);

      if (!updErr) totalLinked += 1;
    }

    offset += entries.length;
    if (entries.length < pageSize) break;
  }

  console.log(`[Backfill] Scanned ${totalChecked} journal entries; linked ${totalLinked}.`);
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const admin = createClient(url, key);

  // Confirm column exists
  const { error: colErr } = await admin.from('chat_sessions').select('journal_entry_id').limit(1);
  if (colErr) {
    console.error('chat_sessions.journal_entry_id not readable; ensure column exists first.');
  } else {
    await ensureIndexAndFk(admin);
  }

  await backfill(admin);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
