/**
 * FILE:   src/features/auth/api/authQueries.ts
 * LAYER:  feature api
 * STATUS: implemented
 *
 * PURPOSE
 *   The feature's TanStack Query definitions: query KEYS + fetchers defined together, so hooks,
 *   prefetching and invalidation always use the same pair (no central queryKeys.ts to drift).
 *
 * CONTENT
 *   authKeys.session() -> ['auth', 'session']
 *   authQueries.session(): whoami -> IUser; staleTime Infinity (changes only on login/logout);
 *     retry false (401 simply means "no session").
 *   authMutations.login() / logout(): mutation key + transport function.
 *   - Pattern for every feature: <feature>Keys + <feature>Queries (+ <feature>Mutations).
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
import { queryOptions } from '@tanstack/react-query';
import { authApi } from './authApi';

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

export const authQueries = {
  session: () =>
    queryOptions({
      queryKey: authKeys.session(),
      queryFn: async () => (await authApi.whoami()).user,
      staleTime: Infinity,
      retry: false,
    }),
};

export const authMutations = {
  login: () => ({ mutationKey: [...authKeys.all, 'login'] as const, mutationFn: authApi.login }),
  logout: () => ({ mutationKey: [...authKeys.all, 'logout'] as const, mutationFn: authApi.logout }),
};
