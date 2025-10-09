import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper to create a Supabase client with service role key (server-side)
function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  console.log('[Therapist Feedback API] Using Supabase key prefix', supabaseKey?.slice(0, 8));
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey
  );
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('therapist_feedback')
      .select('id, feedback_content, created_at, session_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, feedback: data });
  } catch (error) {
    console.error('Error fetching therapist feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, sessionId } = body as { content?: string; sessionId?: string };

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Content required' }, { status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Session ID required' }, { status: 400 });
    }

    // Get authenticated user from request
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      // Create a client with anon key for user authentication
      const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    console.log('[Therapist Feedback API] Saving therapist feedback for user:', userId, 'session:', sessionId);
    
    // Save to private therapist feedback table
    const { data, error } = await supabase
      .from('therapist_feedback')
      .insert({ 
        user_id: userId,
        session_id: sessionId,
        feedback_content: content
      })
      .select('id, feedback_content, created_at')
      .single();

    if (error) {
      console.error('[Therapist Feedback API] Supabase insert error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, entry: data });
  } catch (error: unknown) {
    console.error('[Therapist Feedback API] Error creating therapist feedback:', error);
    const message = typeof error === 'string' ? error : (error instanceof Error ? error.message : 'Failed to create feedback');
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
