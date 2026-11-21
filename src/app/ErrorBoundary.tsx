/**
 * FILE:   src/app/ErrorBoundary.tsx   (+ ErrorBoundary.module.css)
 * LAYER:  app
 * STATUS: implemented
 *
 * PURPOSE
 *   Last-resort catch for RENDER errors outside the router (providers, bootstrap).
 *   Route-level errors (lazy chunks, page crashes, 404) are handled by routes/RouteError.tsx.
 *
 * CONTENT
 *   Class component (React has no hook equivalent). Fallback = FatalError: plain text + "Reload"
 *   button (window.location.reload()). It must not depend on i18n/query/router - they may be what
 *   failed - so its English text is a constant here: the one documented exception to the i18n rule.
 *   Named export.
 *
 * EXPORTS
 *   class ErrorBoundary, interface IErrorBoundaryProps
 *
 * USED BY
 *   src/app/App.tsx (outermost wrapper)
 *
 * MAY IMPORT
 *   react only (+ its own CSS module).
 */
import { Component } from 'react';
import type { ErrorInfo, ReactElement, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

export interface IErrorBoundaryProps {
  children: ReactNode;
}

interface IErrorBoundaryState {
  hasError: boolean;
}

const FATAL_TEXT = {
  title: 'Something went wrong',
  message: 'The application could not start. Reload the page to try again.',
  reload: 'Reload',
} as const;

function FatalError(): ReactElement {
  return (
    <main className={styles.page}>
      <div className={styles.card} role="alert">
        <h1 className={styles.title}>{FATAL_TEXT.title}</h1>
        <p className={styles.message}>{FATAL_TEXT.message}</p>
        <button type="button" className={styles.reload} onClick={() => window.location.reload()}>
          {FATAL_TEXT.reload}
        </button>
      </div>
    </main>
  );
}

export class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  override state: IErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): IErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(error, info.componentStack);
  }

  override render(): ReactNode {
    return this.state.hasError ? <FatalError /> : this.props.children;
  }
}
