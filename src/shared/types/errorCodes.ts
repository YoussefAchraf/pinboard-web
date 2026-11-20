/**
 * FILE:   src/shared/types/errorCodes.ts
 * LAYER:  shared
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Mirror of the backend error-code catalog (et-be/src/domain/errors/errorCodes.ts, published in
 *   ../contracts/conventions.md). The UI branches on these codes - never compare against string
 *   literals outside this file.
 *
 * WHAT TO WRITE
 *   export const ERROR_CODES = [
 *     'VALIDATION_FAILED', 'UNAUTHENTICATED', 'INVALID_CREDENTIALS', 'FORBIDDEN', 'CSRF_INVALID',
 *     'NOT_FOUND', 'CONFLICT', 'RATE_LIMITED', 'INTERNAL_ERROR',
 *     'NETWORK_ERROR', 'TIMEOUT',            // client-side only (no response from the server)
 *   ] as const;
 *   export type ErrorCode = (typeof ERROR_CODES)[number];
 *   - Every code has a translation: shared/i18n/locales/<lang>/common.json -> "errors.<CODE>".
 *   - A code missing from the contract = file a request in ../contracts/requests/, never invent one.
 *
 * EXPORTS
 *   ERROR_CODES, ErrorCode
 *
 * USED BY
 *   shared/lib/apiError.ts, shared/types/api.ts, feature hooks/components handling errors.
 *
 * MAY IMPORT
 *   Nothing.
 */
export {};
