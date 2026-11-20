/**
 * FILE:   src/features/home/pages/HomePage/HomePage.tsx   (+ HomePage.module.css, HomePage.data.json)
 * LAYER:  feature page (default export)
 * STATUS: placeholder - the signed-in landing page; replace with the project's real home.
 *
 * PURPOSE
 *   Target of paths.home behind ProtectedRoute, so the auth flow is complete end-to-end on the
 *   empty template (login -> home -> logout). A real project replaces its content (dashboard,
 *   project list...) and may rename the feature.
 *
 * WHAT TO WRITE
 *   export default function HomePage(): ReactElement {
 *     const { t } = useTranslation('home');
 *     return (
 *       <section className={styles.page}>
 *         <h1 className={styles.title}>{t(data.titleKey)}</h1>
 *         <p className={styles.empty}>{t(data.emptyStateKey)}</p>   // designed empty state: guidance + action
 *       </section>
 *     );
 *   }
 *
 * USED BY
 *   routes/routeModules.ts   `[paths.home]: () => import('@/features/home/pages/HomePage/HomePage')`
 *
 * MAY IMPORT
 *   react-i18next, ./HomePage.module.css, ./HomePage.data.json.
 */
export {};
