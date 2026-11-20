import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from './useTheme';
import { useThemeStore } from '../store/themeStore';

const originalMatchMedia = window.matchMedia;

function mockSystemDark(matches: boolean): void {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  act(() => useThemeStore.getState().setPreference('system'));
  delete document.documentElement.dataset.theme;
});

describe('useTheme', () => {
  it('follows prefers-color-scheme by default', () => {
    mockSystemDark(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current.preference).toBe('system');
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('applies an explicit preference to <html data-theme>', () => {
    mockSystemDark(true);
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setPreference('light'));
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
