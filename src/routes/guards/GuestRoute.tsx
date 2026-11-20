/**
 * FILE:   src/routes/guards/GuestRoute.tsx
 * LAYER:  routes
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Keeps signed-in users out of guest-only pages (login): redirects them to home.
 *
 * WHAT TO WRITE
 *   export function GuestRoute(): ReactElement {
 *     const user = useAuthStore((s) => s.user);
 *     return user ? <Navigate to={paths.home} replace /> : <Outlet />;
 *   }
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
export {};
