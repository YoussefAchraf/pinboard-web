/**
 * FILE:   src/shared/types/domain.ts
 * LAYER:  shared
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Domain types that mirror the BACKEND CONTRACT (../contracts/openapi/*.yaml and
 *   ../contracts/domain-model.md) - never the mock's convenience shapes. Shared by every feature.
 *
 * WHAT TO WRITE
 *   export const ROLES = ['admin', 'member'] as const;          // mirror of et-be domain/constants/roles.ts
 *   export type Role = (typeof ROLES)[number];
 *   export const USER_STATUSES = ['active', 'disabled'] as const;
 *   export type UserStatus = (typeof USER_STATUSES)[number];
 *   export interface IUser {                                    // = IUserResponse from the backend presenter
 *     id: string; email: string; firstname: string; lastname: string;
 *     roleName: Role; status: UserStatus; createdAt: string;    // ISO 8601 UTC string, format at render time
 *   }
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
export {};
