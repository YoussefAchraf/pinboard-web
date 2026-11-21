/**
 * FILE:   src/routes/guards/GuestRoute.tsx
 * LAYER:  routes
 * STATUS: implemented
 *
 * PURPOSE
 *   Keeps signed-in users out of guest-only pages (login). It is also THE post-login redirect:
 *   once useLogin stores the session, this guard sends the user to the target remembered by
 *   ProtectedRoute (`location.state.from`, internal paths only) or to home.
 *
 * EXPORTS
 *   function GuestRoute
 *
 * USED BY
 *   routes/router.tsx (wraps the AuthLayout branch)
 *
 * MAY IMPORT
 *   react-router-dom, ../paths, @/features/auth/authStore.
 */
import type { ReactElement } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { paths } from '../paths';
import { useAuthStore } from '@/features/auth/authStore';

/** The remembered target if it is an internal path (never `//host` or an absolute URL), else home. */
function redirectTarget(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state) {
    const from = state.from;
    if (typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && from !== paths.login) {
      return from;
    }
  }
  return paths.home;
}

export function GuestRoute(): ReactElement {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (user) return <Navigate to={redirectTarget(location.state)} replace />;
  return <Outlet />;
}
