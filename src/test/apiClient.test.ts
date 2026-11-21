import { delay, http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiUrl, errorBody } from './handlers/authHandlers';
import { server, setupMswLifecycle } from './server';
import { apiClient, configureApiClient } from '@/shared/lib/apiClient';
import { ApiError } from '@/shared/lib/apiError';

setupMswLifecycle();

function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/`;
}

function clearCookie(name: string): void {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

async function rejectionOf(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof ApiError) return error;
    throw new Error(`Expected an ApiError, got ${String(error)}`);
  }
  throw new Error('Expected the request to fail');
}

afterEach(() => {
  clearCookie('csrfToken');
  configureApiClient({ onSessionExpired: () => {} });
});

describe('apiClient CSRF double submit', () => {
  it('sends X-CSRF-Token equal to the csrfToken cookie on POST, not on GET', async () => {
    setCookie('csrfToken', 'csrf-abc');
    const seen: Record<string, string | null> = {};
    server.use(
      http.post(apiUrl('/things'), ({ request }) => {
        seen.post = request.headers.get('x-csrf-token');
        return HttpResponse.json({ ok: true });
      }),
      http.get(apiUrl('/things'), ({ request }) => {
        seen.get = request.headers.get('x-csrf-token');
        return HttpResponse.json({ ok: true });
      }),
    );

    await apiClient.post('/things', { a: 1 });
    await apiClient.get('/things');

    expect(seen.post).toBe('csrf-abc');
    expect(seen.get).toBeNull();
  });

  it('sends the header on PUT, PATCH and DELETE', async () => {
    setCookie('csrfToken', 'csrf-xyz');
    const seen: string[] = [];
    const record = ({ request }: { request: Request }): Response => {
      seen.push(`${request.method}:${request.headers.get('x-csrf-token')}`);
      return new HttpResponse(null, { status: 204 });
    };
    server.use(
      http.put(apiUrl('/things/1'), record),
      http.patch(apiUrl('/things/1'), record),
      http.delete(apiUrl('/things/1'), record),
    );

    await apiClient.put('/things/1', {});
    await apiClient.patch('/things/1', {});
    await apiClient.delete('/things/1');

    expect(seen).toEqual(['PUT:csrf-xyz', 'PATCH:csrf-xyz', 'DELETE:csrf-xyz']);
  });
});

describe('apiClient single-flight refresh', () => {
  it('runs ONE refresh for 3 concurrent 401s, then retries each request once', async () => {
    setCookie('csrfToken', 'csrf-old');
    let sessionValid = false;
    let refreshCalls = 0;
    let refreshCsrf: string | null = null;
    const resourceCalls: Record<string, number> = {};
    const onSessionExpired = vi.fn();
    configureApiClient({ onSessionExpired });

    server.use(
      http.get(apiUrl('/things/:id'), ({ params }) => {
        const id = String(params.id);
        resourceCalls[id] = (resourceCalls[id] ?? 0) + 1;
        return sessionValid
          ? HttpResponse.json({ id })
          : HttpResponse.json(errorBody('UNAUTHENTICATED', 'Expired'), { status: 401 });
      }),
      http.post(apiUrl('/auth/refresh'), async ({ request }) => {
        refreshCalls += 1;
        refreshCsrf = request.headers.get('x-csrf-token');
        await delay(30);
        sessionValid = true;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const responses = await Promise.all(
      ['a', 'b', 'c'].map((id) => apiClient.get<{ id: string }>(`/things/${id}`)),
    );

    expect(responses.map((r) => r.data.id)).toEqual(['a', 'b', 'c']);
    expect(refreshCalls).toBe(1);
    expect(refreshCsrf).toBe('csrf-old');
    expect(resourceCalls).toEqual({ a: 2, b: 2, c: 2 });
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('refresh failure: onSessionExpired once, every request rejects with the original UNAUTHENTICATED error', async () => {
    let refreshCalls = 0;
    const onSessionExpired = vi.fn();
    configureApiClient({ onSessionExpired });

    server.use(
      http.get(apiUrl('/things/:id'), () =>
        HttpResponse.json(errorBody('UNAUTHENTICATED', 'Expired'), { status: 401 }),
      ),
      http.post(apiUrl('/auth/refresh'), async () => {
        refreshCalls += 1;
        await delay(30);
        return HttpResponse.json(errorBody('UNAUTHENTICATED', 'No session'), { status: 401 });
      }),
    );

    const errors = await Promise.all(['a', 'b', 'c'].map((id) => rejectionOf(apiClient.get(`/things/${id}`))));

    expect(refreshCalls).toBe(1);
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
    for (const error of errors) {
      expect(error.code).toBe('UNAUTHENTICATED');
      expect(error.status).toBe(401);
      expect(error.message).toBe('Expired');
    }
  });

  it('never refreshes twice for the same request (retry still 401 -> rejects)', async () => {
    let refreshCalls = 0;
    let resourceCalls = 0;
    server.use(
      http.get(apiUrl('/things/1'), () => {
        resourceCalls += 1;
        return HttpResponse.json(errorBody('UNAUTHENTICATED', 'Expired'), { status: 401 });
      }),
      http.post(apiUrl('/auth/refresh'), () => {
        refreshCalls += 1;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const error = await rejectionOf(apiClient.get('/things/1'));

    expect(error.code).toBe('UNAUTHENTICATED');
    expect(refreshCalls).toBe(1);
    expect(resourceCalls).toBe(2);
  });

  it('does not refresh for the login call itself', async () => {
    let refreshCalls = 0;
    server.use(
      http.post(apiUrl('/auth/login'), () => HttpResponse.json(errorBody('UNAUTHENTICATED', 'No'), { status: 401 })),
      http.post(apiUrl('/auth/refresh'), () => {
        refreshCalls += 1;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const error = await rejectionOf(apiClient.post('/auth/login', { email: 'a@b.test', password: 'x' }));

    expect(error.code).toBe('UNAUTHENTICATED');
    expect(refreshCalls).toBe(0);
  });

  it('does not refresh on a 401 with another code (INVALID_CREDENTIALS)', async () => {
    let refreshCalls = 0;
    server.use(
      http.get(apiUrl('/things/1'), () =>
        HttpResponse.json(errorBody('INVALID_CREDENTIALS', 'Bad'), { status: 401 }),
      ),
      http.post(apiUrl('/auth/refresh'), () => {
        refreshCalls += 1;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const error = await rejectionOf(apiClient.get('/things/1'));

    expect(error.code).toBe('INVALID_CREDENTIALS');
    expect(refreshCalls).toBe(0);
  });
});

describe('apiClient error normalisation', () => {
  it('network failure -> NETWORK_ERROR (status 0)', async () => {
    server.use(http.get(apiUrl('/things/1'), () => HttpResponse.error()));

    const error = await rejectionOf(apiClient.get('/things/1'));

    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.status).toBe(0);
  });

  it('timeout -> TIMEOUT (status 0)', async () => {
    server.use(
      http.get(apiUrl('/things/1'), async () => {
        await delay('infinite');
        return HttpResponse.json({});
      }),
    );

    // MSW's XHR interceptor does not emulate XHR timeouts; the fetch adapter applies the same
    // timeout option through an AbortSignal and raises the same ETIMEDOUT code as the xhr adapter.
    // Node's fetch needs an absolute URL (it does not resolve against the jsdom location).
    const error = await rejectionOf(
      apiClient.get('/things/1', { timeout: 20, adapter: 'fetch', baseURL: `${window.location.origin}/api/v1` }),
    );

    expect(error.code).toBe('TIMEOUT');
    expect(error.status).toBe(0);
  });

  it('envelope -> its code, message and details.fields', async () => {
    server.use(
      http.post(apiUrl('/things'), () =>
        HttpResponse.json(
          errorBody('VALIDATION_FAILED', 'Invalid body', { fields: { email: 'validation.email' } }),
          { status: 422 },
        ),
      ),
    );

    const error = await rejectionOf(apiClient.post('/things', {}));

    expect(error.code).toBe('VALIDATION_FAILED');
    expect(error.status).toBe(422);
    expect(error.message).toBe('Invalid body');
    expect(error.details?.fields).toEqual({ email: 'validation.email' });
  });

  it('non-envelope error body -> code derived from the status', async () => {
    server.use(http.get(apiUrl('/things/1'), () => new HttpResponse('<html>Bad gateway</html>', { status: 502 })));

    const error = await rejectionOf(apiClient.get('/things/1'));

    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.status).toBe(502);
  });
});
