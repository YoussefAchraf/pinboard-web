/**
 * FILE:   src/features/auth/api/authQueries.ts
 * LAYER:  feature api
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The feature's TanStack Query definitions: query KEYS + fetchers defined together, so hooks,
 *   prefetching and invalidation always use the same pair (no central queryKeys.ts to drift).
 *
 * WHAT TO WRITE
 *   export const authKeys = { all: ['auth'] as const, session: () => [...authKeys.all, 'session'] as const };
 *   export const authQueries = {
 *     session: () => queryOptions({
 *       queryKey: authKeys.session(),
 *       queryFn: async () => (await authApi.whoami()).user,
 *       staleTime: Infinity,          // changes only through login/logout (explicit invalidation)
 *       retry: false,                 // 401 here simply means "no session"
 *     }),
 *   };
 *   export const authMutations = {
 *     login: () => ({ mutationKey: [...authKeys.all, 'login'], mutationFn: authApi.login }),
 *     logout: () => ({ mutationKey: [...authKeys.all, 'logout'], mutationFn: authApi.logout }),
 *   };
 *   - Pattern for every feature: <feature>Keys + <feature>Queries (+ <feature>Mutations).
 *     Keys mirror backend resources + params: ['projects', projectId, 'tasks', { cursor }].
 *
 * EXPORTS
 *   authKeys, authQueries, authMutations
 *
 * USED BY
 *   ../hooks/useSessionBootstrap.ts, ../hooks/useLogin.ts, ../hooks/useLogout.ts, tests.
 *
 * MAY IMPORT
 *   @tanstack/react-query (queryOptions), ./authApi.
 */
export {};
