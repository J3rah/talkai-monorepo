import { createContext } from 'react';

interface ChatMessageForContext {
  role: string;
  content: string;
}

const SessionMessagesContext = createContext<ChatMessageForContext[]>([]);
export default SessionMessagesContext;
