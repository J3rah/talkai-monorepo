import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return { error: 'Authorization header required' } as const;
  }
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return { error: 'Invalid authentication' } as const;
  }
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  if (profileError) {
    return { error: 'Error checking admin status' } as const;
  }
  if (!profile?.is_admin) {
    return { error: 'Admin access required', status: 403 } as const;
  }
  return { user } as const;
}

export async function GET(request: NextRequest) {
  // Authn + authz
  const authRes = await authenticateAdmin(request);
  if ('error' in authRes) {
    return NextResponse.json({ error: authRes.error }, { status: authRes.status ?? 401 });
  }

  const url = new URL(request.url);
  const flaggedParam = url.searchParams.get('flagged'); // "true" | "false" | null
  const query = supabaseAdmin
    .from('public_journals')
    .select('id, content, reflection, created_at, is_flagged')
    .order('created_at', { ascending: false });
  if (flaggedParam === 'true') query.eq('is_flagged', true);
  if (flaggedParam === 'false') query.eq('is_flagged', false);

  const { data, error } = await query;
  if (error) {
    console.error('[Admin Journals] GET error', error);
    return NextResponse.json({ error: 'Failed to fetch journals' }, { status: 500 });
  }
  return NextResponse.json({ journals: data || [] });
} 