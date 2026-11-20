import { describe, expect, it } from 'vitest';
import { CLIENT_ERROR_CODES, ERROR_CODES, isServerErrorCode, SERVER_ERROR_CODES } from './errorCodes';
import enCommon from '../i18n/locales/en/common.json';
import frCommon from '../i18n/locales/fr/common.json';

describe('errorCodes', () => {
  it('mirrors conventions.md section 2: 9 server codes + 2 client codes', () => {
    expect(SERVER_ERROR_CODES).toEqual([
      'VALIDATION_FAILED',
      'UNAUTHENTICATED',
      'INVALID_CREDENTIALS',
      'FORBIDDEN',
      'CSRF_INVALID',
      'NOT_FOUND',
      'CONFLICT',
      'RATE_LIMITED',
      'INTERNAL_ERROR',
    ]);
    expect(CLIENT_ERROR_CODES).toEqual(['NETWORK_ERROR', 'TIMEOUT']);
    expect(ERROR_CODES).toHaveLength(11);
  });

  it('has a translation for every code in both locales', () => {
    for (const code of ERROR_CODES) {
      expect(enCommon.errors[code]).toBeTruthy();
      expect(frCommon.errors[code]).toBeTruthy();
    }
  });

  it('recognises only server codes', () => {
    expect(isServerErrorCode('CONFLICT')).toBe(true);
    expect(isServerErrorCode('TIMEOUT')).toBe(false);
    expect(isServerErrorCode(42)).toBe(false);
  });
});
