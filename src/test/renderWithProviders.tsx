/**
 * FILE:   src/test/renderWithProviders.tsx
 * LAYER:  test (relaxed lint)
 * STATUS: implemented
 *
 * PURPOSE
 *   Render a component the way the app does: fresh QueryClient per test (no cache leaks between
 *   tests), a memory router, real i18n (en resources).
 *
 * CONTENT
 *   renderWithProviders(ui, { route?, path? }) -> { queryClient, user, ...render result }
 *   - queries/mutations never retry in tests (deterministic failures).
 *   - Query the DOM by role/label first (getByRole('button', { name: /sign in/i })), never by class.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { i18n } from '@/shared/i18n';

export interface IRenderOptions {
  route?: string;
  path?: string;
}

export interface IRenderWithProvidersResult extends RenderResult {
  queryClient: QueryClient;
  user: ReturnType<typeof userEvent.setup>;
}

export function renderWithProviders(ui: ReactElement, options?: IRenderOptions): IRenderWithProvidersResult {
  if (i18n.language !== 'en') void i18n.changeLanguage('en');
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const router = createMemoryRouter([{ path: options?.path ?? '*', element: ui }], {
    initialEntries: [options?.route ?? '/'],
  });
  return {
    queryClient,
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
  };
}
