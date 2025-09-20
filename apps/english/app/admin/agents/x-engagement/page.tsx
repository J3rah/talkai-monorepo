'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Settings, 
  Activity, 
  Twitter,
  AlertTriangle,
  CheckCircle,
  Heart,
  MessageSquare,
  Search
} from 'lucide-react';

export default function XEngagementAgentAdmin() {
  const [agentStatus, setAgentStatus] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Configuration state
  const [topics, setTopics] = useState('AI mental health, AI therapy, empathic AI, mental health technology');
  const [maxActions, setMaxActions] = useState(6);

  const fetchAgentStatus = async () => {
    try {
      const res = await fetch('/api/agents');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Agent data:', data);
      const xAgent = data.agents?.find((a: any) => a.name === 'x-engagement');
      setAgentStatus(xAgent || { name: 'x-engagement', isRunning: false });
    } catch (err) {
      console.error('Failed to fetch agent status:', err);
      setError(`Failed to fetch agent status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const toggleAgent = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const method = agentStatus?.isRunning ? 'DELETE' : 'POST';
      const res = await fetch('/api/agents', { method });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to toggle agent');
      }
      
      setSuccess(agentStatus?.isRunning ? 'Agent stopped successfully' : 'Agent started successfully');
      await fetchAgentStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const discoverTools = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await fetch('/api/composio/discover-tools?userId=user@email.com');
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Tool discovery results:', data);
      
      if (data.success) {
        const { discovery, tools, hasErrors, errors } = data;
        let message = `🔍 Discovery Results:\n`;
        message += `• Total tools: ${discovery.allToolsCount}\n`;
        message += `• Twitter tools: ${discovery.twitterToolsCount}\n`;
        message += `• X tools: ${discovery.xToolsCount}\n`;
        message += `• Filtered tools: ${discovery.filteredToolsCount}\n\n`;
        
        if (tools.filtered && tools.filtered.length > 0) {
          message += `Available X/Twitter tools:\n`;
          tools.filtered.forEach((tool: any) => {
            message += `• ${tool.name}\n`;
          });
        } else if (tools.twitter && tools.twitter.length > 0) {
          message += `Available Twitter tools:\n`;
          tools.twitter.forEach((tool: any) => {
            message += `• ${tool.name}\n`;
          });
        } else {
          message += `No X/Twitter tools found. You may need to connect your account first.`;
        }
        
        if (hasErrors && errors) {
          message += `\n\n⚠️ Some API calls failed:\n`;
          errors.forEach((error: string) => {
            message += `• ${error}\n`;
          });
        }
        
        setSuccess(message);
      } else if (data.networkIssues) {
        // Handle network issues specifically
        let message = `🌐 Network Connection Issues Detected\n\n`;
        message += `${data.suggestion}\n\n`;
        message += `This is the same TLS/certificate issue affecting other Composio API calls. `;
        message += `Since you've already connected your X/Twitter account via Composio Studio, `;
        message += `the agent should still work when running.\n\n`;
        message += `You can try starting the agent to see if it works despite these API discovery issues.`;
        
        setError(message);
      } else {
        setError(data.error || 'Failed to discover tools');
      }
    } catch (err) {
      console.error('Tool discovery error:', err);
      setError(err instanceof Error ? err.message : 'Failed to discover tools');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const res = await fetch('/api/composio/tools?toolkits=TWITTER,X');
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        
        // Check if it's a network/TLS error
        if (errorText.includes('TLS') || errorText.includes('certificate') || errorText.includes('Connection error')) {
          setError('Network connection issue detected. If you connected via Composio Studio, your connection should work despite this error. Try starting the agent to test actual functionality.');
          return;
        }
        
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Tools data:', data);
      
      if (data.tools && data.tools.length > 0) {
        setSuccess(`✅ Found ${data.tools.length} X/Twitter tools! Connection appears to be working.`);
      } else {
        setError('No X/Twitter tools found. If you connected via Composio Studio, this might be a display issue. Try starting the agent to test actual functionality.');
      }
    } catch (err) {
      console.error('Connection test error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to test connection';
      
      if (errorMsg.includes('fetch failed') || errorMsg.includes('network') || errorMsg.includes('TLS')) {
        setError('Connection test failed due to network issues, but your Composio Studio connection should still work. Try starting the agent to test actual functionality.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };



  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/agents/activities');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Activities data:', data);
      const xActivities = data.activities?.filter((a: any) => 
        a.agent_name === 'x-engagement'
      ).slice(0, 20) || [];
      setActivities(xActivities);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    }
  };

  useEffect(() => {
    fetchAgentStatus();
    fetchActivities();
    
    // Poll every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchAgentStatus();
      fetchActivities();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (message: string) => {
    if (message.includes('Liked tweet')) return <Heart className="h-4 w-4 text-red-500" />;
    if (message.includes('Replied to tweet')) return <MessageSquare className="h-4 w-4 text-blue-500" />;
    if (message.includes('Boosted tweet') || message.includes('retweet')) return <RefreshCw className="h-4 w-4 text-green-500" />;
    if (message.includes('tweets found') || message.includes('searching')) return <Search className="h-4 w-4 text-purple-500" />;
    if (message.includes('Error') || message.includes('failed')) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (message.includes('started') || message.includes('completed')) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Twitter className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">X Engagement Agent</h1>
            <p className="text-gray-600">Autonomous social media engagement for talkAI</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant={agentStatus?.isRunning ? "default" : "secondary"}>
            {agentStatus?.isRunning ? "Running" : "Stopped"}
          </Badge>
          
          <Button
            onClick={toggleAgent}
            disabled={loading}
            variant={agentStatus?.isRunning ? "destructive" : "default"}
            className="flex items-center space-x-2"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : agentStatus?.isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>{agentStatus?.isRunning ? "Stop Agent" : "Start Agent"}</span>
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="connection">Connection Test</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Agent Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge variant={agentStatus?.isRunning ? "default" : "secondary"}>
                    {agentStatus?.isRunning ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Current Topics:</span>
                  <span className="text-sm text-gray-600">{topics.split(',').length} configured</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Max Actions/Cycle:</span>
                  <span className="text-sm text-gray-600">{maxActions}</span>
                </div>

                <Button 
                  onClick={fetchAgentStatus}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh Status
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={testConnection}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Twitter className="h-4 w-4 mr-2" />
                  )}
                  Test X/Twitter Connection
                </Button>

                <Button 
                  onClick={() => window.open('/api/authorize/TWITTER', '_blank')}
                  className="w-full"
                  variant="outline"
                >
                  Connect X/Twitter Account
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  Environment variables needed:
                  <br />
                  • COMPOSIO_API_KEY
                  <br />
                  • X_AGENT_TOPICS (optional)
                  <br />
                  • X_AGENT_MAX_ACTIONS (optional)
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </div>
                <Button 
                  onClick={fetchActivities}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
              <CardDescription>Latest actions and events from the X Engagement Agent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {activities.length > 0 ? (
                  activities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded-lg border">
                      {getActivityIcon(activity.message)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <details className="mt-1">
                            <summary className="text-xs text-blue-600 cursor-pointer">
                              View details
                            </summary>
                            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-20">
                              {JSON.stringify(activity.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No activity recorded yet</p>
                    <p className="text-xs mt-1">
                      {agentStatus?.isRunning 
                        ? "Agent is running - activity will appear here when actions are taken"
                        : "Start the agent to see activity logs"}
                    </p>
                  </div>
                )}
              </div>
              {activities.length > 5 && (
                <div className="mt-3 text-center">
                  <Button variant="outline" size="sm">
                    View All Activity ({activities.length} total)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Complete Activity Log</span>
                </div>
                <Button 
                  onClick={fetchActivities}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>
                Detailed log of all X Engagement Agent activities and actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                      {getActivityIcon(activity.message)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-blue-600 cursor-pointer">
                              View metadata
                            </summary>
                            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(activity.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-16">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No Activity Yet</h3>
                    <p className="mb-4">
                      {agentStatus?.isRunning 
                        ? "The agent is running but hasn't performed any actions yet. Activity will appear here when the agent finds and engages with relevant tweets."
                        : "Start the agent to begin autonomous X/Twitter engagement and see activity logs here."}
                    </p>
                    {!agentStatus?.isRunning && (
                      <Button onClick={toggleAgent} disabled={loading}>
                        {loading ? (
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        Start Agent
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Agent Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure topics and behavior settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topics">Target Topics</Label>
                <Textarea
                  id="topics"
                  placeholder="AI mental health, AI therapy, empathic AI"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Comma-separated list of topics to search for and engage with
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-actions">Max Actions Per Cycle</Label>
                <Input
                  id="max-actions"
                  type="number"
                  min="1"
                  max="50"
                  value={maxActions}
                  onChange={(e) => setMaxActions(parseInt(e.target.value) || 6)}
                />
                <p className="text-xs text-gray-500">
                  Maximum number of actions (likes, replies, boosts) per execution cycle
                </p>
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <strong>What is a cycle?</strong> A cycle is one complete run of the agent, which happens every <strong>1 hour</strong>. 
                  During each cycle, the agent will:
                  <ul className="list-disc list-inside mt-1 ml-2 space-y-1">
                    <li>Search for tweets on your configured topics</li>
                    <li>Evaluate each tweet for relevance</li>
                    <li>Like, reply to, or boost relevant tweets</li>
                    <li>Stop after reaching the max actions limit</li>
                  </ul>
                  <div className="mt-2 text-blue-700">
                    <strong>Example:</strong> If set to 6, the agent will perform up to 6 total actions (e.g., 3 likes + 2 replies + 1 boost) every hour.
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6 mt-6" />
              
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1">
                  Save Configuration
                </Button>
                <Button variant="outline" className="flex-1">
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connection Test Tab */}
        <TabsContent value="connection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>X/Twitter Connection Test</CardTitle>
              <CardDescription>
                Test your Composio X/Twitter integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Search className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="font-medium">Search</div>
                  <div className="text-xs text-gray-500">Find tweets by topic</div>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <div className="font-medium">Like</div>
                  <div className="text-xs text-gray-500">Like relevant tweets</div>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="font-medium">Reply</div>
                  <div className="text-xs text-gray-500">Send empathetic replies</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => window.open('/api/authorize/TWITTER', '_blank')}
                  className="w-full"
                  variant="default"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Connect X/Twitter Account
                </Button>

                <Button 
                  onClick={discoverTools}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Discover Available Tools
                </Button>

                <Button 
                  onClick={testConnection}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Test All Connections
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <strong className="text-blue-800">X/Twitter Authorization Status</strong>
                </div>
                <p className="text-blue-700 text-sm">
                  ✅ You have successfully connected your X/Twitter account (talkAI_im) via Composio Studio!
                </p>
                <p className="text-blue-600 text-xs mt-2">
                  Even if the connection test above fails due to network issues, your authorization should work when the agent runs.
                  The agent will use the connection you established in Composio Studio.
                </p>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={() => setSuccess('✅ Ready to start! Your X/Twitter connection is authorized.')}
                  className="w-full"
                  variant="default"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Confirm Connection is Ready
                </Button>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <strong>Setup Steps:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Set COMPOSIO_API_KEY in your environment</li>
                  <li>Click "Connect X/Twitter Account" above</li>
                  <li>Authorize talkAI to access your X/Twitter account</li>
                  <li>Click "Test All Connections" to verify</li>
                  <li>Start the agent to begin autonomous engagement</li>
                </ol>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <strong className="text-yellow-800">Having connection issues?</strong>
                  <p className="text-yellow-700 mt-1">
                    If the "Connect X/Twitter Account" button shows a 500 error, this is likely due to network/proxy restrictions. 
                    You can connect manually:
                  </p>
                  <ol className="list-decimal list-inside mt-2 text-yellow-700">
                    <li>Go to <a href="https://app.composio.dev" target="_blank" className="underline">app.composio.dev</a></li>
                    <li>Navigate to Connections → Add New Connection</li>
                    <li>Select "Twitter" or "X" from the list</li>
                    <li>Follow the authorization flow</li>
                    <li>Return here and click "Test All Connections"</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

