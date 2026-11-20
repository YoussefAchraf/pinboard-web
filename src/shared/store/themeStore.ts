/**
 * FILE:   src/shared/store/themeStore.ts
 * LAYER:  shared
 * STATUS: implemented
 *
 * PURPOSE
 *   Global UI state for the color theme. UI concerns only - server data never goes in a
 *   Zustand store (that is TanStack Query's job).
 *
 * CONTENT
 *   preference 'light' | 'dark' | 'system' (default 'system' = follow prefers-color-scheme).
 *   - Not persisted (task 002): the choice lasts for the page session. Persisting it per device
 *     (zustand `persist` + localStorage, this store only) is allowed later, documented in AGENTS.md.
 *
 * EXPORTS
 *   useThemeStore, ThemePreference, THEME_PREFERENCES
 *
 * USED BY
 *   shared/hooks/useTheme.ts, a theme toggle component.
 *
 * MAY IMPORT
 *   zustand.
 */
import { create } from 'zustand';

export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

interface IThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

export const useThemeStore = create<IThemeState>()((set) => ({
  preference: 'system',
  setPreference: (preference) => set({ preference }),
}));
