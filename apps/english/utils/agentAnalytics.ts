import supabase from '@/supabaseClient';
import { getVoiceConfigurationById } from '@/utils/voiceConfigUtils';

// Define ChatSession interface locally to avoid import path issues
interface ChatSession {
  id: string;
  user_id: string;
  status: 'active' | 'completed' | 'cancelled';
  started_at: string;
  ended_at?: string;
  last_activity: string;
  hume_chat_group_id?: string;
  session_type?: 'trial' | 'premium';
  voice_config_id?: string;
  agent_name?: string;
  character_name?: string;
  created_at: string;
  updated_at: string;
}

export interface AgentUsageStats {
  characterName: string;
  displayName: string;
  configId: string;
  sessionCount: number;
  percentage: number;
}

export interface UserAgentAnalytics {
  mostUsedAgent: AgentUsageStats | null;
  totalSessions: number;
  agentBreakdown: AgentUsageStats[];
}

function toErrorString(err: unknown): string {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  const anyErr = err as any;
  if (anyErr?.message) return String(anyErr.message);
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/**
 * Calculates the most used agent/therapist for a specific user based on their session history
 */
export async function calculateMostUsedAgent(userId: string): Promise<UserAgentAnalytics> {
  try {
    // Fetch all sessions for the user
    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user sessions for agent analytics:', toErrorString(error));
      return {
        mostUsedAgent: null,
        totalSessions: 0,
        agentBreakdown: []
      };
    }

    if (!sessions || sessions.length === 0) {
      return {
        mostUsedAgent: null,
        totalSessions: 0,
        agentBreakdown: []
      };
    }

    // Since we don't have voice_config_id in chat_sessions, 
    // return basic analytics with a default agent
    const totalSessions = sessions.length;
    const defaultAgent: AgentUsageStats = {
      characterName: 'Talk Therapist',
      displayName: 'Talk Therapist',
      configId: 'default',
      sessionCount: totalSessions,
      percentage: 100
    };

    const agentBreakdown: AgentUsageStats[] = totalSessions > 0 ? [defaultAgent] : [];
    const mostUsedAgent = totalSessions > 0 ? defaultAgent : null;

    return {
      mostUsedAgent,
      totalSessions,
      agentBreakdown
    };
  } catch (error) {
    console.error('Error calculating most used agent:', error);
    return {
      mostUsedAgent: null,
      totalSessions: 0,
      agentBreakdown: []
    };
  }
}

/**
 * Gets the default agent/therapist for a user based on their current voice configuration
 */
export async function getDefaultAgent(userId: string): Promise<string> {
  try {
    // Get user's profile to find their therapist name
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('therapist_name')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile for default agent:', error);
      return 'Talk Therapist';
    }

    // Return custom therapist name if set, otherwise default
    return profile?.therapist_name || 'Talk Therapist';
  } catch (error) {
    console.error('Error getting default agent:', error);
    return 'Talk Therapist';
  }
}

/**
 * Gets the count of available therapists for a user based on their subscription
 */
export async function getAvailableTherapistCount(userId: string): Promise<number> {
  try {
    // Get user's subscription status
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile for therapist count:', error);
      return 1; // Default to 1 therapist
    }

    const subscriptionStatus = profile?.subscription_status || 'calm';
    
    // Map subscription tiers to therapist count
    switch (subscriptionStatus) {
      case 'calm':
        return 2; // Basic voices (Male, Female)
      case 'centered':
        return 4; // Basic + some additional voices
      case 'grounded':
        return 8; // All available voices/therapists
      default:
        return 1;
    }
  } catch (error) {
    console.error('Error getting available therapist count:', error);
    return 1;
  }
}
