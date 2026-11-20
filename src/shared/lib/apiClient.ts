/**
 * FILE:   src/shared/lib/apiClient.ts
 * LAYER:  shared (may import shared/ only) - the ONLY file allowed to import axios (lint).
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The single HTTP client. Implements the cross-stack auth contract
 *   (../contracts/conventions.md -> Auth contract) so feature code never thinks about cookies,
 *   CSRF or token refresh.
 *
 * WHAT TO WRITE
 *   export const apiClient = axios.create({ baseURL: `${env.apiBaseUrl}/v1`, withCredentials: true, timeout: 15_000 });
 *
 *   1. CSRF (request interceptor): on POST/PUT/PATCH/DELETE read the `csrfToken` cookie
 *      (document.cookie) and send it as `X-CSRF-Token`.
 *   2. Single-flight refresh (response interceptor) on 401 code UNAUTHENTICATED:
 *        - skip for the refresh/login calls themselves and for requests already retried (config._retried);
 *        - `await refreshSessionOnce()` - ONE shared promise for all concurrent 401s, made with a
 *          PLAIN axios instance (no interceptors) to `/v1/auth/refresh`;
 *        - success -> retry the original request once; failure -> call `onSessionExpired()` and reject.
 *   3. Error normalisation: every rejection becomes an ApiError (./apiError) - network errors,
 *      timeouts, and `{ error, code, details }` envelopes alike.
 *   4. DI hook instead of importing features (shared must not import features):
 *        let onSessionExpired: () => void = () => {};
 *        export function configureApiClient(options: { onSessionExpired: () => void }): void
 *      App.tsx registers the callback (clear query cache + navigate to paths.login).
 *
 * EXPORTS
 *   const apiClient, function configureApiClient
 *
 * USED BY
 *   features/<name>/api/<name>Api.ts ONLY (lint forbids importing it from hooks/components/pages)
 *   app/App.tsx -> configureApiClient (registration only)
 *
 * MAY IMPORT
 *   axios, ./env, ./apiError.
 */
export {};
