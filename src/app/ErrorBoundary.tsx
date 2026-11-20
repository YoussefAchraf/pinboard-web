/**
 * FILE:   src/app/ErrorBoundary.tsx
 * LAYER:  app
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Last-resort catch for RENDER errors outside the router (providers, bootstrap).
 *   Route-level errors (loaders, lazy chunks, page crashes) are handled by routes/RouteError.tsx.
 *
 * WHAT TO WRITE
 *   export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
 *     state = { hasError: false };
 *     static getDerivedStateFromError(): IErrorBoundaryState { return { hasError: true }; }
 *     componentDidCatch(error: Error, info: ErrorInfo): void { console.error(error, info.componentStack); }
 *     render(): ReactNode {
 *       return this.state.hasError ? <FatalError /> : this.props.children;
 *     }
 *   }
 *   - FatalError: minimal, dependency-free fallback (plain text + "Reload" button calling
 *     window.location.reload()). It must not depend on i18n/query/router - they may be what failed.
 *     Its styles: ErrorBoundary.module.css (tokens only). Text: plain English constant is the one
 *     allowed exception to the i18n rule, documented here.
 *   - Class component is required (React has no hook equivalent). Named export.
 *
 * EXPORTS
 *   class ErrorBoundary
 *
 * USED BY
 *   src/app/App.tsx (outermost wrapper)
 *
 * MAY IMPORT
 *   react only (+ its own CSS module).
 */
export {};
