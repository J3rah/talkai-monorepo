import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import openai from '@/lib/openai';

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
  console.log('[Journal API] Using Supabase key prefix', supabaseKey?.slice(0, 8));
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey
  );
}

// Check if we're in build time (no environment variables available)
const isBuildTime = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(req: Request) {
  try {
    // Skip during build time
    if (isBuildTime) {
      return NextResponse.json({ success: true, entries: [], nextOffset: 0 });
    }

    const url = new URL(req.url);
    const offset = Number(url.searchParams.get('offset') ?? '0');
    const limit = Number(url.searchParams.get('limit') ?? '20');

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('public_journals')
      .select('id, content, reflection, created_at')
      .eq('is_published', true)
      .eq('is_flagged', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ success: true, entries: data, nextOffset: offset + (data?.length ?? 0) });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Skip during build time
    if (isBuildTime) {
      return NextResponse.json({ success: false, error: 'Service unavailable during build' }, { status: 503 });
    }

    const body = await req.json();
    const { content } = body as { content?: string };

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Content required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Get authenticated user from request
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    console.log('[Journal API] Creating reflection via OpenAI for user:', userId);
    // Generate AI reflection using OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_JOURNAL_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an empathetic therapist providing concise reflections (2-3 sentences) on user journal entries.' },
        { role: 'user', content }
      ],
      max_tokens: 120,
      temperature: 0.7
    });

    const reflection = completion.choices?.[0]?.message?.content?.trim() ?? '';

    const { data, error } = await supabase
      .from('public_journals')
      .insert({ content, reflection, is_published: false, user_id: userId })
      .select('id, content, reflection, created_at')
      .single();

    if (error) {
      console.error('[Journal API] Supabase insert error', error);
      throw error;
    }

    return NextResponse.json({ success: true, entry: data });
  } catch (error: unknown) {
    console.error('[Journal API] Error creating journal entry:', error);
    const message = typeof error === 'string' ? error : (error instanceof Error ? error.message : 'Failed to create entry');
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
} 