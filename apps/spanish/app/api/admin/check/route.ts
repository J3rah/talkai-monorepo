import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Ensure environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create supabase client only if environment variables are available
let supabase: any = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET(request: NextRequest) {
  try {
    // Check environment variables first
    if (!supabaseUrl || !supabaseServiceKey || !supabase) {
      console.error('Admin check failed: Missing environment variables', {
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
        hasSupabaseClient: !!supabase
      });
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'Missing required environment variables'
      }, { status: 500 });
    }

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Verify the JWT token and get user info
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Admin check auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check admin status using service role (bypasses RLS)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Error checking admin status' }, { status: 500 });
    }

    const isAdmin = profile?.is_admin || false;
    console.log('Admin check result:', { userId: user.id, isAdmin });

    return NextResponse.json({ 
      isAdmin,
      userId: user.id 
    });

  } catch (error) {
    console.error('Error in admin check:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 