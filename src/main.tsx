/**
 * FILE:   src/main.tsx
 * LAYER:  entry (may import app/, shared/, styles/)
 * STATUS: implemented
 *
 * PURPOSE
 *   Browser entry point (index.html -> /src/main.tsx). Side-effect imports in a fixed order,
 *   then mounts <App />. No components, no logic here.
 *
 * ORDER
 *   1. tokens.css (everything else consumes them)  2. global.css (reset + document defaults)
 *   3. env (validates import.meta.env, throws early)  4. zodConfig (zod error map -> i18n keys)
 *   5. i18n (resources + language detection)          6. <App /> in StrictMode
 */
import '@/styles/tokens.css';
import '@/styles/global.css';
import '@/shared/lib/env';
import '@/shared/lib/zodConfig';
import '@/shared/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
