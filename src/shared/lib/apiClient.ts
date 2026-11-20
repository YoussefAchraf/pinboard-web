/**
 * FILE:   src/shared/lib/apiClient.ts
 * LAYER:  shared (may import shared/ only) - the ONLY file allowed to import axios (lint).
 * STATUS: implemented
 *
 * PURPOSE
 *   The single HTTP client. Implements the cross-stack auth contract
 *   (../contracts/conventions.md section 5, ADR 0002) so feature code never thinks about cookies,
 *   CSRF or token refresh.
 *
 * BEHAVIOR
 *   apiClient = axios instance: baseURL `${env.apiBaseUrl}/v1`, withCredentials, timeout 15 s,
 *   transitional.clarifyTimeoutError (a timeout is ETIMEDOUT -> TIMEOUT; an abort is NETWORK_ERROR).
 *   1. CSRF (request interceptor): on POST/PUT/PATCH/DELETE the `csrfToken` cookie (document.cookie)
 *      is sent as `X-CSRF-Token`. Safe methods never carry it.
 *   2. Single-flight refresh (response interceptor) on 401 code UNAUTHENTICATED:
 *        - skipped for /auth/login and /auth/refresh themselves and for requests already
 *          retried once (config._retried);
 *        - `refreshSessionOnce()` - ONE shared promise for all concurrent 401s, sent with a PLAIN
 *          axios instance (no interceptors) to `/v1/auth/refresh` with the CSRF header;
 *        - success -> the original request is retried once (it re-reads the rotated csrfToken);
 *          failure -> `onSessionExpired()` is called ONCE for that refresh and every waiting request
 *          rejects with its ORIGINAL UNAUTHENTICATED ApiError.
 *   3. Error normalisation: every rejection is an ApiError (./apiError) - network errors (NETWORK_ERROR),
 *      timeouts (TIMEOUT) and `{ error, code, details }` envelopes alike.
 *   4. DI hook instead of importing features (shared must not import features):
 *      configureApiClient({ onSessionExpired }) - App.tsx registers it (clear query cache + go to login).
 *      Note: an anonymous visitor's whoami 401 also tries one refresh, which fails and calls
 *      onSessionExpired - the callback must be harmless when nobody was signed in.
 *
 * EXPORTS
 *   const apiClient, function configureApiClient, interface IApiClientOptions
 *
 * USED BY
 *   features/<name>/api/<name>Api.ts ONLY (lint forbids importing it from hooks/components/pages)
 *   app/App.tsx -> configureApiClient (registration only)
 *
 * MAY IMPORT
 *   axios, ./env, ./apiError.
 */
import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toApiError } from './apiError';
import type { ApiError } from './apiError';
import { env } from './env';

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/naming-convention -- augments axios own interface name (no I prefix)
  interface InternalAxiosRequestConfig {
    /** Set on the single retry after a successful refresh - a request is never refreshed twice. */
    _retried?: boolean;
  }
}

export interface IApiClientOptions {
  onSessionExpired: () => void;
}

const CSRF_COOKIE = 'csrfToken';
const CSRF_HEADER = 'X-CSRF-Token';
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const REFRESH_URL = '/auth/refresh';
const NO_REFRESH_URLS = new Set(['/auth/login', REFRESH_URL]);

const baseConfig = {
  baseURL: `${env.apiBaseUrl}/v1`,
  withCredentials: true,
  timeout: 15_000,
  // xhr adapter: timeouts raise ETIMEDOUT (not ECONNABORTED, which also means 'aborted').
  transitional: { clarifyTimeoutError: true },
} as const;

export const apiClient = axios.create(baseConfig);

/** No interceptors: a failing refresh must never trigger another refresh. */
const refreshClient = axios.create(baseConfig);

let onSessionExpired: () => void = () => {};
let refreshInFlight: Promise<boolean> | null = null;

export function configureApiClient(options: IApiClientOptions): void {
  onSessionExpired = options.onSessionExpired;
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  for (const part of document.cookie.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1 || part.slice(0, separator).trim() !== name) continue;
    const raw = part.slice(separator + 1).trim();
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return undefined;
}

function csrfHeaders(): Record<string, string> {
  const token = readCookie(CSRF_COOKIE);
  return token ? { [CSRF_HEADER]: token } : {};
}

function refreshSessionOnce(): Promise<boolean> {
  refreshInFlight ??= refreshClient
    .post(REFRESH_URL, null, { headers: csrfHeaders() })
    .then(
      () => true,
      () => {
        onSessionExpired();
        return false;
      },
    )
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

function isTimeout(error: AxiosError): boolean {
  return error.code === axios.AxiosError.ETIMEDOUT;
}

function normalise(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) return toApiError(error);
  if (error.response) {
    return toApiError({ status: error.response.status, body: error.response.data });
  }
  return toApiError({ status: 0, timedOut: isTimeout(error) });
}

function shouldRefresh(apiError: ApiError, config: InternalAxiosRequestConfig): boolean {
  return (
    apiError.status === 401 &&
    apiError.code === 'UNAUTHENTICATED' &&
    config._retried !== true &&
    !NO_REFRESH_URLS.has(config.url ?? '')
  );
}

apiClient.interceptors.request.use((config) => {
  const method = (config.method ?? 'get').toUpperCase();
  const token = UNSAFE_METHODS.has(method) ? readCookie(CSRF_COOKIE) : undefined;
  if (token) {
    config.headers.set(CSRF_HEADER, token);
  } else {
    config.headers.delete(CSRF_HEADER);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown): Promise<AxiosResponse> => {
    const apiError = normalise(error);
    const config = axios.isAxiosError(error) ? error.config : undefined;
    if (config && shouldRefresh(apiError, config)) {
      const refreshed = await refreshSessionOnce();
      if (refreshed) {
        config._retried = true;
        return apiClient.request(config);
      }
    }
    throw apiError;
  },
);
