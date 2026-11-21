/**
 * FILE:   src/features/auth/hooks/useSessionExpiry.ts
 * LAYER:  feature hooks
 * STATUS: implemented
 *
 * PURPOSE
 *   Reacts to the apiClient "session expired" signal (refresh failed after a 401): wipes the
 *   session and the query cache, then lets the caller navigate to login.
 *
 * CONTENT
 *   useSessionExpiry(onExpired): registers the handler through authApi.onSessionExpired (only a
 *   feature api/ folder may import apiClient) and unregisters it on unmount.
 *   - Harmless when nobody is signed in: an anonymous visitor's bootstrap whoami 401 triggers one
 *     refresh attempt, and its failure also fires the signal. Unless authStore.status is
 *     'authenticated' the handler does nothing (no error UI, no cache wipe, no redirect loop);
 *     the bootstrap resolves to anonymous and the guards send the visitor to /login.
 *
 * EXPORTS
 *   function useSessionExpiry
 *
 * USED BY
 *   routes/router.tsx -> SessionGate (onExpired navigates the router to paths.login)
 *
 * MAY IMPORT
 *   @tanstack/react-query, react, ../api/authApi, ../authStore.
 */
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../authStore';

export function useSessionExpiry(onExpired: () => void): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    authApi.onSessionExpired(() => {
      const { status, clearSession } = useAuthStore.getState();
      if (status !== 'authenticated') return;
      clearSession();
      queryClient.clear();
      onExpired();
    });
    return () => authApi.onSessionExpired(() => {});
  }, [queryClient, onExpired]);
}
