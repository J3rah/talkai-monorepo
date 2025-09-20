export interface EmotionMetrics {
  id: string;
  session_id: string;
  message_id: string;
  emotions: Record<string, number>;
  created_at: string;
  metadata?: Record<string, any>;
} 