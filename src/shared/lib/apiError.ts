/**
 * FILE:   src/shared/lib/apiError.ts
 * LAYER:  shared
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   One typed error for every failed request, mirroring the backend envelope
 *   `{ error, code, details? }`. UI and hooks branch on `code` - never on HTTP status alone,
 *   never on raw axios errors, never on message text.
 *
 * WHAT TO WRITE
 *   export class ApiError extends Error {
 *     readonly status: number;          // 0 for network/timeout
 *     readonly code: ErrorCode;         // from ../types/errorCodes (+ 'NETWORK_ERROR' | 'TIMEOUT' client-side codes)
 *     readonly details?: unknown;       // e.g. { fields: { email: '...' } } for VALIDATION_FAILED
 *   }
 *   export function toApiError(error: unknown): ApiError     // used by apiClient's response interceptor
 *   export function isApiError(error: unknown, code?: ErrorCode): error is ApiError
 *   export function fieldErrors(error: unknown): Record<string, string>   // maps VALIDATION_FAILED details
 *                                                                          // to react-hook-form setError calls
 *
 * EXPORTS
 *   class ApiError, toApiError, isApiError, fieldErrors
 *
 * USED BY
 *   shared/lib/apiClient.ts        (normalisation)
 *   features/<name>/hooks/*        `onError: (e) => isApiError(e, 'INVALID_CREDENTIALS') && ...`
 *   feature components             user-facing message: t(`errors.${error.code}`) (common namespace)
 *
 * MAY IMPORT
 *   ../types/errorCodes, axios (type-only `isAxiosError` is NOT allowed - only apiClient imports axios;
 *   receive already-unwrapped data from apiClient instead).
 */
export {};
