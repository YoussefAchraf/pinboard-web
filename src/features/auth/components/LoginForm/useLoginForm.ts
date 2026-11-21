/**
 * FILE:   src/features/auth/components/LoginForm/useLoginForm.ts
 * LAYER:  feature component logic (the "logic" file of the four-file unit)
 * STATUS: implemented
 *
 * PURPOSE
 *   All behavior of LoginForm: form state, validation, submit, and mapping API errors to the UI.
 *
 * CONTENT
 *   - react-hook-form + zodResolver(loginSchema), validation on blur; on submit the first invalid
 *     field gets focus (react-hook-form shouldFocusError, default true).
 *   - Server errors (auth.yaml 1.1.0 login responses) -> UI:
 *       401 INVALID_CREDENTIALS -> form message common:errors.INVALID_CREDENTIALS; the password is
 *                                  cleared and focused
 *       403 FORBIDDEN           -> form message auth:login.accountDisabled
 *       422 VALIDATION_FAILED   -> field messages from details.fields (i18n keys, first field focused);
 *                                  no usable fields -> form message common:errors.VALIDATION_FAILED
 *       anything else           -> form message common:errors.<CODE> (RATE_LIMITED, NETWORK_ERROR,
 *                                  TIMEOUT, INTERNAL_ERROR ...)
 *   - Keys returned here carry their namespace (`ns:key`); the form renders them with t().
 *   - Credentials are never logged.
 *
 * EXPORTS
 *   function useLoginForm, interface ILoginFormLogic, function loginErrorKey
 *
 * USED BY
 *   ./LoginForm.tsx
 *
 * MAY IMPORT
 *   react, react-hook-form, @hookform/resolvers/zod, ../../hooks/useLogin, ../../loginSchema,
 *   @/shared/lib/apiError, ./LoginForm.data.json.
 */
import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useState } from 'react';
import type { BaseSyntheticEvent } from 'react';
import { useForm } from 'react-hook-form';
import type { UseFormRegister } from 'react-hook-form';
import data from './LoginForm.data.json';
import { useLogin } from '../../hooks/useLogin';
import { loginSchema } from '../../loginSchema';
import type { LoginFormValues } from '../../loginSchema';
import { fieldErrors, toApiError } from '@/shared/lib/apiError';
import type { ApiError } from '@/shared/lib/apiError';

type LoginField = keyof LoginFormValues;

export interface ILoginFormIds {
  email: string;
  emailError: string;
  password: string;
  passwordError: string;
}

export interface ILoginFormLogic {
  ids: ILoginFormIds;
  register: UseFormRegister<LoginFormValues>;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  /** i18n key (common namespace) of the field's error, if any. */
  fieldError: (name: LoginField) => string | undefined;
  /** Namespaced i18n key (`ns:key`) of the form-level error, if any. */
  formError: string | undefined;
  isSubmitting: boolean;
}

/** Form order: the first invalid field in this order receives focus. */
const FIELDS: readonly LoginField[] = ['email', 'password'];

/** Form-level message key for a failed login. */
export function loginErrorKey(error: ApiError): string {
  if (error.code === 'FORBIDDEN') return data.accountDisabledKey;
  return `${data.errorKeyPrefix}${error.code}`;
}

export function useLoginForm(): ILoginFormLogic {
  const baseId = useId();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });
  const login = useLogin();
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(undefined);
    try {
      await login.mutateAsync(values);
    } catch (caught) {
      const error = toApiError(caught);
      if (error.code === 'VALIDATION_FAILED') {
        const serverFields = fieldErrors(error);
        const invalid = FIELDS.filter((name) => serverFields[name] !== undefined);
        if (invalid.length > 0) {
          invalid.forEach((name, index) => {
            form.setError(name, { type: 'server', message: serverFields[name] }, { shouldFocus: index === 0 });
          });
          return;
        }
      }
      setFormError(loginErrorKey(error));
      if (error.code === 'INVALID_CREDENTIALS') {
        form.resetField('password');
        form.setFocus('password');
      }
    }
  });

  return {
    ids: {
      email: `${baseId}-email`,
      emailError: `${baseId}-email-error`,
      password: `${baseId}-password`,
      passwordError: `${baseId}-password-error`,
    },
    register: form.register,
    onSubmit,
    fieldError: (name) => form.formState.errors[name]?.message,
    formError,
    isSubmitting: form.formState.isSubmitting,
  };
}
