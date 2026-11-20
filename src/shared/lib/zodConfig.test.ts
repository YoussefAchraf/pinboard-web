import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import './zodConfig';

function firstMessage(schema: z.ZodType, value: unknown): string | undefined {
  const result = schema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe('zodConfig', () => {
  it('turns zod issues into i18n keys that exist in common.json', () => {
    const form = z.object({ email: z.email(), title: z.string().min(2).max(3) });
    expect(firstMessage(form, {})).toBe('validation.required');
    expect(firstMessage(form, { email: 'nope', title: 'ab' })).toBe('validation.email');
    expect(firstMessage(form, { email: 'a@b.test', title: 'a' })).toBe('validation.too_small');
    expect(firstMessage(form, { email: 'a@b.test', title: 'abcd' })).toBe('validation.too_big');
    expect(firstMessage(z.string(), 3)).toBe('validation.invalid_type');
  });

  it('keeps explicit schema messages', () => {
    expect(firstMessage(z.string().min(1, { message: 'validation.custom' }), '')).toBe('validation.custom');
  });
});
