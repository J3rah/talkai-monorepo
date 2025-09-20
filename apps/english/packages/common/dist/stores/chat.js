"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChat = void 0;
const zustand_1 = require("zustand");
exports.useChat = (0, zustand_1.create)((set) => ({
    messages: [],
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),
    updateMessage: (id, message) => set((state) => ({
        messages: state.messages.map((m) => m.id === id ? { ...m, ...message } : m)
    }))
}));
//# sourceMappingURL=chat.js.map