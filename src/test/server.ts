/**
 * FILE:   src/test/server.ts
 * LAYER:  test (relaxed lint)
 * STATUS: implemented
 *
 * PURPOSE
 *   MSW in NODE mode (msw/node 2.x) for Vitest only: intercepts requests at the network level so
 *   tests run the REAL apiClient (CSRF header, single-flight refresh, ApiError normalisation)
 *   instead of mocking api files. No browser service worker is ever registered - the permanent
 *   no-PWA / no-service-worker policy is respected.
 *
 * CONTENT
 *   server = setupServer(...authHandlers) (default handlers of every feature).
 *   Lifecycle: call setupMswLifecycle() at the top level of a test file (listen with onUnhandledRequest:
 *   'error', resetHandlers after each test, close after all). It lives here, not in setup.ts, so
 *   tests that never touch the network do not start MSW.
 *   Per-test overrides: server.use(http.post(apiUrl('/auth/login'), () => HttpResponse.json(..., { status: 401 })))
 */
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { authHandlers } from './handlers/authHandlers';

export const server = setupServer(...authHandlers);

export function setupMswLifecycle(): void {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
