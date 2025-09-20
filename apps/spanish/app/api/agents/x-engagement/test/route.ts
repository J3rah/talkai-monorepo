import { NextRequest, NextResponse } from 'next/server';
import { XEngagementAgent } from '@/app/agents/XEngagementAgent';

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();
    
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
        { status: 500 }
      );
    }

    // Create a temporary agent instance for testing
    const testAgent = new XEngagementAgent({
      name: 'x-engagement-test',
      interval: 0, // Not used for manual test
      enabled: true,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      topics: [topic.trim()],
      maxActionsPerCycle: 3, // Limit for testing
    } as any);

    // Run a single cycle with the test topic
    await (testAgent as any).execute();

    return NextResponse.json({ 
      success: true, 
      message: `Test completed for topic: ${topic}` 
    });
  } catch (error) {
    console.error('Error running X engagement test:', error);
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

