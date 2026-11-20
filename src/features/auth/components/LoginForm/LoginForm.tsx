/**
 * FILE:   src/features/auth/components/LoginForm/LoginForm.tsx
 * LAYER:  feature component
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 * ANATOMY (reference example of the four-file unit):
 *   LoginForm.tsx         structure - JSX only, binds the three files below
 *   LoginForm.module.css  presentation - tokens only
 *   LoginForm.data.json   data - i18n keys + static config
 *   useLoginForm.ts       logic - form state, submit, error mapping
 *
 * WHAT TO WRITE
 *   export function LoginForm(): ReactElement {
 *     const { t } = useTranslation(['auth', 'common']);
 *     const { register, onSubmit, fieldError, formError, isSubmitting } = useLoginForm();
 *     return (
 *       <form className={styles.form} onSubmit={onSubmit} noValidate>
 *         {formError && <p role="alert" className={styles.formError}>{t(formError, { ns: 'common' })}</p>}
 *         <label className={styles.field}>
 *           <span className={styles.label}>{t(data.emailLabelKey)}</span>
 *           <input className={styles.input} type="email" autoComplete="email" aria-invalid={!!fieldError('email')} {...register('email')} />
 *           {fieldError('email') && <span className={styles.fieldError}>{t(fieldError('email'), { ns: 'common' })}</span>}
 *         </label>
 *         ... password field (type="password", autoComplete="current-password") ...
 *         <button className={styles.submit} type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
 *           {t(isSubmitting ? data.submittingKey : data.submitKey)}
 *         </button>
 *       </form>
 *     );
 *   }
 *   - Labels always visible; errors near the field and announced; button distinguishes
 *     "submitting" from "invalid". No inline styles, no hardcoded text, no fetch.
 *   - Named export (lint).
 *
 * USED BY
 *   ../../pages/LoginPage/LoginPage.tsx
 *
 * MAY IMPORT
 *   react-i18next, ./useLoginForm, ./LoginForm.module.css, ./LoginForm.data.json.
 */
export {};
