/**
 * FILE:   src/routes/router.tsx
 * LAYER:  routes (may import routes/, layouts/, features/, shared/)
 * STATUS: implemented
 *
 * PURPOSE
 *   The route tree: layouts + guards + lazily loaded pages. Also the composition point where
 *   feature components are slotted into layouts (layouts never import features).
 *
 * CONTENT
 *   appRoutes:
 *     root (DocumentTitle, errorElement RouteError, HydrateFallback PageSpinner)
 *       GuestRoute > AuthLayout > /login (lazy LoginPage)
 *       ProtectedRoute > AppLayout(userMenu=<UserMenu/>) > / (lazy HomePage)
 *     Unknown paths: no route matches -> the root errorElement renders RouteError with a 404.
 *     Each page route declares `handle: { titleKey: '<ns>:<key>' }` (read by DocumentTitle).
 *     Role-gated branches (future): `{ element: <RoleRoute allow={['admin']} />, children: [...] }`
 *     inside the ProtectedRoute branch.
 *   getBrowserRouter(): the app's browser router, created on first use (tests build a memory
 *   router from appRoutes instead).
 *   - SessionGate (session bootstrap before the router renders) lives in ./SessionGate.tsx and
 *     the root-route components in ./RouteShell.tsx: this file exports no components (fast refresh).
 *   - `lazy` and `HydrateFallback` verified in react-router 7.18.6 (dist d.ts + tests).
 *
 * EXPORTS
 *   appRoutes, getBrowserRouter, type AppRouter
 *
 * USED BY
 *   routes/SessionGate.tsx (default router), tests (appRoutes + createMemoryRouter).
 *
 * MAY IMPORT
 *   ./paths, ./routeModules, ./guards/*, ./RouteError, ./RouteShell, @/layouts/*,
 *   @/features/<name>/components/*, react-router-dom.
 */
import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { GuestRoute } from './guards/GuestRoute';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { paths } from './paths';
import { RouteError } from './RouteError';
import { lazyRoute } from './routeModules';
import { DocumentTitle, PageSpinner } from './RouteShell';
import { UserMenu } from '@/features/auth/components/UserMenu/UserMenu';
import { AppLayout } from '@/layouts/AppLayout/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout/AuthLayout';

export type AppRouter = ReturnType<typeof createBrowserRouter>;

interface IRouteHandle {
  /** '<namespace>:<key>' of the page title. */
  titleKey: string;
}

const loginHandle: IRouteHandle = { titleKey: 'auth:login.title' };
const homeHandle: IRouteHandle = { titleKey: 'home:title' };

export const appRoutes: RouteObject[] = [
  {
    element: <DocumentTitle />,
    errorElement: <RouteError />,
    HydrateFallback: PageSpinner,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [{ path: paths.login, lazy: lazyRoute(paths.login), handle: loginHandle }],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout userMenu={<UserMenu />} />,
            children: [{ path: paths.home, lazy: lazyRoute(paths.home), handle: homeHandle }],
          },
        ],
      },
    ],
  },
];

let browserRouter: AppRouter | undefined;

export function getBrowserRouter(): AppRouter {
  browserRouter ??= createBrowserRouter(appRoutes);
  return browserRouter;
}
