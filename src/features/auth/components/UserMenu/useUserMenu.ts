/**
 * FILE:   src/features/auth/components/UserMenu/useUserMenu.ts
 * LAYER:  feature component logic
 * STATUS: implemented
 *
 * PURPOSE
 *   Behavior of UserMenu: disclosure state (open/close), keyboard and outside-click handling,
 *   and the sign-out action.
 *
 * CONTENT
 *   - Disclosure pattern: the trigger carries aria-expanded + aria-controls; Escape closes and
 *     returns focus to the trigger; focus leaving the menu or a pointer press outside closes it.
 *   - Elements are tracked with callback refs into state (setRoot / setTrigger), so nothing reads a
 *     ref during render.
 *   - signOut(): useLogout().mutate() - local sign-out happens even if the request fails.
 *
 * EXPORTS
 *   function useUserMenu, interface IUserMenuLogic
 *
 * USED BY
 *   ./UserMenu.tsx
 *
 * MAY IMPORT
 *   react, ../../authStore, ../../hooks/useLogout, @/shared/types/domain (types).
 */
import { useEffect, useId, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';
import { useAuthStore } from '../../authStore';
import { useLogout } from '../../hooks/useLogout';
import type { IUser } from '@/shared/types/domain';

export interface IUserMenuLogic {
  user: IUser | null;
  initial: string;
  isOpen: boolean;
  panelId: string;
  setRoot: (element: HTMLDivElement | null) => void;
  setTrigger: (element: HTMLButtonElement | null) => void;
  toggle: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onBlur: (event: FocusEvent<HTMLDivElement>) => void;
  signOut: () => void;
  isSigningOut: boolean;
}

export function useUserMenu(): IUserMenuLogic {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen || !root) return undefined;
    const onPointerDown = (event: PointerEvent): void => {
      if (event.target instanceof Node && root.contains(event.target)) return;
      setIsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen, root]);

  return {
    user,
    initial: user?.firstname.trim().charAt(0).toUpperCase() ?? '',
    isOpen,
    panelId,
    setRoot,
    setTrigger,
    toggle: () => setIsOpen((open) => !open),
    onKeyDown: (event) => {
      if (event.key !== 'Escape' || !isOpen) return;
      event.stopPropagation();
      setIsOpen(false);
      trigger?.focus();
    },
    onBlur: (event) => {
      const next = event.relatedTarget;
      if (next instanceof Node && event.currentTarget.contains(next)) return;
      if (next !== null) setIsOpen(false);
    },
    signOut: () => logout.mutate(),
    isSigningOut: logout.isPending,
  };
}
