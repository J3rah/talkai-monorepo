import { NextRequest, NextResponse } from 'next/server';
import composio from '@/lib/composio';
import { executeTool } from '@/lib/composio';

// GET /api/composio/tools - List available tools
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId') || undefined;
    const toolkitsParam = url.searchParams.get('toolkits');
    const toolkits = toolkitsParam
      ? toolkitsParam.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

    // Fetch tools directly using the Composio client to support filters
    const tools = await (composio as any).tools.get(
      userId,
      toolkits ? { toolkits } : undefined
    );

    return NextResponse.json({ tools: tools || [] });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}

// POST /api/composio/tools - Execute a tool
export async function POST(request: NextRequest) {
  try {
    const { toolName, arguments: args } = await request.json();
    
    if (!toolName) {
      return NextResponse.json(
        { error: 'Tool name is required' },
        { status: 400 }
      );
    }

    const result = await executeTool(toolName, args);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error executing tool:', error);
    return NextResponse.json(
      { error: 'Failed to execute tool' },
      { status: 500 }
    );
  }
} 