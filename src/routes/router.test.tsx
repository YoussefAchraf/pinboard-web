import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/features/auth/authStore';
import { apiUrl, errorBody, signedInWhoami, TEST_CREDENTIALS, TEST_USER } from '@/test/handlers/authHandlers';
import { renderApp } from '@/test/renderWithProviders';
import { server, setupMswLifecycle } from '@/test/server';

setupMswLifecycle();

describe('app routes - guards and session bootstrap', () => {
  it('signed-out visit to / lands on /login; after login the user is on / and sees their first name', async () => {
    const { router, user } = renderApp({ route: '/' });

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe('Sign in - PinBoard'));

    await user.type(screen.getByLabelText('Email'), TEST_CREDENTIALS.email);
    await user.type(screen.getByLabelText('Password'), TEST_CREDENTIALS.password);
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('heading', { name: `Hello, ${TEST_USER.firstname}` })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
    expect(screen.getByRole('link', { name: 'PinBoard' })).toBeInTheDocument();
    await waitFor(() => expect(document.title).toBe('Home - PinBoard'));
  });

  it('signed-in visit to /login redirects to /', async () => {
    server.use(signedInWhoami());
    const { router } = renderApp({ route: '/login' });

    expect(await screen.findByRole('heading', { name: `Hello, ${TEST_USER.firstname}` })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });

  it('anonymous bootstrap: whoami 401 + failed refresh is harmless (one call each, no error UI, no loop)', async () => {
    let whoamiCalls = 0;
    let refreshCalls = 0;
    server.use(
      http.get(apiUrl('/auth/whoami'), () => {
        whoamiCalls += 1;
        return HttpResponse.json(errorBody('UNAUTHENTICATED', 'Authentication required'), { status: 401 });
      }),
      http.post(apiUrl('/auth/refresh'), () => {
        refreshCalls += 1;
        return HttpResponse.json(errorBody('UNAUTHENTICATED', 'No session'), { status: 401 });
      }),
    );
    const { router } = renderApp({ route: '/' });

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(useAuthStore.getState().status).toBe('anonymous');
    expect(whoamiCalls).toBe(1);
    expect(refreshCalls).toBe(1);
  });

  it('network failure at boot resolves to the signed-out state (no endless spinner)', async () => {
    server.use(http.get(apiUrl('/auth/whoami'), () => HttpResponse.error()));
    renderApp({ route: '/' });

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('session expiry while signed in clears the session and the cache and goes to /login', async () => {
    server.use(signedInWhoami());
    const { router, queryClient } = renderApp({ route: '/' });
    expect(await screen.findByRole('heading', { name: `Hello, ${TEST_USER.firstname}` })).toBeInTheDocument();

    server.use(
      http.get(apiUrl('/auth/whoami'), () =>
        HttpResponse.json(errorBody('UNAUTHENTICATED', 'Expired'), { status: 401 }),
      ),
    );
    await expect(authApi.whoami()).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(useAuthStore.getState()).toMatchObject({ user: null, status: 'anonymous' });
    expect(queryClient.getQueryCache().getAll().filter((query) => query.state.data !== undefined)).toHaveLength(0);
  });

  it('unknown path renders the not-found view with a link home', async () => {
    renderApp({ route: '/does-not-exist' });

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
  });
});
