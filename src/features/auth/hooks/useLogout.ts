/**
 * FILE:   src/features/auth/hooks/useLogout.ts
 * LAYER:  feature hooks
 * STATUS: implemented
 *
 * PURPOSE
 *   Sign out: revoke the server session, wipe ALL client caches, go to login.
 *
 * CONTENT
 *   onSettled (success OR failure - the user wants out either way): clearSession(),
 *   queryClient.clear() (no previous user's data may survive), navigate(paths.login, replace).
 *   The CSRF header is added by apiClient (POST).
 *
 * EXPORTS
 *   function useLogout
 *
 * USED BY
 *   ../components/UserMenu/useUserMenu.ts (UserMenu is slotted into AppLayout by routes/router.tsx).
 *
 * MAY IMPORT
 *   @tanstack/react-query, react-router-dom, @/routes/paths, ../api/authQueries, ../authStore.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authMutations } from '../api/authQueries';
import { useAuthStore } from '../authStore';
import { paths } from '@/routes/paths';
import type { ApiError } from '@/shared/lib/apiError';

export function useLogout(): UseMutationResult<void, ApiError, void> {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);
  const navigate = useNavigate();
  return useMutation<void, ApiError, void>({
    ...authMutations.logout(),
    onSettled: () => {
      clearSession();
      queryClient.clear();
      void navigate(paths.login, { replace: true });
    },
  });
}
