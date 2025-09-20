import { create } from 'zustand';
import { Session } from '../types';

interface SessionStore {
  session: Session | null;
  setSession: (session: Session | null) => void;
  updateSession: (updates: Partial<Session>) => void;
}

export const useSession = create<SessionStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  updateSession: (updates) => set((state) => ({
    session: state.session ? { ...state.session, ...updates } : null
  }))
})); 