/**
 * FILE:   src/shared/lib/zodConfig.ts
 * LAYER:  shared
 * STATUS: implemented
 *
 * PURPOSE
 *   Global zod error customization so form validation messages are i18n KEYS, not hardcoded
 *   English. Imported once for its side effect.
 *
 * CONTENT
 *   z.config({ customError: validationKey }) (zod 4.6 API, verified in zod/v4/core/core.d.ts).
 *   validationKey maps a zod issue to a key that EXISTS in common.json -> "validation":
 *     invalid_type with undefined input -> validation.required
 *     invalid_format with format email  -> validation.email
 *     too_small / too_big               -> validation.too_small / validation.too_big
 *     anything else                     -> validation.invalid_type ("This value is not valid.")
 *   - Components render field errors with t(error.message, { ns: 'common' }).
 *   - Feature schemas may pass explicit keys (they win over this global map):
 *       z.email({ message: 'validation.email' })
 *
 * EXPORTS
 *   function validationKey (exported for tests); side effect: z.config(...)
 *
 * USED BY
 *   src/main.tsx   `import '@/shared/lib/zodConfig';` (before any schema is evaluated)
 *
 * MAY IMPORT
 *   zod.
 */
import { z } from 'zod';

interface IIssueLike {
  code?: string;
  input?: unknown;
  format?: unknown;
}

export function validationKey(issue: IIssueLike): string {
  switch (issue.code) {
    case 'invalid_type':
      return issue.input === undefined ? 'validation.required' : 'validation.invalid_type';
    case 'invalid_format':
      return issue.format === 'email' ? 'validation.email' : 'validation.invalid_type';
    case 'too_small':
      return 'validation.too_small';
    case 'too_big':
      return 'validation.too_big';
    default:
      return 'validation.invalid_type';
  }
}

z.config({ customError: (issue) => validationKey(issue) });
