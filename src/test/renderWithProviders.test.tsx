import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TEST_CREDENTIALS, TEST_USER } from './handlers/authHandlers';
import { renderWithProviders } from './renderWithProviders';
import { setupMswLifecycle } from './server';
import { Spinner } from '@/shared/components/Spinner/Spinner';
import { apiClient } from '@/shared/lib/apiClient';
import { ApiError } from '@/shared/lib/apiError';

setupMswLifecycle();

describe('test harness', () => {
  it('renderWithProviders renders with real i18n and a fresh QueryClient', () => {
    const first = renderWithProviders(<Spinner />);
    expect(screen.getByRole('status')).toHaveTextContent(/^Loading/);
    first.unmount();
    const second = renderWithProviders(<Spinner />);
    expect(second.queryClient).not.toBe(first.queryClient);
  });

  it('default auth handlers return auth.yaml shapes', async () => {
    const login = await apiClient.post<{ user: typeof TEST_USER }>('/auth/login', TEST_CREDENTIALS);
    expect(login.data).toEqual({ user: TEST_USER });

    await expect(
      apiClient.post('/auth/login', { ...TEST_CREDENTIALS, password: 'wrong-password' }),
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS', status: 401 });
    await expect(apiClient.get('/auth/whoami')).rejects.toBeInstanceOf(ApiError);
    expect((await apiClient.post('/auth/logout')).status).toBe(204);
  });
});
