/**
 * FILE:   src/features/auth/hooks/useSessionBootstrap.ts
 * LAYER:  feature hooks (React Query; never imports apiClient/axios - lint)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Resolves "is there a session?" once at startup (GET /auth/whoami) before the router renders,
 *   so guards never flash the wrong page.
 *
 * WHAT TO WRITE
 *   export function useSessionBootstrap(): { isResolved: boolean } {
 *     const query = useQuery(authQueries.session());
 *     const setSession = useAuthStore((s) => s.setSession);
 *     const clearSession = useAuthStore((s) => s.clearSession);
 *     useEffect(() => {
 *       if (query.isSuccess) setSession(query.data);
 *       if (query.isError) clearSession();               // 401 = anonymous, not an error to show
 *     }, [query.isSuccess, query.isError, query.data, setSession, clearSession]);
 *     return { isResolved: !query.isPending };
 *   }
 *   - A network failure (not 401) should still resolve to anonymous AND surface a toast/banner
 *     (offline at boot), never block the app on a spinner forever.
 *
 * EXPORTS
 *   function useSessionBootstrap
 *
 * USED BY
 *   routes/router.tsx -> SessionGate (Spinner until isResolved, then RouterProvider)
 *
 * MAY IMPORT
 *   @tanstack/react-query, react, ../api/authQueries, ../authStore.
 */
export {};
