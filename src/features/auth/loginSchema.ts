/**
 * FILE:   src/features/auth/loginSchema.ts
 * LAYER:  feature (root of the feature folder)
 * STATUS: implemented
 *
 * PURPOSE
 *   Client-side validation for the login form, matching contract LoginRequest (auth.yaml 1.1.0:
 *   email format, max 254; password 8-128). The backend still validates; this is fast feedback only.
 *
 * CONTENT
 *   Messages are i18n KEYS of the `common` namespace (validation.*), rendered with t(...) by the form.
 *   An empty email reports validation.required only (the pipe stops before the format check).
 *
 * EXPORTS
 *   loginSchema, LoginFormValues
 *
 * USED BY
 *   ./components/LoginForm/useLoginForm.ts   `useForm({ resolver: zodResolver(loginSchema), mode: 'onBlur' })`
 *
 * MAY IMPORT
 *   zod.
 */
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'validation.required' })
    .pipe(z.email({ message: 'validation.email' }).max(254, { message: 'validation.too_big' })),
  password: z
    .string()
    .min(1, { message: 'validation.required' })
    .min(8, { message: 'validation.too_small' })
    .max(128, { message: 'validation.too_big' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
