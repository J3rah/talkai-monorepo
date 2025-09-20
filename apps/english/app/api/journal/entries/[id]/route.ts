import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper: service-role Supabase client
function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing SUPABASE URL');
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('Missing Supabase key');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'id param required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('public_journals')
      .select('id, content, reflection, created_at')
      .eq('id', id)
      .eq('is_published', true)
      .eq('is_flagged', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Row not found
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, entry: data });
  } catch (error: any) {
    console.error('[Journal API] GET single error', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch entry' },
      { status: 500 }
    );
  }
} 