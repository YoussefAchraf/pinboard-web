/**
 * FILE:   src/test/server.ts
 * LAYER:  test (relaxed lint)
 * STATUS: placeholder - implement with the first test that exercises the network layer.
 *
 * PURPOSE
 *   MSW in NODE mode (msw/node) for Vitest only: intercepts requests at the network level so
 *   tests run the REAL apiClient (CSRF header, single-flight refresh, ApiError normalisation)
 *   instead of mocking api files. No browser service worker is ever registered - the permanent
 *   no-PWA / no-service-worker policy is respected.
 *
 * WHAT TO WRITE
 *   import { setupServer } from 'msw/node';
 *   import { authHandlers } from './handlers/authHandlers';
 *   export const server = setupServer(...authHandlers);
 *   - Wire the lifecycle in ./setup.ts (listen with onUnhandledRequest: 'error', resetHandlers, close).
 *   - Per-test overrides: server.use(http.post('/api/v1/auth/login', () => HttpResponse.json(..., { status: 401 })))
 *   - Verify API names against the pinned msw 2.x version.
 */
export {};
