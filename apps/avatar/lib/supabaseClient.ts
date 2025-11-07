import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types (matching existing talkAI schema)
export interface AvatarSession {
  id: string;
  user_id: string;
  title: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
  duration_seconds?: number;
  hume_chat_group_id?: string;
  avatar_id?: string;
  voice_config_id?: string;
  emotion_summary?: any;
}

export interface AvatarMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  emotions?: any;
  audio_url?: string;
  video_timestamp?: number;
}

export interface EmotionMetric {
  id: string;
  session_id: string;
  message_id?: string;
  timestamp: string;
  emotion_type: string;
  score: number;
  valence?: number;
  arousal?: number;
  raw_data?: any;
}

