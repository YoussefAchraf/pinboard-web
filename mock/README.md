# Mock API (json-server 0.17)

Temporary REST API so frontend work is never blocked by the backend. It follows the cross-stack
contracts (`../../contracts/conventions.md`) so feature code is **identical** against the mock and
against et-be.

## Run

```bash
npm run mock      # http://localhost:4001  (routes.json maps /v1/* -> /*)
# .env: VITE_USE_MOCK=true   -> the Vite dev proxy sends /api to the mock instead of et-be
npm run dev       # http://localhost:3000
```

Sign in with `admin@example.test` or `member@example.test`, password `mock-password`.

## What it serves

| Request | Response |
|---|---|
| `POST /v1/auth/login` | `200 { user }` + readable `csrfToken` cookie, `401 INVALID_CREDENTIALS`, `422 VALIDATION_FAILED` |
| `GET /v1/auth/whoami` | `200 { user }` after login, otherwise `401 UNAUTHENTICATED` |
| `POST /v1/auth/refresh` | `204` after login, otherwise `401 UNAUTHENTICATED` |
| `POST /v1/auth/logout` | `204` |
| `GET /v1/<collection>?cursor=&limit=` | `{ items, nextCursor }` (cursor pagination, same as et-be) |
| `GET /v1/<collection>/:id`, `POST`, `PATCH`, `DELETE` | json-server defaults |
| `/v1/users/*` | `404` (mock users contain plaintext mock passwords) |

All errors use the contract envelope `{ error, code, details? }`. Data lives in `db.json` and is
written back while the server runs (reset with `git checkout mock/db.json`).

## Rules for agents

1. **The contract wins.** Shape the mock to the contract (`../../contracts/openapi/*.yaml`), never
   the reverse. Types in `src/shared/types` and `src/features/*/api` mirror et-be, not the mock.
2. **Need an endpoint the contract lacks?** File `../../contracts/requests/fe-<NNN>-api-needs-<slug>.md`.
   Until it is resolved the shape is *pending* (`../../agents/PROTOCOL.md` 4.2.1): add it here only if the request
   is triaged/scheduled and the UI cannot be built without it, and mark the related code `// PENDING(<request>)`.
3. **No real auth here.** No tokens, no httpOnly cookies, no CSRF validation, no refresh rotation -
   the apiClient's auth flow is verified against et-be (and MSW in tests), never faked in the mock.
4. **Migration is part of done.** When the real endpoint ships: set `VITE_USE_MOCK=false`, verify the
   feature against et-be, delete the resource from `db.json`. When every endpoint exists, delete
   `mock/` and the `mock` script.
