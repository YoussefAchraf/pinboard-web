/**
 * FILE:   src/features/auth/hooks/useLogout.ts
 * LAYER:  feature hooks
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Sign out: revoke the server session, wipe ALL client caches, go to login.
 *
 * WHAT TO WRITE
 *   export function useLogout(): UseMutationResult<void, ApiError, void> {
 *     const queryClient = useQueryClient();
 *     const clearSession = useAuthStore((s) => s.clearSession);
 *     const navigate = useNavigate();
 *     return useMutation({
 *       ...authMutations.logout(),
 *       onSettled: () => {                 // even if the request fails, the user wants out
 *         clearSession();
 *         queryClient.clear();             // no previous user's data may survive
 *         navigate(paths.login, { replace: true });
 *       },
 *     });
 *   }
 *
 * EXPORTS
 *   function useLogout
 *
 * USED BY
 *   A UserMenu component in this feature (slotted into AppLayout by routes/router.tsx).
 *
 * MAY IMPORT
 *   @tanstack/react-query, react-router-dom, @/routes/paths, ../api/authQueries, ../authStore.
 */
export {};
