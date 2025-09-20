import { createClient } from '@supabase/supabase-js';

export interface AgentConfig {
  name: string;
  interval: number; // milliseconds between runs
  enabled: boolean;
  supabaseUrl: string;
  supabaseKey: string;
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  protected supabase: ReturnType<typeof createClient>;
  protected intervalId: ReturnType<typeof setInterval> | null = null;
  protected isRunning: boolean = false;

  constructor(config: AgentConfig) {
    this.config = config;
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
  }

  public async start(): Promise<void> {
    if (this.isRunning) {
      console.log(`Agent ${this.config.name} is already running`);
      return;
    }

    console.log(`Starting agent ${this.config.name}`);
    this.isRunning = true;

    // Run immediately on start
    await this.execute();

    // Then set up interval
    this.intervalId = setInterval(async () => {
      await this.execute();
    }, this.config.interval);
  }

  public stop(): void {
    if (!this.isRunning) {
      console.log(`Agent ${this.config.name} is not running`);
      return;
    }

    console.log(`Stopping agent ${this.config.name}`);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  protected abstract execute(): Promise<void>;

  protected async logActivity(message: string, metadata: any = {}): Promise<void> {
    try {
      // TODO: Fix agent_activities table type issue
      // For now, just log to console
      console.log(`[${this.config.name}] ${message}`, metadata);
      
      // const { error } = await this.supabase
      //   .from('agent_activities')
      //   .insert({
      //     agent_name: this.config.name,
      //     message,
      //     metadata,
      //     created_at: new Date().toISOString()
      //   });

      // if (error) {
      //   console.error('Failed to log agent activity:', error);
      // }
    } catch (error) {
      console.error('Error logging agent activity:', error);
    }
  }

  protected async handleError(error: any): Promise<void> {
    console.error(`Error in agent ${this.config.name}:`, error);
    await this.logActivity('Error occurred', { error: error.message });
  }
} 