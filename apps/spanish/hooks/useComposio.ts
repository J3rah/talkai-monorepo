import { useState, useCallback } from 'react';

interface UseComposioReturn {
  tools: any[];
  loading: boolean;
  error: string | null;
  executeTool: (toolName: string, args?: any) => Promise<any>;
  refreshTools: () => Promise<void>;
}

export function useComposio(): UseComposioReturn {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/composio/tools');
      const data = await response.json();
      
      if (response.ok) {
        setTools(data.tools || []);
      } else {
        setError(data.error || 'Failed to fetch tools');
      }
    } catch (err) {
      setError('Network error while fetching tools');
    } finally {
      setLoading(false);
    }
  }, []);

  const executeTool = useCallback(async (toolName: string, args?: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/composio/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolName,
          arguments: args,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        return data.result;
      } else {
        throw new Error(data.error || 'Failed to execute tool');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTools = useCallback(async () => {
    await fetchTools();
  }, [fetchTools]);

  return {
    tools,
    loading,
    error,
    executeTool,
    refreshTools,
  };
} 