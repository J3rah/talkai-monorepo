import { Session } from '../types';
interface SessionStore {
    session: Session | null;
    setSession: (session: Session | null) => void;
    updateSession: (updates: Partial<Session>) => void;
}
export declare const useSession: import("zustand").UseBoundStore<import("zustand").StoreApi<SessionStore>>;
export {};
//# sourceMappingURL=session.d.ts.map