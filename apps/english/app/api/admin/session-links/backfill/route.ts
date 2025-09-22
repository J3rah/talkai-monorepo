import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-only: create admin client
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase URL or Service Role Key');
  return createClient(url, key);
}

const UUID_RE = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/;

function extractSessionIdFromContent(content: string | null): string | null {
  if (!content) return null;
  const enIdx = content.indexOf('(Session');
  const esIdx = content.indexOf('(Sesión');
  const idx = enIdx >= 0 ? enIdx : esIdx;
  if (idx === -1) return null;
  const after = content.slice(idx);
  const match = after.match(UUID_RE);
  return match ? match[0] : null;
}

export async function POST() {
  try {
    const admin = getSupabaseAdmin();

    let offset = 0;
    const pageSize = 500;
    let scanned = 0;
    let linked = 0;

    while (true) {
      const { data: entries, error } = await admin
        .from('public_journals')
        .select('id, content, created_at')
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) throw error;
      if (!entries || entries.length === 0) break;

      for (const entry of entries) {
        scanned += 1;
        const sid = extractSessionIdFromContent(entry.content as unknown as string);
        if (!sid) continue;

        const { data: session, error: sErr } = await admin
          .from('chat_sessions')
          .select('id, journal_entry_id')
          .eq('id', sid)
          .single();
        if (sErr || !session) continue;
        if (session.journal_entry_id) continue;

        const { error: updErr } = await admin
          .from('chat_sessions')
          .update({ journal_entry_id: entry.id })
          .eq('id', sid);
        if (!updErr) linked += 1;
      }

      offset += entries.length;
      if (entries.length < pageSize) break;
    }

    return NextResponse.json({ success: true, scanned, linked });
  } catch (err: any) {
    console.error('[Admin Backfill] Error', err);
    return NextResponse.json({ success: false, error: err?.message || 'Backfill failed' }, { status: 500 });
  }
}
