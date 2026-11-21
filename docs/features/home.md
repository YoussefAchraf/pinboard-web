---
feature: home
title: Home
status: in-progress
since: -
task: 004
summary: Signed-in landing page that greets the member by first name until the bookmarks list replaces it.
routes: / [protected]
---

# Home

## Overview

Temporary landing page behind `ProtectedRoute`, inside `AppLayout`: a greeting with the member's first name and
a short note that the bookmarks list is coming. The bookmarks feature replaces this page in round 2.

## Screens & states

| Screen (route) | States designed | Notes |
|---|---|---|
| Home (`/`, protected) | greeting + "coming soon" card | fluid h1, card padding grows from `--bp-tablet`; works at 320 px |

## API usage

None. The first name comes from the session: `ProtectedRoute` passes `{ user }` as outlet context (forwarded by
`AppLayout`), read by `useSessionUser()` - the home feature never imports the auth feature.

## Code map

| Part | Files |
|---|---|
| Hooks | `src/features/home/hooks/useSessionUser.ts` |
| Page | `src/features/home/pages/HomePage/` |
| Routing | `src/routes/paths.ts` (`home`), `routeModules.ts`, `router.tsx` (title `home:title`) |
| i18n | `src/shared/i18n/locales/{en,fr}/home.json` |

## Testing

Covered by the app flow in `src/routes/router.test.tsx` (after login the heading "Hello, <first name>" is shown).
