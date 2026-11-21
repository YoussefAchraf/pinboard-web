/**
 * FILE:   src/routes/prefetchRoute.ts
 * LAYER:  route-public (importable by layouts and features - see eslint boundaries)
 * STATUS: implemented
 *
 * PURPOSE
 *   Warm a page's JS chunk before the user clicks (hover/focus prefetch) so navigation feels
 *   instant. Query data prefetch is separate: features call queryClient.prefetchQuery with their
 *   own queryOptions factories (features/<name>/api/<name>Queries.ts).
 *
 * CONTENT
 *   prefetchRoute(path): imports the page chunk once; a failed import is forgotten so the next
 *   hover retries. prefetchHandlers(path): { onPointerEnter, onFocus } to spread on a link.
 *   - Never prefetch everything on mount (defeats code splitting); only likely-next routes.
 *
 * EXPORTS
 *   function prefetchRoute, function prefetchHandlers, interface IPrefetchHandlers
 *
 * USED BY
 *   layouts/AppLayout (brand + nav links), feature components with prominent links.
 *
 * MAY IMPORT
 *   ./paths, ./routeModules.
 */
import type { AppPath } from './paths';
import { routeModules } from './routeModules';

export interface IPrefetchHandlers {
  onPointerEnter: () => void;
  onFocus: () => void;
}

const warmed = new Set<AppPath>();

export function prefetchRoute(path: AppPath): void {
  if (warmed.has(path)) return;
  warmed.add(path);
  routeModules[path]().catch(() => {
    warmed.delete(path);
  });
}

export function prefetchHandlers(path: AppPath): IPrefetchHandlers {
  const warm = (): void => prefetchRoute(path);
  return { onPointerEnter: warm, onFocus: warm };
}
