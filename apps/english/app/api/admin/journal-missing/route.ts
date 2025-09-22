import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase URL or Service Role Key');
  return createClient(url, key);
}

export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('chat_sessions')
      .select('id, created_at')
      .is('journal_entry_id', null)
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) throw error;
    return NextResponse.json({ success: true, missing: data || [] });
  } catch (err: any) {
    console.error('[Admin Missing] Error', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to load' }, { status: 500 });
  }
}
