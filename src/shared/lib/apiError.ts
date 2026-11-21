/**
 * FILE:   src/shared/lib/apiError.ts
 * LAYER:  shared
 * STATUS: implemented
 *
 * PURPOSE
 *   One typed error for every failed request, mirroring the backend envelope
 *   `{ error, code, details? }`. UI and hooks branch on `code` - never on HTTP status alone,
 *   never on raw axios errors, never on message text.
 *
 * CONTENT
 *   class ApiError       status (0 when no response), code (server code or NETWORK_ERROR / TIMEOUT),
 *                        message (server `error` text - for logs only, the UI shows t('errors.<CODE>')),
 *                        details?.fields (VALIDATION_FAILED: field -> i18n key).
 *   toApiError(failure)  normalises what apiClient hands over (it unwraps axios errors itself, so this
 *                        file never imports axios):
 *                          - an ApiError                       -> returned unchanged
 *                          - IHttpFailure { status: 0, timedOut } -> TIMEOUT / NETWORK_ERROR
 *                          - IHttpFailure { status > 0, body } -> envelope code + details; a body that is
 *                            not a contract envelope (proxy HTML page...) falls back to a code by status
 *                          - anything else                     -> NETWORK_ERROR (status 0)
 *   isApiError(e, code?) type guard, optionally for one code.
 *   fieldErrors(e)       VALIDATION_FAILED details.fields as a plain record ({} otherwise), ready for
 *                        react-hook-form setError(field, { message: key }).
 *
 * EXPORTS
 *   class ApiError, IHttpFailure, toApiError, isApiError, fieldErrors
 *
 * USED BY
 *   shared/lib/apiClient.ts        (normalisation)
 *   shared/lib/queryClient.ts      (retry policy)
 *   features/<name>/hooks/*        `onError: (e) => isApiError(e, 'INVALID_CREDENTIALS') && ...`
 *   feature components             user-facing message: t(`errors.${error.code}`) (common namespace)
 *
 * MAY IMPORT
 *   ../types/errorCodes, ../types/api (types).
 */
import type { IApiErrorDetails } from '../types/api';
import { isServerErrorCode } from '../types/errorCodes';
import type { ErrorCode } from '../types/errorCodes';

export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly details?: IApiErrorDetails;

  constructor(code: ErrorCode, message: string, status: number, details?: IApiErrorDetails) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    if (details) this.details = details;
  }
}

/** A failed HTTP exchange as unwrapped by apiClient (status 0 = no response received). */
export interface IHttpFailure {
  status: number;
  body?: unknown;
  timedOut?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isHttpFailure(value: unknown): value is IHttpFailure {
  return isRecord(value) && typeof value.status === 'number' && !(value instanceof Error);
}

function codeForStatus(status: number): ErrorCode {
  switch (status) {
    case 400:
    case 422:
      return 'VALIDATION_FAILED';
    case 401:
      return 'UNAUTHENTICATED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 429:
      return 'RATE_LIMITED';
    default:
      return 'INTERNAL_ERROR';
  }
}

function parseDetails(value: unknown): IApiErrorDetails | undefined {
  if (!isRecord(value) || !isRecord(value.fields)) return undefined;
  const fields: Record<string, string> = {};
  for (const [field, key] of Object.entries(value.fields)) {
    if (typeof key === 'string') fields[field] = key;
  }
  return { fields };
}

export function toApiError(failure: unknown): ApiError {
  if (failure instanceof ApiError) return failure;

  if (isHttpFailure(failure)) {
    if (failure.status === 0) {
      return failure.timedOut
        ? new ApiError('TIMEOUT', 'Request timed out', 0)
        : new ApiError('NETWORK_ERROR', 'Network error', 0);
    }
    const body = failure.body;
    if (isRecord(body) && isServerErrorCode(body.code)) {
      const message = typeof body.error === 'string' ? body.error : body.code;
      return new ApiError(body.code, message, failure.status, parseDetails(body.details));
    }
    const code = codeForStatus(failure.status);
    return new ApiError(code, `HTTP ${failure.status}`, failure.status);
  }

  const message = failure instanceof Error ? failure.message : 'Network error';
  return new ApiError('NETWORK_ERROR', message, 0);
}

export function isApiError(error: unknown, code?: ErrorCode): error is ApiError {
  return error instanceof ApiError && (code === undefined || error.code === code);
}

export function fieldErrors(error: unknown): Record<string, string> {
  if (!isApiError(error, 'VALIDATION_FAILED')) return {};
  return { ...(error.details?.fields ?? {}) };
}
