"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Play, Square, Plus, RefreshCw, Edit, Trash, Eye } from "lucide-react";

interface AgentStatus {
  name: string;
  isRunning: boolean;
  lastActivity?: string;
}

interface AgentActivity {
  id: number;
  agent_name: string;
  message: string;
  metadata: any;
  created_at: string;
}

interface EditingAgent {
  id: number;
  name: string;
  type: string;
  interval: number;
  enabled: boolean;
  serviceUrl: string;
  apiKey: string;
  isRunning: boolean;
  logs: string[];
  lastActivity?: string;
}

const AGENT_TYPES = [
  { value: 'SessionCleanupAgent', label: 'Session Cleanup Agent' },
  { value: 'WebhookAgent', label: 'Webhook Agent' },
  { value: 'CustomAgent', label: 'Custom Agent' },
];

function getDefaultAgent() {
  return {
    id: Date.now(),
    name: '',
    type: AGENT_TYPES[0].value,
    interval: 60000,
    enabled: true,
    serviceUrl: '',
    apiKey: '',
    isRunning: false,
    logs: [],
  };
}

function agentStatusToEditingAgent(status: AgentStatus): EditingAgent {
  return {
    id: Date.now() + Math.floor(Math.random() * 10000), // fallback unique id
    name: status.name,
    type: AGENT_TYPES[0].value,
    interval: 60000,
    enabled: true,
    serviceUrl: '',
    apiKey: '',
    isRunning: status.isRunning,
    logs: [],
    lastActivity: status.lastActivity,
  };
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<EditingAgent[]>([]);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<EditingAgent | null>(null);
  const [showDetails, setShowDetails] = useState<EditingAgent | null>(null);

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      if (data.success) {
        setAgents(data.agents.map(agentStatusToEditingAgent));
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch agent status');
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/agents/activities');
      const data = await response.json();
      if (data.success) {
        setActivities(data.activities);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([fetchAgentStatus(), fetchActivities()]);
    setRefreshing(false);
  };

  useEffect(() => {
    refreshData();
    // Set up polling every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStartAgents = async () => {
    try {
      const response = await fetch('/api/agents', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        await refreshData();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to start agents');
    }
  };

  const handleStopAgents = async () => {
    try {
      const response = await fetch('/api/agents', { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        await refreshData();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to stop agents');
    }
  };

  const handleCreate = () => {
    setEditingAgent(getDefaultAgent());
    setShowModal(true);
  };

  const handleEdit = (agent: EditingAgent) => {
    setEditingAgent({ ...agent });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setAgents(agents.filter(a => a.id !== id));
  };

  const handleSave = (agent: EditingAgent) => {
    if (agent.id && agents.some(a => a.id === agent.id)) {
      setAgents(agents.map(a => (a.id === agent.id ? agent : a)));
    } else {
      setAgents([...agents, { ...agent, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingAgent(null);
  };

  const handleStart = (id: number) => {
    setAgents(agents.map(a => a.id === id ? { ...a, isRunning: true, logs: [...a.logs, `Started at ${new Date().toLocaleString()}`] } : a));
  };
  const handleStop = (id: number) => {
    setAgents(agents.map(a => a.id === id ? { ...a, isRunning: false, logs: [...a.logs, `Stopped at ${new Date().toLocaleString()}`] } : a));
  };

  const handleShowDetails = (agent: EditingAgent) => setShowDetails(agent);
  const handleCloseDetails = () => setShowDetails(null);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Background Agents</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleStartAgents}
            disabled={loading || agents.some(a => a.isRunning)}
          >
            <Play className="w-4 h-4 mr-2" />
            Start All
          </Button>
          <Button
            variant="destructive"
            onClick={handleStopAgents}
            disabled={loading || !agents.some(a => a.isRunning)}
          >
            <Square className="w-4 h-4 mr-2" />
            Stop All
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" /> Create Agent
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agent Status Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Status</CardTitle>
            <CardDescription>Current status of all background agents</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div
                    key={agent.name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{agent.name}</h3>
                      {agent.lastActivity && (
                        <p className="text-sm text-muted-foreground">
                          Last activity: {new Date(agent.lastActivity).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Badge variant={agent.isRunning ? "success" : "secondary"}>
                      {agent.isRunning ? "Running" : "Stopped"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest operations performed by agents</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{activity.agent_name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{activity.message}</p>
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <pre className="mt-2 text-xs bg-muted p-2 rounded">
                        {JSON.stringify(activity.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingAgent?.id ? 'Edit Agent' : 'Create Agent'}</h2>
            <form onSubmit={e => {
              e.preventDefault();
              if (editingAgent) handleSave(editingAgent);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded" value={editingAgent?.name || ''} onChange={e => editingAgent && setEditingAgent({ ...editingAgent, name: e.target.value, id: editingAgent.id ?? Date.now(), type: editingAgent.type ?? AGENT_TYPES[0].value, interval: editingAgent.interval ?? 60000, enabled: editingAgent.enabled ?? true, serviceUrl: editingAgent.serviceUrl ?? '', apiKey: editingAgent.apiKey ?? '', isRunning: editingAgent.isRunning ?? false, logs: editingAgent.logs ?? [] })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select className="w-full px-3 py-2 border rounded" value={editingAgent?.type || ''} onChange={e => editingAgent && setEditingAgent({ ...editingAgent, type: e.target.value, id: editingAgent.id ?? Date.now(), name: editingAgent.name ?? '', interval: editingAgent.interval ?? 60000, enabled: editingAgent.enabled ?? true, serviceUrl: editingAgent.serviceUrl ?? '', apiKey: editingAgent.apiKey ?? '', isRunning: editingAgent.isRunning ?? false, logs: editingAgent.logs ?? [] })}>
                  {AGENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Interval (ms)</label>
                <input type="number" className="w-full px-3 py-2 border rounded" value={editingAgent?.interval || 60000} onChange={e => editingAgent && setEditingAgent({ ...editingAgent, interval: Number(e.target.value), id: editingAgent.id ?? Date.now(), name: editingAgent.name ?? '', type: editingAgent.type ?? AGENT_TYPES[0].value, enabled: editingAgent.enabled ?? true, serviceUrl: editingAgent.serviceUrl ?? '', apiKey: editingAgent.apiKey ?? '', isRunning: editingAgent.isRunning ?? false, logs: editingAgent.logs ?? [] })} min={1000} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editingAgent?.enabled || false} onChange={e => editingAgent && setEditingAgent({ ...editingAgent, enabled: e.target.checked, id: editingAgent.id ?? Date.now(), name: editingAgent.name ?? '', type: editingAgent.type ?? AGENT_TYPES[0].value, interval: editingAgent.interval ?? 60000, serviceUrl: editingAgent.serviceUrl ?? '', apiKey: editingAgent.apiKey ?? '', isRunning: editingAgent.isRunning ?? false, logs: editingAgent.logs ?? [] })} />
                <span className="text-sm">Enabled</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service URL</label>
                <input type="text" className="w-full px-3 py-2 border rounded" value={editingAgent?.serviceUrl || ''} onChange={e => editingAgent && setEditingAgent({ ...editingAgent, serviceUrl: e.target.value, id: editingAgent.id ?? Date.now(), name: editingAgent.name ?? '', type: editingAgent.type ?? AGENT_TYPES[0].value, interval: editingAgent.interval ?? 60000, enabled: editingAgent.enabled ?? true, apiKey: editingAgent.apiKey ?? '', isRunning: editingAgent.isRunning ?? false, logs: editingAgent.logs ?? [] })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">API Key</label>
                <input type="text" className="w-full px-3 py-2 border rounded" value={editingAgent?.apiKey || ''} onChange={e => editingAgent && setEditingAgent({ ...editingAgent, apiKey: e.target.value, id: editingAgent.id ?? Date.now(), name: editingAgent.name ?? '', type: editingAgent.type ?? AGENT_TYPES[0].value, interval: editingAgent.interval ?? 60000, enabled: editingAgent.enabled ?? true, serviceUrl: editingAgent.serviceUrl ?? '', isRunning: editingAgent.isRunning ?? false, logs: editingAgent.logs ?? [] })} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingAgent(null); }}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details/Logs Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Agent Details</h2>
            <div className="mb-4">
              <div><b>Name:</b> {showDetails.name}</div>
              <div><b>Type:</b> {AGENT_TYPES.find(t => t.value === showDetails.type)?.label}</div>
              <div><b>Interval:</b> {showDetails.interval} ms</div>
              <div><b>Enabled:</b> {showDetails.enabled ? 'Yes' : 'No'}</div>
              <div><b>Service URL:</b> {showDetails.serviceUrl || <span className="italic text-muted-foreground">(none)</span>}</div>
              <div><b>API Key:</b> {showDetails.apiKey ? '••••••••' : <span className="italic text-muted-foreground">(none)</span>}</div>
              <div><b>Status:</b> <Badge variant={showDetails.isRunning ? 'success' : 'secondary'}>{showDetails.isRunning ? 'Running' : 'Stopped'}</Badge></div>
              {showDetails.lastActivity && (
                <div><b>Last Activity:</b> {new Date(showDetails.lastActivity).toLocaleString()}</div>
              )}
            </div>
            <div>
              <h3 className="font-medium mb-2">Logs</h3>
              <ScrollArea className="h-40 bg-muted p-2 rounded">
                {showDetails.logs.length === 0 ? (
                  <div className="text-muted-foreground italic">No logs yet.</div>
                ) : (
                  <ul className="text-xs space-y-1">
                    {showDetails.logs.map((log, i) => <li key={i}>{log}</li>)}
                  </ul>
                )}
              </ScrollArea>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button type="button" variant="outline" onClick={handleCloseDetails}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 