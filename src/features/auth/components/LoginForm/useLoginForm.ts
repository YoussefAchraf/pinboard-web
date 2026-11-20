/**
 * FILE:   src/features/auth/components/LoginForm/useLoginForm.ts
 * LAYER:  feature component logic (the "logic" file of the four-file unit)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   All behavior of LoginForm: form state, validation, submit, and mapping API errors to the UI.
 *
 * WHAT TO WRITE
 *   export interface ILoginFormLogic {
 *     register: UseFormRegister<LoginFormValues>;
 *     onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
 *     fieldError: (name: keyof LoginFormValues) => string | undefined;   // returns an i18n KEY
 *     formError: string | undefined;                                     // i18n KEY, e.g. 'errors.INVALID_CREDENTIALS'
 *     isSubmitting: boolean;
 *   }
 *   export function useLoginForm(): ILoginFormLogic {
 *     const form = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), mode: 'onBlur' });
 *     const login = useLogin();
 *     const onSubmit = form.handleSubmit(async (values) => {
 *       try { await login.mutateAsync(values); }
 *       catch (error) {
 *         Object.entries(fieldErrors(error)).forEach(([name, key]) => form.setError(name as keyof LoginFormValues, { message: key }));
 *       }
 *     });
 *     const formError = login.error && !isApiError(login.error, 'VALIDATION_FAILED') ? `errors.${login.error.code}` : undefined;
 *     ...
 *   }
 *   - Never clear the password field's value on error except after INVALID_CREDENTIALS
 *     (then focus it). Never log credentials.
 *
 * EXPORTS
 *   function useLoginForm, interface ILoginFormLogic
 *
 * USED BY
 *   ./LoginForm.tsx
 *
 * MAY IMPORT
 *   react-hook-form, @hookform/resolvers/zod, ../../hooks/useLogin, ../../loginSchema, @/shared/lib/apiError.
 */
export {};
