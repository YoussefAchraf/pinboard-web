/**
 * FILE:   src/routes/prefetchRoute.ts
 * LAYER:  route-public (importable by layouts and features - see eslint boundaries)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Warm a page's JS chunk before the user clicks (hover/focus prefetch) so navigation feels
 *   instant. Query data prefetch is separate: features call queryClient.prefetchQuery with their
 *   own queryOptions factories (features/<name>/api/<name>Queries.ts).
 *
 * WHAT TO WRITE
 *   const warmed = new Set<AppPath>();
 *   export function prefetchRoute(path: AppPath): void {
 *     if (warmed.has(path)) return;
 *     warmed.add(path);
 *     void routeModules[path]().catch(() => warmed.delete(path));   // retry on next hover if it failed
 *   }
 *   export function prefetchHandlers(path: AppPath): { onPointerEnter: () => void; onFocus: () => void }
 *     -> spread onto a nav <Link {...prefetchHandlers(paths.home)} />
 *   - Never prefetch everything on mount (defeats code splitting); only likely-next routes.
 *
 * EXPORTS
 *   function prefetchRoute, function prefetchHandlers
 *
 * USED BY
 *   layouts/AppLayout (nav links), feature components with prominent links.
 *
 * MAY IMPORT
 *   ./paths, ./routeModules.
 */
export {};
