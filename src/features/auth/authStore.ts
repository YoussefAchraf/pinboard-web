/**
 * FILE:   src/features/auth/authStore.ts
 * LAYER:  feature (root of the feature folder)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Synchronous access to "who is signed in" for guards and UI. It is the ONE documented
 *   exception to "never mirror server data in Zustand": it holds only the session identity,
 *   and is WRITTEN ONLY by this feature's hooks (bootstrap, login, logout).
 *
 * WHAT TO WRITE
 *   interface IAuthState {
 *     user: IUser | null;
 *     status: 'unknown' | 'authenticated' | 'anonymous';   // 'unknown' until bootstrap resolves
 *     setSession: (user: IUser) => void;
 *     clearSession: () => void;
 *   }
 *   export const useAuthStore = create<IAuthState>()((set) => ({ ... }));
 *   - NEVER persisted (no localStorage/sessionStorage): the httpOnly cookie is the session;
 *     the store is rebuilt from /auth/whoami on every page load.
 *   - Consumers select narrowly: useAuthStore((s) => s.user) - never the whole store.
 *
 * EXPORTS
 *   useAuthStore
 *
 * USED BY
 *   ./hooks/* (writers), routes/guards/* (readers), feature components showing the user.
 *
 * MAY IMPORT
 *   zustand, @/shared/types/domain.
 */
export {};
