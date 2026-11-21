/**
 * FILE:   src/shared/lib/safeOpen.ts
 * LAYER:  shared
 * STATUS: implemented
 *
 * PURPOSE
 *   The ONLY sanctioned way to open a new window (window.open is a lint error elsewhere).
 *   Blocks dangerous schemes and reverse-tabnabbing.
 *
 * CONTENT
 *   isSafeUrl(rawUrl)   true only for an ABSOLUTE URL (WHATWG parser, no base) with scheme http: or
 *                       https: - blocks javascript:, data:, mailto:, file:, relative paths.
 *                       Use it before rendering <a href target="_blank" rel="noopener noreferrer">.
 *   safeOpen(rawUrl, { allowedHosts? })
 *                       opens the URL in a new tab with 'noopener,noreferrer' when isSafeUrl passes
 *                       (and the host is in allowedHosts, if given); returns whether it opened.
 *   - Bookmarks rely on this: contracts/domain-model.md requires the frontend to re-check the scheme.
 *
 * EXPORTS
 *   function safeOpen, function isSafeUrl, interface ISafeOpenOptions
 *
 * USED BY
 *   Any component that opens external content.
 *
 * MAY IMPORT
 *   Nothing.
 */
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

export interface ISafeOpenOptions {
  allowedHosts?: string[];
}

function parseSafeUrl(rawUrl: string): URL | null {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }
  return ALLOWED_PROTOCOLS.has(url.protocol) ? url : null;
}

export function isSafeUrl(rawUrl: string): boolean {
  return parseSafeUrl(rawUrl) !== null;
}

export function safeOpen(rawUrl: string, options?: ISafeOpenOptions): boolean {
  const url = parseSafeUrl(rawUrl);
  if (!url) return false;
  if (options?.allowedHosts && !options.allowedHosts.includes(url.host)) return false;
  // eslint-disable-next-line no-restricted-syntax -- the single audited window.open call (URL checked above)
  window.open(url.toString(), '_blank', 'noopener,noreferrer');
  return true;
}
