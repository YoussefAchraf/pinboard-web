import { describe, expect, it } from 'vitest';
import { ApiError } from './apiError';
import { queryClient, shouldRetryQuery } from './queryClient';

describe('queryClient defaults', () => {
  it('retries a query once, never on UNAUTHENTICATED or FORBIDDEN', () => {
    expect(shouldRetryQuery(0, new ApiError('INTERNAL_ERROR', 'x', 500))).toBe(true);
    expect(shouldRetryQuery(1, new ApiError('INTERNAL_ERROR', 'x', 500))).toBe(false);
    expect(shouldRetryQuery(0, new ApiError('UNAUTHENTICATED', 'x', 401))).toBe(false);
    expect(shouldRetryQuery(0, new ApiError('FORBIDDEN', 'x', 403))).toBe(false);
  });

  it('never retries mutations', () => {
    expect(queryClient.getDefaultOptions().mutations?.retry).toBe(false);
  });
});
