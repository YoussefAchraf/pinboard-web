/**
 * FILE:   src/shared/types/errorCodes.ts
 * LAYER:  shared
 * STATUS: implemented
 *
 * PURPOSE
 *   Mirror of the backend error-code catalog (et-be/src/domain/errors/errorCodes.ts, published in
 *   ../contracts/conventions.md section 2). The UI branches on these codes - never compare against
 *   string literals outside this file.
 *
 * CONTENT
 *   SERVER_ERROR_CODES  the 9 codes a server response may carry (auth.yaml ErrorCode enum).
 *   CLIENT_ERROR_CODES  NETWORK_ERROR, TIMEOUT - produced by apiClient when no response arrives.
 *   ERROR_CODES         both lists (11 codes); ErrorCode is its union type.
 *   - Every code has a translation: shared/i18n/locales/<lang>/common.json -> "errors.<CODE>".
 *   - A code missing from the contract = file a request in ../contracts/requests/, never invent one.
 *
 * EXPORTS
 *   SERVER_ERROR_CODES, CLIENT_ERROR_CODES, ERROR_CODES, ErrorCode, ServerErrorCode, isServerErrorCode
 *
 * USED BY
 *   shared/lib/apiError.ts, shared/types/api.ts, feature hooks/components handling errors.
 *
 * MAY IMPORT
 *   Nothing.
 */
export const SERVER_ERROR_CODES = [
  'VALIDATION_FAILED',
  'UNAUTHENTICATED',
  'INVALID_CREDENTIALS',
  'FORBIDDEN',
  'CSRF_INVALID',
  'NOT_FOUND',
  'CONFLICT',
  'RATE_LIMITED',
  'INTERNAL_ERROR',
] as const;

export const CLIENT_ERROR_CODES = ['NETWORK_ERROR', 'TIMEOUT'] as const;

export const ERROR_CODES = [...SERVER_ERROR_CODES, ...CLIENT_ERROR_CODES] as const;

export type ServerErrorCode = (typeof SERVER_ERROR_CODES)[number];
export type ErrorCode = (typeof ERROR_CODES)[number];

export function isServerErrorCode(value: unknown): value is ServerErrorCode {
  return typeof value === 'string' && (SERVER_ERROR_CODES as readonly string[]).includes(value);
}
