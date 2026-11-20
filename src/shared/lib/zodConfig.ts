/**
 * FILE:   src/shared/lib/zodConfig.ts
 * LAYER:  shared
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Global zod error customization so form validation messages are i18n KEYS, not hardcoded
 *   English. Imported once for its side effect.
 *
 * WHAT TO WRITE
 *   z.config({ customError: (issue) => `validation.${issue.code}` })   // zod 4 API - VERIFY against the pinned version
 *   - Components render field errors with t(error.message, { ns: 'common' }).
 *   - Keys live in shared/i18n/locales/<lang>/common.json -> "validation": { "too_small": "...", ... }.
 *   - Feature schemas (features/<name>/<thing>Schema.ts) may pass explicit keys:
 *       z.string().email({ message: 'validation.email' })
 *
 * EXPORTS
 *   nothing (side-effect module)
 *
 * USED BY
 *   src/main.tsx   `import '@/shared/lib/zodConfig';` (before any schema is evaluated)
 *
 * MAY IMPORT
 *   zod.
 */
export {};
