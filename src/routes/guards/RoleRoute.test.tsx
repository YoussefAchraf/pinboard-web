import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { paths } from '../paths';
import { RoleRoute } from './RoleRoute';
import { INITIAL_AUTH_STATE, useAuthStore } from '@/features/auth/authStore';
import type { Role } from '@/shared/types/domain';
import { TEST_USER } from '@/test/handlers/authHandlers';

function renderAdminArea(role: Role): void {
  useAuthStore.getState().setSession({ ...TEST_USER, roleName: role });
  const router = createMemoryRouter(
    [
      { path: paths.home, element: <p>home page</p> },
      { element: <RoleRoute allow={['admin']} />, children: [{ path: '/admin', element: <p>admin page</p> }] },
    ],
    { initialEntries: ['/admin'] },
  );
  render(<RouterProvider router={router} />);
}

beforeEach(() => {
  useAuthStore.setState(INITIAL_AUTH_STATE);
});

describe('RoleRoute', () => {
  it('renders the branch for an allowed role', async () => {
    renderAdminArea('admin');
    expect(await screen.findByText('admin page')).toBeInTheDocument();
  });

  it('redirects other roles to home', async () => {
    renderAdminArea('member');
    expect(await screen.findByText('home page')).toBeInTheDocument();
    expect(screen.queryByText('admin page')).not.toBeInTheDocument();
  });
});
