import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  // Move client creation inside the handler to avoid build-time errors
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Check admin status using service role (bypasses RLS)
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('is_admin, subscription_status')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return NextResponse.json(
        { error: 'Failed to check admin status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      isAdmin: profile?.is_admin || false,
      subscriptionStatus: profile?.subscription_status || 'free'
    });

  } catch (error) {
    console.error('Error in admin check-direct API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 