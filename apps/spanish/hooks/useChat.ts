import { create } from 'zustand';
import { Message } from '@/types/chat';

interface ChatStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, message: Partial<Message>) => void;
}

export const useChat = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  updateMessage: (id, message) => set((state) => ({
    messages: state.messages.map((m) => 
      m.id === id ? { ...m, ...message } : m
    )
  }))
})); 