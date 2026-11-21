/**
 * FILE:   src/features/auth/hooks/useSessionBootstrap.ts
 * LAYER:  feature hooks (React Query; never imports apiClient/axios - lint)
 * STATUS: implemented
 *
 * PURPOSE
 *   Resolves "is there a session?" ONCE at startup (GET /auth/whoami) before the router renders,
 *   so guards never flash the wrong page.
 *
 * CONTENT
 *   - The whoami query runs only while authStore.status is 'unknown' (enabled flag): after the
 *     first answer the store is the source of truth, so a later queryClient.clear() (logout,
 *     session expiry) never re-runs the bootstrap or brings back the spinner.
 *   - Success -> setSession(user). Any error -> clearSession(): 401 is the normal anonymous case
 *     (not an error UI); a network failure at boot also resolves to anonymous (login page) instead
 *     of blocking the app on a spinner.
 *   - isResolved = status !== 'unknown'.
 *
 * EXPORTS
 *   function useSessionBootstrap, interface ISessionBootstrap
 *
 * USED BY
 *   routes/router.tsx -> SessionGate (Spinner until isResolved, then RouterProvider)
 *
 * MAY IMPORT
 *   @tanstack/react-query, react, ../api/authQueries, ../authStore.
 */
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { authQueries } from '../api/authQueries';
import { useAuthStore } from '../authStore';

export interface ISessionBootstrap {
  isResolved: boolean;
}

export function useSessionBootstrap(): ISessionBootstrap {
  const status = useAuthStore((s) => s.status);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const query = useQuery({ ...authQueries.session(), enabled: status === 'unknown' });

  useEffect(() => {
    if (status !== 'unknown') return;
    if (query.isSuccess) setSession(query.data);
    else if (query.isError) clearSession();
  }, [status, query.isSuccess, query.isError, query.data, setSession, clearSession]);

  return { isResolved: status !== 'unknown' };
}
