# Frontend agent notes (working memory)

Rewritten at the end of every frontend session (rules: `../../agents/PROTOCOL.md` section 6).
This is the frontend agent's memory across sessions and AI tools. Never store secrets or personal data.

## 1. Snapshot (2026-11-20)

Task 002 (web platform foundation) is implemented on branch `feature/002-web-platform-foundation`; PR into
`dev` opened, waiting for manager review (Result says review). Shared layer works: apiClient (CSRF,
single-flight refresh, ApiError), error codes, domain types, queryClient, env, zodConfig, safeOpen, i18n,
theme, Spinner, MSW harness. Next: task 004 (auth UI + app shell) once the manager marks it ready.

## 2. Active work

- 002 - review; PR open (never merge it - the manager merges). Next step: address review feedback, if any.
- 004 - queued (auth UI + app shell), builds on 002.

## 3. Project knowledge

- PinBoard: single tenant, tier S, locales en (default) + fr, WCAG 2.2 AA, no sign-up (operator seed script).
- apiClient: an anonymous visitor's whoami 401 also triggers one refresh attempt; when it fails,
  `onSessionExpired` is called - the App.tsx callback (task 004) must be harmless when nobody was signed in.
- Error UX: the UI renders `t('errors.<CODE>')` (common); zod messages are `validation.*` keys (zodConfig).
- Bookmark URLs must pass `isSafeUrl` (absolute http/https only) before a link is rendered.
- Lint boundaries classify colocated tests by their folder: a `shared/` or `features/` test cannot import
  `src/test/*` (renderWithProviders, server). Until request `fe-002-decision-colocated-tests-harness` is
  resolved, harness-based tests go in `src/test/`.
- MSW lifecycle: call `setupMswLifecycle()` (src/test/server.ts) at the top level of a network test file.
  Handlers match `apiUrl('/auth/login')` = `*/api/v1/auth/login`; `TEST_USER`, `TEST_CREDENTIALS`, `errorBody`.
- `main.tsx` still renders `null` and does not import env/zodConfig yet (task 004 finishes it).

## 4. Verified facts

Installed versions (2026-11-20): react 19.3.1, react-router-dom 7.18.6, @tanstack/react-query 5.108.1,
zod 4.6.7, vite 8.3.8, vitest 4.1.12, msw 2.15.0, axios 1.21.1, i18next 26.7.2, react-i18next 17.1.13,
i18next-browser-languagedetector 8.3.1, zustand 5.1.0, stylelint 18.0.0, postcss-custom-media 12.0.4.

- eslint-plugin-boundaries 7.4.4 - element patterns match FOLDERS; single files via `boundaries/files`
  categories (`entry`, `route-public`); `capture: ['featureName']` + `captured` enforces same-feature
  imports - verified: violation test. A colocated `*.test.ts` in shared/ is element `shared` - verified: lint.
- postcss-custom-media 12 - `@import '@/styles/breakpoints.css'` + `@media (--bp-tablet)` compiles to
  `@media (width>=768px)` - verified: probe build.
- react-router 7.18.6 - route `lazy` and `HydrateFallback` exist - verified: dist d.ts.
- zod 4.6.7 - `z.config({ customError })`; the map receives raw issues with `input`; an email failure is code
  `invalid_format` + `format: 'email'`; explicit schema messages win - verified: core.d.ts + zodConfig.test.ts.
- axios 1.21.1 - xhr adapter: timeout code is ECONNABORTED unless `transitional.clarifyTimeoutError` (then
  ETIMEDOUT); ECONNABORTED also means "aborted"; fetch adapter always ETIMEDOUT - verified:
  lib/adapters/xhr.js, lib/helpers/composeSignals.js, apiClient.test.ts.
- msw 2.15.0 - the XHR interceptor does not emulate the XHR `timeout` for a pending mocked response (test hangs);
  test timeouts with `adapter: 'fetch'` + an absolute baseURL (Node fetch ignores the jsdom location) - verified: test.
- i18next 26.7.2 - init options `initAsync`, `returnNull` exist - verified: typescript/options.d.ts.
- i18next-browser-languagedetector 8.3.1 - `detection.caches: []` disables storage writes - verified: index.d.ts.
- stylelint-config-standard 41 - requires short hex (`#fff`) - fixed in tokens.css.
- Node: stylelint 18 / jsdom 30 dependencies require node >= 22.22.2 (engines field set accordingly).
- NOT yet verified: nginx-unprivileged template rendering (needs a Docker build/run task).

## 5. Decisions & contract versions relied on

- ADR 0001 (no PWA), ADR 0002 (cookie auth + CSRF), ADR 0003 (envelope, pagination, /v1), ADR 0005 (tier S).
- Conventions sections 2, 3, 5, 6 implemented in `src/shared/`.
- React Router native `lazy` + `routeModules.ts` registry; per-feature `queryOptions`; apiClient
  session expiry via `configureApiClient` callback; layouts take feature UI through slots.
- Contract versions: `auth.yaml 1.1.0` (refreshSession, User, ErrorResponse, ErrorCode - task 002).

## 6. Pitfalls learned

- CSS variables do not work inside `@media` - breakpoints are `@custom-media`.
- React 19 types have no global `JSX` namespace - type components as `ReactElement` (import type from 'react').
- json-server 0.17 CLI does not parse bodies before custom middlewares (mock reads the body itself).
- Flat ESLint config: later blocks REPLACE same-name rules - always declare complete lists.
- Without `.gitattributes`, Windows git rewrites every line -> whole-file diffs. Keep the file.
- Two agents editing `routes/paths.ts` conflict; resolve by keeping both entries (`../../agents/PROTOCOL.md` 9.5).
- Git hooks block bad commits/pushes (PROTOCOL 5.2) - fix the cause, never `--no-verify`.
- Shell heredocs with backticks/quotes break easily in the Windows Git Bash tool - write files with the editor tool.
- Non-ASCII in tests (the ellipsis of "Loading...") breaks the ASCII rule - assert with a regex instead.
- A brief's allowed files may exclude `src/test/setup.ts` or `eslint.config.mjs` - check before planning edits.

## 7. Waiting on

- `../../contracts/requests/fe-002-decision-colocated-tests-harness.md` - open (non-blocking).
