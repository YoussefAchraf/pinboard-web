# Progress log

Agent-assisted work is logged here per session. Append entries; never rewrite past ones.

## Format

```
## YYYY-MM-DD — <scope/title>
- **Done:**
- **Decisions:**
- **Deferred:**
- **Validation:**
```

---

## 2026-11-20 — project created from the fs-reustemp template
- **Done:** template copied; package renamed (pinboard-web).
- **Validation:** not run in this repository yet (first task: install + verify).

## 2026-11-20 - task 002 web platform foundation
- **Done:** implemented in place (STATUS: implemented): `shared/lib/{apiClient,apiError,queryClient,env,zodConfig,safeOpen}.ts`,
  `shared/types/{domain,api,errorCodes}.ts`, `shared/store/themeStore.ts`, `shared/hooks/useTheme.ts`,
  `shared/components/Spinner/*`, `shared/i18n/index.ts` (common, auth, home in en + fr; app name "PinBoard"),
  `test/{server.ts,renderWithProviders.tsx,handlers/authHandlers.ts}`. Docs: `docs/features/platform.md`,
  `docs/design-system.md` (Spinner, theme), CHANGELOG, README (docs:readme).
- **Decisions:**
  - apiClient uses `transitional.clarifyTimeoutError` so a timeout is `ETIMEDOUT` (-> TIMEOUT) and an abort
    (`ECONNABORTED`) is NETWORK_ERROR. `apiError.ts` never imports axios: apiClient unwraps to `{ status, body, timedOut }`.
  - Non-envelope error bodies (proxy pages) get a code derived from the HTTP status.
  - `safeOpen`/`isSafeUrl`: absolute `http:`/`https:` URLs only (brief; the placeholder also allowed `mailto:`).
  - Spinner under reduced motion: 2 s per turn (CSS placeholder), not frozen (the tsx placeholder said 0 s).
  - Theme preference not persisted (persisting needs an AGENTS.md note, outside this task's files).
  - MSW lifecycle via `setupMswLifecycle()` from `test/server.ts` (setup.ts was not in the allowed files).
  - Network tests live in `src/test/` because lint forbids colocated `shared/` tests from importing `src/test/`
    (request `fe-002-decision-colocated-tests-harness`).
- **Lint disables (reasons):** `safeOpen.ts` `no-restricted-syntax` (the single audited `window.open`);
  `apiClient.ts` `@typescript-eslint/naming-convention` (module augmentation of axios' own
  `InternalAxiosRequestConfig` interface, which has no `I` prefix). Both line-level.
- **Deferred:** `main.tsx` imports of env/zodConfig and `<App />` (task 004 scope); colocated harness tests (request).
- **Validation:** `npm run verify` exit 0 - eslint/oxlint/stylelint clean, policy passed, README up to date,
  typecheck clean, vitest 9 files / 32 tests passed, vite build ok (largest chunk vendor-react 68.25 kB gzip).

## 2026-11-21 - task 004 auth UI and app shell
- **Done:** ADR 0006 lint rule first (`eslint.config.mjs`: file category `test-file` for `src/**/*.test.{ts,tsx}` + one
  policy `test-file -> test`). Implemented in place (STATUS: implemented): `main.tsx`, `app/{App,ErrorBoundary}.tsx`,
  `routes/{routeModules,prefetchRoute,router,RouteError}.ts(x)`, `routes/guards/{Protected,Guest,Role}Route.tsx`,
  `layouts/{AppLayout,AuthLayout}/*`, auth feature (api, queries, store, hooks, loginSchema, LoginForm, LoginPage),
  `features/home/pages/HomePage/*`. New: `routes/{SessionGate,RouteShell}.tsx`, `features/auth/hooks/useSessionExpiry.ts`,
  `features/auth/components/UserMenu/*`, `features/home/hooks/useSessionUser.ts`, `layouts/AppLayout/useAppLayout.ts`,
  CSS modules for ErrorBoundary/RouteError/RouteShell. Locales en+fr (auth, home, common). Harness: `renderApp()`,
  `signedInWhoami()`, `loginFails()`. Mock: template `projects` removed from `mock/db.json`. Docs: features auth/home,
  design-system patterns, CHANGELOG, README (docs:readme).
- **Decisions:**
  - Session-expiry wiring lives in the auth feature (`authApi.onSessionExpired` + `useSessionExpiry`, called by
    SessionGate) because lint forbids `app/` and `routes/` from importing apiClient. The handler acts only when
    `authStore.status === 'authenticated'` (anonymous bootstrap 401 -> failed refresh is ignored).
  - Bootstrap whoami runs only while status is `unknown` (enabled flag); SessionGate resolves from the store status,
    so `queryClient.clear()` (logout/expiry) never re-shows the spinner or re-fetches whoami.
  - Post-login redirect is done by GuestRoute only (`state.from`, internal paths only) - useLogin does not navigate.
  - Home reads the user from outlet context (`ProtectedRoute` -> AppLayout forwards -> `useSessionUser`): features
    never import each other.
  - Not-found: no `*` route; React Router renders the root errorElement (RouteError) with a 404 for unmatched paths.
  - Document title from route `handle.titleKey` (`RouteShell.DocumentTitle`): "<page> - PinBoard", both locales.
  - router.tsx split: route tree + `getBrowserRouter()` in `router.tsx`, components in `RouteShell.tsx`,
    `SessionGate.tsx` - oxlint `react(only-export-components)` warns on mixed component/non-component exports.
  - UserMenu trigger name via `aria-label` "<first name>, account menu" (spans concatenated without a space).
  - Removed unused key `home.emptyState` (en, fr).
- **Lint disables:** none added.
- **Deferred:** offline banner when the boot whoami fails with a network error (resolves to the login page today);
  `index.html` `<title>App</title>` (pre-JS title) is outside the brief's files; AGENTS.md section 2/3 still describe
  router.tsx as "route tree + SessionGate" (outside the brief's files).
- **Validation:** `npm run verify` exit 0 - eslint/oxlint/stylelint clean, policy passed, README up to date, typecheck
  clean, vitest 14 files / 58 tests passed, vite build ok (largest chunk vendor-react 95.47 kB gzip, LoginPage
  14.62 kB, HomePage 0.66 kB). Mock via the Vite proxy (curl, VITE_USE_MOCK=true): whoami 401 -> login 401 / 200 +
  csrfToken cookie -> whoami 200 -> logout 204 -> whoami 401. Browser checks (viewports, keyboard, themes, fr): not
  run - no browser available in this session.
