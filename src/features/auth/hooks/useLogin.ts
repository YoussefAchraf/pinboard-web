/**
 * FILE:   src/features/auth/hooks/useLogin.ts
 * LAYER:  feature hooks
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The login mutation: calls the API, updates the session, and navigates on success.
 *
 * WHAT TO WRITE
 *   export function useLogin(): UseMutationResult<ILoginResponse, ApiError, ILoginPayload> {
 *     const queryClient = useQueryClient();
 *     const setSession = useAuthStore((s) => s.setSession);
 *     const navigate = useNavigate();
 *     const location = useLocation();
 *     return useMutation({
 *       ...authMutations.login(),
 *       onSuccess: ({ user }) => {
 *         setSession(user);
 *         queryClient.setQueryData(authQueries.session().queryKey, user);
 *         navigate((location.state as { from?: string } | null)?.from ?? paths.home, { replace: true });
 *       },
 *     });
 *   }
 *   - Errors are NOT handled here: the form maps them (INVALID_CREDENTIALS -> form-level message,
 *     VALIDATION_FAILED -> field errors via fieldErrors(), RATE_LIMITED -> message).
 *
 * EXPORTS
 *   function useLogin
 *
 * USED BY
 *   ../components/LoginForm/useLoginForm.ts
 *
 * MAY IMPORT
 *   @tanstack/react-query, react-router-dom, @/routes/paths, @/shared/lib/apiError (types), ../api/*, ../authStore.
 */
export {};
