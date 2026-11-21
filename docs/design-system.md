# Design system

## Principles

Mobile-first, calm and consistent. One accent color carries the brand; status colors are semantic and
never decorative. WCAG 2.2 AA contrast in both themes. Motion is short and purposeful and respects
`prefers-reduced-motion`.

## Tokens - `src/styles/tokens.css`

The only file allowed to declare colors and fonts (stylelint + `npm run check:policy` enforce it).
Rebranding means editing this file only.

| Group | Tokens |
|---|---|
| Typography | `--font-family-base`, `--font-size-100` ... `--font-size-700` (fluid h1), `--font-weight-regular/semibold`, `--line-height-body/heading`, `--measure` |
| Spacing (4/8 grid) | `--space-1` (4px) `--space-2` (8) `--space-3` (12) `--space-4` (16) `--space-6` (24) `--space-8` (32) `--space-12` (48) |
| Radii | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full` |
| Surfaces & text | `--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-text-inverse` |
| Brand & status | `--color-accent`, `--color-accent-hover`, `--color-accent-contrast`, `--color-focus-ring`, `--color-success`, `--color-warning`, `--color-danger`, `--color-danger-surface` |
| Elevation | `--shadow-sm`, `--shadow-md` |
| Interaction | `--touch-target-min` (44px), `--focus-ring-width`, `--duration-fast`, `--duration-base`, `--easing-standard` |
| Layout | `--layout-max-width`, `--z-header`, `--z-overlay`, `--z-toast` |

## Themes

`useTheme` sets `<html data-theme="light|dark">`; the dark block in `tokens.css` redefines the semantic
color tokens. Components never know which theme is active. The preference (`light` | `dark` | `system`,
default `system` = `prefers-color-scheme`) lives in `shared/store/themeStore.ts` and is not persisted yet.

## Breakpoints - `src/styles/breakpoints.css`

| Name | Query |
|---|---|
| `--bp-phone-lg` | `(min-width: 480px)` |
| `--bp-tablet` | `(min-width: 768px)` |
| `--bp-desktop` | `(min-width: 1024px)` |
| `--bp-wide` | `(min-width: 1280px)` |

Usage in a CSS module: `@import '@/styles/breakpoints.css';` then `@media (--bp-tablet) { ... }`
(`@custom-media`, because CSS variables do not work inside media queries).

## Component anatomy

Every component is four co-located files: `<Thing>.tsx` (structure), `<Thing>.module.css` (presentation,
tokens only), `<Thing>.data.json` (i18n keys + static config), `use<Thing>.ts` (logic). Shared components
live in `src/shared/components/` and are created on the second need, not speculatively.

## Shared components

| Component | Purpose | Status |
|---|---|---|
| `Spinner` | Loading indicator (route chunks, session bootstrap, buttons); `role="status"`, sizes `sm`/`md`/`lg`, slower rotation under reduced motion | implemented (002) |

## Patterns (task 004)

| Pattern | Where | Rules |
|---|---|---|
| Form field | `features/auth/components/LoginForm` | visible `<label for>`; error text under the field (`role="alert"`, linked by `aria-describedby`, `aria-invalid` on the input); validation on blur; first invalid field focused on submit |
| Form-level error | `LoginForm` | `--color-danger` text on `--color-danger-surface`, `role="alert"`, above the fields |
| Primary button | `LoginForm` submit, `RouteError` | `--color-accent` / `--color-accent-contrast`, 44 px min height; `disabled` + `aria-busy` + "...ing" label while submitting |
| Disclosure menu | `features/auth/components/UserMenu` | trigger with `aria-expanded`/`aria-controls`, accessible name starts with the visible text; Escape closes and returns focus; focus leaving or a pointer press outside closes |
| Centered card shell | `AuthLayout`, `RouteError`, `ErrorBoundary` fallback | full-bleed card on phones, max inline size + `--shadow-md` from `--bp-tablet` |
| Full-page spinner | `routes/RouteShell.tsx` `PageSpinner` | session bootstrap and lazy route loading |

Promote any of these to `shared/components/` on the second feature that needs it.
