/**
 * FILE:   src/layouts/AppLayout/AppLayout.tsx   (+ AppLayout.module.css, AppLayout.data.json, useAppLayout.ts)
 * LAYER:  layouts (may import layouts/, route-public (paths, prefetchRoute), shared/)
 * STATUS: implemented
 *
 * PURPOSE
 *   Shell for signed-in pages: skip link, header (brand "PinBoard" + nav + user slot), <main> with
 *   <Outlet />. A layout NEVER imports features: feature UI (user menu) arrives through slots
 *   (props) passed by routes/router.tsx.
 *
 * CONTENT
 *   - Nav links prefetch their page chunk on hover/focus (routes/prefetchRoute).
 *   - The outlet context of the parent route is forwarded to the page (useAppLayout).
 *   - Mobile-first: brand, nav and user slot share one wrapping row at 320 px; the main column
 *     gets more padding from --bp-tablet. One nav item today, so no drawer is needed.
 *   - No data fetching. Named export.
 *
 * EXPORTS
 *   function AppLayout, interface IAppLayoutProps
 *
 * USED BY
 *   routes/router.tsx   `{ element: <AppLayout userMenu={<UserMenu />} />, children: [...] }`
 *
 * MAY IMPORT
 *   react-router-dom, react-i18next, @/routes/paths, @/routes/prefetchRoute, ./useAppLayout,
 *   ./AppLayout.module.css, ./AppLayout.data.json.
 */
import type { ReactElement, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet } from 'react-router-dom';
import data from './AppLayout.data.json';
import styles from './AppLayout.module.css';
import { useAppLayout } from './useAppLayout';
import { paths } from '@/routes/paths';
import { prefetchHandlers } from '@/routes/prefetchRoute';

export interface IAppLayoutProps {
  userMenu?: ReactNode;
}

export function AppLayout({ userMenu }: IAppLayoutProps): ReactElement {
  const { t } = useTranslation('common');
  const { navItems, outletContext } = useAppLayout();

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main">
        {t(data.skipToContentKey)}
      </a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to={paths.home} className={styles.brand} {...prefetchHandlers(paths.home)}>
            {t(data.brandKey)}
          </Link>
          <nav className={styles.nav} aria-label={t(data.navLabelKey)}>
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end className={styles.navLink} {...prefetchHandlers(item.to)}>
                    {t(item.labelKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          {userMenu && <div className={styles.userSlot}>{userMenu}</div>}
        </div>
      </header>
      <main id="main" tabIndex={-1} className={styles.main}>
        <Outlet context={outletContext} />
      </main>
    </div>
  );
}
