/**
 * FILE:   src/routes/routeModules.ts
 * LAYER:  routes (may import routes/, layouts/, features/, shared/)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The lazy-loading registry: one dynamic import() per page. It is the ONLY place pages are
 *   imported, so every page is its own code-split chunk. Used by BOTH the router (React Router 7
 *   native `lazy`) and hover/focus prefetching (prefetchRoute.ts) - one loader, two uses.
 *
 * WHAT TO WRITE
 *   type PageModule = { default: ComponentType };
 *   export const routeModules = {
 *     [paths.home]:  () => import('@/features/home/pages/HomePage/HomePage'),
 *     [paths.login]: () => import('@/features/auth/pages/LoginPage/LoginPage'),
 *   } satisfies Record<AppPath, () => Promise<PageModule>>;
 *   export function lazyRoute(path: AppPath): () => Promise<{ Component: ComponentType }> {
 *     return async () => ({ Component: (await routeModules[path]()).default });
 *   }
 *   - `satisfies Record<AppPath, ...>` makes a missing page a TYPE ERROR when a path is added.
 *   - Pages are the only default exports in the app (lint) precisely for this file.
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
export {};
