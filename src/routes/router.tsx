/**
 * FILE:   src/routes/router.tsx
 * LAYER:  routes (may import routes/, layouts/, features/, shared/)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The route tree: layouts + guards + lazily loaded pages. Also the composition point where
 *   feature components are slotted into layouts (layouts never import features).
 *
 * WHAT TO WRITE
 *   export const router = createBrowserRouter([
 *     {
 *       errorElement: <RouteError />,
 *       HydrateFallback: Spinner,                       // shown while a lazy route chunk loads
 *       children: [
 *         { element: <GuestRoute />, children: [        // signed-in users are redirected to home
 *           { element: <AuthLayout />, children: [
 *             { path: paths.login, lazy: lazyRoute(paths.login) },
 *           ]},
 *         ]},
 *         { element: <ProtectedRoute />, children: [    // anonymous users are redirected to login
 *           { element: <AppLayout userMenu={<UserMenu />} />, children: [   // slot: feature component
 *             { path: paths.home, lazy: lazyRoute(paths.home) },
 *             // role-gated branch: { element: <RoleRoute allow={['admin']} />, children: [...] }
 *           ]},
 *         ]},
 *         { path: '*', lazy: ... NotFound page (add to paths + routeModules) },
 *       ],
 *     },
 *   ]);
 *   export function SessionGate(): ReactElement  // uses features/auth useSessionBootstrap();
 *                                                // Spinner while pending, then <RouterProvider router={router} />
 *   - Verify `lazy` / `HydrateFallback` route options against the pinned react-router-dom version.
 *
 * EXPORTS
 *   const router, function SessionGate
 *
 * USED BY
 *   src/app/App.tsx   `<SessionGate />` (renders RouterProvider) and `router.navigate(...)`
 *
 * MAY IMPORT
 *   ./paths, ./routeModules, ./guards/*, ./RouteError, @/layouts/*, @/features/<name>/(hooks|components)/*,
 *   @/shared/components/Spinner, react-router-dom.
 */
export {};
