/**
 * FILE:   src/app/App.tsx
 * LAYER:  app (may import app/, routes/, shared/)
 * STATUS: implemented
 *
 * PURPOSE
 *   The application shell: providers + session bootstrap gate. Zero UI chrome (that is layouts/).
 *
 * CONTENT
 *   useTheme() sets <html data-theme>. ErrorBoundary > QueryClientProvider > SessionGate
 *   (routes/SessionGate.tsx: Spinner until the whoami bootstrap resolves, then RouterProvider).
 *   React Query devtools in development only.
 *   - Session expiry (apiClient onSessionExpired) is registered by SessionGate through the auth
 *     feature (features/auth/hooks/useSessionExpiry): app/ may not import apiClient (lint - only a
 *     feature api/ folder may) nor features/ (boundaries).
 *   - Named export only (no default export - lint).
 *
 * EXPORTS
 *   function App
 *
 * USED BY
 *   src/main.tsx   `createRoot(root).render(<StrictMode><App /></StrictMode>)`
 *
 * MAY IMPORT
 *   ./ErrorBoundary, @/routes/SessionGate, @/shared/lib/queryClient, @/shared/hooks/useTheme,
 *   @tanstack/react-query, @tanstack/react-query-devtools.
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactElement } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { SessionGate } from '@/routes/SessionGate';
import { useTheme } from '@/shared/hooks/useTheme';
import { queryClient } from '@/shared/lib/queryClient';

export function App(): ReactElement {
  useTheme();
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SessionGate />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
