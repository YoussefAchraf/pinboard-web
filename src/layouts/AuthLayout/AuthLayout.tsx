/**
 * FILE:   src/layouts/AuthLayout/AuthLayout.tsx   (+ AuthLayout.module.css, AuthLayout.data.json)
 * LAYER:  layouts (may import layouts/, route-public, shared/)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Shell for guest pages (login, password reset): centered card, brand, no app navigation.
 *
 * WHAT TO WRITE
 *   export function AuthLayout(): ReactElement {
 *     const { t } = useTranslation('common');
 *     return (
 *       <main className={styles.page}>
 *         <section className={styles.card} aria-labelledby="auth-title">
 *           <p className={styles.brand}>{t(data.brandKey)}</p>
 *           <Outlet />
 *         </section>
 *       </main>
 *     );
 *   }
 *   - Full-bleed on phones, centered card with max inline size from --bp-tablet.
 *   - Named export, no data fetching.
 *
 * EXPORTS
 *   function AuthLayout
 *
 * USED BY
 *   routes/router.tsx   `{ element: <GuestRoute />, children: [{ element: <AuthLayout />, children: [...] }] }`
 *
 * MAY IMPORT
 *   react-router-dom, react-i18next, ./AuthLayout.module.css, ./AuthLayout.data.json.
 */
export {};
