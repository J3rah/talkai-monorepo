import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client for the authenticated user
const createUserSupabase = (authHeader: string) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    }
  );
};

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const userSupabase = createUserSupabase(authHeader);

    // Get the authenticated user
    const { data: { user }, error: userError } = await userSupabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    console.log(`🗑️ Deleting all session data for user: ${user.id}`);

    // Delete all chat sessions for the user (this will cascade to related tables)
    const { error: deleteError } = await userSupabase
      .from('chat_sessions')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting user sessions:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete session data' },
        { status: 500 }
      );
    }

    console.log(`✅ Successfully deleted all session data for user: ${user.id}`);

    return NextResponse.json({ 
      success: true,
      message: 'All session data deleted successfully'
    });

  } catch (error) {
    console.error('Error in delete user sessions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 