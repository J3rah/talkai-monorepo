import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

async function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return { error: 'Authorization header required' } as const;
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return { error: 'Invalid authentication' } as const;
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  if (!profile?.is_admin) return { error: 'Admin access required', status: 403 } as const;
  return { user } as const;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await authenticateAdmin(request);
  if ('error' in authRes) {
    return NextResponse.json({ error: authRes.error }, { status: authRes.status ?? 401 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'id param required' }, { status: 400 });

  const body = await request.json();
  const { is_flagged } = body as { is_flagged?: boolean };
  if (typeof is_flagged !== 'boolean') {
    return NextResponse.json({ error: 'is_flagged boolean required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('public_journals')
    .update({ is_flagged })
    .eq('id', id)
    .select('id, is_flagged')
    .single();
  if (error) {
    console.error('[Admin Journals] PATCH error', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }

  return NextResponse.json({ success: true, entry: data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authRes = await authenticateAdmin(request);
  if ('error' in authRes) {
    return NextResponse.json({ error: authRes.error }, { status: authRes.status ?? 401 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'id param required' }, { status: 400 });

  const { error } = await supabaseAdmin
    .from('public_journals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Admin Journals] DELETE error', error);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 