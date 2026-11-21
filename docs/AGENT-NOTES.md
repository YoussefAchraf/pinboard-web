# Frontend agent notes (working memory)

Rewritten at the end of every frontend session (rules: `../../agents/PROTOCOL.md` section 6).
This is the frontend agent's memory across sessions and AI tools. Never store secrets or personal data.

## 1. Snapshot (2026-11-21)

Task 004 (auth UI + app shell) is implemented on branch `feature/004-auth-ui-app-shell`; PR into `dev` opened,
waiting for manager review (brief Status: review). Login, session bootstrap, guards, layouts, user menu with sign
out, session expiry, RouteError/404 and a temporary home greeting work against MSW and the json-server mock.
Auth still runs on the mock; switching to et-be + nginx e2e is a later integration task (after 003 is done).
Next: round 2 (bookmarks) or review feedback.

## 2. Active work

- 004 - review; PR open (never merge it - the manager merges). Next step: address review feedback, if any.

## 3. Project knowledge

- PinBoard: single tenant, tier S, locales en (default) + fr, WCAG 2.2 AA, no sign-up (operator seed script).
- Session flow: `routes/SessionGate.tsx` -> `useSessionBootstrap` (whoami runs only while `authStore.status` is
  `unknown`) -> RouterProvider. Logout / expiry call `queryClient.clear()`; the disabled session observer then
  re-creates an EMPTY `['auth','session']` query (no fetch) - assert "no query has data", not "cache empty".
- Session expiry is wired by the auth feature (`authApi.onSessionExpired` + `hooks/useSessionExpiry`), because
  lint forbids `app/` and `routes/` from importing apiClient. It ignores the signal unless status is `authenticated`
  (an anonymous bootstrap 401 -> failed refresh also fires it).
- Post-login redirect is done only by `GuestRoute` (`location.state.from`, internal paths only); useLogin does not navigate.
- Protected pages get the user from outlet context (`ProtectedRoute` -> AppLayout forwards -> e.g. home
  `useSessionUser`); features never import each other.
- Routes: tree + `getBrowserRouter()` in `routes/router.tsx`; components `PageSpinner`/`DocumentTitle` in
  `routes/RouteShell.tsx`; `SessionGate.tsx`. Page title = route `handle.titleKey` ('ns:key') -> "<page> - PinBoard".
  No `*` route: unmatched paths render the root errorElement (RouteError, 404).
- Tests: colocated tests may import `src/test/**` (ADR 0006). App-level tests use `renderApp({ route })`
  (real SessionGate + appRoutes in a memory router, auth store reset). Helpers: `signedInWhoami()`, `loginFails()`.
  A test under `routes/` may NOT import apiClient (lint) - go through a feature api (`authApi.whoami()`).
- Error UX: `common:errors.<CODE>`; login FORBIDDEN -> `auth:login.accountDisabled`; zod messages are `validation.*`.
- Mock: sign in `member@example.test` / `mock-password`; its "session" is one server-side flag shared by all clients.
- Bookmark URLs must pass `isSafeUrl` (absolute http/https only) before a link is rendered.
- `index.html` still has `<title>App</title>` (pre-JS title; not in the 004 file scope).

## 4. Verified facts

Installed versions (2026-11-21): react 19.3.1, react-router-dom 7.18.6, @tanstack/react-query 5.108.1,
zod 4.6.7, vite 8.3.8, vitest 4.1.12, msw 2.15.0, axios 1.21.1, i18next 26.7.2, react-i18next 17.1.13,
zustand 5.1.0, react-hook-form 7.92.0, @hookform/resolvers 5.9.2, lucide-react 1.77.0, oxlint 1.94.0,
eslint-plugin-boundaries 7.4.4.

- eslint-plugin-boundaries 7.4.4 - element patterns match FOLDERS; files via `boundaries/files` categories.
  ADR 0006 rule: `{ pattern: 'src/**/*.test.{ts,tsx}', category: 'test-file' }` + policy
  `{ from: { file: { categories: 'test-file' } }, allow: { to: { element: { types: ['test'] } } } }` - verified with
  probe files: test files in shared/ and features/ may import `@/test/*`; production files there still fail; a
  feature test file still cannot import `routes` (the rule is narrow).
- react-router 7.18.6 - route `lazy` returning `{ Component }`, `HydrateFallback`, `handle` + `useMatches()`;
  unmatched path -> root errorElement with an `isRouteErrorResponse` 404; `createBrowserRouter`/`createMemoryRouter`
  return the same Router type; `router.navigate()` returns a Promise - verified: d.ts + router.test.tsx.
- react-hook-form 7.92.0 - `setError(name, error, { shouldFocus })`, `resetField`, `setFocus`; submit focuses the
  first invalid field by default - verified: form.d.ts + LoginForm.test.tsx.
- zod 4.6.7 - top-level `z.email()` (string `.email()` is deprecated); `.pipe()` stops on input issues, so an empty
  email reports only `validation.required` - verified: schemas.d.ts + loginSchema.test.ts.
- oxlint 1.94 - `react(refs)` flags every property read of an object that also carries a value passed to `ref=`
  (destructure the hook result); `react(only-export-components)` warns on mixed component/non-component exports -
  verified: lint output.
- Accessible name of `<button><span>Max</span><span>Account menu</span></button>` is "MaxAccount menu" (no space) -
  use an aria-label starting with the visible text - verified: Testing Library.
- msw / axios / i18next facts from task 002 still hold (see the git history of this file).
- Git Bash rewrites `VAR=/api` env values into Windows paths: prefix `MSYS_NO_PATHCONV=1` - verified (vite env dump).
- Headless Chrome `--window-size` has a minimum width above 320 px; dev-mode pages need a long `--virtual-time-budget`.
- NOT yet verified: nginx-unprivileged template rendering (needs a Docker build/run task).

## 5. Decisions & contract versions relied on

- ADR 0001 (no PWA), 0002 (cookie auth + CSRF), 0003 (envelope, pagination, /v1), 0005 (tier S), 0006 (lint
  boundary exceptions - implemented in 004).
- Conventions sections 2, 3, 5, 6, 7 implemented.
- Contract versions: `auth.yaml 1.1.0` (login, logout, whoami, refreshSession, User, ErrorResponse).

## 6. Pitfalls learned

- CSS variables do not work inside `@media` - breakpoints are `@custom-media`.
- React 19 types have no global `JSX` namespace - type components as `ReactElement`.
- json-server 0.17 CLI does not parse bodies before custom middlewares (mock reads the body itself).
- Flat ESLint config: later blocks REPLACE same-name rules - always declare complete lists.
- Git hooks block bad commits/pushes (PROTOCOL 5.2) - fix the cause, never `--no-verify`.
- The file-writing tool refuses to overwrite a file not read in the session - read (or delete) placeholders first.
- stylelint `no-descending-specificity`: put `:disabled` rules before `:hover:not(:disabled)`.
- Test helper params defaulting to `as const` values get literal types - annotate them `string`.
- Re-run `tsc -b` after adding tests (typecheck covers test files).
- A brief's allowed files may exclude AGENTS.md / index.html - report instead of editing.

## 7. Waiting on

- `../../contracts/requests/fe-002-decision-colocated-tests-harness.md` - scheduled, delivered in 004 (manager resolves).
