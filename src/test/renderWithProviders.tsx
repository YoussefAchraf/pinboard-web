/**
 * FILE:   src/test/renderWithProviders.tsx
 * LAYER:  test (relaxed lint)
 * STATUS: placeholder - implement with the first component/page test.
 *
 * PURPOSE
 *   Render a component the way the app does: fresh QueryClient per test (no cache leaks between
 *   tests), a memory router, real i18n.
 *
 * WHAT TO WRITE
 *   export function renderWithProviders(ui: ReactElement, options?: { route?: string; path?: string }) {
 *     const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
 *     const router = createMemoryRouter([{ path: options?.path ?? '*', element: ui }], { initialEntries: [options?.route ?? '/'] });
 *     return { queryClient, user: userEvent.setup(),
 *              ...render(<QueryClientProvider client={queryClient}><RouterProvider router={router} /></QueryClientProvider>) };
 *   }
 *   - Query the DOM by role/label first (getByRole('button', { name: /sign in/i })), never by class.
 */
export {};
