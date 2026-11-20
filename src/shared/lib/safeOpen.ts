/**
 * FILE:   src/shared/lib/safeOpen.ts
 * LAYER:  shared
 * STATUS: placeholder - implement when the app first needs to open a new window/tab.
 *
 * PURPOSE
 *   The ONLY sanctioned way to open a new window (window.open is a lint error elsewhere).
 *   Blocks dangerous schemes and reverse-tabnabbing.
 *
 * WHAT TO WRITE
 *   export function safeOpen(rawUrl: string, options?: { allowedHosts?: string[] }): boolean {
 *     let url: URL;
 *     try { url = new URL(rawUrl, window.location.origin); } catch { return false; }
 *     if (!['https:', 'http:', 'mailto:'].includes(url.protocol)) return false;   // blocks javascript:, data:, ...
 *     if (options?.allowedHosts && !options.allowedHosts.includes(url.host)) return false;
 *     // eslint-disable-next-line no-restricted-syntax -- the single audited window.open call
 *     window.open(url.toString(), '_blank', 'noopener,noreferrer');
 *     return true;
 *   }
 *   - For plain links prefer <a href target="_blank" rel="noopener noreferrer"> with the same URL check
 *     (export an `isSafeUrl(url)` helper for that).
 *
 * EXPORTS
 *   function safeOpen, function isSafeUrl
 *
 * USED BY
 *   Any component that opens external content.
 *
 * MAY IMPORT
 *   Nothing.
 */
export {};
