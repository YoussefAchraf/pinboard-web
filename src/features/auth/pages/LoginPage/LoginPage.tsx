/**
 * FILE:   src/features/auth/pages/LoginPage/LoginPage.tsx   (+ LoginPage.module.css, LoginPage.data.json)
 * LAYER:  feature page (route-level; the ONLY kind of file with a default export)
 * STATUS: implemented
 *
 * PURPOSE
 *   Route component for paths.login. Composes feature components; owns the page heading
 *   (id "auth-title", referenced by AuthLayout's aria-labelledby). The document title comes from
 *   the route `handle` (routes/router.tsx).
 *
 * USED BY
 *   routes/routeModules.ts   `[paths.login]: () => import('@/features/auth/pages/LoginPage/LoginPage')`
 *
 * MAY IMPORT
 *   react-i18next, ../../components/LoginForm/LoginForm, ./LoginPage.module.css, ./LoginPage.data.json.
 */
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import data from './LoginPage.data.json';
import styles from './LoginPage.module.css';
import { LoginForm } from '../../components/LoginForm/LoginForm';

export default function LoginPage(): ReactElement {
  const { t } = useTranslation('auth');
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 id="auth-title" className={styles.title}>
          {t(data.titleKey)}
        </h1>
        <p className={styles.subtitle}>{t(data.subtitleKey)}</p>
      </div>
      <LoginForm />
    </div>
  );
}
