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
 * Now tracks actual voice configuration usage from session data
 */
export async function calculateMostUsedAgent(userId: string): Promise<UserAgentAnalytics> {
  try {
    // Fetch all sessions for the user that have voice configuration data
    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('character_name, agent_name, voice_config_id, created_at')
      .eq('user_id', userId)
      .not('character_name', 'is', null)
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
      console.log('No sessions with character data found for user');
      return {
        mostUsedAgent: null,
        totalSessions: 0,
        agentBreakdown: []
      };
    }

    // Group sessions by character name and count usage
    const agentCounts: Record<string, {
      characterName: string;
      displayName: string;
      configId: string;
      count: number;
    }> = {};

    sessions.forEach(session => {
      const characterName = session.character_name || 'Unknown';
      const key = characterName.toLowerCase();
      
      if (!agentCounts[key]) {
        agentCounts[key] = {
          characterName: session.character_name || 'Unknown',
          displayName: session.agent_name || session.character_name || 'Unknown',
          configId: session.voice_config_id || '',
          count: 0
        };
      }
      agentCounts[key].count++;
    });

    // Convert to array and calculate percentages
    const totalSessions = sessions.length;
    const agentBreakdown: AgentUsageStats[] = Object.values(agentCounts).map(agent => ({
      characterName: agent.characterName,
      displayName: agent.displayName,
      configId: agent.configId,
      sessionCount: agent.count,
      percentage: Math.round((agent.count / totalSessions) * 100)
    }));

    // Sort by session count (most used first)
    agentBreakdown.sort((a, b) => b.sessionCount - a.sessionCount);

    // Get the most used agent
    const mostUsedAgent = agentBreakdown.length > 0 ? agentBreakdown[0] : null;

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
 * Gets the last used agent/therapist for a user based on their saved voice configuration
 */
export async function getDefaultAgent(userId: string): Promise<string> {
  try {
    console.log('Getting default agent for user:', userId);
    
    // First, try to get the character name from the most recent session
    const { data: recentSessions, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('character_name, agent_name, voice_config_id')
      .eq('user_id', userId)
      .not('character_name', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!sessionError && recentSessions && recentSessions.length > 0) {
      const recentSession = recentSessions[0];
      console.log('Found recent session with character_name:', recentSession.character_name);
      return recentSession.character_name || 'Talk Therapist';
    }

    // If no recent sessions with character data, check user's saved voice configuration
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('voice_config_id')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile for default agent:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return 'Talk Therapist';
    }

    if (!profile?.voice_config_id) {
      console.log('No saved voice config found for user');
      return 'Talk Therapist';
    }

    // Get the character name from the voice configuration
    try {
      console.log('Fetching voice config for ID:', profile.voice_config_id);
      const voiceConfig = await getVoiceConfigurationById(profile.voice_config_id);
      if (voiceConfig?.character_name) {
        console.log('Using character_name from voice config:', voiceConfig.character_name);
        return voiceConfig.character_name;
      }
    } catch (voiceConfigError) {
      console.error('Error fetching voice config for saved config:', voiceConfigError);
    }

    // Fallback to default
    return 'Talk Therapist';
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
