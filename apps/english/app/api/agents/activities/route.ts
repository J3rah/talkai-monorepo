import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: activities, error } = await supabase
      .from('agent_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('Error fetching agent activities:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch agent activities',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 