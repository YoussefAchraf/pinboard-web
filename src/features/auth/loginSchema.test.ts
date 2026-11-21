import { describe, expect, it } from 'vitest';
import { loginSchema } from './loginSchema';

function firstMessage(input: unknown, field: 'email' | 'password'): string | undefined {
  const result = loginSchema.safeParse(input);
  if (result.success) return undefined;
  return result.error.issues.find((issue) => issue.path[0] === field)?.message;
}

describe('loginSchema (contract LoginRequest)', () => {
  it('accepts a valid payload and trims the email', () => {
    expect(loginSchema.parse({ email: '  member@example.test ', password: '12345678' })).toEqual({
      email: 'member@example.test',
      password: '12345678',
    });
  });

  it('empty fields -> validation.required', () => {
    expect(firstMessage({ email: '', password: '' }, 'email')).toBe('validation.required');
    expect(firstMessage({ email: '', password: '' }, 'password')).toBe('validation.required');
  });

  it('email format and max length 254', () => {
    expect(firstMessage({ email: 'nope', password: '12345678' }, 'email')).toBe('validation.email');
    const long = `${'a'.repeat(250)}@b.io`;
    expect(firstMessage({ email: long, password: '12345678' }, 'email')).toBe('validation.too_big');
  });

  it('password length 8-128', () => {
    expect(firstMessage({ email: 'a@b.io', password: '1234567' }, 'password')).toBe('validation.too_small');
    expect(firstMessage({ email: 'a@b.io', password: 'x'.repeat(129) }, 'password')).toBe('validation.too_big');
    expect(firstMessage({ email: 'a@b.io', password: 'x'.repeat(128) }, 'password')).toBeUndefined();
  });
});
