/**
 * FILE:   src/shared/lib/queryClient.ts
 * LAYER:  shared
 * STATUS: implemented
 *
 * PURPOSE
 *   The single TanStack Query client with app-wide defaults.
 *
 * CONTENT
 *   queries:   staleTime 30 s (lists; detail queries override ~60 s in their queryOptions),
 *              retry once except for UNAUTHENTICATED / FORBIDDEN (shouldRetryQuery),
 *              refetchOnWindowFocus true.
 *   mutations: retry false - never auto-retry non-idempotent writes.
 *   - Query KEYS are not defined here: each feature owns them in api/<feature>Queries.ts
 *     (queryOptions factories), so keys and fetchers can never drift apart.
 *
 * EXPORTS
 *   const queryClient, function shouldRetryQuery
 *
 * USED BY
 *   app/App.tsx (QueryClientProvider, cache clear on session expiry), test/renderWithProviders.tsx
 *   (tests create a FRESH client per test instead), hooks using queryClient.prefetchQuery / invalidateQueries
 *   should call useQueryClient() rather than importing this singleton.
 *
 * MAY IMPORT
 *   @tanstack/react-query, ./apiError.
 */
import { QueryClient } from '@tanstack/react-query';
import { isApiError } from './apiError';

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  return failureCount < 1 && !isApiError(error, 'UNAUTHENTICATED') && !isApiError(error, 'FORBIDDEN');
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: true,
    },
    mutations: { retry: false },
  },
});
