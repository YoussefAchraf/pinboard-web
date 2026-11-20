/**
 * FILE:   src/layouts/AppLayout/AppLayout.tsx   (+ AppLayout.module.css, AppLayout.data.json)
 * LAYER:  layouts (may import layouts/, route-public (paths, prefetchRoute), shared/)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Shell for signed-in pages: skip link, header (brand + nav + user slot), <main> with <Outlet />.
 *   A layout NEVER imports features: feature UI (user menu, notifications) arrives through slots
 *   (props) passed by routes/router.tsx.
 *
 * WHAT TO WRITE
 *   export interface IAppLayoutProps { userMenu?: ReactNode }
 *   export function AppLayout({ userMenu }: IAppLayoutProps): ReactElement {
 *     const { t } = useTranslation('common');
 *     return (
 *       <div className={styles.shell}>
 *         <a className={styles.skipLink} href="#main">{t(data.skipToContentKey)}</a>
 *         <header className={styles.header}>
 *           <Link to={paths.home} className={styles.brand}>{t(data.brandKey)}</Link>
 *           <nav aria-label={t(data.navLabelKey)}>
 *             {data.nav.map((item) => <NavLink key={item.path} to={paths[item.path]} {...prefetchHandlers(paths[item.path])}>{t(item.labelKey)}</NavLink>)}
 *           </nav>
 *           {userMenu}
 *         </header>
 *         <main id="main" className={styles.main}><Outlet /></main>
 *       </div>
 *     );
 *   }
 *   - Mobile-first: compact header + drawer/bottom nav on small screens, inline nav from --bp-tablet.
 *   - No data fetching. Named export.
 *
 * EXPORTS
 *   function AppLayout, interface IAppLayoutProps
 *
 * USED BY
 *   routes/router.tsx   `{ element: <AppLayout userMenu={<UserMenu />} />, children: [...] }`
 *
 * MAY IMPORT
 *   react-router-dom, react-i18next, @/routes/paths, @/routes/prefetchRoute, ./AppLayout.module.css, ./AppLayout.data.json.
 */
export {};
