import { describe, expect, it } from 'vitest';
import { ApiError, fieldErrors, isApiError, toApiError } from './apiError';

describe('toApiError', () => {
  it('returns an ApiError unchanged', () => {
    const error = new ApiError('CONFLICT', 'Taken', 409);
    expect(toApiError(error)).toBe(error);
  });

  it('maps a contract envelope to its code, message and details.fields', () => {
    const error = toApiError({
      status: 422,
      body: { error: 'Invalid', code: 'VALIDATION_FAILED', details: { fields: { email: 'validation.email', bad: 3 } } },
    });
    expect(error).toMatchObject({ code: 'VALIDATION_FAILED', status: 422, message: 'Invalid' });
    expect(error.details).toEqual({ fields: { email: 'validation.email' } });
  });

  it('falls back to a code derived from the status for a non-envelope body', () => {
    expect(toApiError({ status: 404, body: 'Not Found' }).code).toBe('NOT_FOUND');
    expect(toApiError({ status: 429, body: {} }).code).toBe('RATE_LIMITED');
    expect(toApiError({ status: 401, body: { code: 'SOMETHING_ELSE' } }).code).toBe('UNAUTHENTICATED');
    expect(toApiError({ status: 503 }).code).toBe('INTERNAL_ERROR');
  });

  it('maps no response to NETWORK_ERROR or TIMEOUT with status 0', () => {
    expect(toApiError({ status: 0 })).toMatchObject({ code: 'NETWORK_ERROR', status: 0 });
    expect(toApiError({ status: 0, timedOut: true })).toMatchObject({ code: 'TIMEOUT', status: 0 });
    expect(toApiError(new TypeError('boom'))).toMatchObject({ code: 'NETWORK_ERROR', status: 0 });
  });
});

describe('isApiError / fieldErrors', () => {
  it('narrows by optional code', () => {
    const error = new ApiError('FORBIDDEN', 'No', 403);
    expect(isApiError(error)).toBe(true);
    expect(isApiError(error, 'FORBIDDEN')).toBe(true);
    expect(isApiError(error, 'NOT_FOUND')).toBe(false);
    expect(isApiError(new Error('x'))).toBe(false);
  });

  it('returns field keys only for VALIDATION_FAILED', () => {
    const invalid = new ApiError('VALIDATION_FAILED', 'Invalid', 422, { fields: { title: 'validation.too_big' } });
    expect(fieldErrors(invalid)).toEqual({ title: 'validation.too_big' });
    expect(fieldErrors(new ApiError('CONFLICT', 'x', 409))).toEqual({});
    expect(fieldErrors('nope')).toEqual({});
  });
});
