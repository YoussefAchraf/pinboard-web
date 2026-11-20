/**
 * FILE:   src/shared/lib/queryClient.ts
 * LAYER:  shared
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The single TanStack Query client with app-wide defaults.
 *
 * WHAT TO WRITE
 *   export const queryClient = new QueryClient({
 *     defaultOptions: {
 *       queries: {
 *         staleTime: 30_000,                      // lists; detail queries override (~60s) in their queryOptions
 *         retry: (count, error) => count < 1 && !isApiError(error, 'UNAUTHENTICATED') && !isApiError(error, 'FORBIDDEN'),
 *         refetchOnWindowFocus: true,
 *       },
 *       mutations: { retry: false },              // never auto-retry non-idempotent writes
 *     },
 *   });
 *   - Query KEYS are not defined here: each feature owns them in api/<feature>Queries.ts
 *     (queryOptions factories), so keys and fetchers can never drift apart.
 *
 * EXPORTS
 *   const queryClient
 *
 * USED BY
 *   app/App.tsx (QueryClientProvider, cache clear on session expiry), test/renderWithProviders.tsx
 *   (tests create a FRESH client per test instead), hooks using queryClient.prefetchQuery / invalidateQueries
 *   should call useQueryClient() rather than importing this singleton.
 *
 * MAY IMPORT
 *   @tanstack/react-query, ./apiError.
 */
export {};
