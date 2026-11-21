/**
 * FILE:   src/layouts/AuthLayout/AuthLayout.tsx   (+ AuthLayout.module.css, AuthLayout.data.json)
 * LAYER:  layouts (may import layouts/, route-public, shared/)
 * STATUS: implemented
 *
 * PURPOSE
 *   Shell for guest pages (login): brand "PinBoard" + card, no app navigation.
 *   The card is labelled by the page heading (id "auth-title", written by the page).
 *   Full-bleed on phones, centered card with a max inline size from --bp-tablet.
 *   Named export, no data fetching.
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
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import data from './AuthLayout.data.json';
import styles from './AuthLayout.module.css';

export function AuthLayout(): ReactElement {
  const { t } = useTranslation('common');
  return (
    <main className={styles.page}>
      <div className={styles.column}>
        <p className={styles.brand}>{t(data.brandKey)}</p>
        <section className={styles.card} aria-labelledby="auth-title">
          <Outlet />
        </section>
      </div>
    </main>
  );
}
