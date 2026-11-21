import { screen, waitFor } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { LoginForm } from './LoginForm';
import { INITIAL_AUTH_STATE, useAuthStore } from '../../authStore';
import { apiUrl, loginFails, TEST_CREDENTIALS, TEST_USER } from '@/test/handlers/authHandlers';
import { renderWithProviders } from '@/test/renderWithProviders';
import { server, setupMswLifecycle } from '@/test/server';

setupMswLifecycle();

beforeEach(() => {
  useAuthStore.setState(INITIAL_AUTH_STATE);
});

type TUser = ReturnType<typeof renderWithProviders>['user'];

async function fillAndSubmit(
  user: TUser,
  email: string = TEST_CREDENTIALS.email,
  password: string = TEST_CREDENTIALS.password,
): Promise<void> {
  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
}

describe('LoginForm - client validation', () => {
  it('validates on blur with visible, linked messages', async () => {
    const { user } = renderWithProviders(<LoginForm />);
    const email = screen.getByLabelText('Email');

    await user.type(email, 'not-an-email');
    await user.tab();

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('Enter a valid email address.');
  });

  it('empty submit shows required messages and focuses the first invalid field', async () => {
    const { user } = renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findAllByText('This field is required.')).toHaveLength(2);
    expect(screen.getByLabelText('Email')).toHaveFocus();
  });

  it('password shorter than 8 characters is rejected before any request', async () => {
    const { user } = renderWithProviders(<LoginForm />);

    await fillAndSubmit(user, TEST_CREDENTIALS.email, 'short');

    expect(await screen.findByText('This value is too short.')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveFocus();
  });
});

describe('LoginForm - server responses', () => {
  it('success stores the session', async () => {
    const { user } = renderWithProviders(<LoginForm />);

    await fillAndSubmit(user);

    await waitFor(() => expect(useAuthStore.getState().user).toEqual(TEST_USER));
    expect(useAuthStore.getState().status).toBe('authenticated');
  });

  it('401 INVALID_CREDENTIALS: form-level alert, password cleared and focused', async () => {
    const { user } = renderWithProviders(<LoginForm />);

    await fillAndSubmit(user, TEST_CREDENTIALS.email, 'wrong-password');

    expect(await screen.findByRole('alert')).toHaveTextContent('Email or password is incorrect.');
    const password = screen.getByLabelText('Password');
    expect(password).toHaveValue('');
    expect(password).toHaveFocus();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('403 FORBIDDEN: account disabled message', async () => {
    server.use(loginFails(403, 'FORBIDDEN'));
    const { user } = renderWithProviders(<LoginForm />);

    await fillAndSubmit(user);

    expect(await screen.findByRole('alert')).toHaveTextContent('This account is disabled. Contact your administrator.');
  });

  it('422 VALIDATION_FAILED: field messages from details.fields, first invalid field focused', async () => {
    server.use(loginFails(422, 'VALIDATION_FAILED', { fields: { email: 'validation.email', password: 'validation.too_small' } }));
    const { user } = renderWithProviders(<LoginForm />);

    await fillAndSubmit(user);

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('This value is too short.')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveFocus();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('422 without usable fields: generic validation message', async () => {
    server.use(loginFails(422, 'VALIDATION_FAILED'));
    const { user } = renderWithProviders(<LoginForm />);

    await fillAndSubmit(user);

    expect(await screen.findByRole('alert')).toHaveTextContent('Some fields are invalid. Check the form and try again.');
  });

  it('429 RATE_LIMITED: too many attempts message', async () => {
    server.use(loginFails(429, 'RATE_LIMITED'));
    const { user } = renderWithProviders(<LoginForm />);

    await fillAndSubmit(user);

    expect(await screen.findByRole('alert')).toHaveTextContent('Too many attempts. Wait a moment and try again.');
  });

  it('5xx INTERNAL_ERROR and NETWORK_ERROR: matching errors.* text', async () => {
    server.use(loginFails(500, 'INTERNAL_ERROR'));
    const { user } = renderWithProviders(<LoginForm />);

    await fillAndSubmit(user);
    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong on our side. Try again later.');

    server.use(http.post(apiUrl('/auth/login'), () => HttpResponse.error()));
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('You appear to be offline. Check your connection.')).toBeInTheDocument();
  });

  it('submit is disabled and busy while the request is in flight', async () => {
    server.use(
      http.post(apiUrl('/auth/login'), async () => {
        await delay(50);
        return HttpResponse.json({ user: TEST_USER });
      }),
    );
    const { user } = renderWithProviders(<LoginForm />);

    await fillAndSubmit(user);

    const busy = await screen.findByRole('button', { name: /^Signing in/ });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute('aria-busy', 'true');
    await waitFor(() => expect(useAuthStore.getState().status).toBe('authenticated'));
  });
});
