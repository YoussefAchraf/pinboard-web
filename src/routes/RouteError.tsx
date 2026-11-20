/**
 * FILE:   src/routes/RouteError.tsx
 * LAYER:  routes
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Router-level error UI (`errorElement`): page crashes, failed lazy chunks, thrown responses.
 *
 * WHAT TO WRITE
 *   export function RouteError(): ReactElement {
 *     const error = useRouteError();
 *     - Chunk load failure after a deploy (error message matches /Failed to fetch dynamically imported module|Loading chunk/):
 *         show "A new version is available" + Reload button (window.location.reload()).
 *     - isRouteErrorResponse(error) && error.status === 404: not-found message + link to paths.home.
 *     - otherwise: generic error + "Try again" (navigate(0)) + link home; console.error(error).
 *   }
 *   - Text via i18n (common namespace: errors.*); styles in RouteError.module.css (tokens only).
 *   - Named export.
 *
 * EXPORTS
 *   function RouteError
 *
 * USED BY
 *   routes/router.tsx   `errorElement: <RouteError />` on the root route (and optionally per layout)
 *
 * MAY IMPORT
 *   react-router-dom, react-i18next, ./paths, its CSS module.
 */
export {};
