/**
 * FILE:   src/layouts/AppLayout/useAppLayout.ts
 * LAYER:  layouts (logic file of the AppLayout unit)
 * STATUS: implemented
 *
 * PURPOSE
 *   Derives the navigation items of AppLayout from AppLayout.data.json (path NAMES of
 *   routes/paths.ts -> real paths) and forwards the parent's outlet context to the pages.
 *
 * CONTENT
 *   navItems: { to, labelKey }[] - unknown path names in the data file are skipped.
 *   outletContext: whatever the parent route (ProtectedRoute: `{ user }`) passed; the layout does not
 *   know its shape, it only forwards it so pages can read it with useOutletContext().
 *
 * EXPORTS
 *   function useAppLayout, interfaces IAppLayoutLogic, INavItem
 *
 * USED BY
 *   ./AppLayout.tsx
 *
 * MAY IMPORT
 *   react-router-dom, @/routes/paths, ./AppLayout.data.json.
 */
import { useOutletContext } from 'react-router-dom';
import data from './AppLayout.data.json';
import { paths } from '@/routes/paths';
import type { AppPath } from '@/routes/paths';

export interface INavItem {
  to: AppPath;
  labelKey: string;
}

export interface IAppLayoutLogic {
  navItems: INavItem[];
  outletContext: unknown;
}

function isPathName(name: string): name is keyof typeof paths {
  return Object.hasOwn(paths, name);
}

const NAV_ITEMS: INavItem[] = data.nav.flatMap((item) =>
  isPathName(item.path) ? [{ to: paths[item.path], labelKey: item.labelKey }] : [],
);

export function useAppLayout(): IAppLayoutLogic {
  const outletContext: unknown = useOutletContext();
  return { navItems: NAV_ITEMS, outletContext };
}
