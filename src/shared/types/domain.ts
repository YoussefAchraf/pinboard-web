/**
 * FILE:   src/shared/types/domain.ts
 * LAYER:  shared
 * STATUS: implemented
 *
 * PURPOSE
 *   Domain types that mirror the BACKEND CONTRACT (../contracts/openapi/*.yaml and
 *   ../contracts/domain-model.md) - never the mock's convenience shapes. Shared by every feature.
 *
 * CONTENT
 *   User public shape = `User` schema of contracts/openapi/auth.yaml 1.1.0 (every field except
 *   passwordHash and updatedAt). `createdAt` is an ISO 8601 UTC string, formatted at render time.
 *   - Feature-specific types stay in the feature's api/ file; move them here only when a second
 *     feature needs them. If this file grows, split per bounded area: types/domain/<area>.ts.
 *
 * EXPORTS
 *   ROLES, Role, USER_STATUSES, UserStatus, IUser
 *
 * USED BY
 *   features/auth (authApi, authStore), routes/guards/RoleRoute.tsx, any component showing a user.
 *
 * MAY IMPORT
 *   Nothing.
 */
export const ROLES = ['admin', 'member'] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ['active', 'disabled'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export interface IUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  roleName: Role;
  status: UserStatus;
  createdAt: string;
}
