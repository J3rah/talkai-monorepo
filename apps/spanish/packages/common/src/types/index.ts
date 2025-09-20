export interface Session {
  id: string;
  user_id: string;
  status: 'in_progress' | 'completed' | 'error';
  chat_group_id?: string;
  created_at: string;
  updated_at: string;
  ended_at?: string;
  error_message?: string;
  metadata?: Record<string, any>;
}

export interface EmotionMetrics {
  id: string;
  session_id: string;
  message_id: string;
  emotions: Record<string, number>;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  metadata?: {
    chat_group_id?: string;
    prosody?: {
      scores?: Record<string, number>;
    };
  };
} 