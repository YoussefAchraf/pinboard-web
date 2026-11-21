/**
 * FILE:   src/features/auth/hooks/useLogin.ts
 * LAYER:  feature hooks
 * STATUS: implemented
 *
 * PURPOSE
 *   The login mutation: calls the API and stores the session.
 *
 * CONTENT
 *   onSuccess: seeds the session query cache and calls setSession(user). Navigation is done by
 *   routes/guards/GuestRoute (a signed-in user on a guest page is sent to the remembered target or
 *   home) - one place decides the post-login destination, so two navigations never race.
 *   - Errors are NOT handled here: the form maps them (../components/LoginForm/useLoginForm.ts).
 *
 * EXPORTS
 *   function useLogin
 *
 * USED BY
 *   ../components/LoginForm/useLoginForm.ts
 *
 * MAY IMPORT
 *   @tanstack/react-query, @/shared/lib/apiError (types), ../api/*, ../authStore.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import type { ILoginPayload, ILoginResponse } from '../api/authApi';
import { authMutations, authQueries } from '../api/authQueries';
import { useAuthStore } from '../authStore';
import type { ApiError } from '@/shared/lib/apiError';

export function useLogin(): UseMutationResult<ILoginResponse, ApiError, ILoginPayload> {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation<ILoginResponse, ApiError, ILoginPayload>({
    ...authMutations.login(),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authQueries.session().queryKey, user);
      setSession(user);
    },
  });
}
