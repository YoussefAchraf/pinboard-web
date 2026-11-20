/**
 * FILE:   src/shared/store/themeStore.ts
 * LAYER:  shared
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Global UI state for the color theme. UI concerns only - server data never goes in a
 *   Zustand store (that is TanStack Query's job).
 *
 * WHAT TO WRITE
 *   export type ThemePreference = 'light' | 'dark' | 'system';
 *   interface IThemeState { preference: ThemePreference; setPreference: (p: ThemePreference) => void }
 *   export const useThemeStore = create<IThemeState>()((set) => ({ preference: 'system', setPreference: (preference) => set({ preference }) }));
 *   - Persisting the preference is a per-device convenience, not auth data: if wanted, use zustand
 *     `persist` with localStorage ONLY for this store, and document that exception in AGENTS.md
 *     (the localStorage.setItem lint ban targets auth/session data; persist uses its own storage API).
 *
 * EXPORTS
 *   useThemeStore, ThemePreference
 *
 * USED BY
 *   shared/hooks/useTheme.ts, a theme toggle component.
 *
 * MAY IMPORT
 *   zustand.
 */
export {};
