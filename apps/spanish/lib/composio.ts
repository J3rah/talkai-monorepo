// lib/composio.ts
import { Composio } from '@composio/core';

type ComposioConnection = {
  id?: string;
  toolkit?: string;
  name?: string | null;
};

type ComposioClientShape = {
  tools: {
    get: () => Promise<unknown[]>;
    execute: (toolName: string, args: unknown, connectionId?: string) => Promise<unknown>;
  };
  connections: {
    list: () => Promise<ComposioConnection[]>;
    get: (...args: unknown[]) => Promise<unknown>;
  };
  toolkits: {
    authorize: (userId: string, toolkit: string) => Promise<{ redirectUrl?: string }>;
  };
};

const apiKey = process.env.COMPOSIO_API_KEY;

// Add debugging
console.log('🔍 Composio Debug: API Key present:', !!apiKey);
console.log('🔍 Composio Debug: API Key length:', apiKey ? apiKey.length : 0);

let composioClient: ComposioClientShape;

if (apiKey) {
  // Real client when key is present
  console.log('🔍 Composio Debug: Initializing real client');
  composioClient = new Composio({ 
    apiKey
  }) as any;
} else {
  // Fallback stub so build doesn't crash in environments without the key
  console.warn('⚠️  COMPOSIO_API_KEY not set – Composio features disabled for this build');
  composioClient = {
    tools: {
      // Return empty array so callers can safely destructure
      get: async () => [],
      execute: async () => ({ error: 'Composio not configured' }),
    },
    connections: {
      list: async () => [],
      get: async () => null,
    },
    toolkits: {
      authorize: async () => ({ redirectUrl: undefined }),
    },
  };
}

// Helper function to get available tools
export async function getAvailableTools(): Promise<unknown[]> {
  try {
    console.log('🔍 Composio Debug: getAvailableTools called');
    if (!apiKey) {
      console.log('🔍 Composio Debug: No API key, returning empty array');
      return [];
    }
    console.log('🔍 Composio Debug: Fetching tools from Composio...');
    const tools = await composioClient.tools.get();
    console.log('🔍 Composio Debug: Tools received:', Array.isArray(tools) ? tools.length : 'unknown');
    console.log('🔍 Composio Debug: Tools:', tools);
    return tools;
  } catch (error: unknown) {
    console.error('❌ Error fetching Composio tools:', error);
    return [];
  }
}

// Helper function to execute a tool
export async function executeTool(
  toolName: string,
  arguments_: string | Record<string, unknown>,
  connectionId?: string
) {
  try {
    if (!apiKey) {
      throw new Error('Composio API key not configured');
    }
    
    console.log(`🔧 Executing tool ${toolName} with args:`, arguments_, connectionId ? `using connection: ${connectionId}` : '');
    
    // The Composio API expects arguments to be passed in a specific format
    // Based on the error, it seems like it expects either 'text' OR 'arguments', not both
    let formattedArgs: unknown;
    
    if (typeof arguments_ === 'string') {
      // If it's a string, pass it as 'text'
      formattedArgs = { text: arguments_ };
    } else if (typeof arguments_ === 'object' && arguments_ !== null && 'text' in arguments_) {
      // If it already has a 'text' field, use it as is
      formattedArgs = arguments_;
    } else {
      // Otherwise, wrap in 'arguments' field
      formattedArgs = { arguments: arguments_ };
    }
    
    console.log(`🔧 Formatted args for ${toolName}:`, formattedArgs);
    const result = connectionId
      ? await composioClient.tools.execute(toolName, formattedArgs, connectionId)
      : await composioClient.tools.execute(toolName, formattedArgs);
    return result;
  } catch (error: unknown) {
    console.error(`Error executing tool ${toolName}:`, error);
    throw error;
  }
}

// Helper function to get connections
export async function getConnections(): Promise<ComposioConnection[]> {
  try {
    if (!apiKey) return [];
    const connections = await composioClient.connections.list();
    return connections;
  } catch (error: unknown) {
    console.error('Error fetching connections:', error);
    return [];
  }
}

// Helper function to get the X/Twitter connection ID
export async function getTwitterConnectionId(): Promise<string | null> {
  try {
    if (!apiKey) return null;
    const connections = await composioClient.connections.list();
    
    // Look for X/Twitter connection
    const twitterConnection = connections.find((conn: ComposioConnection) => 
      conn.toolkit === 'TWITTER' || 
      conn.toolkit === 'X' ||
      conn.name?.toLowerCase().includes('twitter') ||
      conn.name?.toLowerCase().includes('x')
    );
    
    if (twitterConnection) {
      console.log('🔗 Found Twitter connection:', twitterConnection.id);
      return twitterConnection.id || null;
    }
    
    console.log('❌ No Twitter connection found');
    return null;
  } catch (error: unknown) {
    console.error('Error fetching Twitter connection:', error);
    return null;
  }
}

export default composioClient;