/**
 * FILE:   src/features/home/hooks/useSessionUser.ts
 * LAYER:  feature hooks
 * STATUS: implemented
 *
 * PURPOSE
 *   The signed-in user as provided to protected pages by the router. Features never import each
 *   other, so the home page does not read the auth store: routes/guards/ProtectedRoute passes
 *   `{ user }` as outlet context (forwarded by AppLayout) and this hook reads it.
 *
 * CONTENT
 *   useSessionUser() -> IUser | null (null when rendered outside the protected branch, e.g. a test).
 *
 * EXPORTS
 *   function useSessionUser
 *
 * USED BY
 *   ../pages/HomePage/HomePage.tsx
 *
 * MAY IMPORT
 *   react-router-dom, @/shared/types/domain (types).
 */
import { useOutletContext } from 'react-router-dom';
import type { IUser } from '@/shared/types/domain';

function hasUser(context: unknown): context is { user: IUser } {
  return typeof context === 'object' && context !== null && 'user' in context && context.user !== null;
}

export function useSessionUser(): IUser | null {
  const context: unknown = useOutletContext();
  return hasUser(context) ? context.user : null;
}
