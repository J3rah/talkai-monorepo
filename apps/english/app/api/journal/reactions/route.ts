import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing SUPABASE URL');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('Missing Supabase key');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const journalId = url.searchParams.get('journalId');
    if (!journalId) return NextResponse.json({ success: false, error: 'journalId required' }, { status: 400 });
    const supabase = getSupabaseAdmin();
    const { count, error } = await supabase
      .from('public_journal_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('journal_id', journalId)
      .eq('emoji', 'heart');
    if (error) throw error;
    return NextResponse.json({ success: true, count: count ?? 0 });
  } catch (error: unknown) {
    console.error('[Reactions API] GET error', error);
    const message = error instanceof Error ? error.message : 'error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { journalId } = body as { journalId?: string };
    if (!journalId) return NextResponse.json({ success: false, error: 'journalId required' }, { status: 400 });
    const supabase = getSupabaseAdmin();
    await supabase.from('public_journal_reactions').insert({ journal_id: journalId, emoji: 'heart' });
    const { count } = await supabase
      .from('public_journal_reactions')
      .select('*', { count: 'exact', head: true })
      .eq('journal_id', journalId)
      .eq('emoji', 'heart');
    return NextResponse.json({ success: true, count: count ?? 0 });
  } catch (error: unknown) {
    console.error('[Reactions API] POST error', error);
    const message = error instanceof Error ? error.message : 'error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
} 