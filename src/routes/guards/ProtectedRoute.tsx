/**
 * FILE:   src/routes/guards/ProtectedRoute.tsx
 * LAYER:  routes
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Redirects anonymous users to the login page, remembering where they were going.
 *   UX only - real authorization is ALWAYS enforced by the backend.
 *
 * WHAT TO WRITE
 *   export function ProtectedRoute(): ReactElement {
 *     const user = useAuthStore((s) => s.user);
 *     const location = useLocation();
 *     if (!user) return <Navigate to={paths.login} replace state={{ from: location.pathname }} />;
 *     return <Outlet />;
 *   }
 *   - Pure redirect logic: no fetching (the session is already resolved by SessionGate).
 *
 * EXPORTS
 *   function ProtectedRoute
 *
 * USED BY
 *   routes/router.tsx (wraps every signed-in branch)
 *
 * MAY IMPORT
 *   react-router-dom, ../paths, @/features/auth/authStore.
 */
export {};
