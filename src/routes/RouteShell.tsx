/**
 * FILE:   src/routes/RouteShell.tsx   (+ RouteShell.module.css)
 * LAYER:  routes
 * STATUS: implemented
 *
 * PURPOSE
 *   Router-level chrome without UI of its own: the full-page spinner (session bootstrap and lazy
 *   route loading) and the document-title updater of the root route.
 *   (Components live here, not in router.tsx, so router.tsx exports no components - fast refresh.)
 *
 * CONTENT
 *   PageSpinner: centered Spinner, full viewport.
 *   DocumentTitle: renders <Outlet />; the deepest matched route `handle.titleKey` ('<ns>:<key>')
 *   sets document.title = common app.documentTitle ("<page> - PinBoard"); no handle -> "PinBoard".
 *   Re-renders on language change (useTranslation), so the title follows the language.
 *
 * EXPORTS
 *   function PageSpinner, function DocumentTitle
 *
 * USED BY
 *   routes/router.tsx (root route element + HydrateFallback), routes/SessionGate.tsx (PageSpinner)
 *
 * MAY IMPORT
 *   react, react-i18next, react-router-dom, @/shared/components/Spinner, its CSS module.
 */
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useMatches } from 'react-router-dom';
import styles from './RouteShell.module.css';
import { Spinner } from '@/shared/components/Spinner/Spinner';

function titleKeyOf(handle: unknown): string | undefined {
  if (typeof handle !== 'object' || handle === null || !('titleKey' in handle)) return undefined;
  return typeof handle.titleKey === 'string' ? handle.titleKey : undefined;
}

export function PageSpinner(): ReactElement {
  return (
    <div className={styles.fullPage}>
      <Spinner size="lg" />
    </div>
  );
}

export function DocumentTitle(): ReactElement {
  const { t } = useTranslation('common');
  const titleKey = useMatches()
    .map((match) => titleKeyOf(match.handle))
    .filter((key): key is string => key !== undefined)
    .at(-1);

  useEffect(() => {
    document.title = titleKey ? t('app.documentTitle', { page: t(titleKey) }) : t('app.name');
  }, [t, titleKey]);

  return <Outlet />;
}
