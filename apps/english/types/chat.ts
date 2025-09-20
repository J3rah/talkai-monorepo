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