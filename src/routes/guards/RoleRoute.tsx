/**
 * FILE:   src/routes/guards/RoleRoute.tsx
 * LAYER:  routes
 * STATUS: implemented (not used on a route yet - first role-restricted page will use it)
 *
 * PURPOSE
 *   Hides role-restricted branches from users without the role. UX only - the backend's
 *   requireRole middleware is the real gate (it returns 403 FORBIDDEN regardless of the UI).
 *
 * CONTENT
 *   Allowed role -> <Outlet /> (the parent outlet context is forwarded); otherwise -> home.
 *   - Must be nested INSIDE ProtectedRoute (it assumes a user exists).
 *   - Role values come from shared/types/domain.ts (mirror of the contract role enum).
 *
 * EXPORTS
 *   function RoleRoute, interface IRoleRouteProps
 *
 * USED BY
 *   routes/router.tsx   `{ element: <RoleRoute allow={['admin']} />, children: [...] }` (future)
 *
 * MAY IMPORT
 *   react-router-dom, ../paths, @/features/auth/authStore, @/shared/types/domain.
 */
import type { ReactElement } from 'react';
import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { paths } from '../paths';
import { useAuthStore } from '@/features/auth/authStore';
import type { Role } from '@/shared/types/domain';

export interface IRoleRouteProps {
  allow: readonly Role[];
}

export function RoleRoute({ allow }: IRoleRouteProps): ReactElement {
  const role = useAuthStore((s) => s.user?.roleName);
  const context: unknown = useOutletContext();
  if (role && allow.includes(role)) return <Outlet context={context} />;
  return <Navigate to={paths.home} replace />;
}
