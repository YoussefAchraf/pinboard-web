/**
 * FILE:   src/shared/hooks/useTheme.ts
 * LAYER:  shared
 * STATUS: implemented
 *
 * PURPOSE
 *   Applies the theme to the document: sets <html data-theme="light|dark">, which switches the
 *   token values declared in src/styles/tokens.css. Components never read the theme themselves.
 *
 * CONTENT
 *   useTheme() -> { theme, preference, setPreference }
 *     theme = preference, or the OS `prefers-color-scheme` when preference is 'system'
 *     (subscribed with useSyncExternalStore, so an OS switch updates live).
 *     An effect writes document.documentElement.dataset.theme whenever `theme` changes.
 *
 * EXPORTS
 *   function useTheme, type ResolvedTheme, interface IUseThemeResult
 *
 * USED BY
 *   app/App.tsx (called once at the top), theme toggle UI.
 *
 * MAY IMPORT
 *   react, ../store/themeStore.
 */
import { useEffect, useSyncExternalStore } from 'react';
import { useThemeStore } from '../store/themeStore';
import type { ThemePreference } from '../store/themeStore';

export type ResolvedTheme = 'light' | 'dark';

export interface IUseThemeResult {
  theme: ResolvedTheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function prefersDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

function prefersDarkOnServer(): boolean {
  return false;
}

export function useTheme(): IUseThemeResult {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const systemDark = useSyncExternalStore(subscribe, prefersDark, prefersDarkOnServer);
  const theme: ResolvedTheme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return { theme, preference, setPreference };
}
