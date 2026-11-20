import { afterEach, describe, expect, it, vi } from 'vitest';
import { isSafeUrl, safeOpen } from './safeOpen';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('isSafeUrl', () => {
  it('accepts absolute http and https URLs only', () => {
    expect(isSafeUrl('https://example.com/a?b=c')).toBe(true);
    expect(isSafeUrl('http://example.com')).toBe(true);
    expect(isSafeUrl('  https://example.com  ')).toBe(true);
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('JavaScript:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/html,<p>x</p>')).toBe(false);
    expect(isSafeUrl('mailto:a@b.test')).toBe(false);
    expect(isSafeUrl('/relative/path')).toBe(false);
    expect(isSafeUrl('not a url')).toBe(false);
  });
});

describe('safeOpen', () => {
  it('opens a safe URL with noopener,noreferrer', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    expect(safeOpen('https://example.com/page')).toBe(true);
    expect(open).toHaveBeenCalledWith('https://example.com/page', '_blank', 'noopener,noreferrer');
  });

  it('refuses unsafe schemes and hosts outside allowedHosts', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    expect(safeOpen('javascript:alert(1)')).toBe(false);
    expect(safeOpen('https://evil.test', { allowedHosts: ['example.com'] })).toBe(false);
    expect(open).not.toHaveBeenCalled();
  });
});
