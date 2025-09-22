import { createContext } from 'react';

export interface LiveChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SessionMessagesContext = createContext<LiveChatMessage[]>([]);
export default SessionMessagesContext;
