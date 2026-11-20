/**
 * FILE:   src/routes/paths.ts
 * LAYER:  route-public (importable by features, layouts, app, routes, test - see eslint boundaries)
 * STATUS: implemented (pure data) - extend per feature.
 *
 * PURPOSE
 *   The single source of truth for every route string. JSX `to=` values and navigate() calls
 *   use these constants/builders - inline route literals are a lint error.
 *
 * HOW TO EXTEND
 *   - Static route:         projects: '/projects',
 *   - Parameterised route:  add the pattern to `paths` (for the router) AND a builder to `buildPath`
 *                           (for links), e.g.
 *                             projectDetail: '/projects/:projectId',
 *                             projectDetail: (projectId: string): string => `/projects/${encodeURIComponent(projectId)}`,
 *   - Then register the page in routeModules.ts and router.tsx.
 *
 * USED BY
 *   routes/router.tsx, routes/routeModules.ts, routes/guards/*, app/App.tsx (session-expired redirect),
 *   features (navigate after login, <Link to={paths.home}>), layouts (nav links).
 */

export const paths = {
  home: '/',
  login: '/login',
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];

/** Builders for parameterised routes (keep in sync with the patterns above). */
export const buildPath = {} as const;
