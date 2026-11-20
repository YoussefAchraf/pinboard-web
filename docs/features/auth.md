---
feature: auth
title: Authentication
status: planned            # template baseline: documented placeholders, not implemented yet
since: -
task: -
summary: Sign in and sign out with cookie sessions, session bootstrap on load, automatic token refresh and guarded routes.
routes: /login [guest]
---

# Authentication

## Overview

The user signs in with email and password on `/login`; the session is held in httpOnly cookies set by
et-be (the app never sees tokens). On every page load the app asks "who am I?" before rendering routes,
so guards never flash the wrong screen. Expired access tokens are refreshed transparently once.

## Screens & states

| Screen (route) | States designed | Notes |
|---|---|---|
| Login (`/login`) | idle, field errors (on blur), submitting, invalid credentials, rate limited, network error | visible labels, errors announced, 44 px targets, works at 320 px |
| Session bootstrap (any route) | pending (spinner), anonymous, authenticated | no layout shift |

## API usage

- Contract: workspace `contracts/openapi/auth.yaml` - `login`, `whoami`, `logout` (refresh is handled by `apiClient`).
- Error codes: `INVALID_CREDENTIALS` -> form message; `VALIDATION_FAILED` -> field errors; `RATE_LIMITED` ->
  "too many attempts"; `FORBIDDEN` -> account disabled message; `NETWORK_ERROR` / `TIMEOUT` -> retry message.
- Mock: `mock/middleware.cjs` simulates login / whoami / refresh / logout (`admin@example.test` / `mock-password`).

## Code map

| Part | Files |
|---|---|
| API + queries | `src/features/auth/api/{authApi,authQueries}.ts` |
| Hooks | `src/features/auth/hooks/{useSessionBootstrap,useLogin,useLogout}.ts` |
| State | `src/features/auth/authStore.ts` (identity only, never persisted) |
| Validation | `src/features/auth/loginSchema.ts` |
| Components | `src/features/auth/components/LoginForm/` (4-file unit) |
| Pages | `src/features/auth/pages/LoginPage/` |
| Routing | `src/routes/guards/{ProtectedRoute,GuestRoute,RoleRoute}.tsx`, `src/routes/router.tsx` (SessionGate) |
| Network | `src/shared/lib/apiClient.ts` (CSRF echo, single-flight refresh), `src/shared/lib/apiError.ts` |
| i18n | `src/shared/i18n/locales/{en,fr}/auth.json` |

## State & caching

Session query `authKeys.session()` with `staleTime: Infinity` (changes only on login/logout). Logout clears the
whole query cache. `authStore` mirrors the identity for synchronous guard checks.

## Testing

Planned: `useLoginForm` / `LoginPage` tests with MSW handlers (`src/test/handlers/authHandlers.ts`) covering valid
login, invalid credentials, field validation, and guard redirects.
