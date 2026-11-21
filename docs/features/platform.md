---
feature: platform
title: Web platform foundation
status: in-progress
since: -
task: 002
summary: Shared layer every feature uses - HTTP client with cookie session, CSRF and silent refresh, typed API errors, i18n (en, fr), theme and the MSW test harness.
---

# Web platform foundation

## Overview

No screen of its own: this is the shared layer under every feature. Feature `api/` files call `apiClient`,
which carries the cookie session, echoes the CSRF token, refreshes an expired session once (single-flight)
and turns every failure into an `ApiError` whose `code` the UI translates with `t('errors.<CODE>')`.
i18n (en default, fr), the color theme and the `Spinner` live here too.

## Screens & states

| Screen (route) | States designed | Notes |
|---|---|---|
| none (no routes in this feature) | `Spinner`: loading | `role="status"` + visually hidden label; slower rotation under `prefers-reduced-motion` |

## API usage

- Contract: workspace `contracts/openapi/auth.yaml` 1.1.0 - operation `refreshSession` (`POST /v1/auth/refresh`),
  called only by `apiClient`; schemas `User` (-> `IUser`), `ErrorResponse`, `ErrorCode`.
- Conventions: `contracts/conventions.md` sections 2 (envelope, 9 server + 2 client codes), 3 (`ICursorPage`),
  5 (CSRF double submit, single-flight refresh), 6 (headers).
- `apiClient` behavior:
  - base URL `${VITE_API_BASE_URL}/v1`, `withCredentials`, 15 s timeout;
  - `X-CSRF-Token` = `csrfToken` cookie on POST/PUT/PATCH/DELETE only;
  - 401 `UNAUTHENTICATED` -> one shared `POST /auth/refresh` for all concurrent requests, then each request is
    retried once; never for `/auth/login` or `/auth/refresh`, never twice for the same request;
  - refresh failure -> `onSessionExpired()` once (registered with `configureApiClient`), every waiting request
    rejects with its original `UNAUTHENTICATED` error. An anonymous visitor's 401 also tries one refresh, so
    the callback must be harmless when nobody was signed in;
  - errors: envelope -> its `code`, `error` message and `details.fields`; non-envelope body -> code from the
    status; no response -> `NETWORK_ERROR`; timeout -> `TIMEOUT` (status 0 for both).
- Mock resource: none (tests use MSW handlers in `src/test/handlers/authHandlers.ts`).

## Code map

| Part | Files |
|---|---|
| HTTP + errors | `src/shared/lib/{apiClient,apiError}.ts`, `src/shared/types/{errorCodes,api}.ts` |
| Domain types | `src/shared/types/domain.ts` (`IUser`, `ROLES`, `USER_STATUSES`) |
| Config | `src/shared/lib/{env,zodConfig,queryClient}.ts` |
| Safe links | `src/shared/lib/safeOpen.ts` (`isSafeUrl`, `safeOpen`: absolute `http:`/`https:` only) |
| Theme | `src/shared/store/themeStore.ts`, `src/shared/hooks/useTheme.ts` |
| Components | `src/shared/components/Spinner/` |
| i18n | `src/shared/i18n/index.ts`, `src/shared/i18n/locales/{en,fr}/{common,auth,home}.json` |
| Test harness | `src/test/{server.ts,renderWithProviders.tsx}`, `src/test/handlers/authHandlers.ts` |

## State & caching

- `queryClient`: queries `staleTime` 30 s, retry once except `UNAUTHENTICATED`/`FORBIDDEN`, refetch on focus;
  mutations never retried. Query keys belong to each feature.
- `themeStore` (Zustand): `preference` `light | dark | system` (default `system`), not persisted.
- i18n: language from the browser (`navigator`, then `<html lang>`), fallback `VITE_DEFAULT_LOCALE`; no storage writes.
- zod messages are i18n keys (`validation.required|email|too_small|too_big|invalid_type`).

## Testing

- `src/test/apiClient.test.ts` (MSW, real apiClient): CSRF on unsafe methods only, one refresh for 3 concurrent
  401s + one retry each, refresh failure -> `onSessionExpired` once + original errors, no refresh for login or
  other 401 codes, `NETWORK_ERROR`, `TIMEOUT`, envelope and non-envelope errors.
- `src/test/renderWithProviders.test.tsx`: harness (fresh QueryClient, real i18n) and default auth handler shapes.
- Unit tests next to the units: `apiError`, `errorCodes`, `queryClient`, `safeOpen`, `zodConfig`, `useTheme`, `Spinner`.
- Network tests live in `src/test/` because lint forbids `shared/` files (including colocated tests) from
  importing `src/test/` (request `fe-002-decision-colocated-tests-harness`).
- Run: `npx vitest run src/test/apiClient.test.ts` or `npm test`.
