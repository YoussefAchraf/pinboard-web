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
