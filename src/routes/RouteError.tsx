/**
 * FILE:   src/routes/RouteError.tsx   (+ RouteError.module.css)
 * LAYER:  routes
 * STATUS: implemented
 *
 * PURPOSE
 *   Router-level error UI (`errorElement` of the root route): unknown paths (404), page crashes,
 *   failed lazy chunks, thrown responses.
 *
 * CONTENT
 *   - Chunk load failure after a deploy (message matches CHUNK_ERROR): "A new version is
 *     available" + Reload (window.location.reload()).
 *   - isRouteErrorResponse(error) && status 404 (no route matched): not-found view + link home.
 *   - Otherwise: generic error + "Try again" (navigate(0) reloads the route) + link home;
 *     console.error(error).
 *   - Text via i18n (common namespace: routeError.*, actions.*); sets the document title.
 *   - Named export.
 *
 * EXPORTS
 *   function RouteError
 *
 * USED BY
 *   routes/router.tsx   `errorElement: <RouteError />` on the root route
 *
 * MAY IMPORT
 *   react, react-router-dom, react-i18next, ./paths, its CSS module.
 */
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, Link, useNavigate, useRouteError } from 'react-router-dom';
import { paths } from './paths';
import styles from './RouteError.module.css';

type RouteErrorKind = 'notFound' | 'newVersion' | 'unexpected';

const CHUNK_ERROR = /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk/i;

function routeErrorKind(error: unknown): RouteErrorKind {
  if (isRouteErrorResponse(error) && error.status === 404) return 'notFound';
  if (error instanceof Error && CHUNK_ERROR.test(error.message)) return 'newVersion';
  return 'unexpected';
}

const TITLE_KEY: Record<RouteErrorKind, string> = {
  notFound: 'routeError.notFoundTitle',
  newVersion: 'routeError.newVersionTitle',
  unexpected: 'routeError.title',
};

const MESSAGE_KEY: Record<RouteErrorKind, string> = {
  notFound: 'routeError.notFound',
  newVersion: 'routeError.newVersion',
  unexpected: 'routeError.unexpected',
};

export function RouteError(): ReactElement {
  const error = useRouteError();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const kind = routeErrorKind(error);
  const title = t(TITLE_KEY[kind]);

  useEffect(() => {
    if (kind === 'unexpected') console.error(error);
  }, [kind, error]);

  useEffect(() => {
    document.title = t('app.documentTitle', { page: title });
  }, [t, title]);

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="route-error-title">
        <h1 id="route-error-title" className={styles.title}>
          {title}
        </h1>
        <p className={styles.message}>{t(MESSAGE_KEY[kind])}</p>
        <div className={styles.actions}>
          {kind === 'newVersion' && (
            <button type="button" className={styles.primary} onClick={() => window.location.reload()}>
              {t('actions.reload')}
            </button>
          )}
          {kind === 'unexpected' && (
            <button type="button" className={styles.primary} onClick={() => void navigate(0)}>
              {t('actions.retry')}
            </button>
          )}
          <Link to={paths.home} className={kind === 'notFound' ? styles.primary : styles.secondary}>
            {t('actions.backHome')}
          </Link>
        </div>
      </section>
    </main>
  );
}
