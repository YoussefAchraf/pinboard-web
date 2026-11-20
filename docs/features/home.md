---
feature: home
title: Home
status: planned            # template baseline placeholder - replaced by each project's real landing page
since: -
task: -
summary: Signed-in landing page that completes the login -> home -> logout flow on the empty template.
routes: / [protected]
---

# Home

## Overview

Placeholder landing page behind `ProtectedRoute`, inside `AppLayout`. Each project replaces its content
(dashboard, main list...) and may rename the feature; update this page and the route table when it does.

## Screens & states

| Screen (route) | States designed | Notes |
|---|---|---|
| Home (`/`) | empty state with guidance | replace with the project's real content |

## Code map

| Part | Files |
|---|---|
| Page | `src/features/home/pages/HomePage/` |
| i18n | `src/shared/i18n/locales/{en,fr}/home.json` |
