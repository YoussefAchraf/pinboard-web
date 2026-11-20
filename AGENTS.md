# AGENTS.md - rt-fe file contract

Frontend template: React 19 + TypeScript, Vite 8, React Router 7, TanStack Query 5, Zustand 5,
react-hook-form + zod, i18next, CSS Modules on design tokens. This file says WHERE things go and
WHAT each file contains. It is read by every AI tool that works in `rt-fe/` (Codex, Claude via
`CLAUDE.md`, others) - keep it tool-agnostic.

> **Read first, every session:**
> 1. `../agents/PROTOCOL.md` - the three-agent team protocol (channels, notes, engineering rules).
> 2. `AGENTS-SENIOR-FRONTEND.md` - your role, working protocol, no-hallucination rules, scale & tenancy playbook, UI/UX doctrine, definition of done.
> 3. `docs/AGENT-NOTES.md` - **your memory** from previous sessions. Rewrite it at the end of every session.
> 4. `../contracts/profile.md` + `../contracts/conventions.md` - project profile and cross-stack rules. They override any prose here.
> 5. Your task brief in `../contracts/tasks/` and the last entries of `docs/PROGRESS.md`.

## 1. Scope & ownership

- You own `rt-fe/**` only. Never edit `et-be/**`, `contracts/**`, `agents/**` or root files.
- Need an API the contract lacks? Request it (section 13). Never invent fields or endpoints.
- **PWA is permanently excluded:** no service worker, `vite-plugin-pwa`, Workbox, web manifest, web-push or offline IndexedDB layer - not now, not "later". CI enforces it.

## 2. Architecture

```
src/
  main.tsx                 entry: tokens.css -> global.css -> env -> zodConfig -> i18n -> <App/>
  app/                     App.tsx (providers + session gate), ErrorBoundary.tsx
  routes/                  paths.ts + prefetchRoute.ts (public to all layers), routeModules.ts (lazy
                           page registry), router.tsx (route tree + SessionGate), RouteError.tsx, guards/
  layouts/<Name>Layout/    page shells with slots (AppLayout, AuthLayout) - never import features
  features/<name>/         api/ (transport + queryOptions), hooks/ (React Query), components/, pages/,
                           optional <name>Store.ts / <thing>Schema.ts at the feature root
  shared/
    lib/                   apiClient (only axios user), apiError, queryClient, env, zodConfig, safeOpen
    types/                 domain.ts (mirrors backend contract), api.ts (cursor page...), errorCodes.ts
    components/<Thing>/    reusable UI (Spinner...), promoted on the SECOND need
    hooks/                 generic hooks (useTheme...)
    store/                 global UI stores (themeStore) - never server data
    i18n/                  index.ts + locales/<en|fr>/<namespace>.json
  styles/                  tokens.css (ONLY colors/fonts), breakpoints.css (@custom-media), global.css (reset)
  test/                    setup.ts, renderWithProviders.tsx, server.ts + handlers/ (MSW, Node only)
mock/                      json-server mock following the contracts (see mock/README.md)
docker/nginx/              nginx template (runtime BACKEND_UPSTREAM) + security headers
```

### Dependency rule (lint-enforced by eslint-plugin-boundaries)

```
entry        -> app, shared, styles
app          -> app, routes, route-public, shared
routes       -> routes, route-public, layouts, feature, shared
route-public (routes/paths.ts, routes/prefetchRoute.ts) -> route-public, routes
layouts      -> layouts, route-public, shared
feature X    -> feature X (same feature ONLY), route-public, shared
shared       -> shared
test         -> everything
```

- **Features never import each other.** Need it twice? Promote it to `shared/`.
- **Network path:** `page/component -> feature hook -> feature api/ -> shared/lib/apiClient -> backend`.
  Only `features/*/api/` may import `apiClient`; only `apiClient.ts` may import `axios` (lint).
- **No upward imports:** `shared/` never imports features or routes. The apiClient learns about
  session expiry through `configureApiClient({ onSessionExpired })`, registered by `App.tsx`.
- **Layouts use slots:** feature UI (user menu, notifications) is passed into layouts as props by
  `routes/router.tsx`; layouts never import features.

### Data flow at runtime

```
main.tsx -> App -> ErrorBoundary -> QueryClientProvider -> SessionGate
  SessionGate: useSessionBootstrap() (GET /v1/auth/whoami) -> Spinner until resolved -> RouterProvider
  router: GuestRoute/ProtectedRoute/RoleRoute -> Layout (with slots) -> lazy page (routeModules)
  page -> components -> use<Component> logic hook -> feature hook (useQuery/useMutation with
          <feature>Queries) -> <feature>Api -> apiClient (cookies, X-CSRF-Token, single-flight 401
          refresh, ApiError) -> /api/v1/... -> Vite proxy or nginx -> et-be (or mock)
```

## 3. Placeholder files - the header IS the contract

Every file below exists. TypeScript placeholders contain a header (PURPOSE, WHAT TO WRITE, EXPORTS,
USED BY, MAY IMPORT) and `export {};`; CSS module placeholders list the classes to write;
`.data.json` and locale files are real content. Rules:

- **Implement in place.** Never create a parallel file with a similar name.
- Replace `export {};`, change `STATUS: placeholder` to `STATUS: implemented`, keep the header accurate.
- New files follow the same header format and a pattern from section 4.

| Area | Files |
|---|---|
| Entry / app | `main.tsx` (compiling stub), `app/App.tsx`, `app/ErrorBoundary.tsx` |
| Routes | `routes/{paths.ts (implemented), routeModules.ts, router.tsx, prefetchRoute.ts, RouteError.tsx}`, `routes/guards/{ProtectedRoute,GuestRoute,RoleRoute}.tsx` |
| Layouts | `layouts/AppLayout/*`, `layouts/AuthLayout/*` |
| Auth feature (reference slice) | `api/{authApi,authQueries}.ts`, `hooks/{useSessionBootstrap,useLogin,useLogout}.ts`, `authStore.ts`, `loginSchema.ts`, `components/LoginForm/*` (4 files), `pages/LoginPage/*` |
| Home feature | `pages/HomePage/*` (signed-in landing; replace per project) |
| Shared | `lib/{apiClient,apiError,queryClient,env,zodConfig,safeOpen}.ts`, `types/{domain,api,errorCodes}.ts`, `store/themeStore.ts`, `hooks/useTheme.ts`, `components/Spinner/*`, `i18n/index.ts` + locales (implemented) |
| Styles | `styles/{tokens,breakpoints,global}.css` (implemented) |
| Tests | `test/setup.ts` (implemented), `test/{renderWithProviders.tsx, server.ts}`, `test/handlers/authHandlers.ts` |

The auth feature is the REFERENCE SLICE: every new feature copies its shape.

## 4. Naming & file patterns

| Kind | Location | Pattern | Lint |
|---|---|---|---|
| Feature transport | `features/<f>/api/` | `<f>Api.ts` -> `export const <f>Api = { async verb(): Promise<T> }` (named export) | yes |
| Feature queries | `features/<f>/api/` | `<f>Queries.ts` -> `<f>Keys`, `<f>Queries` (queryOptions), `<f>Mutations` | - |
| Feature hook | `features/<f>/hooks/` | `use<Thing>.ts`, wraps `<f>Queries` - never apiClient | yes |
| Component | `features/<f>/components/<Thing>/` or `shared/components/<Thing>/` | 4-file unit (section 5), named export | yes |
| Page | `features/<f>/pages/<Thing>Page/` | `<Thing>Page.tsx` + `.module.css` + `.data.json`, **default export** (only pages) | yes |
| Feature store / schema | `features/<f>/` | `<f>Store.ts` (Zustand), `<thing>Schema.ts` (zod) | - |
| Layout | `layouts/<Name>Layout/` | same anatomy, named export, `<Outlet />` + slot props | yes |
| Shared hook / store | `shared/hooks/`, `shared/store/` | `use<Thing>.ts`, `<thing>Store.ts` | - |
| i18n namespace | `shared/i18n/locales/<lang>/` | `<namespace>.json` (one per feature + `common`), in EVERY locale | - |
| Interfaces / types / generics | anywhere | `I` prefix / PascalCase / `T` prefix | yes |

## 5. Component anatomy - four files, one responsibility each

```
features/<name>/components/LoginForm/
  LoginForm.tsx           structure: JSX only - binds styles.*, data.*, and the logic hook
  LoginForm.module.css    presentation: all styling, tokens only, mobile-first, every interactive state
  LoginForm.data.json     data: i18n KEYS + static config (option lists, variants) - never text, never backend data
  useLoginForm.ts         logic: state, handlers, derived values, calls into feature hooks
```

- **`.tsx` forbids:** inline styles, hardcoded user-facing text, logic beyond trivial binding, fetching.
- **`.module.css` forbids:** colors/fonts (tokens only), raw pixel breakpoints, React concerns. Class names camelCase.
- **`.data.json` forbids:** translatable text (it lives in locale files), secrets, dynamic data.
- **`use<Thing>.ts` forbids:** JSX, styling, hardcoded strings, axios/apiClient.
- Trivial components may omit the hook (no logic) or the data file (no static data) - never the `.tsx` or `.module.css`.
- Pages use the same anatomy; their logic lives in the feature's `hooks/`.
- Text flow: `data.json` holds `"titleKey": "login.title"` -> JSX renders `t(data.titleKey)` -> the text is in `locales/<lang>/auth.json`.

## 6. Styles

- `src/styles/tokens.css` is the ONLY file with colors and fonts (stylelint + CI enforce). Dark mode =
  semantic tokens redefined under `[data-theme='dark']` (set by `useTheme`).
- Breakpoints are `@custom-media` in `src/styles/breakpoints.css` (CSS variables do not work in
  `@media`). In a module: `@import '@/styles/breakpoints.css';` then `@media (--bp-tablet) { ... }`.
- Mobile-first, min-width queries only. Logical properties (`margin-inline`, `padding-block`).
- Reusable components only on the SECOND need (promote from feature to `shared/components/`).

## 7. State decision tree

1. Server data? -> TanStack Query via `<feature>Queries` (keys + fetchers together).
2. Who is signed in? -> `features/auth/authStore` (the one documented server-data exception; written only by auth hooks; never persisted).
3. Global UI (theme, drawer)? -> `shared/store`.
4. Local to one component? -> `useState`/`useReducer` in its logic hook.
Never mirror server data into Zustand; socket events (optional Realtime module) patch the query cache.

## 8. Adding a feature (recipe)

1. Contract exists in `../contracts/openapi/<feature>.yaml`. Missing pieces -> request (section 13).
2. Types: feature-specific in `api/<feature>Api.ts`; shared ones in `shared/types/domain.ts`.
3. `api/<feature>Api.ts` + `api/<feature>Queries.ts`.
4. `hooks/use<Thing>.ts` for each query/mutation the UI needs.
5. Components (4-file units) and pages (default export).
6. Routing: path in `routes/paths.ts` -> loader in `routes/routeModules.ts` -> route in `routes/router.tsx` under the right guard/layout.
7. i18n: `locales/en/<feature>.json` + `locales/fr/<feature>.json`, registered in `shared/i18n/index.ts`.
8. Mock: shape the resource in `mock/db.json` (contract shapes) until et-be ships it.
9. Tests (section 10); docs: `docs/features/<feature>.md` (from `_TEMPLATE.md`, `routes:` with access), CHANGELOG `[Unreleased]` line, `npm run docs:readme` (`../agents/PROTOCOL.md` section 11); `docs/PROGRESS.md` entry.

## 9. Commands

```bash
cp .env.example .env
npm install
npm run dev          # http://localhost:3000 - /api -> et-be :4000 (or mock :4001 with VITE_USE_MOCK=true)
npm run mock         # json-server on :4001
npm run verify       # LOCAL PIPELINE: lint (eslint+oxlint+stylelint) + policy + typecheck + tests + build - mandatory before every push
npm run check:policy # just the policy check (no PWA, no color/font literals in TS/TSX) - same script CI runs
npm run preview      # serve the production build locally
docker compose up -d --build   # nginx image on :3000, BACKEND_UPSTREAM -> et-be
```

### Branches & pipeline (details: `../agents/PROTOCOL.md` sections 5.0, 5.2 and 9)

- **Git hooks** are installed by `npm install` (`.githooks/` + `scripts/git-hooks.mjs`): commit format and no AI
  attribution on commit; no `.env`/secrets/BOM on commit; branch name, CHANGELOG line, lockfile sync, up to date with
  `origin/dev` and the full `npm run verify` on push. Never use `--no-verify`; a block is a defect to fix.
- Branch behind `dev` or a PR conflict: follow `../agents/PROTOCOL.md` 9.5 (merge `origin/dev`, keep both intents,
  re-verify, push).

- Work only on the branch named in your brief: `<type>/<NNN>-<slug>` (`feature/`, `fix/`, `refactor/`, `perf/`,
  `test/`, `docs/`, `chore/`, `ci/`; `hotfix/` from `main` only when the manager says so). Never commit to `dev`/`main`.
- Pushing the branch runs `verify` (lint, policy check, typecheck, tests, boundaries report, `npm audit`, gitleaks)
  and, if green, opens the PR into `dev` with auto-merge. PRs also run a Docker build + Trivy scan; `main` builds
  and pushes the image.
- Frontend-specific first-time-pass checklist: imports respect section 2 (same-feature only, `apiClient` only
  in `api/`, `axios` only in `apiClient.ts`); named exports except pages; no inline `style`, no
  `dangerouslySetInnerHTML`, no `window.open`; colors/fonts only in `tokens.css`, breakpoints via `@custom-media`,
  camelCase CSS classes; every i18n key present in BOTH locales; `noUnusedLocals` (remove unused imports);
  tests use `renderWithProviders` + MSW (no real network); `npm run build` passes (lazy routes resolve).

## 10. Testing

- Vitest + Testing Library (jsdom). Tests live next to the unit (`useLoginForm.test.ts`, `LoginPage.test.tsx`) or in `src/test/`.
- Render through `renderWithProviders` (fresh QueryClient per test). Query by role/label, interact with `userEvent`.
- Network: MSW in Node mode (`src/test/server.ts` + `handlers/`) so the REAL apiClient runs. No browser service worker, ever.
- Cover behavior: form validation, error-code handling, guard redirects, query invalidation. Every bug fix ships a regression test.

## 11. Lint - what is enforced (do not bypass)

`npm run lint` = ESLint (`eslint.config.mjs`) + oxlint + stylelint, zero warnings.

- **Boundaries:** section 2 dependency rule; same-feature-only imports.
- **Network discipline:** `axios` only in `apiClient.ts`; `apiClient` only from `features/*/api/`.
- **Exports:** default exports forbidden except pages.
- **Security:** no `dangerouslySetInnerHTML`, no inline `style`, no `window.open` (use `safeOpen`), no `localStorage/sessionStorage.setItem` for auth data.
- **Routing:** no inline route literals in `to=` (use `paths` / `buildPath`).
- **Styles (stylelint):** no hex/rgb/hsl/named colors and no `font-family` literals outside `tokens.css`; camelCase classes; `--bp-*` custom media only.
- **Hygiene:** no `any`, explicit return types, type-only imports, ordered imports, `rules-of-hooks` + `exhaustive-deps`, no `console` except warn/error.
- Never disable a rule without a reason recorded in `docs/PROGRESS.md`.

## 12. Policies

- **No AI attribution** anywhere: never write an AI tool/vendor name (Claude, Codex, OpenAI, Gemini, Copilot, Cursor, ...) in commit messages, trailers, author identity, branch names, PRs, code comments or docs. Commits: `type(<NNN>): summary`, no trailers. There is no CI check - run the self-check in `../agents/PROTOCOL.md` section 5.1 before every commit and every push.
- **Encoding:** UTF-8 without BOM, LF. Prefer ASCII in code/comments; locale JSON uses proper accents.
- **No secrets in the frontend:** every `VITE_*` variable is public.
- **No PWA** (section 1).

## 13. Requests (the only way to reach the backend or the manager)

You never coordinate with the backend agent directly. Write one file per need in
`../contracts/requests/` from `_TEMPLATE.md` (rules: `../contracts/requests/README.md`):

| You need | File |
|---|---|
| An endpoint, field or error code the contract lacks | `fe-<NNN>-api-needs-<slug>.md` (method, path, request/response shapes, error codes - as they should appear in the contract) |
| The contract is ambiguous or forces bad UX | `fe-<NNN>-contract-issue-<slug>.md` |
| A choice outside your authority (new dependency, pattern change) | `fe-<NNN>-decision-<slug>.md` |
| You cannot continue | `fe-<NNN>-blocker-<slug>.md` |

1. Mark whether it blocks you. It usually doesn't: keep building everything the contract already defines. The requested shape is **pending** (`../agents/PROTOCOL.md` 4.2.1): by default keep it out of types and the mock; only if the request is `triaged`/`scheduled` and the UI cannot be built without it, add it to the mock and types marked `// PENDING(<request-file-name>)`, typed optional, with a UI that still works when it is absent.
2. Never implement the endpoint client-side or invent fields not in the contract - the request is how it gets created.
3. Record the request in your task result and in `docs/AGENT-NOTES.md` ("Waiting on").
4. The manager triages it into a contract amendment + backend task (or declines with a reason); when the backend side is `done`, you receive a migration task to switch that resource off the mock.
5. The backend may need things from you too: they arrive as frontend tasks from the manager (`client-needs` requests), never as direct instructions.
