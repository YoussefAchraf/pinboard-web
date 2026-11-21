/**
 * FILE:   src/shared/lib/env.ts
 * LAYER:  shared
 * STATUS: implemented
 *
 * PURPOSE
 *   The ONLY reader of import.meta.env in app code. Validates the public build-time config once
 *   and exports a typed object, so a missing/invalid variable fails at startup with a readable
 *   message instead of becoming `undefined` deep inside a request.
 *
 * CONTENT
 *   VITE_API_BASE_URL    default '/api' (the Vite proxy and nginx strip it)
 *   VITE_DEFAULT_LOCALE  'en' | 'fr', default 'en'
 *   - Reminder: every VITE_* value is PUBLIC (bundled). No secrets, ever.
 *   - vite.config.ts-only variables (VITE_BACKEND_UPSTREAM, VITE_USE_MOCK, ...) are NOT read here.
 *
 * EXPORTS
 *   const env, type IEnv
 *
 * USED BY
 *   src/main.tsx (side-effect import, early), shared/lib/apiClient.ts (baseURL), shared/i18n/index.ts (fallback language)
 *
 * MAY IMPORT
 *   zod.
 */
import { z } from 'zod';

const schema = z.object({
  VITE_API_BASE_URL: z.string().min(1).default('/api'),
  VITE_DEFAULT_LOCALE: z.enum(['en', 'fr']).default('en'),
});

const parsed = schema.safeParse(import.meta.env);
if (!parsed.success) {
  const keys = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
  throw new Error(`Invalid environment: ${keys}`);
}

export interface IEnv {
  readonly apiBaseUrl: string;
  readonly defaultLocale: 'en' | 'fr';
  readonly isDev: boolean;
}

export const env: IEnv = Object.freeze({
  apiBaseUrl: parsed.data.VITE_API_BASE_URL.replace(/\/+$/, ''),
  defaultLocale: parsed.data.VITE_DEFAULT_LOCALE,
  isDev: import.meta.env.DEV,
});
