import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';
import '@/shared/i18n';

describe('Spinner', () => {
  it('is announced as a status with the translated label', () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole('status')).toHaveTextContent(/^Loading/);
  });
});
