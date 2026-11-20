/**
 * FILE:   src/test/handlers/authHandlers.ts
 * LAYER:  test (relaxed lint)
 * STATUS: placeholder - implement with the first auth test.
 *
 * PURPOSE
 *   Default MSW handlers for the auth endpoints, returning CONTRACT shapes
 *   (../contracts/openapi/auth.yaml) - the same shapes the json-server mock and et-be return.
 *
 * WHAT TO WRITE
 *   export const authHandlers = [
 *     http.post('/api/v1/auth/login', async ({ request }) => {
 *       const body = await request.json();
 *       return body.password === 'correct-password'
 *         ? HttpResponse.json({ user: TEST_USER })
 *         : HttpResponse.json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }, { status: 401 });
 *     }),
 *     http.get('/api/v1/auth/whoami', () => HttpResponse.json({ error: 'Authentication required', code: 'UNAUTHENTICATED' }, { status: 401 })),
 *     http.post('/api/v1/auth/logout', () => new HttpResponse(null, { status: 204 })),
 *     http.post('/api/v1/auth/refresh', () => HttpResponse.json({ error: 'No session', code: 'UNAUTHENTICATED' }, { status: 401 })),
 *   ];
 *   - One handlers file per feature: handlers/<feature>Handlers.ts.
 */
export {};
