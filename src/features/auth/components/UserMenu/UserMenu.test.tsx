import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../../authStore';
import { apiUrl, errorBody, signedInWhoami, TEST_USER } from '@/test/handlers/authHandlers';
import { renderApp } from '@/test/renderWithProviders';
import { server, setupMswLifecycle } from '@/test/server';

setupMswLifecycle();

function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/`;
}

afterEach(() => {
  document.cookie = 'csrfToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
});

async function openMenu(user: ReturnType<typeof renderApp>['user']): Promise<HTMLElement> {
  const trigger = await screen.findByRole('button', { name: `${TEST_USER.firstname}, account menu` });
  await user.click(trigger);
  return trigger;
}

describe('UserMenu - sign out', () => {
  it('shows the email and signs out: POST /v1/auth/logout with X-CSRF-Token, then /login', async () => {
    setCookie('csrfToken', 'csrf-logout');
    let logoutCsrf: string | null = null;
    server.use(
      signedInWhoami(),
      http.post(apiUrl('/auth/logout'), ({ request }) => {
        logoutCsrf = request.headers.get('x-csrf-token');
        return new HttpResponse(null, { status: 204 });
      }),
    );
    const { router, user, queryClient } = renderApp({ route: '/' });

    const trigger = await openMenu(user);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(TEST_USER.email)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(logoutCsrf).toBe('csrf-logout');
    expect(useAuthStore.getState()).toMatchObject({ user: null, status: 'anonymous' });
    expect(queryClient.getQueryCache().getAll().filter((query) => query.state.data !== undefined)).toHaveLength(0);
  });

  it('still signs out locally when the logout request fails', async () => {
    let logoutCalls = 0;
    server.use(
      signedInWhoami(),
      http.post(apiUrl('/auth/logout'), () => {
        logoutCalls += 1;
        return HttpResponse.json(errorBody('INTERNAL_ERROR', 'Boom'), { status: 500 });
      }),
    );
    const { router, user } = renderApp({ route: '/' });

    await openMenu(user);
    await user.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(logoutCalls).toBe(1);
    expect(useAuthStore.getState().user).toBeNull();
  });
});

describe('UserMenu - disclosure', () => {
  it('Escape closes the menu and returns focus to the trigger', async () => {
    server.use(signedInWhoami());
    const { user } = renderApp({ route: '/' });

    const trigger = await openMenu(user);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Sign out' })).toHaveFocus();
    await user.keyboard('{Escape}');

    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Sign out' })).not.toBeInTheDocument();
  });
});
