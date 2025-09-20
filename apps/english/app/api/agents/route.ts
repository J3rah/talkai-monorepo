import { NextResponse } from 'next/server';
import { SessionCleanupAgent } from '@/app/agents/SessionCleanupAgent';
import { TalkAI1Agent } from '@/app/agents/TalkAI1Agent';
import { BlogCommentAgent } from '@/app/agents/BlogCommentAgent';
import { XEngagementAgent } from '@/app/agents/XEngagementAgent';

// Store active agents
const activeAgents = new Map<string, any>();

// Initialize agents
const initializeAgents = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing required environment variables');
  }

  // Initialize session cleanup agent
  const sessionCleanupAgent = new SessionCleanupAgent({
    name: 'session-cleanup',
    interval: 15 * 60 * 1000, // Run every 15 minutes
    enabled: true,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  });

  // Initialize TalkAI1 agent
  const talkAI1Agent = new TalkAI1Agent({
    name: 'talkAI1',
    interval: 30 * 60 * 1000, // Run every 30 minutes
    enabled: true,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  });

  // Initialize Blog Comment agent
  const blogCommentAgent = new BlogCommentAgent({
    name: 'blog-comment',
    interval: 6 * 60 * 60 * 1000, // Run every 6 hours
    enabled: true,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  // Initialize X/Twitter Engagement agent
  const xEngagementAgent = new XEngagementAgent({
    name: 'x-engagement',
    interval: 60 * 60 * 1000, // Run every 1 hour
    enabled: true,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    topics: (process.env.X_AGENT_TOPICS || '').split(',').map(s => s.trim()).filter(Boolean),
    maxActionsPerCycle: Number(process.env.X_AGENT_MAX_ACTIONS || 6),
  } as any);

  activeAgents.set('session-cleanup', sessionCleanupAgent);
  activeAgents.set('talkAI1', talkAI1Agent);
  activeAgents.set('blog-comment', blogCommentAgent);
  activeAgents.set('x-engagement', xEngagementAgent);
};

// Start all agents
export async function POST() {
  try {
    if (activeAgents.size === 0) {
      initializeAgents();
    }

    for (const [name, agent] of activeAgents) {
      if (!agent.isRunning) {
        await agent.start();
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'All agents started successfully',
      activeAgents: Array.from(activeAgents.keys())
    });
  } catch (error) {
    console.error('Error starting agents:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to start agents',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Stop all agents
export async function DELETE() {
  try {
    for (const [name, agent] of activeAgents) {
      if (agent.isRunning) {
        agent.stop();
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'All agents stopped successfully'
    });
  } catch (error) {
    console.error('Error stopping agents:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to stop agents',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Get agent status
export async function GET() {
  try {
    const status = Array.from(activeAgents.entries()).map(([name, agent]) => ({
      name,
      isRunning: agent.isRunning,
      lastActivity: agent.lastActivity
    }));

    return NextResponse.json({ 
      success: true, 
      agents: status
    });
  } catch (error) {
    console.error('Error getting agent status:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to get agent status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 