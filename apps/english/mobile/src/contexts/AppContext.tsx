import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, UserProfile, SessionStats, ChatMessage } from '../services/api';

interface AppContextType {
  user: UserProfile | null;
  sessionStats: SessionStats | null;
  chatHistory: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  updateUser: (user: UserProfile) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user ID - replace with real authentication
  const userId = 'mock-user-id';

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load user profile
      const profileResponse = await apiService.getUserProfile(userId);
      if (profileResponse.data) {
        setUser(profileResponse.data);
      }

      // Load session stats
      const statsResponse = await apiService.getSessionStats(userId);
      if (statsResponse.data) {
        setSessionStats(statsResponse.data);
      }

      // Load chat history
      const chatResponse = await apiService.getChatHistory(userId);
      if (chatResponse.data) {
        setChatHistory(chatResponse.data);
      }

    } catch (err) {
      setError('Failed to load user data');
      console.error('Error loading user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await loadUserData();
  };

  const sendMessage = async (message: string) => {
    try {
      // Add user message to chat history
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      setChatHistory(prev => [...prev, userMessage]);

      // Send to API
      const response = await apiService.sendChatMessage(userId, [...chatHistory, userMessage]);
      
      if (response.data) {
        // Add AI response to chat history
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: response.data.content || 'I understand. Can you tell me more about that?',
          timestamp: new Date().toISOString(),
        };

        setChatHistory(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const updateUser = (newUser: UserProfile) => {
    setUser(newUser);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const value: AppContextType = {
    user,
    sessionStats,
    chatHistory,
    isLoading,
    error,
    refreshData,
    sendMessage,
    updateUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
