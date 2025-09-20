"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSession = void 0;
const zustand_1 = require("zustand");
exports.useSession = (0, zustand_1.create)((set) => ({
    session: null,
    setSession: (session) => set({ session }),
    updateSession: (updates) => set((state) => ({
        session: state.session ? { ...state.session, ...updates } : null
    }))
}));
//# sourceMappingURL=session.js.map