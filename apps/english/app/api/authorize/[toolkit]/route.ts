// app/api/composio/authorize/[toolkit]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import composio from '@/lib/composio';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ toolkit: string }> }
) {
  try {
    // TODO: Replace with your actual user logic
    const userId = 'user@email.com';
    const { toolkit } = await params;

    console.log(`Attempting to authorize toolkit: ${toolkit} for user: ${userId}`);

    const connectionRequest = await composio.toolkits.authorize(userId, toolkit);

    // Redirect the user to the Composio authorization URL
    if (!connectionRequest.redirectUrl) {
      return NextResponse.json({ 
        error: 'No redirectUrl returned from Composio.',
        toolkit,
        userId 
      }, { status: 400 });
    }
    
    console.log(`Authorization successful, redirecting to: ${connectionRequest.redirectUrl}`);
    return NextResponse.redirect(connectionRequest.redirectUrl);
  } catch (error) {
    console.error('Error in authorize route:', error);
    
    // Check if it's a network/TLS error
    if (error instanceof Error) {
      if (error.message.includes('TLS') || error.message.includes('certificate') || error.message.includes('Connection error')) {
        return NextResponse.json({
          error: 'Network connection error',
          details: 'Unable to connect to Composio API. This might be due to network restrictions or proxy settings.',
          suggestion: 'Try connecting from a different network or check your proxy/firewall settings.',
          originalError: error.message
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      error: 'Failed to authorize toolkit',
      toolkit: (await params).toolkit,
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}