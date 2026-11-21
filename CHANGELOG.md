# Changelog

All notable changes to rt-fe. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [Semantic Versioning](https://semver.org/).

- Every task adds a line under **Unreleased** (Added / Changed / Fixed / Removed / Security), with its task id.
- The release task (when `dev` is promoted to `main`) renames **Unreleased** to the new version and date,
  sets `since:` on the released feature pages, and runs `npm run docs:readme`.

## [Unreleased]

### Added

- Web platform foundation: apiClient (cookies, CSRF echo, single-flight refresh), ApiError and error codes, domain types, query client, i18n, theme, Spinner, MSW test harness (002)
- Auth UI and app shell: login page, session bootstrap, guards (guest, protected, role), app and auth layouts, user menu with sign out, session-expiry handling, route error and not-found views, temporary home greeting (004)
