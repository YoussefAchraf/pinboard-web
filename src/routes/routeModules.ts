/**
 * FILE:   src/routes/routeModules.ts
 * LAYER:  routes (may import routes/, layouts/, features/, shared/)
 * STATUS: implemented
 *
 * PURPOSE
 *   The lazy-loading registry: one dynamic import() per page. It is the ONLY place pages are
 *   imported, so every page is its own code-split chunk. Used by BOTH the router (React Router 7
 *   native `lazy`) and hover/focus prefetching (prefetchRoute.ts) - one loader, two uses.
 *
 * CONTENT
 *   - `satisfies Record<AppPath, ...>` makes a missing page a TYPE ERROR when a path is added.
 *   - lazyRoute(path) adapts a page module to the route `lazy` shape ({ Component }).
 *
 * EXPORTS
 *   const routeModules, function lazyRoute
 *
 * USED BY
 *   routes/router.tsx         `{ path: paths.login, lazy: lazyRoute(paths.login) }`
 *   routes/prefetchRoute.ts   warms a chunk on hover/focus
 *
 * MAY IMPORT
 *   ./paths (types + values), react (ComponentType type). Page modules ONLY via dynamic import().
 */
import type { ComponentType } from 'react';
import { paths } from './paths';
import type { AppPath } from './paths';

interface IPageModule {
  default: ComponentType;
}

export const routeModules = {
  [paths.home]: () => import('@/features/home/pages/HomePage/HomePage'),
  [paths.login]: () => import('@/features/auth/pages/LoginPage/LoginPage'),
} satisfies Record<AppPath, () => Promise<IPageModule>>;

export function lazyRoute(path: AppPath): () => Promise<{ Component: ComponentType }> {
  return async () => ({ Component: (await routeModules[path]()).default });
}
