/**
 * FILE:   src/features/auth/loginSchema.ts
 * LAYER:  feature (root of the feature folder)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Client-side validation for the login form. Must match the backend schema
 *   (et-be src/interface/validation/authSchemas.ts, i.e. the contract) - the backend still
 *   validates; this is for fast feedback only.
 *
 * WHAT TO WRITE
 *   export const loginSchema = z.object({
 *     email: z.string().trim().min(1, { message: 'validation.required' }).email({ message: 'validation.email' }).max(254),
 *     password: z.string().min(8, { message: 'validation.too_small' }).max(128),
 *   });
 *   export type LoginFormValues = z.infer<typeof loginSchema>;
 *   - Messages are i18n KEYS (common namespace), rendered with t(...) by the form.
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
export {};
