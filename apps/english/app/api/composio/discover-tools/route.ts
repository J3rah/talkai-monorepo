import { NextRequest, NextResponse } from 'next/server';
import composio from '@/lib/composio';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId') || 'user@email.com';
    
    console.log('🔍 Discovering all available tools for user:', userId);
    
    let allTools: any[] = [];
    let twitterTools: any[] = [];
    let xTools: any[] = [];
    let errors: string[] = [];
    
    // Try to get all tools without filtering first
    try {
      allTools = await (composio as any).tools.get(userId);
      console.log('📋 All tools found:', allTools?.length || 0);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Failed to get all tools:', errorMsg);
      errors.push(`All tools: ${errorMsg}`);
    }
    
    // Try to get Twitter/X specific tools
    try {
      twitterTools = await (composio as any).tools.get(userId, { toolkits: ['TWITTER'] });
      console.log('🐦 Twitter tools found:', twitterTools?.length || 0);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Failed to get Twitter tools:', errorMsg);
      errors.push(`Twitter tools: ${errorMsg}`);
    }
    
    // Try X toolkit
    try {
      xTools = await (composio as any).tools.get(userId, { toolkits: ['X'] });
      console.log('❌ X tools found:', xTools?.length || 0);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Failed to get X tools:', errorMsg);
      errors.push(`X tools: ${errorMsg}`);
    }
    
    // Filter all tools for anything Twitter/X related
    // If allTools failed but we have Twitter tools, use those instead
    const toolsToFilter = (allTools && allTools.length > 0) ? allTools : [...(twitterTools || []), ...(xTools || [])];
    const filteredTools = (toolsToFilter || []).filter((tool: any) => {
      const name = (tool?.function?.name || tool?.name || '').toUpperCase();
      return name.includes('TWITTER') || name.includes('X_') || name.startsWith('X') || 
             name.includes('TWEET') || name.includes('SOCIAL');
    });
    
    console.log('🔎 Filtered Twitter/X related tools:', filteredTools.length);
    
    // If we have network errors but no data, return a helpful response
    if (errors.length > 0 && (!allTools || allTools.length === 0) && (!twitterTools || twitterTools.length === 0) && (!xTools || xTools.length === 0)) {
      return NextResponse.json({
        success: false,
        error: 'Network/API connection issues detected',
        networkIssues: true,
        errors,
        suggestion: 'This appears to be the same TLS/network issue affecting other Composio API calls. Your X/Twitter connection via Composio Studio should still work despite this error.',
        discovery: {
          allToolsCount: 0,
          twitterToolsCount: 0,
          xToolsCount: 0,
          filteredToolsCount: 0
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      hasErrors: errors.length > 0,
      errors: errors.length > 0 ? errors : undefined,
      discovery: {
        allToolsCount: (allTools && allTools.length) || 0,
        twitterToolsCount: (twitterTools && twitterTools.length) || 0,
        xToolsCount: (xTools && xTools.length) || 0,
        filteredToolsCount: filteredTools.length
      },
      tools: {
        all: (allTools && allTools.length > 0) ? allTools.slice(0, 10).map((t: any) => ({ 
          name: t?.function?.name || t.name || 'Unknown', 
          description: t?.function?.description || t.description || 'No description' 
        })) : [],
        twitter: (twitterTools && twitterTools.length > 0) ? twitterTools.map((t: any) => ({ 
          name: t?.function?.name || t.name || 'Unknown', 
          description: t?.function?.description || t.description || 'No description' 
        })) : [],
        x: (xTools && xTools.length > 0) ? xTools.map((t: any) => ({ 
          name: t?.function?.name || t.name || 'Unknown', 
          description: t?.function?.description || t.description || 'No description' 
        })) : [],
        filtered: filteredTools.map((t: any) => ({ 
          name: t?.function?.name || t.name || 'Unknown', 
          description: t?.function?.description || t.description || 'No description' 
        }))
      }
    });
  } catch (error) {
    console.error('Error discovering tools:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    
    // Check for network/TLS issues
    if (errorMsg.includes('TLS') || errorMsg.includes('certificate') || errorMsg.includes('Connection error') || errorMsg.includes('fetch failed')) {
      return NextResponse.json({
        success: false,
        error: 'Network connection error',
        networkIssues: true,
        details: 'Unable to connect to Composio API due to network/TLS issues. This is the same issue affecting other Composio API calls.',
        suggestion: 'Your X/Twitter connection via Composio Studio should still work despite this error. The agent may work when actually running.',
        originalError: errorMsg
      }, { status: 200 }); // Return 200 instead of 500 for network issues
    }
    
    return NextResponse.json({
      success: false,
      error: errorMsg,
      details: 'Failed to discover available tools'
    }, { status: 500 });
  }
}
