import { Message } from '../types';
interface ChatStore {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    updateMessage: (id: string, message: Partial<Message>) => void;
}
export declare const useChat: import("zustand").UseBoundStore<import("zustand").StoreApi<ChatStore>>;
export {};
//# sourceMappingURL=chat.d.ts.map