/**
 * FILE:   src/features/home/pages/HomePage/HomePage.tsx   (+ HomePage.module.css, HomePage.data.json)
 * LAYER:  feature page (default export)
 * STATUS: implemented (temporary content - the bookmarks feature replaces this page in round 2)
 *
 * PURPOSE
 *   Target of paths.home behind ProtectedRoute: greets the member by first name and says the
 *   bookmarks list is coming. The document title comes from the route `handle` (routes/router.tsx).
 *
 * USED BY
 *   routes/routeModules.ts   `[paths.home]: () => import('@/features/home/pages/HomePage/HomePage')`
 *
 * MAY IMPORT
 *   react-i18next, lucide-react, ../../hooks/useSessionUser, ./HomePage.module.css, ./HomePage.data.json.
 */
import { Bookmark } from 'lucide-react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import data from './HomePage.data.json';
import styles from './HomePage.module.css';
import { useSessionUser } from '../../hooks/useSessionUser';

export default function HomePage(): ReactElement {
  const { t } = useTranslation('home');
  const user = useSessionUser();

  return (
    <section className={styles.page} aria-labelledby="home-title">
      <h1 id="home-title" className={styles.title}>
        {user ? t(data.greetingKey, { name: user.firstname }) : t(data.titleKey)}
      </h1>
      <div className={styles.comingSoon}>
        <Bookmark className={styles.icon} size={32} aria-hidden="true" />
        <p className={styles.comingSoonTitle}>{t(data.comingSoonTitleKey)}</p>
        <p className={styles.comingSoonText}>{t(data.comingSoonTextKey)}</p>
      </div>
    </section>
  );
}
