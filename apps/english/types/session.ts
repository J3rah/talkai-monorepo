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