/**
 * FILE:   src/app/App.tsx
 * LAYER:  app (may import app/, routes/, shared/)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The application shell: providers + session bootstrap gate. Zero UI chrome (that is layouts/).
 *
 * WHAT TO WRITE
 *   export function App(): ReactElement {
 *     useTheme();                                        // shared/hooks/useTheme - sets <html data-theme>
 *     useEffect(() => configureApiClient({               // shared/lib/apiClient - DI instead of shared->features import
 *       onSessionExpired: () => { queryClient.clear(); router.navigate(paths.login); },
 *     }), []);
 *     return (
 *       <ErrorBoundary>
 *         <QueryClientProvider client={queryClient}>
 *           <SessionGate />                               // renders <Spinner/> until useSessionBootstrap resolves,
 *                                                         // then <RouterProvider router={router} />
 *           {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
 *         </QueryClientProvider>
 *       </ErrorBoundary>
 *     );
 *   }
 *   - SessionGate may be a small local component in this file. useSessionBootstrap lives in
 *     features/auth; App reaches it through routes/ (e.g. router.tsx re-exports a `SessionGate`),
 *     because app/ must not import features/ directly (boundaries).
 *   - Named export only (no default export - lint).
 *
 * EXPORTS
 *   function App
 *
 * USED BY
 *   src/main.tsx   `createRoot(root).render(<StrictMode><App /></StrictMode>)`
 *
 * MAY IMPORT
 *   ./ErrorBoundary, @/routes/router (router + SessionGate), @/routes/paths, @/shared/lib/{queryClient,apiClient},
 *   @/shared/hooks/useTheme, @tanstack/react-query, @tanstack/react-query-devtools, react-router-dom.
 */
export {};
