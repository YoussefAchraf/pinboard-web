/**
 * FILE:   src/features/auth/components/LoginForm/LoginForm.tsx
 * LAYER:  feature component
 * STATUS: implemented
 * ANATOMY (reference example of the four-file unit):
 *   LoginForm.tsx         structure - JSX only, binds the three files below
 *   LoginForm.module.css  presentation - tokens only
 *   LoginForm.data.json   data - i18n keys + static config
 *   useLoginForm.ts       logic - form state, submit, error mapping
 *
 * CONTENT
 *   Email + password with always-visible labels; field errors under the field (role="alert",
 *   linked with aria-describedby, aria-invalid on the input); form-level error announced
 *   (role="alert"); submit disabled + aria-busy while submitting, its label switches to
 *   "Signing in". No sign-up link (users are created by an operator).
 *
 * USED BY
 *   ../../pages/LoginPage/LoginPage.tsx
 *
 * MAY IMPORT
 *   react-i18next, ./useLoginForm, ./LoginForm.module.css, ./LoginForm.data.json.
 */
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import data from './LoginForm.data.json';
import styles from './LoginForm.module.css';
import { useLoginForm } from './useLoginForm';

export function LoginForm(): ReactElement {
  const { t } = useTranslation(['auth', 'common']);
  const { ids, register, onSubmit, fieldError, formError, isSubmitting } = useLoginForm();
  const emailError = fieldError('email');
  const passwordError = fieldError('password');

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {formError && (
        <p role="alert" className={styles.formError}>
          {t(formError)}
        </p>
      )}
      <div className={styles.field}>
        <label className={styles.label} htmlFor={ids.email}>
          {t(data.emailLabelKey)}
        </label>
        <input
          id={ids.email}
          className={styles.input}
          type="email"
          autoComplete="email"
          inputMode="email"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? ids.emailError : undefined}
          {...register('email')}
        />
        {emailError && (
          <p id={ids.emailError} role="alert" className={styles.fieldError}>
            {t(emailError, { ns: 'common' })}
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={ids.password}>
          {t(data.passwordLabelKey)}
        </label>
        <input
          id={ids.password}
          className={styles.input}
          type="password"
          autoComplete="current-password"
          aria-invalid={passwordError ? true : undefined}
          aria-describedby={passwordError ? ids.passwordError : undefined}
          {...register('password')}
        />
        {passwordError && (
          <p id={ids.passwordError} role="alert" className={styles.fieldError}>
            {t(passwordError, { ns: 'common' })}
          </p>
        )}
      </div>
      <button className={styles.submit} type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {t(isSubmitting ? data.submittingKey : data.submitKey)}
      </button>
    </form>
  );
}
