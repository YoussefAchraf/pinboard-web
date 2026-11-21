---
feature: auth
title: Authentication
status: in-progress
since: -
task: 004
summary: Sign in with email and password, session bootstrap on load, guarded routes, user menu with sign out, automatic token refresh and session-expiry handling.
routes: /login [guest]
---

# Authentication

## Overview

A member signs in with email and password on `/login`; the session is held in httpOnly cookies set by
et-be (the app never sees tokens). On every page load the app asks "who am I?" once before rendering
routes, so guards never flash the wrong screen. Signed-out visitors are sent to `/login` and returned to
the page they wanted after signing in. Signed-in users reach sign out through the user menu in the app
header. There is no sign-up page: users are created by an operator.

## Screens & states

| Screen (route) | States designed | Notes |
|---|---|---|
| Login (`/login`, guest) | idle, field errors (on blur and on submit), submitting (button disabled + busy), invalid credentials, account disabled, server field errors, rate limited, network / timeout / server error | visible labels, errors announced (`role="alert"`), first invalid field focused, 44 px targets, single column at 320 px |
| Session bootstrap (any route) | pending (full-page spinner), anonymous, authenticated | 401 and network failure resolve to anonymous (no error UI) |
| User menu (header of every signed-in page) | closed, open (email + sign out), signing out | disclosure button; Escape / focus-out / outside press close it |

## API usage

- Contract: workspace `contracts/openapi/auth.yaml` **1.1.0** - operations consumed: `login`, `whoami`, `logout`
  (`refreshSession` is called by `apiClient`, task 002).
- Error codes handled on login: `INVALID_CREDENTIALS` -> `common:errors.INVALID_CREDENTIALS` (password cleared and
  focused); `FORBIDDEN` -> `auth:login.accountDisabled`; `VALIDATION_FAILED` -> field messages from `details.fields`
  (no usable field -> `common:errors.VALIDATION_FAILED`); `RATE_LIMITED`, `NETWORK_ERROR`, `TIMEOUT`,
  `INTERNAL_ERROR` (any 5xx) -> `common:errors.<CODE>`.
- Logout: `POST /v1/auth/logout` with `X-CSRF-Token` (apiClient). Local sign-out (store + query cache cleared,
  navigation to `/login`) happens even when the request fails.
- Session expiry: apiClient `onSessionExpired` (refresh failed) -> for a signed-in user: session + query cache
  cleared, navigation to `/login`. For an anonymous visitor (bootstrap whoami 401 -> failed refresh) it is ignored.
- Mock: `mock/middleware.cjs` simulates login / whoami / refresh / logout (`member@example.test` or
  `admin@example.test`, password `mock-password`). Still in use until the integration task switches auth to et-be.

## Code map

| Part | Files |
|---|---|
| API + queries | `src/features/auth/api/{authApi,authQueries}.ts` (`authApi.onSessionExpired` wires the apiClient callback) |
| Hooks | `src/features/auth/hooks/{useSessionBootstrap,useLogin,useLogout,useSessionExpiry}.ts` |
| State | `src/features/auth/authStore.ts` (`user`, `status`: unknown / authenticated / anonymous; never persisted) |
| Validation | `src/features/auth/loginSchema.ts` (LoginRequest: email <= 254, password 8-128) |
| Components | `src/features/auth/components/LoginForm/`, `src/features/auth/components/UserMenu/` (4-file units) |
| Pages | `src/features/auth/pages/LoginPage/` |
| Routing | `src/routes/guards/{ProtectedRoute,GuestRoute,RoleRoute}.tsx`, `src/routes/router.tsx` (route tree), `src/routes/SessionGate.tsx` |
| Network | `src/shared/lib/apiClient.ts` (CSRF echo, single-flight refresh), `src/shared/lib/apiError.ts` |
| i18n | `src/shared/i18n/locales/{en,fr}/auth.json` (+ `common.json` errors.*, validation.*) |

## State & caching

Session query `authKeys.session()` (`['auth', 'session']`), `staleTime: Infinity`, `retry: false`, enabled only while
`authStore.status` is `unknown`: it runs once at boot; afterwards the store is the source of truth (login sets it,
logout / expiry clear it), so clearing the query cache never re-runs the bootstrap. Login seeds the session query
data; logout and expiry call `queryClient.clear()`. The post-login redirect is done by `GuestRoute`
(`location.state.from`, internal paths only, else `/`).

## Testing

MSW handlers `src/test/handlers/authHandlers.ts` (`signedInWhoami()`, `loginFails()`), app-level harness
`renderApp()` in `src/test/renderWithProviders.tsx` (real SessionGate + appRoutes in a memory router).

- `src/routes/router.test.tsx` - signed-out `/` -> `/login` -> login -> `/` with first name; signed-in `/login` -> `/`;
  anonymous bootstrap 401 + failed refresh is harmless; network failure at boot; session expiry; unknown path.
- `src/features/auth/components/LoginForm/LoginForm.test.tsx` - blur/submit validation, 401, 403, 422 (fields and
  none), 429, 5xx, network error, submitting state.
- `src/features/auth/components/UserMenu/UserMenu.test.tsx` - sign out with CSRF header, sign out when logout fails,
  Escape closes and restores focus.
- `src/features/auth/loginSchema.test.ts`, `src/routes/guards/RoleRoute.test.tsx`.

Run: `npx vitest run src/features/auth src/routes`.
