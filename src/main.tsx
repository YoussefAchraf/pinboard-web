/**
 * FILE:   src/main.tsx
 * LAYER:  entry (may import app/, shared/, styles/)
 * STATUS: stub - compiles and boots on the empty template; finish on first implementation.
 *
 * PURPOSE
 *   Browser entry point (index.html -> /src/main.tsx). Side-effect imports in a fixed order,
 *   then mounts <App />. No components, no logic here.
 *
 * FINAL FORM
 *   import '@/styles/tokens.css';        // 1. tokens first (everything else consumes them)
 *   import '@/styles/global.css';        // 2. reset + document defaults
 *   import '@/shared/lib/env';           // 3. validates import.meta.env (throws early, readable)
 *   import '@/shared/lib/zodConfig';     // 4. zod error map -> i18n keys
 *   import '@/shared/i18n';              // 5. i18next init (resources + language detection)
 *   import { App } from '@/app/App';
 *   createRoot(rootElement).render(<StrictMode><App /></StrictMode>);
 *
 * TODO on first implementation: add imports 3-4 and render <App /> instead of null.
 */
import '@/styles/tokens.css';
import '@/styles/global.css';
import '@/shared/i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

createRoot(rootElement).render(<StrictMode>{null}</StrictMode>);
