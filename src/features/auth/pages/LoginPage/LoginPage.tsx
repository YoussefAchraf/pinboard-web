/**
 * FILE:   src/features/auth/pages/LoginPage/LoginPage.tsx   (+ LoginPage.module.css, LoginPage.data.json)
 * LAYER:  feature page (route-level; the ONLY kind of file with a default export)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Route component for paths.login. Composes feature components; owns the page heading and
 *   document title. Page logic lives in the feature's hooks/ (no usePage file unless page-local state).
 *
 * WHAT TO WRITE
 *   export default function LoginPage(): ReactElement {
 *     const { t } = useTranslation('auth');
 *     useDocumentTitle(t(data.titleKey));              // optional shared hook
 *     return (
 *       <div className={styles.page}>
 *         <h1 id="auth-title" className={styles.title}>{t(data.titleKey)}</h1>
 *         <p className={styles.subtitle}>{t(data.subtitleKey)}</p>
 *         <LoginForm />
 *       </div>
 *     );
 *   }
 *   - DEFAULT export (required by routes/routeModules.ts lazy loading). Rendered inside AuthLayout.
 *
 * USED BY
 *   routes/routeModules.ts   `[paths.login]: () => import('@/features/auth/pages/LoginPage/LoginPage')`
 *
 * MAY IMPORT
 *   react-i18next, ../../components/LoginForm/LoginForm, ./LoginPage.module.css, ./LoginPage.data.json.
 */
export {};
