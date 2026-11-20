# Frontend agent notes (working memory)

Rewritten at the end of every frontend session (rules: `../../agents/PROTOCOL.md` section 6).
This is the frontend agent's memory across sessions and AI tools. Never store secrets or personal data.

## 1. Snapshot (2026-11-20)

PinBoard project created from the template; nothing implemented yet. Template baseline: `npm run verify` was
green in the template on 2026-11-20. Contract: `../../contracts/openapi/auth.yaml`.

## 2. Active work

None. Wait for a task brief in `../../contracts/tasks/`.

## 3. Project knowledge

- (empty - filled from the manager's contracts)

## 4. Verified facts

Installed versions (2026-11-20): react 19.3.1, react-router-dom 7.18.6, @tanstack/react-query 5.108.1,
zod 4.6.7, vite 8.3.8, vitest 4.1.12, msw 2.15.0, stylelint 18.0.0, postcss-custom-media 12.0.4.

- eslint-plugin-boundaries 7.4.4 - element patterns match FOLDERS; single files via `boundaries/files`
  categories (`entry`, `route-public`); `capture: ['featureName']` + `captured: { featureName:
  '{{ from.element.captured.featureName }}' }` enforces same-feature imports - verified: violation test
  (cross-feature, layout->feature, shared->feature blocked; same-feature and paths.ts allowed).
- postcss-custom-media 12 - `@import '@/styles/breakpoints.css'` + `@media (--bp-tablet)` compiles to
  `@media (width>=768px)` - verified: probe build.
- react-router 7.18.6 - route `lazy` and `HydrateFallback` exist - verified: dist d.ts.
- zod 4.6.7 - `config({ customError })` exists - verified: zod/v4/core/core.d.ts.
- stylelint-config-standard 41 - requires short hex (`#fff`) - fixed in tokens.css.
- Node: stylelint 18 / jsdom 30 dependencies require node >= 22.22.2 (engines field set accordingly).
- NOT yet verified: nginx-unprivileged template rendering (needs a Docker build/run task).

## 5. Decisions & contract versions relied on

- ADR 0001 (no PWA), ADR 0002 (cookie auth + CSRF), ADR 0003 (envelope, pagination, /v1), ADR 0004.
- React Router native `lazy` + `routeModules.ts` registry; per-feature `queryOptions`; apiClient
  session expiry via `configureApiClient` callback; layouts take feature UI through slots.
- Contract versions: `auth.yaml 1.0.0` (placeholders, mock and MSW handlers follow it; not implemented yet).

## 6. Pitfalls learned

- CSS variables do not work inside `@media` - breakpoints are `@custom-media`.
- React 19 types have no global `JSX` namespace - type components as `ReactElement` (import type from 'react').
- json-server 0.17 CLI does not parse bodies before custom middlewares (mock reads the body itself).
- Flat ESLint config: later blocks REPLACE same-name rules - always declare complete lists.
- Without `.gitattributes`, Windows git rewrites every line -> whole-file diffs. Keep the file.
- Two agents editing `routes/paths.ts` conflict; resolve by keeping both entries (`../../agents/PROTOCOL.md` 9.5).
- Git hooks block bad commits/pushes (PROTOCOL 5.2) - fix the cause, never `--no-verify`.

## 7. Waiting on

- Nothing.
