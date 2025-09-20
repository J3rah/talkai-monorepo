// API service for mobile app
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  subscription_status?: string;
  total_sessions?: number;
  total_minutes?: number;
  mood_average?: number;
}

interface SessionStats {
  totalSessions: number;
  totalWeeks: number;
  moodAverage: number;
  recentSessions: Array<{
    id: string;
    date: string;
    duration: number;
    mood: string;
  }>;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      return { data, success: true };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error' };
    }
  }

  // Chat API
  async sendChatMessage(userId: string, messages: ChatMessage[]) {
    return this.makeRequest('/agent/chat', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        messages,
      }),
    });
  }

  // Journal API
  async getJournalEntries() {
    return this.makeRequest('/journal/entries');
  }

  async createJournalEntry(content: string) {
    return this.makeRequest('/journal/entries', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Mock data for now - replace with real API calls
  async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    // Mock data - replace with real API call
    return {
      data: {
        id: userId,
        email: 'alex.johnson@email.com',
        full_name: 'Alex Johnson',
        created_at: '2024-01-15T00:00:00Z',
        subscription_status: 'premium',
        total_sessions: 47,
        total_minutes: 1410,
        mood_average: 4.8,
      },
      success: true,
    };
  }

  async getSessionStats(userId: string): Promise<ApiResponse<SessionStats>> {
    // Mock data - replace with real API call
    return {
      data: {
        totalSessions: 47,
        totalWeeks: 12,
        moodAverage: 4.8,
        recentSessions: [
          {
            id: '1',
            date: '1/19/2024',
            duration: 30,
            mood: 'good',
          },
          {
            id: '2',
            date: '1/18/2024',
            duration: 25,
            mood: 'great',
          },
          {
            id: '3',
            date: '1/17/2024',
            duration: 35,
            mood: 'okay',
          },
        ],
      },
      success: true,
    };
  }

  // Mock chat history - replace with real API call
  async getChatHistory(userId: string): Promise<ApiResponse<ChatMessage[]>> {
    return {
      data: [
        {
          role: 'assistant',
          content: "Hello! I'm here to help you with your mental health journey. How are you feeling today?",
          timestamp: new Date(Date.now() - 300000).toISOString(),
        },
        {
          role: 'user',
          content: "I've been feeling a bit anxious lately, especially about work.",
          timestamp: new Date(Date.now() - 240000).toISOString(),
        },
        {
          role: 'assistant',
          content: "I understand that work anxiety can be really challenging. Can you tell me more about what specifically is making you feel anxious at work?",
          timestamp: new Date(Date.now() - 180000).toISOString(),
        },
      ],
      success: true,
    };
  }
}

export const apiService = new ApiService();
export type { ChatMessage, UserProfile, SessionStats };
