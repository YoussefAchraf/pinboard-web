/**
 * FILE:   src/routes/guards/ProtectedRoute.tsx
 * LAYER:  routes
 * STATUS: implemented
 *
 * PURPOSE
 *   Redirects anonymous users to the login page, remembering where they were going
 *   (`state.from` = pathname + search; GuestRoute returns there after login).
 *   UX only - real authorization is ALWAYS enforced by the backend.
 *
 * CONTENT
 *   Signed in -> <Outlet context={{ user }} />: protected pages read the user from the outlet
 *   context (features never import the auth feature). Pure redirect logic, no fetching (the session
 *   is already resolved by SessionGate).
 *
 * EXPORTS
 *   function ProtectedRoute, interface IProtectedOutletContext
 *
 * USED BY
 *   routes/router.tsx (wraps every signed-in branch)
 *
 * MAY IMPORT
 *   react-router-dom, ../paths, @/features/auth/authStore, @/shared/types/domain (types).
 */
import type { ReactElement } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { paths } from '../paths';
import { useAuthStore } from '@/features/auth/authStore';
import type { IUser } from '@/shared/types/domain';

export interface IProtectedOutletContext {
  user: IUser;
}

export function ProtectedRoute(): ReactElement {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (!user) {
    return <Navigate to={paths.login} replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  const context: IProtectedOutletContext = { user };
  return <Outlet context={context} />;
}
