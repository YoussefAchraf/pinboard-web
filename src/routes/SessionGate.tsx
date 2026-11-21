/**
 * FILE:   src/routes/SessionGate.tsx
 * LAYER:  routes
 * STATUS: implemented
 *
 * PURPOSE
 *   Resolves the session before the router renders, so guards never flash the wrong page.
 *   app/ cannot import features/ (boundaries), so App reaches the auth hooks through this file.
 *
 * CONTENT
 *   SessionGate({ router? }):
 *   - useSessionBootstrap (whoami once) -> PageSpinner until resolved, then <RouterProvider>.
 *     A 401 resolves to the signed-out state (guards send the visitor to /login), never an error UI.
 *   - useSessionExpiry: when the apiClient reports an expired session for a signed-in user, the auth
 *     feature clears the session + query cache and this gate navigates the router to paths.login.
 *     For an anonymous visitor the signal is ignored (no loop, no error UI).
 *   - `router` defaults to getBrowserRouter(); tests pass a memory router built from appRoutes.
 *
 * EXPORTS
 *   function SessionGate, interface ISessionGateProps
 *
 * USED BY
 *   src/app/App.tsx   `<SessionGate />`
 *
 * MAY IMPORT
 *   react, react-router-dom, ./paths, ./router, ./RouteShell, @/features/auth/hooks/*.
 */
import { useCallback } from 'react';
import type { ReactElement } from 'react';
import { RouterProvider } from 'react-router-dom';
import { paths } from './paths';
import { getBrowserRouter } from './router';
import type { AppRouter } from './router';
import { PageSpinner } from './RouteShell';
import { useSessionBootstrap } from '@/features/auth/hooks/useSessionBootstrap';
import { useSessionExpiry } from '@/features/auth/hooks/useSessionExpiry';

export interface ISessionGateProps {
  router?: AppRouter;
}

export function SessionGate({ router }: ISessionGateProps): ReactElement {
  const activeRouter = router ?? getBrowserRouter();
  const { isResolved } = useSessionBootstrap();
  const goToLogin = useCallback(() => {
    void activeRouter.navigate(paths.login, { replace: true });
  }, [activeRouter]);
  useSessionExpiry(goToLogin);

  if (!isResolved) return <PageSpinner />;
  return <RouterProvider router={activeRouter} />;
}
