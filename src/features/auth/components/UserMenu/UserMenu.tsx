/**
 * FILE:   src/features/auth/components/UserMenu/UserMenu.tsx
 * LAYER:  feature component (four-file unit: .tsx, .module.css, .data.json, useUserMenu.ts)
 * STATUS: implemented
 *
 * PURPOSE
 *   The signed-in user's menu in the app header: first name on the trigger, email and the
 *   sign-out action in the panel. Slotted into AppLayout by routes/router.tsx (layouts never
 *   import features).
 *
 * CONTENT
 *   Disclosure button (aria-expanded/aria-controls) + panel. Trigger accessible name (aria-label)
 *   starts with the visible first name ("Max, account menu" - WCAG 2.5.3 label in name).
 *   Renders nothing without a user (guards prevent that case).
 *
 * USED BY
 *   routes/router.tsx   `<AppLayout userMenu={<UserMenu />} />`
 *
 * MAY IMPORT
 *   react-i18next, lucide-react, ./useUserMenu, ./UserMenu.module.css, ./UserMenu.data.json.
 */
import { ChevronDown } from 'lucide-react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import data from './UserMenu.data.json';
import styles from './UserMenu.module.css';
import { useUserMenu } from './useUserMenu';

export function UserMenu(): ReactElement | null {
  const { t } = useTranslation('auth');
  const { user, initial, isOpen, panelId, setRoot, setTrigger, toggle, onKeyDown, onBlur, signOut, isSigningOut } =
    useUserMenu();
  if (!user) return null;

  return (
    <div className={styles.root} ref={setRoot} onKeyDown={onKeyDown} onBlur={onBlur}>
      <button
        ref={setTrigger}
        type="button"
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={t(data.triggerLabelKey, { name: user.firstname })}
        onClick={toggle}
      >
        <span className={styles.avatar} aria-hidden="true">
          {initial}
        </span>
        <span className={styles.name}>{user.firstname}</span>
        <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
      </button>
      <div id={panelId} className={styles.panel} hidden={!isOpen}>
        <p className={styles.signedInAs}>{t(data.signedInAsKey)}</p>
        <p className={styles.email}>{user.email}</p>
        <button
          type="button"
          className={styles.signOut}
          onClick={signOut}
          disabled={isSigningOut}
          aria-busy={isSigningOut}
        >
          {t(isSigningOut ? data.signingOutKey : data.signOutKey)}
        </button>
      </div>
    </div>
  );
}
