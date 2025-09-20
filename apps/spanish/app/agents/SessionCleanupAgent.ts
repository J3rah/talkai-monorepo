import { BaseAgent, AgentConfig } from './BaseAgent';

export class SessionCleanupAgent extends BaseAgent {
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor(config: AgentConfig) {
    super(config);
  }

  protected async execute(): Promise<void> {
    try {
      await this.logActivity('Starting session cleanup cycle');

      // Get expired sessions
      const { data: expiredSessions, error: fetchError } = await (this.supabase as any)
        .from('chat_sessions')
        .select('*')
        .lt('last_activity', new Date(Date.now() - this.SESSION_TIMEOUT).toISOString())
        .eq('status', 'active');

      if (fetchError) {
        throw fetchError;
      }

      if (!expiredSessions || expiredSessions.length === 0) {
        await this.logActivity('No expired sessions found');
        return;
      }

      // Close expired sessions
      for (const session of expiredSessions) {
        try {
          // Close the chat group in Hume
          const response = await fetch('/api/hume/close-chat-group', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chatGroupId: (session as any).hume_chat_group_id
            })
          });

          if (!response.ok) {
            throw new Error(`Failed to close chat group: ${response.statusText}`);
          }

          // Update session status in database
          const { error: updateError } = await (this.supabase as any)
            .from('chat_sessions')
            .update({ 
              status: 'completed',
              ended_at: new Date().toISOString()
            })
            .eq('id', (session as any).id);

          if (updateError) {
            throw updateError;
          }

          await this.logActivity('Closed expired session', { 
            sessionId: (session as any).id,
            chatGroupId: (session as any).hume_chat_group_id
          });
        } catch (error) {
          await this.handleError(error);
        }
      }

      await this.logActivity('Completed session cleanup cycle', {
        sessionsClosed: expiredSessions.length
      });
    } catch (error) {
      await this.handleError(error);
    }
  }
} 