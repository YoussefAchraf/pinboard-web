/**
 * FILE:   src/test/setup.ts   (vitest setupFiles - runs before every test file)
 *
 * Responsibilities:
 *   - jest-dom matchers for Vitest
 *   - DOM cleanup after each test
 *   - browser APIs jsdom lacks (matchMedia)
 * To add with the first network-level test (see src/test/server.ts):
 *   import { server } from './server';
 *   beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
 *   afterEach(() => server.resetHandlers());
 *   afterAll(() => server.close());
 * To add with the first translated component test:
 *   import '@/shared/i18n';   // real i18n with the 'en' resources, so tests query real text
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
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
  cleanup();
});
