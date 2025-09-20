'use client';

import { useEffect } from 'react';
import { useComposio } from '@/hooks/useComposio';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ComposioToolsDemo() {
  const { tools, loading, error, executeTool, refreshTools } = useComposio();

  useEffect(() => {
    refreshTools();
  }, [refreshTools]);

  const handleExecuteTool = async (toolName: string) => {
    try {
      // Example: Execute a Google Sheets tool
      const result = await executeTool(toolName, {
        // Add appropriate arguments based on the tool
        spreadsheetId: 'your-spreadsheet-id',
        sheetName: 'Sheet1',
        values: [['Test', 'Data']]
      });
      console.log('Tool execution result:', result);
    } catch (err) {
      console.error('Failed to execute tool:', err);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading Composio tools...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-600">
            <h3 className="font-semibold">Error loading Composio tools:</h3>
            <p>{error}</p>
            <Button onClick={refreshTools} className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Composio Tools Integration
            <Badge variant="secondary">{tools.length} tools available</Badge>
          </CardTitle>
          <CardDescription>
            Available tools from your Composio integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tools.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No tools available. Make sure your Composio API key is configured.</p>
              <Button onClick={refreshTools} className="mt-2">
                Refresh Tools
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {tools.map((tool, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{tool.name || tool.displayName}</h4>
                      <p className="text-sm text-gray-600">
                        {tool.description || 'No description available'}
                      </p>
                      {tool.toolkit && (
                        <Badge variant="outline" className="mt-1">
                          {tool.toolkit}
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => handleExecuteTool(tool.name || tool.displayName)}
                      size="sm"
                    >
                      Execute
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
          <CardDescription>
            How to use Composio tools in your AI therapy application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Google Sheets Integration</h4>
              <p className="text-sm text-gray-600">
                Store therapy session data, track progress, or maintain client records
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Email Integration</h4>
              <p className="text-sm text-gray-600">
                Send follow-up emails, appointment reminders, or progress reports
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Calendar Integration</h4>
              <p className="text-sm text-gray-600">
                Schedule sessions, manage appointments, or set reminders
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 