/**
 * FILE:   src/shared/components/Spinner/Spinner.tsx   (+ Spinner.module.css, Spinner.data.json)
 * LAYER:  shared
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 * ANATOMY: structure (.tsx) + presentation (.module.css) + data (.data.json). No logic hook needed.
 *
 * PURPOSE
 *   The single loading indicator: session bootstrap, lazy route chunks (HydrateFallback), buttons.
 *
 * WHAT TO WRITE
 *   export interface ISpinnerProps { size?: 'sm' | 'md' | 'lg'; labelKey?: string }
 *   export function Spinner({ size = 'md', labelKey = data.labelKey }: ISpinnerProps): ReactElement {
 *     const { t } = useTranslation('common');
 *     return <span role="status" className={`${styles.spinner} ${styles[size]}`}>
 *              <span className={styles.visuallyHidden}>{t(labelKey)}</span>
 *            </span>;
 *   }
 *   - Accessible: role="status" + visually hidden label; animation stops under prefers-reduced-motion
 *     (tokens set --duration-* to 0, and the CSS uses animation-duration from tokens).
 *   - Named export (lint).
 *
 * EXPORTS
 *   function Spinner, interface ISpinnerProps
 *
 * USED BY
 *   routes/router.tsx (HydrateFallback, SessionGate), feature buttons in a loading state.
 *
 * MAY IMPORT
 *   react-i18next, ./Spinner.module.css, ./Spinner.data.json.
 */
export {};
