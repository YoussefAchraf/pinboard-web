/**
 * FILE:   src/test/handlers/authHandlers.ts
 * LAYER:  test (relaxed lint)
 * STATUS: implemented
 *
 * PURPOSE
 *   Default MSW handlers for the auth endpoints, returning CONTRACT shapes
 *   (../contracts/openapi/auth.yaml 1.1.0) - the same shapes the json-server mock and et-be return.
 *
 * CONTENT
 *   Default state = anonymous visitor:
 *     POST /api/v1/auth/login    TEST_CREDENTIALS -> 200 { user: TEST_USER }; otherwise 401 INVALID_CREDENTIALS
 *     GET  /api/v1/auth/whoami   401 UNAUTHENTICATED
 *     POST /api/v1/auth/logout   204
 *     POST /api/v1/auth/refresh  401 UNAUTHENTICATED
 *   Per-test overrides: server.use(http.get(apiUrl('/auth/whoami'), () => HttpResponse.json({ user: TEST_USER })))
 *   - One handlers file per feature: handlers/<feature>Handlers.ts.
 */
import { http, HttpResponse } from 'msw';
import type { IApiErrorBody } from '@/shared/types/api';
import type { IUser } from '@/shared/types/domain';

/** Absolute pattern for a contract path (e.g. '/auth/login') as the browser calls it. */
export function apiUrl(path: string): string {
  return `*/api/v1${path}`;
}

export const TEST_USER: IUser = {
  id: '6f1c2b8e-4a3d-4c5e-9f7a-1b2c3d4e5f60',
  email: 'member@example.test',
  firstname: 'Test',
  lastname: 'Member',
  roleName: 'member',
  status: 'active',
  createdAt: '2026-11-20T09:00:00Z',
};

export const TEST_CREDENTIALS = { email: TEST_USER.email, password: 'correct-password' } as const;

export function errorBody(code: IApiErrorBody['code'], error: string, details?: IApiErrorBody['details']): IApiErrorBody {
  return details ? { error, code, details } : { error, code };
}

function isCredentials(body: unknown): body is { email: string; password: string } {
  return typeof body === 'object' && body !== null && 'email' in body && 'password' in body;
}

export const authHandlers = [
  http.post(apiUrl('/auth/login'), async ({ request }) => {
    const body: unknown = await request.json().catch(() => null);
    if (isCredentials(body) && body.email === TEST_CREDENTIALS.email && body.password === TEST_CREDENTIALS.password) {
      return HttpResponse.json({ user: TEST_USER });
    }
    return HttpResponse.json(errorBody('INVALID_CREDENTIALS', 'Invalid credentials'), { status: 401 });
  }),
  http.get(apiUrl('/auth/whoami'), () =>
    HttpResponse.json(errorBody('UNAUTHENTICATED', 'Authentication required'), { status: 401 }),
  ),
  http.post(apiUrl('/auth/logout'), () => new HttpResponse(null, { status: 204 })),
  http.post(apiUrl('/auth/refresh'), () => HttpResponse.json(errorBody('UNAUTHENTICATED', 'No session'), { status: 401 })),
];
