/**
 * FILE:   src/routes/guards/RoleRoute.tsx
 * LAYER:  routes
 * STATUS: placeholder - implement when the first role-restricted page exists.
 *
 * PURPOSE
 *   Hides role-restricted branches from users without the role. UX only - the backend's
 *   requireRole middleware is the real gate (it returns 403 FORBIDDEN regardless of the UI).
 *
 * WHAT TO WRITE
 *   export function RoleRoute({ allow }: { allow: readonly Role[] }): ReactElement {
 *     const role = useAuthStore((s) => s.user?.roleName);
 *     return role && allow.includes(role) ? <Outlet /> : <Navigate to={paths.home} replace />;
 *   }
 *   - Must be nested INSIDE ProtectedRoute (it assumes a user exists).
 *   - Role values come from shared/types/domain.ts (mirror of the backend role catalog).
 *
 * EXPORTS
 *   function RoleRoute
 *
 * USED BY
 *   routes/router.tsx   `{ element: <RoleRoute allow={['admin']} />, children: [...] }`
 *
 * MAY IMPORT
 *   react-router-dom, ../paths, @/features/auth/authStore, @/shared/types/domain.
 */
export {};
