/**
 * FILE:   src/features/auth/authStore.ts
 * LAYER:  feature (root of the feature folder)
 * STATUS: implemented
 *
 * PURPOSE
 *   Synchronous access to "who is signed in" for guards and UI. It is the ONE documented
 *   exception to "never mirror server data in Zustand": it holds only the session identity,
 *   and is WRITTEN ONLY by this feature's hooks (bootstrap, login, logout, session expiry).
 *
 * CONTENT
 *   user + status: 'unknown' (until the bootstrap resolves) | 'authenticated' | 'anonymous'.
 *   setSession(user) / clearSession(). INITIAL_AUTH_STATE is exported for test resets.
 *   - NEVER persisted (no localStorage/sessionStorage): the httpOnly cookie is the session;
 *     the store is rebuilt from /auth/whoami on every page load.
 *   - Consumers select narrowly: useAuthStore((s) => s.user) - never the whole store.
 *
 * EXPORTS
 *   useAuthStore, AuthStatus, INITIAL_AUTH_STATE
 *
 * USED BY
 *   ./hooks/* (writers), routes/guards/* + routes/router.tsx (readers), ./components/UserMenu.
 *
 * MAY IMPORT
 *   zustand, @/shared/types/domain.
 */
import { create } from 'zustand';
import type { IUser } from '@/shared/types/domain';

export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous';

interface IAuthData {
  user: IUser | null;
  status: AuthStatus;
}

interface IAuthState extends IAuthData {
  setSession: (user: IUser) => void;
  clearSession: () => void;
}

export const INITIAL_AUTH_STATE: IAuthData = { user: null, status: 'unknown' };

export const useAuthStore = create<IAuthState>()((set) => ({
  ...INITIAL_AUTH_STATE,
  setSession: (user) => set({ user, status: 'authenticated' }),
  clearSession: () => set({ user: null, status: 'anonymous' }),
}));
